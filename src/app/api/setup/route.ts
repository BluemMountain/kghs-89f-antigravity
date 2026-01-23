import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await sql(statement);
        }

        return NextResponse.json({ message: 'Database initialized successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
