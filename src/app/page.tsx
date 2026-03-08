"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Calendar, Users, Camera, Settings, ChevronRight, ArrowRight } from "lucide-react";
import RsvpStatus from "@/components/RsvpStatus";
import MemberList from "@/components/MemberList";

export default function Home() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] text-[#1e3a2b] selection:bg-[#c5a059] selection:text-white font-sans antialiased overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 z-[100] w-full glass px-6 md:px-12 py-5 flex justify-between items-center transition-all bg-white/70 backdrop-blur-xl border-b border-black/5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl md:text-2xl font-black tracking-tighter text-[#1e3a2b] font-serif"
                >
                    경기고 89회 <span className="text-[#b8860b]">불어반</span> 골프회
                </motion.div>

                <div className="hidden lg:flex gap-10 text-[11px] font-bold tracking-[0.2em] opacity-60 uppercase text-[#1e3a2b]">
                    <Link href="#schedule" className="hover:text-[#b8860b] hover:opacity-100 transition-all">Schedule</Link>
                    <Link href="#rsvp" className="hover:text-[#b8860b] hover:opacity-100 transition-all">RSVP</Link>
                    <Link href="#members" className="hover:text-[#b8860b] hover:opacity-100 transition-all">Members</Link>
                    <Link href="#location" className="hover:text-[#b8860b] hover:opacity-100 transition-all text-[#1e3a2b]">Lhasa CC</Link>
                    <Link href="/gallery" className="hover:text-[#b8860b] hover:opacity-100 transition-all flex items-center gap-1">
                        Gallery
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <Link href="/admin" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1e3a2b] hover:text-[#b8860b] transition-all px-4 py-2 rounded-xl bg-black/5">
                        <Settings size={14} /> Admin
                    </Link>
                    <Link href="#rsvp" className="bg-[#1e3a2b] text-white px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#b8860b] transition-all shadow-lg shadow-[#1e3a2b]/20">
                        Join Round
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-[100svh] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src="/lhasa_cc_golf_course.png"
                        alt="Lhasa CC Premium Golf Course"
                        fill
                        className="object-cover scale-105 animate-pulse-slow brightness-[105%] contrast-[95%]"
                        priority
                    />
                    {/* Brighter overlay for light theme */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-[#f8faf9]"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#1e3a2b]/10 text-[10px] uppercase tracking-[0.3em] text-[#b8860b] mb-10 font-bold shadow-sm"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a27] animate-pulse"></span>
                        Establishment 1989 · Class of French
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-[0.95] tracking-[-0.04em] font-serif text-[#1e3a2b]"
                    >
                        경기고 89회<br />
                        <span className="text-[#b8860b] italic font-normal">불어반 골프회</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg md:text-2xl text-[#1e3a2b]/70 max-w-3xl mx-auto mb-16 font-light leading-relaxed tracking-tight"
                    >
                        포천 <span className="text-[#2d5a27] font-bold italic border-b-2 border-[#2d5a27]/20">라싸CC</span>에서의 고품격 라운딩. <br className="hidden md:block" />
                        시간을 넘어서는 우정과 필드 위에서의 특별한 경험을 함께하십시오.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center"
                    >
                        <Link href="#schedule" className="group bg-[#1e3a2b] text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#b8860b] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1e3a2b]/20">
                            연간 일정 보기 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#rsvp" className="bg-white text-[#1e3a2b] border border-[#1e3a2b]/10 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#f0f4f2] transition-all flex items-center justify-center gap-2 shadow-sm">
                            지금 참여하기
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-40 hidden md:flex flex-col items-center gap-3"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1e3a2b]">Scroll down</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#1e3a2b] to-transparent"></div>
                </motion.div>
            </section>

            {/* Schedule Section */}
            <section id="schedule" className="py-40 px-6 max-w-7xl mx-auto relative content-container">
                <div className="absolute top-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
                    <h2 className="text-[15rem] font-black leading-none uppercase text-[#1e3a2b]">Schedule</h2>
                </div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8"
                >
                    <div className="max-w-xl">
                        <motion.h3 variants={fadeInUp} className="text-[#b8860b] uppercase tracking-[0.4em] text-[11px] font-black mb-4">Official Rounds 2026</motion.h3>
                        <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold font-serif mb-8 italic text-[#1e3a2b]">연간 공식 일정</motion.h2>
                        <motion.p variants={fadeInUp} className="text-[#1e3a2b]/60 text-lg font-light leading-relaxed">
                            사계절의 변화를 느끼며 정기적으로 진행되는 3회의 공식 라운딩을 통해 <br />
                            동문 간의 깊은 우정과 품격 있는 플레이를 이어갑니다.
                        </motion.p>
                    </div>
                </motion.div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* May Round */}
                    <motion.div variants={fadeInUp} className="golf-card p-12 relative overflow-hidden group">
                        <div className="text-[10rem] font-serif font-black text-[#1e3a2b]/[0.02] absolute -top-4 -right-4 transition-all group-hover:text-[#1e3a2b]/[0.05]">05</div>
                        <div className="inline-block p-3 rounded-2xl bg-[#1e3a2b]/5 text-[#1e3a2b] mb-8 font-serif italic text-2xl">
                            대항식
                        </div>
                        <h4 className="text-3xl font-bold mb-6 text-[#1e3a2b]">5월 라운드</h4>
                        <p className="opacity-60 font-light mb-12 text-md leading-relaxed text-[#1e3a2b]">생동하는 봄의 기운이 가득한 필드에서 시즌의 화려한 개막을 알리는 라운딩입니다.</p>
                        <div className="flex flex-col gap-2">
                            <div className="text-[#2d5a27] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={16} /> Lhasa CC
                            </div>
                        </div>
                    </motion.div>

                    {/* Special Round */}
                    <motion.div variants={fadeInUp} className="bg-[#1e3a2b] p-12 rounded-[2.5rem] text-white transform lg:scale-[1.05] shadow-2xl z-20 relative overflow-hidden group border-2 border-[#b8860b]/20">
                        <div className="text-[8rem] font-serif font-black opacity-[0.05] absolute -top-4 -right-4 italic">Event</div>
                        <div className="inline-block p-3 rounded-2xl bg-white/10 text-[#d4af37] mb-8 font-serif italic text-2xl">
                            스페셜
                        </div>
                        <h4 className="text-3xl font-bold mb-6 italic">스페셜 이벤트</h4>
                        <p className="opacity-80 font-light mb-12 text-md leading-relaxed">정기 일정 사이, 테마가 있는 장소에서 진행되는 특별한 만남의 장입니다.</p>
                        <div className="flex flex-col gap-2">
                            <div className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-[#d4af37]">
                                <Calendar size={18} /> 일정 추후 공지
                            </div>
                        </div>
                    </motion.div>

                    {/* November Round */}
                    <motion.div variants={fadeInUp} className="golf-card p-12 relative overflow-hidden group">
                        <div className="text-[10rem] font-serif font-black text-[#1e3a2b]/[0.02] absolute -top-4 -right-4 transition-all group-hover:text-[#1e3a2b]/[0.05]">11</div>
                        <div className="inline-block p-3 rounded-2xl bg-[#1e3a2b]/5 text-[#1e3a2b] mb-8 font-serif italic text-2xl">
                            납회식
                        </div>
                        <h4 className="text-3xl font-bold mb-6 text-[#1e3a2b]">11월 라운드</h4>
                        <p className="opacity-60 font-light mb-12 text-md leading-relaxed text-[#1e3a2b]">한 해를 마무리하며 가을의 정취 속에서 동문 간의 우애를 다지는 피날레 라운드입니다.</p>
                        <div className="flex flex-col gap-2">
                            <div className="text-[#2d5a27] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={16} /> Lhasa CC
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Live Components Wrapper */}
            <div className="relative py-20 bg-white border-y border-black/5">
                <RsvpStatus />
                <MemberList />
            </div>

            {/* Location Section */}
            <section id="location" className="py-40 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden group shadow-2xl border-8 border-white"
                    >
                        <Image
                            src="/lhasa_cc_golf_course.png"
                            alt="Lhasa CC Club House & Course"
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a2b]/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-10 left-10">
                            <p className="text-[#d4af37] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Venue</p>
                            <h4 className="text-3xl font-bold font-serif italic text-white">Lhasa Country Club</h4>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-[#1e3a2b]"
                    >
                        <h3 className="text-[#b8860b] uppercase tracking-[0.5em] text-[11px] font-black mb-6">Location</h3>
                        <h2 className="text-5xl md:text-6xl font-bold font-serif mb-12 italic tracking-tight">명문 라싸CC</h2>
                        <p className="text-xl md:text-2xl text-[#1e3a2b]/70 mb-16 font-light leading-relaxed tracking-tight border-l-4 border-[#2d5a27]/20 pl-8 italic">
                            자연의 순수함이 살아있는 포천의 명문 골프장. 전용 구장에서 불어반 회원들만을 위한 최고의 그린 컨디션과 격조 높은 서비스를 경험하십시오.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-10 golf-card">
                                <MapPin className="text-[#b8860b] mb-6" size={32} />
                                <h5 className="font-bold text-lg mb-2">주소</h5>
                                <p className="opacity-60 text-sm leading-relaxed">경기도 포천시 이동면 화동로 2496 <br />라싸 컨트리클럽</p>
                            </div>
                            <div className="p-10 golf-card">
                                <Phone className="text-[#b8860b] mb-6" size={32} />
                                <h5 className="font-bold text-lg mb-2">예약 및 문의</h5>
                                <p className="opacity-60 text-sm leading-relaxed">031.539.0000 <br />안티그래비티 전용 센터</p>
                            </div>
                        </div>

                        <div className="mt-16 flex flex-wrap gap-10 items-center">
                            <Link href="https://map.naver.com" target="_blank" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#1e3a2b] border-b border-[#b8860b]/30 pb-2 hover:border-[#b8860b] transition-all">
                                Naver Maps <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="https://map.kakao.com" target="_blank" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#1e3a2b]/50 border-b border-black/5 pb-2 hover:border-[#b8860b] hover:text-[#1e3a2b] transition-all">
                                Kakao Maps <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32 px-12 border-t border-black/5 relative bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-20">
                    <div className="lg:col-span-2">
                        <div className="text-3xl font-black tracking-tighter text-[#1e3a2b] font-serif mb-8 flex items-center gap-3">
                        KGHS 89 <span className="text-[#b8860b] italic font-normal">FRENCH CLUB</span>
                        </div>
                        <p className="opacity-40 text-sm leading-relaxed max-w-sm mb-12 text-[#1e3a2b]">
                            경기고등학교 89회 불어반 동문들을 위한 고품격 골프 커뮤니티입니다.
                            격조 높은 만남과 건강한 필드 라이프를 지향합니다.
                        </p>
                        <div className="flex gap-6 opacity-40">
                            <Camera size={20} className="hover:text-[#b8860b] cursor-pointer" />
                            <Users size={20} className="hover:text-[#b8860b] cursor-pointer" />
                            <Settings size={20} className="hover:text-[#b8860b] cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h5 className="font-black uppercase tracking-widest text-[11px] mb-8 text-[#b8860b]">Navigation</h5>
                        <div className="flex flex-col gap-4 text-sm opacity-50 font-bold text-[#1e3a2b]">
                            <Link href="#schedule" className="hover:text-[#1e3a2b] transition-colors">라운딩 일정</Link>
                            <Link href="#rsvp" className="hover:text-[#1e3a2b] transition-colors">참석 신청</Link>
                            <Link href="#members" className="hover:text-[#1e3a2b] transition-colors">회원 명단</Link>
                            <Link href="/gallery" className="hover:text-[#1e3a2b] transition-colors">갤러리</Link>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-black uppercase tracking-widest text-[11px] mb-8 text-[#b8860b]">Administration</h5>
                        <div className="flex flex-col gap-4 text-sm opacity-50 font-bold text-[#1e3a2b]">
                            <Link href="/privacy" className="hover:text-[#1e3a2b] transition-colors">개인정보 처리방침</Link>
                            <Link href="/terms" className="hover:text-[#1e3a2b] transition-colors">이용 약관</Link>
                            <Link href="/admin" className="hover:text-[#1e3a2b] transition-colors">클럽 관리</Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] opacity-30 font-black uppercase tracking-[0.4em] text-[#1e3a2b]">© 2026 KGHS 89 FRENCH GOLF CLUB. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-1 items-center opacity-10 grayscale">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a2b]"></div>
                        <div className="w-8 h-8 rounded-full bg-[#1e3a2b]/50"></div>
                        <div className="w-8 h-8 rounded-full bg-[#1e3a2b]/20"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
