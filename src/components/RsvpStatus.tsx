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
        <section id="rsvp" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-6xl font-black mb-8 text-[#1e3a2b] font-serif italic"
                >
                    신청 현황
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-[#1e3a2b]/60 text-lg mb-16"
                >
                    각 월별 라운딩 신청 현황 및 참가자 정보입니다.
                </motion.p>
                
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center sm:items-end pb-5 border-b-2 border-[#2d5a27]/20 mb-12">
                    <div className="text-left w-full sm:w-auto">
                        <div className="text-2xl font-serif italic font-black text-[#1e3a2b] flex flex-wrap items-baseline gap-3">
                            {new Date(round.round_date).getMonth() + 1}월 {new Date(round.round_date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
                            <span className="text-lg font-sans font-bold text-[#1e3a2b]/40">
                                (총 {rsvps.length} 명 / 참석 {attendeeCount}명)
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-6 sm:mt-0 bg-[#1e3a2b] text-white px-8 py-4 rounded-full font-black hover:bg-[#b8860b] transition-all shadow-xl shadow-[#1e3a2b]/20 flex items-center gap-3 group text-xs uppercase tracking-widest"
                    >
                        <Send size={14} /> 지금 신청하기
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rsvps.map((rsvp, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (idx % 3) * 0.1 }}
                        key={rsvp.id}
                        className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#1e3a2b]/5 flex flex-col gap-6 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex justify-between items-center">
                            <div className="font-black text-2xl text-[#1e3a2b]">{rsvp.name}</div>
                            <div className={`text-[11px] font-black uppercase tracking-widest ${rsvp.status === 'attend' ? 'text-[#2d5a27]' : 'text-black/30'}`}>
                                {rsvp.status === 'attend' ? '참석확정' : '불참'}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-0 pt-1">
                            <div className="flex flex-col gap-2">
                                <div className="text-[10px] text-black/40 font-bold uppercase tracking-tight">25년 핸디</div>
                                <div className="text-2xl font-black text-[#2d5a27]/80">
                                    {rsvp.member_handicap || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 border-x border-black/5 px-2 text-center">
                                <div className="text-[10px] text-black/40 font-bold uppercase tracking-tight">이전 스코어</div>
                                <div className="text-2xl font-black text-[#b8860b]">
                                    {rsvp.last_score || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-right">
                                <div className="text-[10px] text-black/40 font-bold uppercase tracking-tight">26년 핸디</div>
                                <div className="text-2xl font-black text-[#3b82f6]">
                                    {rsvp.last_score ? (parseFloat(rsvp.last_score).toFixed(1)) : '-'}
                                </div>
                            </div>
                        </div>

                        {rsvp.sponsor_item && (
                            <div className="text-[11px] text-[#b8860b] flex items-center gap-2 mt-2 font-black bg-[#b8860b]/5 p-3 rounded-xl border border-[#b8860b]/10">
                                <Gift size={14} /> {rsvp.sponsor_item}
                            </div>
                        )}
                    </motion.div>
                ))}
                {rsvps.length === 0 && (
                    <div className="col-span-full py-24 text-center text-[#1e3a2b]/30 text-sm italic font-serif">아직 신청자가 없습니다.</div>
                )}
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
