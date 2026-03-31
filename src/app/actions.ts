"use server";

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getUpcomingRound() {
    try {
        const rounds = await sql`
      SELECT * FROM rounds 
      WHERE status = 'upcoming' 
      ORDER BY round_date ASC 
      LIMIT 1
    `;
        return rounds[0] || null;
    } catch (error) {
        console.error('Error fetching round:', error);
        return null;
    }
}

export async function getRsvps(roundId: number) {
    try {
        const rsvps = await sql`
            SELECT r.*, m.handicap as member_handicap
            FROM rsvps r
            LEFT JOIN members m ON r.name = m.name
            WHERE r.round_id = ${roundId}
            ORDER BY r.created_at DESC
        `;

        // Fetch all scores once to avoid N+1 if possible, but for simplicity and since the list is small (20-30), 
        // we can do individual lookups or a single join if we prefer.
        // Let's do a single join for better performance.
        const rsvpsWithScores = await Promise.all(rsvps.map(async (rsvp) => {
            const lastScoreMatch = await sql`
                SELECT score FROM round_scores 
                WHERE member_name = ${rsvp.name}
                ORDER BY id DESC
                LIMIT 1
            `;
            return {
                ...rsvp,
                last_score: lastScoreMatch[0]?.score || null
            };
        }));

        return rsvpsWithScores;
    } catch (error) {
        console.error('Error fetching RSVPs:', error);
        return [];
    }
}

export async function getMembers() {
    try {
        return await sql`
      SELECT * FROM members 
      ORDER BY name ASC
    `;
    } catch (error) {
        console.error('Error fetching members:', error);
        return [];
    }
}

export async function getAllRounds() {
    try {
        return await sql`
            SELECT * FROM rounds 
            ORDER BY round_date DESC
        `;
    } catch (error) {
        console.error('Error fetching all rounds:', error);
        return [];
    }
}

export async function getPastRounds() {
    try {
        return await sql`
            SELECT * FROM past_rounds 
            ORDER BY id DESC
        `;
    } catch (error) {
        console.error('Error fetching past rounds:', error);
        return [];
    }
}

export async function getPastScores(roundId: number) {
    try {
        return await sql`
            SELECT * FROM round_scores 
            WHERE round_id = ${roundId}
            ORDER BY score ASC
        `;
    } catch (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
}

export async function getScoreMatrix() {
    try {
        const rounds = await sql`SELECT * FROM past_rounds ORDER BY round_date ASC`;
        const rawMembers = await sql`SELECT DISTINCT member_name FROM round_scores ORDER BY member_name ASC`;
        const scores = await sql`SELECT * FROM round_scores`;

        // 특정 회원들을 끝으로 보내는 커스텀 정렬
        const endMembers = ['김지혜', '나홍진', '박상구', '조세근'];
        const sortedMembers = [
            ...rawMembers.filter(m => !endMembers.includes(m.member_name)),
            ...rawMembers.filter(m => endMembers.includes(m.member_name))
        ];

        return { rounds, members: sortedMembers, scores };
    } catch (error) {
        console.error('Error fetching score matrix:', error);
        return { rounds: [], members: [], scores: [] };
    }
}

export async function submitRsvp(formData: FormData) {
    const roundId = parseInt(formData.get('roundId') as string);
    const name = formData.get('name') as string;
    const status = formData.get('status') as string;
    const sponsorItem = formData.get('sponsorItem') as string;
    const comment = formData.get('comment') as string;

    try {
        await sql`
      INSERT INTO rsvps (round_id, name, status, sponsor_item, comment)
      VALUES (${roundId}, ${name}, ${status}, ${sponsorItem}, ${comment})
    `;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Admin Actions ---

export async function addMember(formData: FormData) {
    const name = formData.get('name') as string;
    const handicap = parseFloat(formData.get('handicap') as string) || 0;
    const role = formData.get('role') as string || 'member';

    try {
        await sql`
            INSERT INTO members (name, handicap, role)
            VALUES (${name}, ${handicap}, ${role})
        `;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateMember(id: number, data: any) {
    try {
        await sql`
            UPDATE members 
            SET name = ${data.name}, handicap = ${data.handicap}, role = ${data.role}
            WHERE id = ${id}
        `;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMember(id: number) {
    try {
        await sql`DELETE FROM members WHERE id = ${id}`;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addRound(formData: FormData) {
    const title = formData.get('title') as string;
    const date = formData.get('roundDate') as string;
    const status = formData.get('status') as string || 'upcoming';

    try {
        await sql`
            INSERT INTO rounds (title, round_date, status)
            VALUES (${title}, ${date}, ${status})
        `;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteRound(id: number) {
    try {
        await sql`DELETE FROM rounds WHERE id = ${id}`;
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
