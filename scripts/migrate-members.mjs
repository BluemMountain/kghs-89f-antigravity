import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// 1. .env.local에서 DATABASE_URL 읽기
function getDatabaseUrl() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        throw new Error('.env.local 파일이 없습니다. DATABASE_URL을 설정해주세요.');
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
    if (!match || !match[1]) {
        throw new Error('.env.local에 DATABASE_URL이 정의되지 않았습니다.');
    }
    return match[1];
}

async function migrate() {
    console.log('--- 마이그레이션 시작 ---');

    try {
        const dbUrl = getDatabaseUrl();
        const sql = neon(dbUrl);

        const csvPath = path.join(process.cwd(), 'kghs-89f golf data.csv');
        if (!fs.existsSync(csvPath)) {
            throw new Error('CSV 파일을 찾을 수 없습니다: ' + csvPath);
        }

        const rawData = fs.readFileSync(csvPath, 'utf8');
        const rows = rawData.split(/\r?\n/).map(row => row.split(','));

        // 테이블이 없으면 생성
        await sql`
            CREATE TABLE IF NOT EXISTS members (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                handicap DECIMAL(4,1) DEFAULT 0.0,
                role VARCHAR(20) DEFAULT 'member',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // UNIQUE 제약 조건 추가 (없을 경우에만)
        try {
            await sql`ALTER TABLE members ADD CONSTRAINT members_name_unique UNIQUE (name)`;
            console.log('성공: name 컬럼에 UNIQUE 제약 조건을 설정했습니다.');
        } catch (e) {
            // 이미 존재하거나 데이터 중복 시 무시 (중복 데이터가 있으면 아래 INSERT에서 처리됨)
        }

        console.log('데이터베이스 준비 완료.');

        // CSV 구조 분석 (사용자가 주신 파일 기준)
        // 1행 (index 0): ,,Name,이름1,이름2... (4번째 컬럼부터 이름)
        // 3행 (index 2): count,Date,CC/HD,HD1,HD2... (4번째 컬럼부터 핸디캡)

        const names = rows[0].slice(3).map(n => n.trim()).filter(n => n.length > 0);
        const handicaps = rows[2].slice(3).map(h => h.trim());

        console.log(`총 ${names.length}명의 회원을 발견했습니다.`);

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const hdValue = parseFloat(handicaps[i]) || 0;

            // UPSERT 수행 (이름이 같으면 핸디캡 업데이트)
            await sql`
                INSERT INTO members (name, handicap, role)
                VALUES (${name}, ${hdValue}, 'member')
                ON CONFLICT (name) 
                DO UPDATE SET handicap = EXCLUDED.handicap
            `;

            console.log(`[성공] ${name} (핸디캡: ${hdValue})`);
        }

        console.log('--- 마이그레이션 완료! ---');
        console.log('이제 웹사이트에서 회원 명단을 확인해보세요.');

    } catch (error) {
        console.error('마이그레이션 오류 발생:');
        console.error(error.message);
        process.exit(1);
    }
}

migrate();
