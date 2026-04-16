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
                <div className="inline-flex items-center space-x-2 text-indigo-400 mb-2">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Integrity Engine</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Ingest Academic Artifacts</h1>
                <p className="text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
                    Upload research papers, lab reports, or handwritten notes for deep similarity analysis and AI-human detection.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Metadata */}
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
                        <div className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.15em] mb-3 ml-1">Artifact Label</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Ancient Indian History Thesis"
                                        className="w-full bg-slate-800/50 px-5 py-4 rounded-2xl border border-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-200 placeholder:text-slate-600"
                                        value={assignmentMeta.title}
                                        onChange={(e) => setAssignmentMeta({ ...assignmentMeta, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.15em] mb-3 ml-1">Submission Context</label>
                                    <select className="w-full bg-slate-800/50 px-5 py-4 rounded-2xl border border-slate-700 outline-none focus:border-indigo-500/50 text-slate-200 appearance-none">
                                        <option>End-Term Examination</option>
                                        <option>Ph.D. Research Submission</option>
                                        <option>Sessional Assignment</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.15em] mb-3 ml-1">Additional Constraints</label>
                                <textarea
                                    placeholder="Specify scanning parameters or original sources..."
                                    className="w-full bg-slate-800/50 px-5 py-4 rounded-2xl border border-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all h-32 resize-none text-slate-200 placeholder:text-slate-600"
                                    value={assignmentMeta.description}
                                    onChange={(e) => setAssignmentMeta({ ...assignmentMeta, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Upload Zone */}
                    <div
                        className={`relative bg-slate-900 p-12 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[350px] group overflow-hidden ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[1.02]' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {/* Pulsing effect */}
                        {isDragging && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>}

                        <input
                            type="file"
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            onChange={(e) => validateAndAddFiles(Array.from(e.target.files))}
                        />

                        <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform shadow-2xl relative z-10">
                            <FileUp className="w-10 h-10 text-indigo-400" />
                        </div>

                        <h3 className="text-2xl font-black text-white relative z-10 mb-2">Drop academic files here</h3>
                        <p className="text-slate-500 text-center font-medium relative z-10 text-sm max-w-sm">
                            We highly recommend <span className="text-white font-bold">OCR-ready PDFs</span> for handwritten scripts from Gurukul Kangri.
                        </p>
                        <div className="mt-8 flex items-center space-x-6 relative z-10">
                            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-800 px-3 py-1.5 rounded-lg">
                                <FileDigit className="w-3 h-3" />
                                <span>PDF (25MB)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-800 px-3 py-1.5 rounded-lg">
                                <ImageIcon className="w-3 h-3" />
                                <span>JPEG/PNG</span>
                            </div>
                        </div>
                    </div>

                    {/* File List */}
                    <AnimatePresence>
                        {files.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden"
                            >
                                <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Selected Artifacts ({files.length})</span>
                                    <button onClick={() => setFiles([])} className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest">Discard Cube</button>
                                </div>
                                <div className="divide-y divide-slate-800 max-h-80 overflow-auto custom-scrollbar">
                                    {files.map((file, i) => (
                                        <motion.div
                                            layout
                                            key={i}
                                            className="px-8 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group"
                                        >
                                            <div className="flex items-center space-x-4 truncate">
                                                <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors">
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-bold text-slate-200 truncate">{file.name}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{(file.size / (1024 * 1024)).toFixed(2)} Megabytes</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFile(i)} className="text-slate-600 hover:text-rose-400 p-2 transition-colors">
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
                <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 fill-current text-white" />
                                </div>
                                <h3 className="text-xl font-black italic tracking-tighter">Hyper-Scan</h3>
                            </div>
                            <p className="text-indigo-100/90 text-sm font-medium leading-relaxed mb-6">
                                Our AI analyzes cross-repository leaks, including internal archives of <span className="font-bold text-white underline decoration-white/30">Gurukul Kangri Academic Bank</span>.
                            </p>
                            <div className="space-y-4">
                                {['Multi-Model OCR', 'Deep Semantics', 'Ref. Indexing'].map(t => (
                                    <div key={t} className="flex items-center text-[10px] font-black uppercase tracking-widest bg-white/15 px-4 py-2.5 rounded-xl border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white mr-3 shadow-[0_0_8px_white]"></div>
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
                        <h3 className="text-sm font-black text-white mb-4 uppercase tracking-[0.2em] flex items-center">
                            <AlertCircle className="w-4 h-4 mr-3 text-amber-400" />
                            Thresholds
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mb-6 italic leading-relaxed">
                            Standard Grade Book protocol flags anything with a <span className="text-rose-400 font-bold underline">Similarity Index &gt; 15%</span> for academic review.
                        </p>
                        <button className="w-full py-4 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-slate-600 hover:text-white transition-all shadow-inner">
                            Configure Policy
                        </button>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="w-full gradebook-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-indigo-900/30 transition-all flex items-center justify-center active:scale-[0.98]"
                    >
                        {uploading ? (
                            <div className="flex items-center space-x-3">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="uppercase tracking-[0.2em] text-sm">Initializing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 group">
                                <span className="uppercase tracking-[0.25em] text-sm font-black">Scan Artifacts</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadAssignment;
