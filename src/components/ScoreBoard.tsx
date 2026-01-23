"use client";

import { useEffect, useState } from 'react';
import { getPastRounds, getPastScores } from '@/app/actions';
import { Trophy, Calendar, MapPin, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreBoard() {
    const [rounds, setRounds] = useState<any[]>([]);
    const [selectedRound, setSelectedRound] = useState<any>(null);
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRounds() {
            const list = await getPastRounds();
            setRounds(list);
            if (list.length > 0) {
                setSelectedRound(list[0]);
            }
            setLoading(false);
        }
        fetchRounds();
    }, []);

    useEffect(() => {
        async function fetchScores() {
            if (selectedRound) {
                const list = await getPastScores(selectedRound.id);
                setScores(list);
            }
        }
        fetchScores();
    }, [selectedRound]);

    if (loading) return <div className="animate-pulse glass p-8 rounded-3xl h-96 mt-20 max-w-7xl mx-auto"></div>;
    if (rounds.length === 0) return null;

    return (
        <section id="scoreboard" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Round Selector Sidebar */}
                <div className="lg:w-1/3">
                    <h3 className="text-[#2d5a27] uppercase tracking-widest text-sm mb-2">History</h3>
                    <h2 className="text-4xl font-bold font-serif italic mb-10 text-[#1e3a2b]">역대 전적 확인</h2>

                    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 custom-scrollbar">
                        {rounds.map((round) => (
                            <button
                                key={round.id}
                                onClick={() => setSelectedRound(round)}
                                className={`flex items-center justify-between p-5 rounded-2xl transition-all text-left min-w-[200px] border ${selectedRound?.id === round.id
                                        ? 'bg-[#2d5a27] text-white border-[#2d5a27] shadow-xl shadow-[#2d5a27]/10 scale-[1.02]'
                                        : 'bg-white/40 text-black/60 border-black/5 hover:bg-white/60 hover:border-black/10'
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span className={`text-[10px] uppercase tracking-widest mb-1 ${selectedRound?.id === round.id ? 'opacity-70' : 'opacity-40'}`}>
                                        {round.round_date}
                                    </span>
                                    <span className="font-bold whitespace-nowrap">{round.course_name}</span>
                                </div>
                                <ChevronRight size={16} className={selectedRound?.id === round.id ? 'opacity-100' : 'opacity-20'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Score Table Area */}
                <div className="lg:w-2/3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedRound?.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass rounded-[2rem] bg-white/50 overflow-hidden shadow-2xl shadow-black/5"
                        >
                            <div className="p-8 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-[#b8860b] mb-1">
                                        <Trophy size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest">Round Leaderboard</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-[#1e3a2b]">{selectedRound?.course_name}</h4>
                                </div>
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <div className="text-[10px] uppercase opacity-40 font-bold tracking-widest mb-1">Date</div>
                                        <div className="text-sm font-bold text-black/80">{selectedRound?.round_date}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] uppercase opacity-40 font-bold tracking-widest mb-1">Players</div>
                                        <div className="text-sm font-bold text-black/80">{scores.length}명</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black opacity-30">
                                    <div className="col-span-2 text-center">Rank</div>
                                    <div className="col-span-6">Name</div>
                                    <div className="col-span-4 text-center">Score</div>
                                </div>

                                <div className="space-y-2">
                                    {scores.map((score, idx) => (
                                        <div
                                            key={score.id}
                                            className={`grid grid-cols-12 gap-4 px-6 py-5 rounded-xl items-center transition-all ${idx === 0 ? 'bg-[#2d5a27]/5 border border-[#2d5a27]/10' : 'hover:bg-black/5'
                                                }`}
                                        >
                                            <div className="col-span-2 flex justify-center">
                                                {idx === 0 ? (
                                                    <div className="bg-[#b8860b] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">1</div>
                                                ) : (
                                                    <span className="text-sm font-bold opacity-20">{idx + 1}</span>
                                                )}
                                            </div>
                                            <div className="col-span-6 flex items-center gap-3">
                                                <span className="font-bold text-black/80 text-lg">{score.member_name}</span>
                                                {idx === 0 && <span className="text-[8px] bg-[#b8860b] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Medalist</span>}
                                            </div>
                                            <div className="col-span-4 text-center">
                                                <span className={`text-2xl font-black italic ${idx === 0 ? 'text-[#2d5a27]' : 'text-black/70'}`}>
                                                    {score.score}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
