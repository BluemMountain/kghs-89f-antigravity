"use client";

import { useEffect, useState } from 'react';
import { getMembers } from '@/app/actions';
import { ShieldCheck, Gift, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const SPONSORS = [
    { no: 1, name: '황승용', item: '파크선샤인 2박3일 숙박권 + 히비끼 1병' },
    { no: 2, name: '김동익', item: 'JBL Flip7 블루투스 스피커' },
    { no: 3, name: '박청산', item: '고~오~급 타올 1 set' },
    { no: 4, name: '김준규', item: '엘지생건 비욘드 바디셋트' },
    { no: 5, name: '마석용', item: '사케 1병' },
    { no: 6, name: '김재우', item: '슈퍼싸이클론 차량용 청소기 + 드라이버 Ultra Super Rocket Tee 1 ea' },
    { no: 7, name: '김천중', item: '보르도 와인 1병 + 중국 된장술 1병' },
    { no: 8, name: '조명환', item: '화이트 와인 1병 + 양파즙 1박스' },
    { no: 9, name: '한승훈', item: 'Kamill 바디로션 세트 + BACHA coffee' },
    { no: 10, name: '박경배', item: '테일러메이드 골프공(2피스), 젠플리츠 혼밥용기세트' },
    { no: 11, name: '김기홍', item: '정관장 활기력 MAX, 힐링 티세트' },
    { no: 12, name: '안수용', item: '사케 1병' },
];

const OCTOBER_AWARDS = [
    { title: '신페리오 우승', badge: '🏆', name: '한승훈', score: '88타', detail: 'NET 66.4 · JBL Flip7 블루투스 스피커', highlight: true },
    { title: '메달리스트', badge: '🥇', name: '박청산', score: '89타', detail: '젠플리츠 혼밥용기세트', highlight: true },
    { title: '신페리오 2등', badge: '🥈', name: '김재우', score: '109타', detail: 'NET 69.4 · Kamill 바디로션 세트', highlight: true },
    { title: '신페리오 3등', badge: '🥉', name: '안수용', score: '100타', detail: 'NET 70.0 · 힐링 티세트', highlight: false },
    { title: '롱기스트', badge: '🚀', name: '김동익', score: '98타', detail: '245m · 파크선샤인 2박3일 숙박권', highlight: false },
    { title: '니어리스트', badge: '🎯', name: '마석용', score: '92타', detail: '1.5m · 고~오~급 타올 1 set', highlight: false },
    { title: '다버디', badge: '🦅', name: '박경배', score: '109타', detail: '1개 · 슈퍼싸이클론 차량용 청소기 + 드라이버 티', highlight: false },
    { title: '다보기', badge: '⛳', name: '조명환', score: '106타', detail: '8개 · 정관장 활기력 MAX', highlight: false },
    { title: '다더블', badge: '⚡', name: '김기홍', score: '103타', detail: '8개 · 양파즙 1박스', highlight: false },
    { title: '다트리플', badge: '🔥', name: '김준규', score: '106타', detail: '7개 · 테일러메이드 골프공(2피스)', highlight: false },
    { title: '행운상', badge: '🍀', name: '황승용', score: '99타', detail: 'BACHA Coffee', highlight: false },
    { title: '노력상', badge: '💪', name: '김천중', score: '111타', detail: '엘지생건 비욘드 바디셋트', highlight: false },
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
                    className="mb-16 bg-[#f8faf9] rounded-[2.5rem] p-8 md:p-12 border border-[#1e3a2b]/10 shadow-sm"
                >
                    <div className="text-center mb-10">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8860b]">
                            Special Thanks & Sponsors
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold font-serif italic text-[#1e3a2b] mt-3 flex items-center justify-center gap-3">
                            <Gift className="text-[#b8860b]" size={28} />
                            26년 10월 납회식 스폰서 및 스폰 물품
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

                {/* 26년 10월 납회식 시상 내역 Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 bg-gradient-to-br from-[#1e3a2b] to-[#2d5a27] rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
                >
                    <div className="text-center mb-10">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#d4af37]">
                            Hall of Fame · October 31, 2026
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold font-serif italic text-white mt-3 flex items-center justify-center gap-3">
                            <Trophy className="text-[#d4af37]" size={28} />
                            26년 10월 납회식 시상 내역
                        </h3>
                        <p className="text-sm text-white/70 mt-2">
                            라싸CC 레이크-밸리 코스에서 펼쳐진 10월 납회식 영광의 수상자 및 부상 내역입니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                        {OCTOBER_AWARDS.map((award) => (
                            <div
                                key={award.title}
                                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                    award.highlight
                                        ? 'bg-white text-[#1e3a2b] border-[#d4af37] shadow-lg'
                                        : 'bg-white/10 backdrop-blur-md text-white border-white/15 hover:bg-white/15'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                                        award.highlight
                                            ? 'bg-[#1e3a2b] text-[#d4af37]'
                                            : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
                                    }`}>
                                        <span>{award.badge}</span>
                                        <span>{award.title}</span>
                                    </span>
                                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                                        award.highlight
                                            ? 'bg-[#2d5a27]/10 text-[#2d5a27]'
                                            : 'bg-white/10 text-white/80'
                                    }`}>
                                        {award.score}
                                    </span>
                                </div>

                                <div className="flex items-baseline justify-between gap-2 pt-1">
                                    <span className={`text-xl font-black ${award.highlight ? 'text-[#1e3a2b]' : 'text-white'}`}>
                                        {award.name}
                                    </span>
                                    <span className={`text-xs font-bold text-right break-keep ${
                                        award.highlight ? 'text-[#2d5a27]' : 'text-white/80'
                                    }`}>
                                        {award.detail}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 회원 명단 및 핸디캡 (한눈에 보는 컴팩트 표) */}
                <div className="text-center mb-10">
                    <h3 className="text-[#b8860b] uppercase tracking-[0.4em] text-xs mb-3 font-black">Fellow Classmates</h3>
                    <h2 className="text-3xl md:text-4xl font-bold italic mb-4 text-[#1e3a2b] font-serif tracking-tight">회원 명단 및 핸디캡</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent mx-auto"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#f8faf9] rounded-[2rem] p-5 md:p-8 border border-[#1e3a2b]/10 shadow-sm max-w-6xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#1e3a2b]/10 px-1">
                        <span className="text-xs font-black uppercase tracking-widest text-[#1e3a2b]/70">
                            전체 회원 핸디캡 일람표
                        </span>
                        <span className="text-xs font-bold bg-[#1e3a2b] text-white px-3 py-1 rounded-full">
                            총 {members.length}명
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white px-3.5 py-2.5 rounded-xl border border-[#1e3a2b]/10 flex items-center justify-between hover:border-[#b8860b] hover:shadow-xs transition-all"
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-black text-sm text-[#1e3a2b] whitespace-nowrap">
                                        {member.name}
                                    </span>
                                    {member.role === 'executive' && (
                                        <ShieldCheck className="text-[#b8860b] shrink-0" size={14} />
                                    )}
                                </div>
                                <span className="text-sm font-black text-[#2d5a27] italic font-serif whitespace-nowrap ml-2">
                                    {member.handicap}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
