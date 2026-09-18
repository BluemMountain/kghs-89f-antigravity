"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, X, ArrowLeft, Calendar, User, Trash2, Eye } from 'lucide-react';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from '@/app/actions';

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const fetchImages = async () => {
        setLoading(true);
        const list = await getGalleryImages();
        setImages(list);
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('파일 크기는 10MB 이하이어야 합니다.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!previewUrl) {
            alert('업로드할 사진을 선택하세요.');
            return;
        }

        setUploading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append('url', previewUrl);

        const res = await uploadGalleryImage(formData);
        if (res.success) {
            setShowUploadModal(false);
            setPreviewUrl('');
            await fetchImages();
        } else {
            alert('업로드 실패: ' + res.error);
        }
        setUploading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('이 사진을 갤러리에서 삭제하시겠습니까?')) return;
        const res = await deleteGalleryImage(id);
        if (res.success) {
            if (selectedImage?.id === id) setSelectedImage(null);
            await fetchImages();
        } else {
            alert('삭제 실패: ' + res.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faf9] text-[#1e3a2b] font-sans antialiased selection:bg-[#c5a059] selection:text-white">
            {/* Header / Navbar */}
            <nav className="fixed top-0 z-[100] w-full glass px-6 md:px-12 py-5 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-black/5">
                <Link href="/" className="flex items-center gap-2 text-sm font-black tracking-widest text-[#1e3a2b] hover:text-[#b8860b] transition-all">
                    <ArrowLeft size={18} /> 메인으로 돌아가기
                </Link>

                <div className="text-xl md:text-2xl font-black tracking-tighter text-[#1e3a2b] font-serif">
                    경기고 89회 <span className="text-[#b8860b]">불어반</span> 갤러리
                </div>

                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-[#1e3a2b] text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#b8860b] transition-all shadow-lg shadow-[#1e3a2b]/20 flex items-center gap-2"
                >
                    <Plus size={16} /> 사진 올리기
                </button>
            </nav>

            {/* Hero Header */}
            <section className="pt-36 pb-16 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-[#1e3a2b]/10 text-[10px] uppercase tracking-[0.3em] text-[#b8860b] mb-6 font-bold shadow-sm">
                        <Camera size={14} /> Photo Gallery
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-[#1e3a2b] font-serif italic">
                        추억의 필드 라운딩 갤러리
                    </h1>
                    <p className="text-[#1e3a2b]/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        경기고 89회 불어반 동문들이 필드 위에서 함께 만든 소중한 순간과 라운딩 사진을 공유하는 갤러리입니다.
                    </p>
                </motion.div>
            </section>

            {/* Gallery Grid */}
            <main className="pb-32 px-6 max-w-7xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="animate-pulse bg-white rounded-3xl h-64 border border-black/5"></div>
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-black/5 shadow-sm max-w-md mx-auto">
                        <Camera size={48} className="mx-auto mb-4 text-[#1e3a2b]/20" />
                        <h3 className="text-xl font-bold font-serif text-[#1e3a2b] mb-2">등록된 사진이 없습니다</h3>
                        <p className="text-[#1e3a2b]/50 text-sm mb-6">첫번째 사진을 올려 추억을 나누어보세요!</p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-[#2d5a27] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b8860b] transition-all shadow-lg"
                        >
                            사진 업로드하기
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (idx % 4) * 0.1 }}
                                key={img.id}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div
                                    onClick={() => setSelectedImage(img)}
                                    className="relative aspect-[4/3] bg-black/5 overflow-hidden cursor-pointer"
                                >
                                    <img
                                        src={img.url}
                                        alt={img.description || '갤러리 사진'}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1e3a2b] shadow-lg">
                                            <Eye size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <p className="text-sm font-bold text-[#1e3a2b] line-clamp-2 mb-3">
                                        {img.description || '등록된 설명이 없습니다.'}
                                    </p>
                                    <div className="flex justify-between items-center text-[11px] text-[#1e3a2b]/40 font-bold border-t border-black/5 pt-3">
                                        <span className="flex items-center gap-1">
                                            <User size={12} /> {img.uploaded_by || '동문'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(img.created_at).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Lightbox / View Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-4 bg-black text-white flex justify-between items-center">
                                <div className="text-sm font-bold flex items-center gap-2">
                                    <Camera size={16} /> {selectedImage.uploaded_by || '동문'} 님의 사진
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDelete(selectedImage.id)}
                                        className="text-white/60 hover:text-red-400 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                    >
                                        <Trash2 size={16} /> 삭제
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="text-white/60 hover:text-white p-2 rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative bg-black flex-1 flex items-center justify-center p-2 min-h-[300px] overflow-hidden">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.description || '갤러리 사진'}
                                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
                                />
                            </div>

                            {selectedImage.description && (
                                <div className="p-6 bg-white border-t border-black/5">
                                    <p className="text-base font-bold text-[#1e3a2b]">{selectedImage.description}</p>
                                    <p className="text-xs text-black/40 mt-1">
                                        등록일: {new Date(selectedImage.created_at).toLocaleString('ko-KR')}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#1e3a2b]/60 backdrop-blur-md">
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleUploadSubmit}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden border border-[#b8860b]/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-[#1e3a2b] font-serif italic">사진 업로드</h3>
                                    <p className="text-[#1e3a2b]/50 text-xs mt-1">라운드 추억 사진을 공유해 보세요.</p>
                                </div>
                                <button type="button" onClick={() => setShowUploadModal(false)} className="text-black/30 hover:text-black">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b] block mb-2">사진 선택</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        className="w-full text-sm text-[#1e3a2b] file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#1e3a2b] file:text-white hover:file:bg-[#b8860b] file:transition-colors"
                                    />
                                </div>

                                {previewUrl && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/10 bg-black/5">
                                        <img src={previewUrl} alt="미리보기" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b] block mb-2">사진 설명 (선택)</label>
                                    <textarea
                                        name="description"
                                        placeholder="예: 5월 라싸CC 1번 홀 단체사진"
                                        rows={3}
                                        className="w-full bg-[#f8faf9] border border-[#1e3a2b]/10 rounded-2xl p-4 text-sm font-medium text-[#1e3a2b] focus:outline-none focus:border-[#2d5a27] resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b] block mb-2">작성자 이름</label>
                                    <input
                                        name="uploadedBy"
                                        placeholder="본인 성함"
                                        defaultValue="동문"
                                        className="w-full bg-[#f8faf9] border border-[#1e3a2b]/10 rounded-2xl px-5 py-3 text-sm font-bold text-[#1e3a2b] focus:outline-none focus:border-[#2d5a27]"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="flex-1 px-4 py-4 rounded-full font-black text-xs uppercase tracking-widest text-[#1e3a2b]/40 hover:bg-black/5 transition-all"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 px-4 py-4 rounded-full font-black text-xs uppercase tracking-widest bg-[#1e3a2b] text-white hover:bg-[#b8860b] transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {uploading ? '업로드 중...' : '업로드 완료'}
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
