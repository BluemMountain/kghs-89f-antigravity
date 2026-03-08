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
        <section id="rsvp" className="py-20 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h3 className="text-[#b8860b] uppercase tracking-widest text-sm mb-4 font-bold">Registration</h3>
                    <h2 className="text-4xl md:text-5xl font-bold italic mb-8 text-[#1e3a2b] font-serif">현재 참석 현황</h2>
                    <p className="text-[#1e3a2b]/60 mb-12 max-w-md leading-relaxed">
                        <span className="font-bold text-[#1e3a2b]">{round.title}</span><br />
                        ({new Date(round.round_date).toLocaleDateString('ko-KR')}) 라운딩 참석 명단입니다.<br />
                        현재 <span className="text-[#2d5a27] font-black text-2xl mx-1 underline underline-offset-4 decoration-[#2d5a27]/20">{attendeeCount}명</span>의 원우님이 확정하셨습니다.
                    </p>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#1e3a2b] text-white px-10 py-5 rounded-full font-bold hover:bg-[#b8860b] transition-all shadow-xl shadow-[#1e3a2b]/20 flex items-center gap-3 group"
                    >
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 지금 신청하기
                    </button>
                </div>

                <div className="golf-card overflow-hidden">
                    <div className="p-8 bg-[#1e3a2b]/5 border-b border-[#1e3a2b]/10 flex justify-between items-center">
                        <span className="font-bold flex items-center gap-2 text-[#1e3a2b] italic"> <Users size={18} /> 참석자 명단</span>
                        <span className="text-[10px] text-[#1e3a2b]/40 uppercase tracking-widest font-black">{rsvps.length} Entries</span>
                    </div>
                    <div className="max-h-[450px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {rsvps.map((rsvp, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={rsvp.id}
                                className="flex items-center justify-between p-5 bg-[#f8faf9] rounded-2xl hover:bg-[#1e3a2b]/5 transition-all border border-[#1e3a2b]/5 group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-sm ${rsvp.status === 'attend' ? 'bg-[#1e3a2b] text-white' : 'bg-white text-[#1e3a2b]/20 border border-[#1e3a2b]/10'}`}>
                                        {rsvp.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-black text-[#1e3a2b]">{rsvp.name}</div>
                                        {rsvp.sponsor_item && (
                                            <div className="text-[11px] text-[#b8860b] flex items-center gap-1.5 mt-1 font-bold">
                                                <Gift size={12} /> {rsvp.sponsor_item}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${rsvp.status === 'attend' ? 'bg-[#2d5a27]/10 text-[#2d5a27]' : 'bg-black/5 text-black/30'}`}>
                                    {rsvp.status === 'attend' ? 'Confirmed' : 'Absent'}
                                </div>
                            </motion.div>
                        ))}
                        {rsvps.length === 0 && (
                            <div className="py-24 text-center text-[#1e3a2b]/30 text-sm italic font-serif">아직 신청자가 없습니다.</div>
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
                            className="absolute inset-0 bg-[#1e3a2b]/60 backdrop-blur-md"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden border border-[#b8860b]/20"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e3a2b] via-[#b8860b] to-[#1e3a2b]"></div>

                            <h3 className="text-3xl font-black mb-2 text-[#1e3a2b] font-serif italic">참석 신청</h3>
                            <p className="text-[#1e3a2b]/50 text-sm mb-10 font-medium">{round.title} 라운딩에 함께하시겠습니까?</p>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <input type="hidden" name="roundId" value={round.id} />

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b]">성함</label>
                                    <input name="name" required placeholder="본인의 성함을 입력하세요" className="w-full bg-[#f8faf9] border border-[#1e3a2b]/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#b8860b] transition-all text-[#1e3a2b] font-bold" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b]">참석 여부</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border border-[#1e3a2b]/5 bg-[#f8faf9] cursor-pointer hover:bg-[#1e3a2b]/5 transition-all group has-[:checked]:bg-[#1e3a2b] has-[:checked]:text-white has-[:checked]:scale-[1.02] shadow-sm">
                                            <input type="radio" name="status" value="attend" defaultChecked className="hidden" />
                                            <CheckCircle size={18} className="group-has-[:checked]:text-[#d4af37]" /> <span className="font-bold">참석</span>
                                        </label>
                                        <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border border-[#1e3a2b]/5 bg-[#f8faf9] cursor-pointer hover:bg-[#1e3a2b]/5 transition-all group has-[:checked]:bg-[#f44336] has-[:checked]:text-white has-[:checked]:scale-[1.02] shadow-sm">
                                            <input type="radio" name="status" value="absent" className="hidden" />
                                            <XCircle size={18} /> <span className="font-bold">불참</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b]">스폰 물품/내용 (선택)</label>
                                    <input name="sponsorItem" placeholder="예: 골프공 1더즌, 와인 등" className="w-full bg-[#f8faf9] border border-[#2d5a27]/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#2d5a27] transition-all text-[#1e3a2b] font-bold placeholder:text-[#1e3a2b]/20" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b]">동문들께 남길 메시지 (선택)</label>
                                    <textarea name="comment" placeholder="메시지를 입력하세요" className="w-full bg-[#f8faf9] border border-[#1e3a2b]/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#1e3a2b] transition-all h-28 resize-none text-[#1e3a2b] font-medium"></textarea>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-5 rounded-full font-black text-xs uppercase tracking-widest text-[#1e3a2b]/40 hover:text-[#1e3a2b] hover:bg-black/5 transition-all">취소하기</button>
                                    <button type="submit" className="flex-1 px-4 py-5 rounded-full font-black text-xs uppercase tracking-widest bg-[#1e3a2b] text-white hover:bg-[#b8860b] transition-all shadow-xl shadow-[#1e3a2b]/20">제출하기</button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#1e3a2b]/5">
                                    <p className="font-black text-[#b8860b] text-[10px] uppercase tracking-[0.2em] mb-4">Round Policy</p>
                                    <div className="space-y-4 text-[0.8rem] text-[#1e3a2b]/60 leading-relaxed font-medium">
                                        <div className="flex gap-3">
                                            <span className="text-[#2d5a27] font-bold">•</span>
                                            <span><strong>정회원:</strong> 라운드 비용 중 <span className="text-[#1e3a2b] font-bold">10만 원</span>을 클럽 기금에서 지원합니다.</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-[#2d5a27] font-bold">•</span>
                                            <span><strong>일반회원:</strong> 신청 시 10만 원을 선입금해 주셔야 합니다. (카카오모임 3333-34-7847834)</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
