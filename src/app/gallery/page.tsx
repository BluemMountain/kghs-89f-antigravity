"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, X, ArrowLeft, Calendar, User, Trash2, Eye, ChevronLeft, ChevronRight, ImagePlus } from 'lucide-react';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from '@/app/actions';

// Compress and resize image on client side so multiple high-res phone photos upload fast and reliably
function compressImage(file: File, maxDimension = 1600, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
        reader.onload = () => {
            const img = new window.Image();
            img.onerror = () => resolve(reader.result as string);
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(reader.result as string);
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [processingFiles, setProcessingFiles] = useState(false);

    const fetchImages = async () => {
        setLoading(true);
        const list = await getGalleryImages();
        setImages(list);
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setProcessingFiles(true);
        const newUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 25 * 1024 * 1024) {
                alert(`"${file.name}" 파일이 너무 큽니다 (25MB 이하만 가능).`);
                continue;
            }
            try {
                const compressed = await compressImage(file);
                newUrls.push(compressed);
            } catch (err) {
                console.error(err);
            }
        }

        setPreviewUrls(prev => [...prev, ...newUrls]);
        setProcessingFiles(false);
        // Reset input value so selecting the same or additional files works cleanly
        e.target.value = '';
    };

    const removePreview = (index: number) => {
        setPreviewUrls(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (previewUrls.length === 0) {
            alert('업로드할 사진을 1장 이상 선택하세요.');
            return;
        }

        setUploading(true);
        setUploadProgress({ current: 0, total: previewUrls.length });

        const form = e.currentTarget;
        const baseFormData = new FormData(form);
        const description = (baseFormData.get('description') as string) || '';
        const uploadedBy = (baseFormData.get('uploadedBy') as string) || '동문';

        let successCount = 0;
        let lastError = '';

        // Upload in reverse order so the first selected photo appears first when sorted by created_at DESC
        const urlsToUpload = [...previewUrls].reverse();

        for (let i = 0; i < urlsToUpload.length; i++) {
            setUploadProgress({ current: i + 1, total: urlsToUpload.length });
            const fd = new FormData();
            fd.append('url', urlsToUpload[i]);
            fd.append('description', description);
            fd.append('uploadedBy', uploadedBy);

            const res = await uploadGalleryImage(fd);
            if (res.success) {
                successCount++;
            } else {
                lastError = res.error || '알 수 없는 오류';
            }
        }

        if (successCount > 0) {
            setShowUploadModal(false);
            setPreviewUrls([]);
            await fetchImages();
            if (successCount < urlsToUpload.length) {
                alert(`${urlsToUpload.length}장 중 ${successCount}장 업로드 완료 (일부 실패: ${lastError})`);
            }
        } else {
            alert('업로드 실패: ' + lastError);
        }

        setUploading(false);
        setUploadProgress({ current: 0, total: 0 });
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

    const selectedIndex = selectedImage ? images.findIndex(img => img.id === selectedImage.id) : -1;
    const handlePrevImage = () => {
        if (selectedIndex > 0) setSelectedImage(images[selectedIndex - 1]);
    };
    const handleNextImage = () => {
        if (selectedIndex >= 0 && selectedIndex < images.length - 1) setSelectedImage(images[selectedIndex + 1]);
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
                                transition={{ delay: (idx % 4) * 0.08 }}
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
                                    {images.length > 1 && (
                                        <span className="text-xs text-white/50 ml-2">
                                            ({selectedIndex + 1} / {images.length})
                                        </span>
                                    )}
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
                                {selectedIndex > 0 && (
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                )}
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.description || '갤러리 사진'}
                                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
                                />
                                {selectedIndex >= 0 && selectedIndex < images.length - 1 && (
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                )}
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

            {/* Upload Modal (Multiple Photos Supported) */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#1e3a2b]/60 backdrop-blur-md overflow-y-auto">
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleUploadSubmit}
                            className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden border border-[#b8860b]/20 my-auto max-h-[90vh] flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-[#1e3a2b] font-serif italic">사진 여러 장 업로드</h3>
                                    <p className="text-[#1e3a2b]/50 text-xs mt-1">한 번에 여러 장의 라운드 추억 사진을 선택하여 올릴 수 있습니다.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!uploading) {
                                            setShowUploadModal(false);
                                            setPreviewUrls([]);
                                        }
                                    }}
                                    className="text-black/30 hover:text-black"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6 overflow-y-auto pr-1">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b]">
                                            사진 선택 (다중 선택 가능)
                                        </label>
                                        {previewUrls.length > 0 && (
                                            <span className="text-xs font-black text-[#2d5a27] bg-[#2d5a27]/10 px-3 py-1 rounded-full">
                                                총 {previewUrls.length}장 선택됨
                                            </span>
                                        )}
                                    </div>

                                    <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#1e3a2b]/20 rounded-2xl bg-[#f8faf9] hover:bg-[#1e3a2b]/5 hover:border-[#2d5a27] transition-all cursor-pointer">
                                        <ImagePlus size={28} className="text-[#2d5a27]" />
                                        <span className="text-sm font-bold text-[#1e3a2b]">
                                            {processingFiles
                                                ? '사진 불러오는 중...'
                                                : previewUrls.length > 0
                                                ? '클릭하여 사진 추가 선택하기'
                                                : '클릭하여 사진 여러 장 선택하기'}
                                        </span>
                                        <span className="text-[11px] text-[#1e3a2b]/40">
                                            Ctrl / Shift 키 또는 모바일에서 여러 장을 동시에 선택하세요
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            disabled={uploading || processingFiles}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {previewUrls.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-[#1e3a2b]/60">미리보기</span>
                                            <button
                                                type="button"
                                                onClick={() => setPreviewUrls([])}
                                                disabled={uploading}
                                                className="text-xs font-bold text-red-500 hover:underline"
                                            >
                                                전체 선택 취소
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-52 overflow-y-auto p-2 rounded-2xl bg-[#f8faf9] border border-black/5">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-black/10 bg-black/5 group">
                                                    <img src={url} alt={`미리보기 ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePreview(index)}
                                                        disabled={uploading}
                                                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    <span className="absolute bottom-1 left-1.5 text-[10px] font-black bg-black/60 text-white px-1.5 py-0.5 rounded">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8860b] block mb-2">사진 설명 (선택)</label>
                                    <textarea
                                        name="description"
                                        placeholder="예: 10월 31일 납회식 라싸CC 라운딩"
                                        rows={2}
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

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        disabled={uploading}
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setPreviewUrls([]);
                                        }}
                                        className="flex-1 px-4 py-4 rounded-full font-black text-xs uppercase tracking-widest text-[#1e3a2b]/40 hover:bg-black/5 transition-all disabled:opacity-40"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading || processingFiles || previewUrls.length === 0}
                                        className="flex-1 px-4 py-4 rounded-full font-black text-xs uppercase tracking-widest bg-[#1e3a2b] text-white hover:bg-[#b8860b] transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {uploading
                                            ? `업로드 중... (${uploadProgress.current}/${uploadProgress.total})`
                                            : previewUrls.length > 0
                                            ? `${previewUrls.length}장 업로드 완료`
                                            : '업로드 완료'}
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
