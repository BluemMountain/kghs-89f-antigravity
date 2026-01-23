"use client";

import { useEffect, useState } from 'react';
import { getUpcomingRound, getRsvps, submitRsvp } from '@/app/actions';
import { Users, CheckCircle, XCircle, Gift, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RsvpStatus() {
    const [round, setRound] = useState<any>(null);
    const [rsvps, setRsvps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const upcoming = await getUpcomingRound();
            if (upcoming) {
                setRound(upcoming);
                const list = await getRsvps(upcoming.id);
                setRsvps(list);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await submitRsvp(formData);
        if (result.success) {
            setShowModal(false);
            // Refresh RSVPs
            const list = await getRsvps(round.id);
            setRsvps(list);
        } else {
            alert('신청 실패: ' + result.error);
        }
    };

    if (loading) return <div className="animate-pulse glass p-8 rounded-3xl h-64"></div>;
    if (!round) return null;

    const attendeeCount = rsvps.filter(r => r.status === 'attend').length;

    return (
        <section id="rsvp" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h3 className="text-[#2d5a27] uppercase tracking-widest text-sm mb-2">RSVP Status</h3>
                    <h2 className="text-4xl md:text-5xl font-bold italic mb-6 text-[#1e3a2b]">현재 예약 현황</h2>
                    <p className="text-black/60 mb-12 max-w-md">
                        {round.title} ({new Date(round.round_date).toLocaleDateString('ko-KR')}) 의 참석 현황입니다.
                        현재 <span className="text-[#b8860b] font-bold">{attendeeCount}명</span>의 원우님이 참석 의사를 밝히셨습니다.
                    </p>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#2d5a27] text-white px-10 py-4 rounded-full font-bold hover:bg-[#b8860b] transition-all shadow-lg shadow-[#2d5a27]/10 flex items-center gap-2"
                    >
                        <Send size={18} /> 지금 신청하기
                    </button>
                </div>

                <div className="glass rounded-3xl overflow-hidden bg-white/40">
                    <div className="p-6 bg-black/5 border-b border-black/5 flex justify-between items-center text-black">
                        <span className="font-bold flex items-center gap-2 italic"> <Users size={16} /> 참석자 명단</span>
                        <span className="text-xs opacity-50 uppercase tracking-widest">{rsvps.length} Records</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-4 space-y-3 custom-scrollbar text-black">
                        {rsvps.map((rsvp, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={rsvp.id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rsvp.status === 'attend' ? 'bg-[#2d5a27] text-white' : 'bg-black/5 text-black/30'}`}>
                                        {rsvp.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-black/80">{rsvp.name}</div>
                                        {rsvp.sponsor_item && (
                                            <div className="text-[10px] text-[#b8860b] flex items-center gap-1 mt-0.5">
                                                <Gift size={10} /> {rsvp.sponsor_item}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-[10px] uppercase tracking-widest opacity-40">
                                    {rsvp.status === 'attend' ? 'Confirmed' : 'Absent'}
                                </div>
                            </motion.div>
                        ))}
                        {rsvps.length === 0 && (
                            <div className="py-20 text-center opacity-30 text-sm italic">아직 신청자가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* RSVP Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md glass rounded-3xl p-8 border-white/20"
                        >
                            <h3 className="text-2xl font-bold mb-2">참석 신청</h3>
                            <p className="opacity-50 text-sm mb-8">{round.title} 라운딩에 참여하시겠습니까?</p>

                            <form onSubmit={handleSubmit} className="space-y-6 text-black">
                                <input type="hidden" name="roundId" value={round.id} />
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest opacity-50">성함</label>
                                    <input name="name" required placeholder="본인의 이름을 입력하세요" className="w-full bg-black/5 border border-black/5 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d5a27] transition-colors" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest opacity-50">참석 여부</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-black/5 cursor-pointer hover:bg-black/5 transition-colors has-[:checked]:bg-[#2d5a27] has-[:checked]:text-white has-[:checked]:border-[#2d5a27]">
                                            <input type="radio" name="status" value="attend" defaultChecked className="hidden" />
                                            <CheckCircle size={16} /> 참석
                                        </label>
                                        <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-black/5 cursor-pointer hover:bg-black/5 transition-colors has-[:checked]:bg-red-500 has-[:checked]:text-white has-[:checked]:border-red-500">
                                            <input type="radio" name="status" value="absent" className="hidden" />
                                            <XCircle size={16} /> 불참
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest opacity-50 text-[#2d5a27]">스폰 물품/내용 (선택)</label>
                                    <input name="sponsorItem" placeholder="예: 골프공 1더즌, 와인 등" className="w-full bg-[#2d5a27]/5 border border-[#2d5a27]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d5a27] transition-colors placeholder:text-[#2d5a27]/30" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest opacity-50">메시지 (선택)</label>
                                    <textarea name="comment" placeholder="남기실 말씀을 적어주세요" className="w-full bg-black/5 border border-black/5 rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d5a27] transition-colors h-24 resize-none"></textarea>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-4 rounded-full font-bold border border-black/5 hover:bg-black/5 transition-colors text-black">취소</button>
                                    <button type="submit" className="flex-1 px-4 py-4 rounded-full font-bold bg-[#2d5a27] text-white hover:bg-[#b8860b] transition-all">제출하기</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
