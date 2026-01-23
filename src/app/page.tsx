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

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#060606] text-white selection:bg-[#c5a059] selection:text-black font-sans antialiased overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 z-[100] w-full glass px-6 md:px-12 py-5 flex justify-between items-center transition-all bg-black/40 backdrop-blur-xl border-b border-white/5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl md:text-2xl font-black tracking-tighter text-[#2d5a27] font-serif"
                >
                    경기고 89회 불어반 골프회
                </motion.div>

                <div className="hidden lg:flex gap-10 text-[11px] font-bold tracking-[0.2em] opacity-60 uppercase">
                    <Link href="#schedule" className="hover:text-[#c5a059] hover:opacity-100 transition-all">Schedule</Link>
                    <Link href="#rsvp" className="hover:text-[#c5a059] hover:opacity-100 transition-all">RSVP</Link>
                    <Link href="#members" className="hover:text-[#c5a059] hover:opacity-100 transition-all">Members</Link>
                    <Link href="#location" className="hover:text-[#c5a059] hover:opacity-100 transition-all">Lhasa CC</Link>
                    <Link href="/gallery" className="hover:text-[#c5a059] hover:opacity-100 transition-all flex items-center gap-1">
                        Gallery
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <Link href="/admin" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2d5a27] hover:text-[#b8860b] transition-all px-4 py-2 rounded-xl bg-black/5">
                        <Settings size={14} /> Admin
                    </Link>
                    <Link href="#rsvp" className="bg-[#2d5a27] text-white px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#b8860b] transition-all shadow-xl shadow-[#2d5a27]/10">
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
                        className="object-cover opacity-80 scale-105 animate-pulse-slow lg:opacity-90 grayscale-[20%] brightness-[110%]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-[#fdfdfd]"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10 text-[10px] uppercase tracking-[0.3em] text-[#c5a059] mb-10 font-bold"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
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
                        className="text-lg md:text-2xl text-black/60 max-w-3xl mx-auto mb-16 font-light leading-relaxed tracking-tight"
                    >
                        포천 <span className="text-[#2d5a27] font-medium italic underline underline-offset-8 decoration-[#2d5a27]/20">라싸CC</span>에서의 고결한 만남. <br className="hidden md:block" />
                        시간을 거스르는 우정과 필드 위의 절정, 불어반 골프회가 함께합니다.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center"
                    >
                        <Link href="#schedule" className="group bg-[#2d5a27] text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#b8860b] transition-all flex items-center justify-center gap-3">
                            View Schedule <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#rsvp" className="glass px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest border-black/10 hover:bg-black/5 text-[#2d5a27] transition-all flex items-center justify-center gap-2">
                            Join Now
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 hidden md:flex flex-col items-center gap-3"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                </motion.div>
            </section>

            {/* Schedule Section */}
            <section id="schedule" className="py-40 px-6 max-w-7xl mx-auto relative">
                <div className="absolute top-0 right-0 -z-10 opacity-[0.02] pointer-events-none">
                    <h2 className="text-[20rem] font-black leading-none uppercase">Schedule</h2>
                </div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8"
                >
                    <div className="max-w-xl">
                        <motion.h3 variants={fadeInUp} className="text-[#2d5a27] uppercase tracking-[0.4em] text-[11px] font-black mb-4">The Calendar 2026</motion.h3>
                        <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-bold font-serif mb-8 italic text-[#1e3a2b]">연간 공식 일정</motion.h2>
                        <motion.p variants={fadeInUp} className="text-black/60 text-lg font-light leading-relaxed">
                            매회 특별한 의미를 담은 3회의 정기 라운딩을 통해 <br />
                            동문 간의 깊은 우정과 품격 있는 플레이를 완성합니다.
                        </motion.p>
                    </div>
                    <motion.div variants={fadeInUp} className="bg-white/40 p-6 rounded-2xl glass border-black/5 text-sm max-w-xs text-black">
                        <div className="flex items-center gap-3 text-[#2d5a27] mb-2 font-bold uppercase tracking-widest text-[10px]">
                            <Calendar size={14} /> Regular Rounds
                        </div>
                        <p className="opacity-60 text-xs leading-relaxed">공식 라운딩은 고정 장소인 <span className="text-[#2d5a27] font-bold">라싸CC</span>에서 진행되며, 상세 일정은 공지문을 확인해 주세요.</p>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* May Round */}
                    <motion.div variants={fadeInUp} className="glass p-16 rounded-[2.5rem] group hover:border-[#2d5a27]/30 transition-all duration-700 relative overflow-hidden bg-white/40 text-black shadow-lg">
                        <div className="text-[12rem] font-black text-black/[0.03] absolute -top-10 -right-4 group-hover:text-[#2d5a27]/[0.05] transition-colors font-serif">05</div>
                        <h4 className="text-3xl font-bold mb-6 font-serif underline underline-offset-[12px] decoration-[#2d5a27]/20">5월 대항식</h4>
                        <p className="opacity-60 font-light mb-12 text-lg leading-relaxed">생동하는 5월, 라싸CC의 대항식 라운드는 시즌의 화려한 개막을 알리는 상징적인 무대입니다.</p>
                        <div className="flex flex-col gap-2">
                            <div className="text-[#2d5a27] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={16} /> Lhasa CC
                            </div>
                            <div className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">Pocheon, Gyeonggi-do</div>
                        </div>
                    </motion.div>

                    {/* Event Round */}
                    <motion.div variants={fadeInUp} className="bg-[#2d5a27] p-16 rounded-[2.5rem] text-white transform lg:scale-[1.05] shadow-2xl z-20 relative overflow-hidden group">
                        <div className="text-[10rem] font-black opacity-[0.08] absolute -top-10 -right-4 italic">SPEC</div>
                        <div className="w-12 h-1 bg-white/20 mb-10 group-hover:w-20 transition-all duration-500"></div>
                        <h4 className="text-3xl font-black mb-6 italic font-serif">스페셜 이벤트</h4>
                        <p className="opacity-80 font-medium mb-12 text-lg leading-relaxed">정기 라운드 사이, 특별한 장소와 테마로 진행되는 이벤트 라운드입니다.</p>
                        <div className="flex flex-col gap-2">
                            <div className="font-black text-sm uppercase tracking-widest flex items-center gap-2 text-[#d4af37]">
                                <Calendar size={18} /> Schedule TBA
                            </div>
                            <div className="text-[10px] opacity-60 font-bold uppercase tracking-[0.2em]">Variable Locations</div>
                        </div>
                    </motion.div>

                    {/* November Round */}
                    <motion.div variants={fadeInUp} className="glass p-16 rounded-[2.5rem] group hover:border-[#2d5a27]/30 transition-all duration-700 relative overflow-hidden bg-white/40 text-black shadow-lg">
                        <div className="text-[12rem] font-black text-black/[0.03] absolute -top-10 -right-4 group-hover:text-[#2d5a27]/[0.05] transition-colors font-serif">11</div>
                        <h4 className="text-3xl font-bold mb-6 font-serif underline underline-offset-[12px] decoration-[#2d5a27]/20">11월 납회식</h4>
                        <p className="opacity-60 font-light mb-12 text-lg leading-relaxed">만추의 서정이 가득한 필드 위에서 한 해를 마무리하며 돈독한 우애를 다지는 피날레 라운드입니다.</p>
                        <div className="flex flex-col gap-2">
                            <div className="text-[#2d5a27] font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={16} /> Lhasa CC
                            </div>
                            <div className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">Pocheon, Gyeonggi-do</div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Live Components Wrapper with light theme */}
            <div className="relative py-20 bg-[#fdfdfd]">
                <RsvpStatus />
                <MemberList />
            </div>

            {/* Info/Location Section */}
            <section id="location" className="py-40 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden group shadow-2xl"
                    >
                        <Image
                            src="/lhasa_cc_golf_course.png"
                            alt="Lhasa CC Club House & Course"
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-12 left-12">
                            <p className="text-[#c5a059] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Primary Venue</p>
                            <h4 className="text-3xl font-bold font-serif italic">Lhasa Country Club</h4>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-black"
                    >
                        <h3 className="text-[#2d5a27] uppercase tracking-[0.5em] text-[11px] font-black mb-6">Discovery</h3>
                        <h2 className="text-5xl md:text-6xl font-bold font-serif mb-12 italic tracking-tight text-[#1e3a2b]">명문 라싸CC</h2>
                        <p className="text-xl md:text-2xl text-black/60 mb-16 font-light leading-relaxed tracking-tight underline decoration-[#2d5a27]/10 underline-offset-[12px]">
                            자연의 순수함과 인간의 미학이 조우하는 공간. 불어반 회원들만을 위한 최고의 그린 컨디션과 품격 있는 서비스를 라싸CC에서 경험하십시오.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-8 glass rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
                                <MapPin className="text-[#c5a059] mb-6" size={32} />
                                <h5 className="font-bold text-lg mb-2">Location</h5>
                                <p className="opacity-40 text-sm leading-relaxed">경기도 포천시 이동면 화동로 2496 <br />라싸 컨트리클럽</p>
                            </div>
                            <div className="p-8 glass rounded-[2rem] border-white/5 hover:bg-white/[0.05] transition-all">
                                <Phone className="text-[#c5a059] mb-6" size={32} />
                                <h5 className="font-bold text-lg mb-2">Reservation</h5>
                                <p className="opacity-40 text-sm leading-relaxed">031.539.0000 <br />안티그래비티 전용 부킹 센터</p>
                            </div>
                        </div>

                        <div className="mt-16 flex flex-wrap gap-8 items-center">
                            <Link href="https://map.naver.com" target="_blank" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#c5a059] pb-2 hover:border-white transition-all">
                                Naver Maps <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="https://map.kakao.com" target="_blank" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-white/20 pb-2 hover:border-[#c5a059] transition-all">
                                Kakao Maps <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32 px-12 border-t border-white/5 relative bg-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-20">
                    <div className="lg:col-span-2">
                        <div className="text-3xl font-black tracking-tighter text-gradient font-serif mb-8">KGHS 89 ANTIGRAVITY</div>
                        <p className="opacity-30 text-sm leading-relaxed max-w-sm mb-12">
                            경기고등학교 89회 불어반 동문들을 위한 고품격 골프 커뮤니티입니다.
                            격조 높은 만남과 건강한 필드 라이프를 지향합니다.
                        </p>
                        <div className="flex gap-6 opacity-30">
                            <Camera size={20} className="hover:text-[#c5a059] cursor-pointer" />
                            <Users size={20} className="hover:text-[#c5a059] cursor-pointer" />
                            <Settings size={20} className="hover:text-[#c5a059] cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h5 className="font-black uppercase tracking-widest text-[11px] mb-8 text-[#c5a059]">Quick Navigation</h5>
                        <div className="flex flex-col gap-4 text-sm opacity-40 font-bold">
                            <Link href="#schedule" className="hover:text-white transition-colors">Schedule</Link>
                            <Link href="#rsvp" className="hover:text-white transition-colors">Round Entry</Link>
                            <Link href="#members" className="hover:text-white transition-colors">Member Directory</Link>
                            <Link href="/gallery" className="hover:text-white transition-colors">Lounge & Gallery</Link>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-black uppercase tracking-widest text-[11px] mb-8 text-[#c5a059]">Legal & Ethics</h5>
                        <div className="flex flex-col gap-4 text-sm opacity-40 font-bold">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/admin" className="hover:text-white transition-colors">Club Administration</Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] opacity-20 font-black uppercase tracking-[0.4em]">© 2026 KGHS 89 ANTIGRAVITY GOLF CLUB. ALL ASSETS RESERVED.</p>
                    <div className="flex gap-1 items-center opacity-10 grayscale">
                        <div className="w-8 h-8 rounded-full bg-white"></div>
                        <div className="w-8 h-8 rounded-full bg-white/50"></div>
                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
