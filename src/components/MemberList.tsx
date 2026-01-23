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
        <section id="members" className="py-32 bg-[#fdfdfd]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 text-black">
                    <h3 className="text-[#2d5a27] uppercase tracking-[0.3em] text-sm mb-4">Classmates</h3>
                    <h2 className="text-4xl md:text-5xl font-bold italic mb-6">회원 정보 및 핸디캡</h2>
                    <div className="h-px w-24 bg-[#b8860b] mx-auto opacity-30"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {members.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.03 }}
                            className="glass p-6 rounded-2xl flex flex-col items-center text-center group hover:border-[#2d5a27]/30 transition-all bg-white/40 text-black"
                        >
                            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4 group-hover:bg-[#2d5a27]/10 transition-colors">
                                {member.role === 'executive' ? (
                                    <ShieldCheck className="text-[#b8860b]" size={24} />
                                ) : (
                                    <User size={24} className="opacity-20" />
                                )}
                            </div>
                            <div className="font-bold text-lg mb-1">{member.name}</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-40 mb-3">{member.role}</div>
                            <div className="w-full h-px bg-black/5 mb-3"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest opacity-40">Handicap</span>
                                <span className="text-xl font-black text-[#2d5a27] italic">{member.handicap}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
