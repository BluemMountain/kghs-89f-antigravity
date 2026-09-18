"use client";

import { useState, useEffect } from 'react';
import { getMembers, getAllRounds, addMember, updateMember, deleteMember, addRound, deleteRound, getRoundParticipants, finalizeRound, deleteRsvp, getRsvps, getUpcomingRound, updateRsvpGroup, autoAssignGroups } from '@/app/actions';
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
    Trophy,
    ClipboardList,
    GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'rounds' | 'history' | 'rsvps'>('dashboard');
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
                            active={activeTab === 'rsvps'}
                            onClick={() => setActiveTab('rsvps')}
                            icon={<ClipboardList size={20} />}
                            label="RSVP 관리"
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
                                {activeTab === 'rsvps' && <RsvpManagementView />}
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
    const [awardsMap, setAwardsMap] = useState<{ [key: string]: string }>({});
    const [notesMap, setNotesMap] = useState<{ [key: string]: string }>({});
    const [overallNotes, setOverallNotes] = useState('');
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

    const handleAwardChange = (name: string, value: string) => {
        setAwardsMap(prev => ({ ...prev, [name]: value }));
    };

    const handleNoteChange = (name: string, value: string) => {
        setNotesMap(prev => ({ ...prev, [name]: value }));
    };

    const getWinners = () => {
        return Object.entries(scores)
            .filter(([_, s]) => s > 0)
            .sort((a, b) => a[1] - b[1])
            .slice(0, 3);
    };

    const winners = getWinners();

    const handleSubmit = async () => {
        const participantData = participants.map((p: any) => ({
            name: p.name,
            score: scores[p.name] || 0,
            award: awardsMap[p.name] || '',
            note: notesMap[p.name] || ''
        }));
        if (participantData.some(s => s.score === 0)) {
            if (!confirm('점수가 0인 인원이 있습니다. 그대로 진행하시겠습니까?')) return;
        }

        const res = await finalizeRound(round.id, participantData, overallNotes);
        if (res.success) {
            refresh();
        } else {
            alert('오류 발생: ' + res.error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1e3a2b]/40 backdrop-blur-md">
            <datalist id="award-suggestions">
                <option value="우승" />
                <option value="준우승" />
                <option value="신페리오 우승" />
                <option value="메달리스트" />
                <option value="롱기스트" />
                <option value="니어리스트" />
                <option value="행운상" />
            </datalist>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-3xl shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#2d5a27] via-[#b8860b] to-[#2d5a27]"></div>

                <div className="flex justify-between items-start mb-6 text-black">
                    <div>
                        <h3 className="text-3xl font-black font-serif italic text-[#1e3a2b]">Round Finalize</h3>
                        <p className="text-black/40 text-sm mt-1">{round.title} 스코어 및 수상 기록 입력</p>
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
                        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-6 text-black/80">
                            {winners.length > 0 && (
                                <div className="bg-[#2d5a27]/5 rounded-2xl p-4 border border-[#2d5a27]/10 flex justify-between items-center">
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

                            <div>
                                <label className="text-[11px] font-black uppercase tracking-widest text-[#2d5a27] mb-3 block">참석자 스코어 및 수상/비고 입력</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {participants.map((p: any) => (
                                        <div key={p.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/5 rounded-2xl border border-transparent hover:border-[#2d5a27]/20 transition-all gap-3">
                                            <div className="font-bold text-[#1e3a2b] min-w-[70px]">{p.name}</div>
                                            <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
                                                {/* 수상 선택/입력 */}
                                                <div className="flex items-center gap-1.5 flex-1 min-w-[120px] max-w-[170px]">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#b8860b] whitespace-nowrap">수상</span>
                                                    <input
                                                        list="award-suggestions"
                                                        value={awardsMap[p.name] || ''}
                                                        onChange={(e) => handleAwardChange(p.name, e.target.value)}
                                                        placeholder="수상 선택/입력"
                                                        className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1e3a2b] focus:outline-none focus:border-[#b8860b]"
                                                    />
                                                </div>
                                                {/* 기타 비고 */}
                                                <div className="flex items-center gap-1.5 flex-1 min-w-[120px] max-w-[180px]">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30 whitespace-nowrap">기타</span>
                                                    <input
                                                        type="text"
                                                        value={notesMap[p.name] || ''}
                                                        onChange={(e) => handleNoteChange(p.name, e.target.value)}
                                                        placeholder="기타 내용"
                                                        className="w-full bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-medium text-[#1e3a2b] focus:outline-none focus:border-[#2d5a27]"
                                                    />
                                                </div>
                                                {/* 스코어 */}
                                                <div className="flex items-center gap-2 whitespace-nowrap">
                                                    <span className="text-[10px] uppercase font-black tracking-widest opacity-30">SCORE</span>
                                                    <input
                                                        type="number"
                                                        value={scores[p.name] || ''}
                                                        onChange={(e) => handleScoreChange(p.name, e.target.value)}
                                                        className="w-20 bg-white border border-black/10 rounded-xl px-3 py-1.5 text-center font-black text-[#2d5a27] focus:outline-none focus:border-[#2d5a27]"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {participants.length === 0 && (
                                        <div className="text-center py-10 opacity-30 italic">참석 신청자가 없습니다.</div>
                                    )}
                                </div>
                            </div>

                            {/* 전체 라운드 총평/메모 */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a2b]/50 block">라운드 전체 기타 내용 (선택)</label>
                                <textarea
                                    value={overallNotes}
                                    onChange={(e) => setOverallNotes(e.target.value)}
                                    placeholder="라운드 전체 메모 및 특이사항을 입력하세요"
                                    rows={2}
                                    className="w-full bg-black/5 border border-transparent rounded-2xl p-4 text-sm font-medium text-[#1e3a2b] focus:outline-none focus:border-[#2d5a27] resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-black/5 flex gap-4">
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

function RsvpManagementView() {
    const [round, setRound] = useState<any>(null);
    const [rsvps, setRsvps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [autoAssigning, setAutoAssigning] = useState(false);

    const fetchRsvps = async () => {
        setLoading(true);
        const upcoming = await getUpcomingRound();
        if (upcoming) {
            setRound(upcoming);
            const list = await getRsvps(upcoming.id);
            setRsvps(list);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRsvps();
    }, []);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`"${name}" 님의 RSVP 신청을 삭제하시겠습니까?`)) return;
        setDeleting(id);
        const res = await deleteRsvp(id);
        if (res.success) {
            await fetchRsvps();
        } else {
            alert('삭제 실패: ' + res.error);
        }
        setDeleting(null);
    };

    const handleGroupChange = async (rsvpId: number, groupName: string) => {
        const res = await updateRsvpGroup(rsvpId, groupName);
        if (res.success) {
            setRsvps(prev => prev.map(r => r.id === rsvpId ? { ...r, group_name: groupName } : r));
        } else {
            alert('조 변경 실패: ' + res.error);
        }
    };

    const handleAutoAssign = async () => {
        if (!round) return;
        if (!confirm('참석 확정 인원을 핸디캡 균형에 따라 자동 4인 1조로 배치하시겠습니까?')) return;
        setAutoAssigning(true);
        const res = await autoAssignGroups(round.id);
        if (res.success) {
            await fetchRsvps();
        } else {
            alert('자동 조편성 실패: ' + res.error);
        }
        setAutoAssigning(false);
    };

    if (loading) return <div className="animate-pulse glass h-[400px] rounded-[2rem]"></div>;

    // Grouping summary
    const attendees = rsvps.filter(r => r.status === 'attend');
    const groupedMap: { [key: string]: any[] } = {};
    attendees.forEach(r => {
        const gName = r.group_name || '미지정';
        if (!groupedMap[gName]) groupedMap[gName] = [];
        groupedMap[gName].push(r);
    });

    const sortedGroupKeys = Object.keys(groupedMap).sort((a, b) => {
        if (a === '미지정') return 1;
        if (b === '미지정') return -1;
        return a.localeCompare(b, undefined, { numeric: true });
    });

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold italic text-[#1e3a2b] font-serif">RSVP & 조편성 관리</h1>
                    {round && (
                        <p className="text-black/40 text-sm mt-2">
                            {round.title} · {new Date(round.round_date).toLocaleDateString('ko-KR')} · 총 {rsvps.length}명 신청 (참석 {attendees.length}명)
                        </p>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {round && attendees.length > 0 && (
                        <button
                            onClick={handleAutoAssign}
                            disabled={autoAssigning}
                            className="bg-[#b8860b] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#2d5a27] transition-all shadow-lg shadow-[#b8860b]/10 text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                        >
                            ⚡ 자동 4인 조편성
                        </button>
                    )}
                    <button
                        onClick={fetchRsvps}
                        className="bg-[#2d5a27] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#b8860b] transition-all shadow-lg shadow-[#2d5a27]/10 text-xs uppercase tracking-widest"
                    >
                        새로고침
                    </button>
                </div>
            </div>

            {!round ? (
                <div className="glass p-16 rounded-[2rem] bg-white/40 text-center">
                    <p className="text-black/40 italic font-serif text-lg">현재 예정된 라운드가 없습니다.</p>
                </div>
            ) : rsvps.length === 0 ? (
                <div className="glass p-16 rounded-[2rem] bg-white/40 text-center">
                    <p className="text-black/40 italic font-serif text-lg">아직 신청자가 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* 조별 현황 요약 카드 */}
                    {sortedGroupKeys.length > 0 && (
                        <div className="glass p-6 rounded-[2rem] bg-white/40 border border-black/5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2d5a27]">
                                    조편성 현황 (Group Summary)
                                </h3>
                                <span className="text-[10px] font-bold text-black/40">
                                    💡 이름 선택 또는 드래그하여 조를 변경할 수 있습니다
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {sortedGroupKeys.map(gKey => (
                                    <div
                                        key={gKey}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const rId = parseInt(e.dataTransfer.getData('text/plain'));
                                            if (rId) {
                                                handleGroupChange(rId, gKey === '미지정' ? '' : gKey);
                                            }
                                        }}
                                        className={`p-4 rounded-2xl border transition-all ${
                                            gKey === '미지정' 
                                                ? 'bg-black/5 border-dashed border-black/10' 
                                                : 'bg-white border-[#2d5a27]/20 shadow-sm hover:border-[#b8860b]'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-black/5">
                                            <span className={`font-black text-sm ${gKey === '미지정' ? 'text-black/40' : 'text-[#2d5a27]'}`}>
                                                {gKey}
                                            </span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-black/50">
                                                {groupedMap[gKey].length}명
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 min-h-[40px]">
                                            {groupedMap[gKey].map((m: any) => (
                                                <div
                                                    key={m.id}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData('text/plain', m.id.toString());
                                                    }}
                                                    className="text-xs font-bold text-[#1e3a2b] flex justify-between items-center p-2 rounded-xl bg-black/5 hover:bg-[#2d5a27]/10 cursor-grab active:cursor-grabbing transition-all group/item border border-transparent hover:border-[#2d5a27]/20"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <GripVertical size={12} className="text-black/30 group-hover/item:text-[#2d5a27]" />
                                                        <span>{m.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] text-black/40 font-medium">H: {m.member_handicap || '-'}</span>
                                                        <select
                                                            value={m.group_name || ''}
                                                            onChange={(e) => handleGroupChange(m.id, e.target.value)}
                                                            className="text-[10px] bg-white border border-black/10 rounded px-1 py-0.5 font-bold text-[#2d5a27] cursor-pointer focus:outline-none"
                                                        >
                                                            <option value="">미지정</option>
                                                            <option value="1조">1조</option>
                                                            <option value="2조">2조</option>
                                                            <option value="3조">3조</option>
                                                            <option value="4조">4조</option>
                                                            <option value="5조">5조</option>
                                                            <option value="6조">6조</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                            {groupedMap[gKey].length === 0 && (
                                                <div className="text-[11px] text-black/20 text-center py-2 italic font-serif">비어 있음</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 참가자 RSVP 목록 및 조 지정 테이블 */}
                    <div className="glass rounded-[2rem] bg-white/50 overflow-hidden shadow-xl border-black/5">
                        <table className="w-full text-left">
                            <thead className="bg-[#2d5a27] text-white text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-5 w-12">#</th>
                                    <th className="px-6 py-5">이름 및 스코어 정보</th>
                                    <th className="px-6 py-5 text-center">상태</th>
                                    <th className="px-6 py-5 text-center">조편성</th>
                                    <th className="px-6 py-5 text-center">스폰서</th>
                                    <th className="px-6 py-5 text-center">신청일시</th>
                                    <th className="px-6 py-5 text-right">삭제</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {rsvps.map((rsvp, idx) => (
                                    <tr key={rsvp.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-6 py-4 text-black/30 text-sm">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span className="font-bold text-black/80 text-lg">{rsvp.name}</span>
                                                {rsvp.name.length > 10 && (
                                                    <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-bold">이름 확인 필요</span>
                                                )}
                                                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                                    <span className="px-2.5 py-0.5 bg-[#2d5a27]/10 text-[#2d5a27] font-bold rounded-lg border border-[#2d5a27]/15">
                                                        25년 핸디: {rsvp.member_handicap || '-'}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 bg-[#b8860b]/10 text-[#b8860b] font-bold rounded-lg border border-[#b8860b]/15">
                                                        이전 스코어: {rsvp.last_score ? `${rsvp.last_score}타` : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                                rsvp.status === 'attend' ? 'bg-[#2d5a27]/10 text-[#2d5a27]' : 'bg-black/5 text-black/30'
                                            }`}>
                                                {rsvp.status === 'attend' ? '참석' : '불참'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {rsvp.status === 'attend' ? (
                                                <select
                                                    value={rsvp.group_name || ''}
                                                    onChange={(e) => handleGroupChange(rsvp.id, e.target.value)}
                                                    className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-bold text-[#2d5a27] focus:outline-none focus:border-[#2d5a27]"
                                                >
                                                    <option value="">미지정</option>
                                                    <option value="1조">1조</option>
                                                    <option value="2조">2조</option>
                                                    <option value="3조">3조</option>
                                                    <option value="4조">4조</option>
                                                    <option value="5조">5조</option>
                                                    <option value="6조">6조</option>
                                                </select>
                                            ) : (
                                                <span className="text-xs text-black/20 font-medium">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-black/50">
                                            {rsvp.sponsor_item || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-black/40">
                                            {new Date(rsvp.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(rsvp.id, rsvp.name)}
                                                disabled={deleting === rsvp.id}
                                                className="p-2 hover:bg-red-50 rounded-lg text-black/20 hover:text-red-500 transition-all disabled:opacity-30"
                                            >
                                                {deleting === rsvp.id ? (
                                                    <span className="text-xs">삭제중...</span>
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
