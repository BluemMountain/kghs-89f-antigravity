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
    
    console.log('--- Cleanup duplicates starting ---');
    
    // 1. Find all rounds
    const rounds = await sql`SELECT id, title, round_date FROM rounds ORDER BY id ASC`;
    
    const seen = new Map();
    const toKeep = [];
    const toDelete = [];
    const idMap = new Map(); // old_id -> new_id
    
    for (const r of rounds) {
        const key = `${r.title}|${r.round_date}`;
        if (!seen.has(key)) {
            seen.set(key, r.id);
            toKeep.push(r.id);
        } else {
            toDelete.push(r.id);
            idMap.set(r.id, seen.get(key));
        }
    }
    
    console.log('To Keep:', toKeep);
    console.log('To Delete:', toDelete);
    
    // 2. Update RSVPs to point to the kept IDs
    for (const [oldId, newId] of idMap.entries()) {
        await sql`UPDATE rsvps SET round_id = ${newId} WHERE round_id = ${oldId}`;
        console.log(`Updated RSVPs from ${oldId} to ${newId}`);
    }
    
    // 3. Delete duplicates
    if (toDelete.length > 0) {
        for (const id of toDelete) {
            await sql`DELETE FROM rounds WHERE id = ${id}`;
            console.log(`Deleted round ID: ${id}`);
        }
    }
    
    console.log('--- Cleanup finished ---');
}

run();
