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
                <div className="inline-flex items-center space-x-2 text-orange-400 mb-2.5">
                    <Scale className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Policy Configuration</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Grading Algorithms</h1>
                <p className="text-slate-500 font-medium mt-1 text-sm leading-relaxed">Define how similarity indices translate to academic marks at Gurukul Kangri Centres.</p>
            </header>

            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/10 shadow-xl neon-border text-glow">
                            <Settings className="w-6 h-6 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Similarity-to-Grade Scalar</h3>
                    </div>
                    <button className="flex items-center space-x-3 gradebook-gradient text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95">
                        <Plus className="w-4.5 h-4.5" />
                        <span>Add Global Rule</span>
                    </button>
                </div>

                <div className="p-10 space-y-6">
                    {rules.map((rule) => (
                        <motion.div
                            key={rule.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.01 }}
                            className="group flex items-center gap-8 bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-orange-500/20 hover:bg-white/10 transition-all shadow-inner"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-[#020617] border border-white/5 flex items-center justify-center text-2xl font-black ${rule.color} shadow-2xl`}>
                                {rule.grade}
                            </div>

                            <div className="flex-1 space-y-2">
                                <p className="text-base font-extrabold text-slate-200 tracking-tight">{rule.name}</p>
                                <div className="flex items-center space-x-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span className="opacity-50">Similarity Boundary:</span>
                                    <span className="text-orange-400 font-bold bg-orange-500/5 px-2 py-0.5 rounded-lg border border-orange-500/10">{rule.minSimilarity}% — {rule.maxSimilarity}%</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3.5 bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all border border-white/5">
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button className="p-3.5 bg-white/5 text-rose-500/50 hover:text-rose-400 rounded-xl transition-all border border-white/5">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="p-10 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center text-amber-500/60 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Info className="w-4.5 h-4.5 mr-3" />
                        Latency: Global Sync Active
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-4 gradebook-gradient px-10 py-4.5 rounded-2xl text-xs font-black uppercase tracking-[0.25em] text-white shadow-2xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Save className="w-5 h-5" />
                        <span>Update Policy Ledger</span>
                    </button>
                </div>
            </div>

            {/* AI Assistant Hook */}
            <div className="bg-orange-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-orange-900/40 relative overflow-hidden group">
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                                <Zap className="w-7 h-7 fill-current text-white" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight italic">Forensic Tuning</h3>
                        </div>
                        <p className="text-orange-50 font-medium leading-relaxed mb-8 text-sm opacity-90">
                            Want to auto-fail students with ChatGPT signatures? Enable <span className="font-serif italic text-white underline decoration-white/30 underline-offset-8">AI Semantic Detection</span> to override standard similarity thresholds.
                        </p>
                        <div className="flex items-center space-x-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/15 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">Status: Active</span>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] bg-white text-orange-600 px-8 py-3 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95">Calibrate Model</button>
                        </div>
                    </div>
                    <div className="w-48 h-48 border-4 border-white/20 rounded-[3rem] flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-3xl bg-white/5 backdrop-blur-md shadow-orange-700/20">
                        <ShieldCheck className="w-24 h-24 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradingRules;
