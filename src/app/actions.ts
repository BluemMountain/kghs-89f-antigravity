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
        revalidatePath('/', 'layout');
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
        revalidatePath('/', 'layout');
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
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMember(id: number) {
    try {
        await sql`DELETE FROM members WHERE id = ${id}`;
        revalidatePath('/', 'layout');
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
        // Check for duplicates
        const existing = await sql`
            SELECT id FROM rounds 
            WHERE title = ${title} AND round_date = ${date}
        `;
        if (existing.length > 0) {
            return { success: false, error: '이미 동일한 제목과 날짜의 라운드가 존재합니다.' };
        }

        await sql`
            INSERT INTO rounds (title, round_date, status)
            VALUES (${title}, ${date}, ${status})
        `;
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getRoundParticipants(roundId: number) {
    try {
        return await sql`
            SELECT name FROM rsvps 
            WHERE round_id = ${roundId} AND status = 'attend'
            ORDER BY name ASC
        `;
    } catch (error) {
        console.error('Error fetching participants:', error);
        return [];
    }
}

export async function finalizeRound(roundId: number, scores: { name: string, score: number }[]) {
    try {
        const round = await sql`SELECT * FROM rounds WHERE id = ${roundId}`;
        if (round.length === 0) throw new Error('Round not found');

        const { title, round_date, location } = round[0];

        // 1. Create past_round
        const [pastRound] = await sql`
            INSERT INTO past_rounds (round_date, course_name)
            VALUES (${new Date(round_date).toLocaleDateString('ko-KR')}, ${location || title})
            RETURNING id
        `;

        // 2. Insert scores and update member handicaps
        for (const s of scores) {
            // Insert score
            await sql`
                INSERT INTO round_scores (round_id, member_name, score)
                VALUES (${pastRound.id}, ${s.name}, ${s.score})
            `;

            // Calculate new average handicap
            const memberScores = await sql`
                SELECT score FROM round_scores WHERE member_name = ${s.name}
            `;
            
            if (memberScores.length > 0) {
                const avg = memberScores.reduce((acc, curr: any) => acc + curr.score, 0) / memberScores.length;
                await sql`
                    UPDATE members SET handicap = ${avg.toFixed(1)} WHERE name = ${s.name}
                `;
            }
        }

        // 3. Delete upcoming round and its RSVPs
        await sql`DELETE FROM rsvps WHERE round_id = ${roundId}`;
        await sql`DELETE FROM rounds WHERE id = ${roundId}`;

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Error finalizing round:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteRound(id: number) {
    try {
        await sql`DELETE FROM rsvps WHERE round_id = ${id}`;
        await sql`DELETE FROM rounds WHERE id = ${id}`;
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
