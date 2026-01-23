"use client";

import { useState, useEffect } from 'react';
import { getMembers, getAllRounds, addMember, updateMember, deleteMember, addRound, deleteRound } from '@/app/actions';
import ScoreHistoryTable from '@/components/ScoreHistoryTable';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    ShieldCheck,
    User,
    Lock,
    Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'rounds' | 'history'>('dashboard');
    const [members, setMembers] = useState<any[]>([]);
    const [rounds, setRounds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Global exposure for quick links
    useEffect(() => {
        // @ts-ignore
        window.setActiveTab = setActiveTab;
    }, [setActiveTab]);

    // Auth check
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '8989') { // 간단한 비밀번호 설정
            setIsAuthorized(true);
            localStorage.setItem('admin_auth', 'true');
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('admin_auth') === 'true') {
            setIsAuthorized(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthorized) {
            refreshData();
        }
    }, [isAuthorized]);

    const refreshData = async () => {
        setLoading(true);
        const [mList, rList] = await Promise.all([getMembers(), getAllRounds()]);
        setMembers(mList);
        setRounds(rList);
        setLoading(false);
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-[#2d5a27]/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="text-[#2d5a27]" size={28} />
                        </div>
                        <h1 className="text-2xl font-bold font-serif italic text-[#1e3a2b]">Admin Access</h1>
                        <p className="text-black/40 text-sm">관리자 비밀번호를 입력하세요.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/5 border border-black/5 rounded-xl px-5 py-4 focus:outline-none focus:border-[#2d5a27] transition-all"
                            autoFocus
                        />
                        <button className="w-full bg-[#2d5a27] text-white py-4 rounded-xl font-bold hover:bg-[#b8860b] transition-all shadow-lg shadow-[#2d5a27]/10">
                            Login
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfdfd] text-black">
            {/* Sidebar-style Header */}
            <div className="flex">
                <aside className="w-64 md:w-72 bg-white/50 border-r border-black/5 min-h-screen p-6 md:p-8 flex flex-col">
                    <div className="mb-12">
                        <h2 className="text-xl font-black italic text-[#2d5a27] font-serif">Admin Panel</h2>
                        <p className="text-[10px] uppercase tracking-widest opacity-30 mt-1">Management System</p>
                    </div>

                    <nav className="space-y-2">
                        <TabButton
                            active={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                        />
                        <TabButton
                            active={activeTab === 'members'}
                            onClick={() => setActiveTab('members')}
                            icon={<Users size={20} />}
                            label="Members"
                        />
                        <TabButton
                            active={activeTab === 'rounds'}
                            onClick={() => setActiveTab('rounds')}
                            icon={<Calendar size={20} />}
                            label="Rounds"
                        />
                        <TabButton
                            active={activeTab === 'history'}
                            onClick={() => setActiveTab('history')}
                            icon={<Trophy size={20} />}
                            label="History"
                        />
                    </nav>

                    <div className="mt-auto absolute bottom-8 left-8">
                        <button
                            onClick={() => {
                                localStorage.removeItem('admin_auth');
                                setIsAuthorized(false);
                            }}
                            className="flex items-center gap-3 text-black/40 hover:text-red-500 transition-all text-sm font-bold"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-6 lg:p-12">
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <div className="animate-pulse glass h-[600px] rounded-[2rem]"></div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {activeTab === 'dashboard' && <DashboardView members={members} rounds={rounds} setActiveTab={setActiveTab} />}
                                {activeTab === 'members' && <MemberManagementView members={members} refresh={refreshData} />}
                                {activeTab === 'rounds' && <RoundManagementView rounds={rounds} refresh={refreshData} />}
                                {activeTab === 'history' && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                        <ScoreHistoryTable />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all ${active
                ? 'bg-[#2d5a27] text-white shadow-xl shadow-[#2d5a27]/10'
                : 'text-black/50 hover:bg-black/5'
                }`}
        >
            {icon} {label}
        </button>
    );
}

function DashboardView({ members, rounds }: any) {
    const execCount = members.filter((m: any) => m.role === 'executive').length;
    const upcomingRound = rounds.find((r: any) => r.status === 'upcoming');

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h1 className="text-4xl font-bold italic mb-8 text-[#1e3a2b] font-serif">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Total Members" value={members.length} icon={<Users className="text-[#2d5a27]" />} />
                <StatCard label="Executive Board" value={execCount} icon={<ShieldCheck className="text-[#b8860b]" />} />
                <StatCard label="Upcoming Round" value={upcomingRound ? "1" : "0"} icon={<Calendar className="text-[#2d5a27]" />} />
            </div>

            <div className="glass p-10 rounded-[2rem] bg-white/40">
                <h3 className="text-xl font-bold mb-6 italic">최근 활동 현황</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-white/60 rounded-xl border border-black/5 flex justify-between items-center text-sm">
                        <span className="opacity-50">다음 라운딩</span>
                        <span className="font-bold">{upcomingRound?.title || '일정 없음'}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => (window as any).setActiveTab('history')}
                className="mt-8 w-full glass p-6 rounded-2xl flex items-center justify-between group hover:bg-[#2d5a27]/5 transition-all text-left"
            >
                <div>
                    <h4 className="font-bold text-[#1e3a2b] mb-1">역대 전적 확인하기</h4>
                    <p className="text-xs opacity-40">2019년~2025년의 상세 기록을 확인합니다.</p>
                </div>
                <Trophy className="text-[#b8860b] group-hover:scale-125 transition-transform" size={24} />
            </button>
        </motion.div>
    );
}

function StatCard({ label, value, icon }: any) {
    return (
        <div className="glass p-8 rounded-[2rem] bg-white shadow-sm border-black/5 flex items-center justify-between">
            <div>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-1">{label}</p>
                <p className="text-4xl font-black italic">{value}</p>
            </div>
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
                {icon}
            </div>
        </div>
    );
}

function MemberManagementView({ members, refresh }: any) {
    const [isAdding, setIsAdding] = useState(false);

    const handleDelete = async (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const res = await deleteMember(id);
            if (res.success) refresh();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold italic text-[#1e3a2b] font-serif">Member Management</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-[#2d5a27] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#b8860b] transition-all flex items-center gap-2 shadow-lg shadow-[#2d5a27]/10"
                >
                    <Plus size={18} /> Add Member
                </button>
            </div>

            <div className="glass rounded-[2rem] bg-white/50 overflow-hidden shadow-xl border-black/5">
                <table className="w-full text-left">
                    <thead className="bg-[#2d5a27] text-white text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Name</th>
                            <th className="px-8 py-5 text-center">Handicap</th>
                            <th className="px-8 py-5 text-center">Role</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {members.map((member: any) => (
                            <tr key={member.id} className="hover:bg-white/40 transition-colors">
                                <td className="px-8 py-4 font-bold text-black/80">{member.name}</td>
                                <td className="px-8 py-4 text-center italic font-black text-[#2d5a27]">{member.handicap}</td>
                                <td className="px-8 py-4 text-center">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${member.role === 'executive' ? 'bg-[#b8860b] text-white' : 'bg-black/5 opacity-50'
                                        }`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-black/5 rounded-lg text-black/30 hover:text-[#2d5a27] transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="p-2 hover:bg-black/5 rounded-lg text-black/30 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Member Modal (Simplified) */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                        <motion.form
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onSubmit={async (e: any) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const res = await addMember(formData);
                                if (res.success) {
                                    setIsAdding(false);
                                    refresh();
                                }
                            }}
                            className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold font-serif italic text-[#1e3a2b]">Add New Member</h3>
                                <button type="button" onClick={() => setIsAdding(false)} className="text-black/30 hover:text-black"><X size={24} /></button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Name</label>
                                    <input name="name" required className="w-full bg-black/5 px-5 py-3 rounded-xl focus:outline-none focus:border-[#2d5a27] border border-transparent transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Handicap</label>
                                    <input name="handicap" type="number" step="0.1" required className="w-full bg-black/5 px-5 py-3 rounded-xl focus:outline-none focus:border-[#2d5a27] border border-transparent transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Role</label>
                                    <select name="role" className="w-full bg-black/5 px-5 py-3 rounded-xl focus:outline-none focus:border-[#2d5a27] border border-transparent transition-all">
                                        <option value="member">General Member</option>
                                        <option value="executive">Executive Board</option>
                                    </select>
                                </div>
                            </div>
                            <button className="w-full bg-[#2d5a27] text-white py-4 rounded-xl font-bold hover:bg-[#b8860b] transition-all shadow-lg shadow-[#2d5a27]/10">
                                Save Member
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function RoundManagementView({ rounds, refresh }: any) {
    const [isAdding, setIsAdding] = useState(false);

    const handleDelete = async (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const res = await deleteRound(id);
            if (res.success) refresh();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold italic text-[#1e3a2b] font-serif">Round Management</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-[#2d5a27] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#b8860b] transition-all flex items-center gap-2 shadow-lg shadow-[#2d5a27]/10"
                >
                    <Plus size={18} /> New Round
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rounds.map((round: any) => (
                    <div key={round.id} className="glass p-8 rounded-[2rem] bg-white/50 border-black/5 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block ${round.status === 'upcoming' ? 'bg-[#2d5a27] text-white' : 'bg-black/5 opacity-50'
                                    }`}>
                                    {round.status}
                                </span>
                                <h4 className="text-2xl font-bold font-serif">{round.title}</h4>
                            </div>
                            <button
                                onClick={() => handleDelete(round.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-black/20 hover:text-red-500 rounded-lg transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-black/50 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> {round.round_date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                        <motion.form
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onSubmit={async (e: any) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const res = await addRound(formData);
                                if (res.success) {
                                    setIsAdding(false);
                                    refresh();
                                }
                            }}
                            className="bg-white rounded-[2rem] p-10 w-full max-w-md shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold font-serif italic text-[#1e3a2b]">Schedule New Round</h3>
                                <button type="button" onClick={() => setIsAdding(false)} className="text-black/30 hover:text-black"><X size={24} /></button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Title</label>
                                    <input name="title" required placeholder="예: 5월 정기 라운딩" className="w-full bg-black/5 px-5 py-3 rounded-xl focus:outline-none focus:border-[#2d5a27] border border-transparent transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Date</label>
                                    <input name="roundDate" type="date" required className="w-full bg-black/5 px-5 py-3 rounded-xl focus:outline-none focus:border-[#2d5a27] border border-transparent transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</label>
                                    <select name="status" className="w-full bg-black/5 px-5 py-3 rounded-xl focus:outline-none focus:border-[#2d5a27] border border-transparent transition-all">
                                        <option value="upcoming">Upcoming (Active RSVP)</option>
                                        <option value="finished">Finished</option>
                                    </select>
                                </div>
                            </div>
                            <button className="w-full bg-[#2d5a27] text-white py-4 rounded-xl font-bold hover:bg-[#b8860b] transition-all shadow-lg shadow-[#2d5a27]/10">
                                Save Round
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
