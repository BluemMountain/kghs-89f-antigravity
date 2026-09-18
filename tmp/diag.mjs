import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return null;
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
    return match ? match[1] : null;
}

async function run() {
    const url = getDatabaseUrl();
    if (!url) { console.error('No DB URL'); return; }
    const sql = neon(url);
    await sql`
        UPDATE rounds 
        SET title = '납회식 (백 vs 흑 대전)', round_date = '2026-10-31' 
        WHERE id = 2
    `;
    const rounds = await sql`SELECT id, title, round_date FROM rounds`;
    console.log('UPDATED ROUNDS:', JSON.stringify(rounds, null, 2));
}

run();
