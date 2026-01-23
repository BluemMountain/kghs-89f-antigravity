"use client";

import { useEffect, useState } from 'react';
import { getScoreMatrix } from '@/app/actions';
import { Trophy, Database, Maximize2, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScoreHistoryTable() {
    const [data, setData] = useState<{ rounds: any[], members: any[], scores: any[] }>({ rounds: [], members: [], scores: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await getScoreMatrix();
            setData(result);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="animate-pulse glass p-8 rounded-3xl h-96 mt-10"></div>;
    if (data.rounds.length === 0) return (
        <div className="glass p-10 rounded-3xl text-center opacity-40">
            <Database className="mx-auto mb-4" />
            기록된 데이터가 없습니다.
        </div>
    );

    // Get score for a specific member and round
    const getScore = (memberName: string, roundId: number) => {
        const scoreEntry = data.scores.find(s => s.member_name === memberName && s.round_id === roundId);
        return scoreEntry ? scoreEntry.score : '-';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-[#2d5a27] uppercase tracking-widest text-[10px] font-black mb-1">Full Records (Transposed)</h3>
                    <h2 className="text-3xl font-bold font-serif italic text-[#1e3a2b]">역대 전적 통합 보기</h2>
                </div>
                <div className="text-[10px] font-black opacity-30 uppercase tracking-widest flex items-center gap-2">
                    <Maximize2 size={12} /> Scroll Right to see all members
                </div>
            </div>

            <div className="glass rounded-[2rem] bg-white/40 overflow-hidden shadow-2xl border-black/5">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#2d5a27] text-white">
                                <th className="sticky left-0 z-10 bg-[#2d5a27] px-4 py-3 border-r border-white/10 min-w-[160px] text-[10px] font-black uppercase tracking-widest">
                                    Round / Course
                                </th>
                                {data.members.map((member) => (
                                    <th key={member.member_name} className="px-2 py-3 border-r border-white/5 min-w-[72px] text-center text-[10px] font-bold whitespace-nowrap">
                                        {member.member_name}
                                    </th>
                                ))}
                            </tr>
                            <tr className="bg-[#b8860b]/10 text-[#b8860b]">
                                <th className="sticky left-0 z-10 bg-[#fdfdfd] px-4 py-2 border-r border-black/5 text-[10px] font-black uppercase tracking-widest text-[#b8860b]">
                                    Avg Handicap
                                </th>
                                {data.members.map((member) => {
                                    const memberScores = data.scores.filter(s => s.member_name === member.member_name);
                                    const avg = memberScores.length > 0
                                        ? (memberScores.reduce((acc, curr) => acc + curr.score, 0) / memberScores.length).toFixed(1)
                                        : '-';
                                    return (
                                        <th key={`hd-${member.member_name}`} className="px-2 py-2 border-r border-black/5 text-center text-[11px] font-black italic">
                                            {avg}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {[...data.rounds].reverse().map((round) => (
                                <tr key={round.id} className="hover:bg-white/60 transition-colors">
                                    <td className="sticky left-0 z-10 bg-white/80 backdrop-blur-md px-4 py-2 border-r border-black/5">
                                        <div className="text-[10px] opacity-60 font-black uppercase tracking-widest leading-none mb-1 text-[#2d5a27]">{round.round_date}</div>
                                        <div className="text-xs font-bold text-black/80 leading-tight">{round.course_name}</div>
                                    </td>
                                    {data.members.map((member) => {
                                        const score = getScore(member.member_name, round.id);
                                        return (
                                            <td key={`${member.member_name}-${round.id}`} className="px-2 py-2 text-center border-r border-black/5">
                                                <span className={`text-sm font-black ${score === '-' ? 'opacity-10' : 'text-[#2d5a27]'}`}>
                                                    {score}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-[11px] opacity-30 text-center italic">
                * 위 테이블은 세로로 라운딩 정보가, 가로로 회원 명단이 표시됩니다. 우측으로 스크롤하여 모든 회원의 점수를 확인하세요.
            </p>
        </div>
    );
}
