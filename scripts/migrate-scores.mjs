import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        throw new Error('.env.local 파일이 없습니다.');
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
    if (!match || !match[1]) {
        throw new Error('.env.local에 DATABASE_URL이 없습니다.');
    }
    return match[1];
}

async function migrate() {
    console.log('--- 역사적 스코어 마이그레이션 시작 ---');
    try {
        const dbUrl = getDatabaseUrl();
        const sql = neon(dbUrl);

        // 1. 테이블 생성
        await sql`
            CREATE TABLE IF NOT EXISTS past_rounds (
                id SERIAL PRIMARY KEY,
                round_date VARCHAR(20) NOT NULL,
                course_name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS round_scores (
                id SERIAL PRIMARY KEY,
                round_id INTEGER REFERENCES past_rounds(id),
                member_name VARCHAR(100) NOT NULL,
                score INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('테이블 준비 완료.');

        const csvPath = path.join(process.cwd(), 'kghs-89f golf data.csv');
        const rawData = fs.readFileSync(csvPath, 'utf8');
        const rows = rawData.split(/\r?\n/).map(row => row.split(','));

        // 회원 이름 (행 0)
        const names = rows[0].slice(3).map(n => n.trim()).filter(n => n.length > 0);

        // 라운딩 데이터 (행 3부터 시작)
        const roundRows = rows.slice(3).filter(row => row[1] && row[1].length > 0);

        for (const row of roundRows) {
            const dateStr = row[1].trim();
            const courseName = row[2].trim() || '미지정';

            // 2. 과거 라운딩 삽입
            const [pastRound] = await sql`
                INSERT INTO past_rounds (round_date, course_name)
                VALUES (${dateStr}, ${courseName})
                ON CONFLICT DO NOTHING
                RETURNING id
            `;

            const roundId = pastRound ? pastRound.id : null;
            if (!roundId) continue;

            console.log(`라운딩 처리 중: ${dateStr} at ${courseName}`);

            // 3. 각 회원별 점수 삽입
            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                const scoreValue = parseInt(row[i + 3]) || 0;

                if (scoreValue > 0) {
                    await sql`
                        INSERT INTO round_scores (round_id, member_name, score)
                        VALUES (${roundId}, ${name}, ${scoreValue})
                    `;
                    console.log(`   - ${name}: ${scoreValue}`);
                }
            }
        }

        console.log('--- 마이그레이션 완료! ---');

    } catch (error) {
        console.error('오류:', error.message);
    }
}

migrate();
