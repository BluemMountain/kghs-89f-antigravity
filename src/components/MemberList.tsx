"use client";

import { useEffect, useState } from 'react';
import { getMembers } from '@/app/actions';
import { ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <section id="members" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
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
