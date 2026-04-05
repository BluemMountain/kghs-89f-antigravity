"use client";

import { useState, useEffect } from 'react';
import { getMembers, getAllRounds, addMember, updateMember, deleteMember, addRound, deleteRound, getRoundParticipants, finalizeRound } from '@/app/actions';
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
    const [selectedRound, setSelectedRound] = useState<any>(null);

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
                                className="opacity-30 hover:opacity-100 p-2 hover:bg-red-50 text-red-700 rounded-lg transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-black/50 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> {new Date(round.round_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        {round.status === 'upcoming' && (
                            <button
                                onClick={() => setSelectedRound(round)}
                                className="mt-6 w-full py-3 bg-[#2d5a27]/5 text-[#2d5a27] rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#2d5a27] hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Trophy size={14} /> Enter Scores & Finalize
                            </button>
                        )}
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

            <AnimatePresence>
                {selectedRound && (
                    <ScoreEntryModal
                        round={selectedRound}
                        onClose={() => setSelectedRound(null)}
                        refresh={() => {
                            setSelectedRound(null);
                            refresh();
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function ScoreEntryModal({ round, onClose, refresh }: any) {
    const [participants, setParticipants] = useState<any[]>([]);
    const [scores, setScores] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchParticipants() {
            const list = await getRoundParticipants(round.id);
            setParticipants(list);
            const initialScores: any = {};
            list.forEach((p: any) => initialScores[p.name] = 0);
            setScores(initialScores);
            setLoading(false);
        }
        fetchParticipants();
    }, [round.id]);

    const handleScoreChange = (name: string, value: string) => {
        setScores(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const getWinners = () => {
        return Object.entries(scores)
            .filter(([_, s]) => s > 0)
            .sort((a, b) => a[1] - b[1])
            .slice(0, 3);
    };

    const winners = getWinners();

    const handleSubmit = async () => {
        const scoreList = Object.entries(scores).map(([name, score]) => ({ name, score }));
        if (scoreList.some(s => s.score === 0)) {
            if (!confirm('점수가 0인 인원이 있습니다. 그대로 진행하시겠습니까?')) return;
        }

        const res = await finalizeRound(round.id, scoreList);
        if (res.success) {
            refresh();
        } else {
            alert('오류 발생: ' + res.error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1e3a2b]/40 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2d5a27] via-[#b8860b] to-[#2d5a27]"></div>

                <div className="flex justify-between items-start mb-8 text-black">
                    <div>
                        <h3 className="text-3xl font-black font-serif italic text-[#1e3a2b]">Round Finalize</h3>
                        <p className="text-black/40 text-sm mt-1">{round.title} 스코어 입력 및 종료</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X size={24} className="text-black/20" />
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center text-black/80">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5a27]"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {winners.length > 0 && (
                            <div className="bg-[#2d5a27]/5 rounded-2xl p-6 border border-[#2d5a27]/10 flex justify-between items-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Winner Preview</div>
                                <div className="flex gap-4">
                                    {winners.map(([name, score], i) => (
                                        <div key={name} className="flex flex-col items-center">
                                            <div className="text-[10px] font-black opacity-30 uppercase tracking-widest">{i + 1}st</div>
                                            <div className="text-sm font-bold text-[#1e3a2b]">{name} <span className="text-[#b8860b]">{score}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-black/80">
                            <div className="grid grid-cols-1 gap-3">
                                {participants.map((p: any) => (
                                    <div key={p.name} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border border-transparent hover:border-[#2d5a27]/20 transition-all">
                                        <div className="font-bold text-[#1e3a2b]">{p.name}</div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] uppercase font-black tracking-widest opacity-30">Score</span>
                                            <input
                                                type="number"
                                                value={scores[p.name] || ''}
                                                onChange={(e) => handleScoreChange(p.name, e.target.value)}
                                                className="w-24 bg-white border border-black/5 rounded-xl px-4 py-2 text-center font-black text-[#2d5a27] focus:outline-none focus:border-[#2d5a27]"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {participants.length === 0 && (
                                    <div className="text-center py-10 opacity-30 italic">참석 신청자가 없습니다.</div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-black/5 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-8 py-4 rounded-xl font-bold text-black/40 hover:bg-black/5 transition-all text-sm uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={participants.length === 0}
                                className="flex-1 px-8 py-4 rounded-xl font-bold bg-[#2d5a27] text-white hover:bg-[#b8860b] transition-all shadow-xl shadow-[#2d5a27]/10 text-sm uppercase tracking-widest disabled:opacity-50"
                            >
                                Finalize & Update Handicaps
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
