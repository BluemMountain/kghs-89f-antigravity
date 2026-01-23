import { sql } from './db';
import fs from 'fs';
import path from 'path';

async function initDB() {
    try {
        console.log('초기화 시작...');
        const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Neon doesn't support multiple statements in one call via the serverless driver's tagged template directly for complex scripts easily,
        // but we can split by semicolon. However, the serverless driver actually handles it if we use the right method.
        // For simplicity, we'll execute the whole block if possible, or split it.

        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await sql(`${statement}`);
            console.log('실행 완료:', statement.substring(0, 30) + '...');
        }

        console.log('데이터베이스 초기화 성공!');
    } catch (error) {
        console.error('데이터베이스 초기화 실패:', error);
    }
}

initDB();
