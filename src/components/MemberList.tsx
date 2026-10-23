"use client";

import { useEffect, useState } from 'react';
import { getMembers } from '@/app/actions';
import { ShieldCheck, User, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const SPONSORS = [
    { no: 1, name: '황승용', item: '파크선샤인 2박3일 숙박권, 일본술 1병' },
    { no: 2, name: '김동익', item: 'JBL Flip7 블루투스 스피커' },
    { no: 3, name: '박청산', item: '고~오~급 타올 1 set' },
    { no: 4, name: '김준규', item: '엘지생건 비욘드 바디셋트' },
    { no: 5, name: '마석용', item: '사케 1병' },
    { no: 6, name: '김재우', item: '슈퍼사이클론 차량용 청소기' },
    { no: 7, name: '김천중', item: '보르도 와인 1병 + 중국 된장술 1병' },
];

export default function MemberList() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const list = await getMembers();
            setMembers(list);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <div className="animate-pulse glass p-8 rounded-3xl h-64 mt-20"></div>;
    if (members.length === 0) return null;

    return (
        <section id="members" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* 스폰서 및 협찬 물품 Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-32 bg-[#f8faf9] rounded-[2.5rem] p-8 md:p-12 border border-[#1e3a2b]/10 shadow-sm"
                >
                    <div className="text-center mb-10">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8860b]">
                            Special Thanks & Sponsors
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold font-serif italic text-[#1e3a2b] mt-3 flex items-center justify-center gap-3">
                            <Gift className="text-[#b8860b]" size={28} />
                            납회식 스폰서 및 스폰 물품
                        </h3>
                        <p className="text-sm text-[#1e3a2b]/60 mt-2">
                            이번 라운딩을 더욱 풍성하게 만들어 주신 동문 여러분의 소중한 협찬 내역입니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                        {SPONSORS.map((s) => (
                            <div
                                key={s.no}
                                className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#1e3a2b]/10 shadow-xs hover:border-[#b8860b]/40 hover:shadow-md transition-all"
                            >
                                <span className="w-8 h-8 rounded-full bg-[#1e3a2b] text-[#d4af37] font-black text-xs flex items-center justify-center shrink-0">
                                    {s.no}
                                </span>
                                <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                                    <span className="font-black text-lg text-[#1e3a2b] shrink-0">
                                        {s.name}
                                    </span>
                                    <span className="text-[#1e3a2b]/30 font-bold">:</span>
                                    <span className="font-bold text-sm md:text-base text-[#2d5a27] break-keep">
                                        {s.item}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="text-center mb-24">
                    <h3 className="text-[#b8860b] uppercase tracking-[0.4em] text-xs mb-4 font-black">Fellow Classmates</h3>
                    <h2 className="text-4xl md:text-5xl font-bold italic mb-8 text-[#1e3a2b] font-serif tracking-tight">회원 명단 및 핸디캡</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {members.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.03, duration: 0.5 }}
                            className="golf-card p-10 flex flex-col items-center text-center group border-[#1e3a2b]/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#1e3a2b]/[0.02] rounded-bl-[3rem] -mr-4 -mt-4 group-hover:bg-[#1e3a2b]/[0.05] transition-colors"></div>

                            <div className="w-20 h-20 rounded-full bg-[#1e3a2b]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                {member.role === 'executive' ? (
                                    <ShieldCheck className="text-[#b8860b]" size={32} />
                                ) : (
                                    <User size={32} className="text-[#1e3a2b]/20" />
                                )}
                            </div>

                            <div className="font-black text-xl mb-1 text-[#1e3a2b]">{member.name}</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-[#1e3a2b]/30 mb-6 font-bold">{member.role === 'executive' ? 'Executive' : 'Member'}</div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1e3a2b]/10 to-transparent mb-6"></div>

                            <div className="flex flex-col items-center">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[#b8860b] font-black mb-1">Handicap</span>
                                <span className="text-2xl font-black text-[#2d5a27] italic font-serif group-hover:text-[#b8860b] transition-colors">{member.handicap}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
