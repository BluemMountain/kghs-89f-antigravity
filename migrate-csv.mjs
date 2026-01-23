import { sql } from './src/lib/db.js';
import fs from 'fs';
import path from 'path';

async function migrate() {
    try {
        const csvPath = path.join(process.cwd(), 'kghs-89f golf data.csv');
        const data = fs.readFileSync(csvPath, 'utf8');
        const rows = data.split('\n').map(row => row.split(','));

        // Row 0: Name, 강정석, 김기홍, ...
        const names = rows[0].slice(3).map(n => n.trim()).filter(n => n.length > 0);
        // Row 2: count, Date, CC/HD, 94.3, ...
        const handicaps = rows[2].slice(3).map(h => h.trim());

        console.log(`${names.length}명의 회원 데이터를 처리 중...`);

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const hdStr = handicaps[i] || '0';
            const hd = parseFloat(hdStr) || 0;

            await sql`
            INSERT INTO members (name, handicap, role)
            VALUES (${name}, ${hd}, 'member')
            ON CONFLICT (id) DO NOTHING
        `;
            console.log(`이동 완료: ${name} (HD: ${hd})`);
        }

        console.log('마이그레이션 성공!');
    } catch (error) {
        console.error('마이그레이션 실패:', error);
    }
}

migrate();
