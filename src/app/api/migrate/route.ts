import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const csvPath = path.join(process.cwd(), 'kghs-89f golf data.csv');
        const data = fs.readFileSync(csvPath, 'utf8');

        // Simple CSV parser (Splitting by newline and comma)
        const rows = data.split('\n').map(row => {
            // Handle comma within quotes if necessary, but for this CSV simple split might work
            return row.split(',');
        });

        if (rows.length < 3) throw new Error('CSV format error: Not enough rows');

        // Row 0 index 3 onwards are names
        const names = rows[0].slice(3).map(n => n?.trim()).filter(n => n && n.length > 0);
        // Row 2 index 3 onwards are handicaps
        const handicaps = rows[2].slice(3).map(h => h?.trim());

        const results = [];
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const hdStr = handicaps[i] || '0';
            const hd = parseFloat(hdStr) || 0;

            await sql`
            INSERT INTO members (name, handicap, role)
            VALUES (${name}, ${hd}, 'member')
            ON CONFLICT DO NOTHING
        `;
            results.push({ name, hd });
        }

        return NextResponse.json({ message: `Successfully migrated ${results.length} members`, data: results });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
