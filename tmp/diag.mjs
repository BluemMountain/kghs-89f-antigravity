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
    const rounds = await sql`SELECT id, title, round_date FROM rounds`;
    const rsvps = await sql`SELECT round_id, name, status FROM rsvps`;
    console.log('ROUNDS:', JSON.stringify(rounds, null, 2));
    console.log('RSVPS:', JSON.stringify(rsvps, null, 2));
}

run();
