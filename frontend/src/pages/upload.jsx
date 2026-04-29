import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileUp,
    X,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileDigit,
    Image as ImageIcon,
    FileCode,
    Sparkles,
    Zap,
    ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const UploadAssignment = () => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [assignmentMeta, setAssignmentMeta] = useState({
        title: '',
        description: '',
        deadline: '',
    });

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        validateAndAddFiles(droppedFiles);
    }, []);

    const validateAndAddFiles = (newFiles) => {
        const validFiles = newFiles.filter(file => {
            const isValidType = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'].includes(file.type);
            if (!isValidType) {
                toast.error(`${file.name} unsupported type`);
            }
            return isValidType;
        });

        setFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return toast.error('Drop some files first!');
        if (!assignmentMeta.title) return toast.error('Assignment title missing');

        setUploading(true);
        setTimeout(() => {
            toast.success('Grade Book: Scanning initiated successfully!');
            setFiles([]);
            setAssignmentMeta({ title: '', description: '', deadline: '' });
            setUploading(false);
        }, 2500);
    };

    const getFileIcon = (type) => {
        if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-indigo-400" />;
        if (type.includes('pdf')) return <FileDigit className="w-5 h-5 text-rose-400" />;
        return <FileCode className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <header className="relative">
                <div className="inline-flex items-center space-x-2 text-orange-400 mb-2.5">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Integrity Engine</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Ingest Artifacts</h1>
                <p className="text-slate-500 font-medium max-w-2xl mt-2 text-sm leading-relaxed">
                    Upload research papers, lab reports, or handwritten notes for deep similarity analyse and AI-human detection.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Metadata */}
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[100px] rounded-full"></div>
                        <div className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3.5 ml-1">Artifact Label</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Ancient Indian History Thesis"
                                        className="w-full bg-white/5 px-6 py-4.5 rounded-2xl border border-white/5 outline-none focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-200 placeholder:text-slate-700 font-medium"
                                        value={assignmentMeta.title}
                                        onChange={(e) => setAssignmentMeta({ ...assignmentMeta, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3.5 ml-1">Submission Context</label>
                                    <div className="relative">
                                        <select className="w-full bg-white/5 px-6 py-4.5 rounded-2xl border border-white/5 outline-none focus:border-orange-500/30 text-slate-200 appearance-none font-medium">
                                            <option>End-Term Examination</option>
                                            <option>Ph.D. Research Submission</option>
                                            <option>Sessional Assignment</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3.5 ml-1">Additional Constraints</label>
                                <textarea
                                    placeholder="Specify scanning parameters or original sources..."
                                    className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/5 outline-none focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/5 transition-all h-40 resize-none text-slate-200 placeholder:text-slate-700 font-medium"
                                    value={assignmentMeta.description}
                                    onChange={(e) => setAssignmentMeta({ ...assignmentMeta, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Upload Zone */}
                    <div
                        className={`relative bg-slate-900/20 p-16 rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[400px] group overflow-hidden ${isDragging ? 'border-orange-500 bg-orange-500/5 scale-[1.01]' : 'border-white/5 hover:border-orange-500/20 hover:bg-white/5'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {/* Pulsing effect */}
                        {isDragging && <div className="absolute inset-0 bg-orange-500/5 animate-pulse"></div>}

                        <input
                            type="file"
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            onChange={(e) => validateAndAddFiles(Array.from(e.target.files))}
                        />

                        <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform shadow-2xl relative z-10 neon-border">
                            <FileUp className="w-12 h-12 text-orange-400" />
                        </div>

                        <h3 className="text-3xl font-black text-white relative z-10 mb-3 tracking-tight">Drop files here</h3>
                        <p className="text-slate-500 text-center font-medium relative z-10 text-sm max-w-sm px-6">
                            Institutional protocol requires <span className="text-orange-400 font-bold">OCR-enabled archives</span> for forensic handwriting analysis.
                        </p>
                        <div className="mt-10 flex items-center space-x-6 relative z-10">
                            <div className="flex items-center space-x-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] border border-white/5 px-4 py-2 rounded-xl bg-white/5">
                                <FileDigit className="w-3.5 h-3.5" />
                                <span>PDF Archive</span>
                            </div>
                            <div className="flex items-center space-x-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] border border-white/5 px-4 py-2 rounded-xl bg-white/5">
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>Digital Imagery</span>
                            </div>
                        </div>
                    </div>

                    {/* File List */}
                    <AnimatePresence>
                        {files.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden"
                            >
                                <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ready for Injection ({files.length})</span>
                                    <button onClick={() => setFiles([])} className="text-[10px] font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-[0.2em]">Purge Buffer</button>
                                </div>
                                <div className="divide-y divide-white/5 max-h-[400px] overflow-auto custom-scrollbar">
                                    {files.map((file, i) => (
                                        <motion.div
                                            layout
                                            key={i}
                                            className="px-10 py-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="flex items-center space-x-5 truncate">
                                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors border border-white/5">
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-bold text-slate-200 truncate">{file.name}</p>
                                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFile(i)} className="text-slate-600 hover:text-rose-500 p-2.5 transition-colors">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-10">
                    <div className="bg-orange-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-orange-900/40 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                                    <Zap className="w-7 h-7 fill-current text-white" />
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter">Hyper-Scan</h3>
                            </div>
                            <p className="text-orange-50/90 text-sm font-medium leading-relaxed mb-8">
                                Our AI analyses cross-repository leaks, including internal archives of <span className="font-bold text-white underline decoration-white/30 underline-offset-4">Gurukul Kangri Academic Centre</span>.
                            </p>
                            <div className="space-y-4">
                                {['Forensic OCR', 'Semantic Flow', 'Cross-Index'].map(t => (
                                    <div key={t} className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <div className="w-2 h-2 rounded-full bg-white mr-4 shadow-[0_0_12px_white]"></div>
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <h3 className="text-[10px] font-black text-white mb-6 uppercase tracking-[0.3em] flex items-center opacity-70">
                            <AlertCircle className="w-4 h-4 mr-3 text-orange-400" />
                            Policy Matrix
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mb-8 italic leading-relaxed">
                            Global protocol flags anything with a <span className="text-orange-400 font-bold underline underline-offset-4">Similarity Index &gt; 15%</span> for mandatory peer review.
                        </p>
                        <button className="w-full py-4.5 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:border-orange-500/20 hover:text-white transition-all shadow-inner">
                            Audit Thresholds
                        </button>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="w-full gradebook-gradient hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-orange-500/30 transition-all flex items-center justify-center active:scale-[0.98] group"
                    >
                        {uploading ? (
                            <div className="flex items-center space-x-4">
                                <Loader2 className="w-7 h-7 animate-spin" />
                                <span className="uppercase tracking-[0.3em] text-[15px]">Analysing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <span className="uppercase tracking-[0.3em] text-[15px]">Initiate Scan</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadAssignment;
