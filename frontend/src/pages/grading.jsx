import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Plus,
    Trash2,
    Save,
    ChevronRight,
    ShieldCheck,
    Scale,
    Zap,
    Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const GradingRules = () => {
    const [rules, setRules] = useState([
        { id: 1, name: 'Standard Academic Threshold', minSimilarity: 0, maxSimilarity: 15, grade: 'A+', color: 'text-emerald-400' },
        { id: 2, name: 'Minor Citations Detected', minSimilarity: 16, maxSimilarity: 30, grade: 'B', color: 'text-amber-400' },
        { id: 3, name: 'Significant Overlap', minSimilarity: 31, maxSimilarity: 60, grade: 'C', color: 'text-orange-400' },
        { id: 4, name: 'Critical Plagiarism Flag', minSimilarity: 61, maxSimilarity: 100, grade: 'F', color: 'text-rose-400' },
    ]);

    const handleSave = () => {
        toast.success('Grade Book: Policy rules globally updated.');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <header>
                <div className="inline-flex items-center space-x-2 text-indigo-400 mb-2">
                    <Scale className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Policy Configuration</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Grading Algorithms</h1>
                <p className="text-slate-500 font-medium mt-1">Define how similarity indices translate to academic marks at Gurukul Kangri.</p>
            </header>

            <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                            <Settings className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Similarity-to-Grade Mapping</h3>
                    </div>
                    <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                        <Plus className="w-4 h-4" />
                        <span>Add New Scalar</span>
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    {rules.map((rule) => (
                        <motion.div
                            key={rule.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="group flex items-center gap-6 bg-slate-800/20 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all shadow-inner"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl font-black ${rule.color} shadow-2xl`}>
                                {rule.grade}
                            </div>

                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-bold text-slate-200">{rule.name}</p>
                                <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span>Similarity Range:</span>
                                    <span className="text-slate-300 font-bold">{rule.minSimilarity}% — {rule.maxSimilarity}%</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700/50">
                                    <Settings className="w-4 h-4" />
                                </button>
                                <button className="p-3 bg-slate-800 text-rose-500/50 hover:text-rose-400 rounded-xl transition-all border border-slate-700/50">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="p-8 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center text-amber-400/60 text-[10px] font-black uppercase tracking-widest">
                        <Info className="w-4 h-4 mr-2" />
                        Changes affect all future ingestion cycles
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-3 gradebook-gradient px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-900/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Save className="w-5 h-5" />
                        <span>Apply Policy</span>
                    </button>
                </div>
            </div>

            {/* AI Assistant Hook */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-lg">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                <Zap className="w-6 h-6 fill-current text-white" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Auto-Ingestion Tuning</h3>
                        </div>
                        <p className="text-indigo-100 font-medium leading-relaxed mb-6">
                            Want to auto-fail students with ChatGPT signatures? Enable <span className="font-serif italic text-white underline decoration-white/30">AI Semantic Detection</span> to override standard similarity thresholds.
                        </p>
                        <div className="flex items-center space-x-4">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/15 px-4 py-2.5 rounded-xl border border-white/5">Detection Status: Active</span>
                            <button className="text-[10px] font-black uppercase tracking-widest bg-white text-indigo-600 px-6 py-2.5 rounded-xl transition-all shadow-xl">Tune Model</button>
                        </div>
                    </div>
                    <div className="w-40 h-40 border-4 border-white/20 rounded-[2.5rem] flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-2xl bg-white/5 backdrop-blur-md">
                        <ShieldCheck className="w-20 h-20 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradingRules;
