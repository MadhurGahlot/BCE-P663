import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Eye,
    Download,
    AlertCircle,
    Shapes,
    History,
    ChevronRight,
    TrendingDown
} from 'lucide-react';

const mockHistory = [
    { id: 1, title: 'Advaitic Philosophy Analysis', similarity: 4, status: 'Graded', marks: 95, date: 'Oct 12, 2023', code: 'GKV-BCE-012' },
    { id: 2, title: 'Vedic Literature & AI Ethics', similarity: 18, status: 'Graded', marks: 82, date: 'Oct 05, 2023', code: 'GKV-BCE-008' },
    { id: 3, title: 'Computational Linguistics Final', similarity: 55, status: 'Auditing', marks: null, date: 'Oct 20, 2023', code: 'GKV-BCE-041' },
];

const SubmissionHistory = () => {
    return (
        <div className="space-y-10 pb-20">
            <header className="relative">
                <div className="inline-flex items-center space-x-2 text-indigo-400 mb-2">
                    <History className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Student Submission Ledger</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Academic Milestone History</h1>
                <p className="text-slate-500 font-medium mt-1 leading-relaxed max-w-2xl">
                    Review your original work audit trails and official Grade Book certifications.
                </p>
            </header>

            {/* AI Alert Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-[2rem] flex items-start space-x-5 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="bg-rose-500/20 p-3 rounded-2xl relative z-10">
                    <AlertCircle className="w-7 h-7 text-rose-400" />
                </div>
                <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-black text-rose-400 text-xs uppercase tracking-widest">Audit Alert: High Similarity Detected</h4>
                        <span className="text-[10px] font-black text-rose-400/50 uppercase tracking-widest">Action Required</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                        Your artifact <span className="text-white font-bold underline decoration-rose-500/30 font-serif italic">'Computational Linguistics Final'</span> has triggered a 55% match with internal Gurukul databases. Please coordinate with your department head.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockHistory.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-50"></div>

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 shadow-xl group-hover:scale-105 transition-transform">
                                <FileText className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${item.status === 'Graded' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/5 text-indigo-400 border-indigo-500/20'
                                }`}>
                                {item.status}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.code}</p>
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-100 transition-colors line-clamp-2 leading-tight h-14">{item.title}</h3>
                            <div className="flex items-center text-[10px] font-black text-slate-600 uppercase tracking-tighter mt-3 pb-6 border-b border-white/5">
                                <Clock className="w-3 h-3 mr-2 text-slate-500" />
                                Logged: {item.date}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-6 relative z-10">
                            <div>
                                <p className="text-[9px] uppercase font-black text-slate-600 tracking-[0.2em] mb-1.5">Integrity</p>
                                <div className={`flex items-center text-xl font-black ${item.similarity > 70 ? 'text-rose-400' : item.similarity > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {item.similarity}%
                                    {item.similarity > 40 && <TrendingDown className="w-4 h-4 ml-2" />}
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-black text-slate-600 tracking-[0.2em] mb-1.5">Assessment</p>
                                <div className="text-xl font-black text-slate-200">
                                    {item.marks ? `${item.marks}/100` : <span className="text-slate-700 italic font-medium">—</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-8 relative z-10">
                            <button className="flex-1 bg-slate-800 border border-slate-700 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center group/btn">
                                <Eye className="w-3.5 h-3.5 mr-2" />
                                Traceability Report
                            </button>
                            <button className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-all">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Academic Integrity Board Stats */}
            <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-md">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 gkv-gradient rounded-xl flex items-center justify-center shadow-lg">
                                <Shapes className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-white tracking-tight">Grade Book Quotient</h4>
                        </div>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                            Your overall originality quotient is measured against high-fidelity academic benchmarks. Keep refining your research protocols.
                        </p>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl inline-flex items-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 mr-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Status: Compliant</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-10 w-full md:w-auto">
                        <div className="text-center px-10 py-6 bg-slate-800/30 rounded-[2.5rem] border border-slate-800 flex-1 sm:flex-none">
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Internal Benchmark</h4>
                            <div className="text-5xl font-black text-white tracking-tighter">12.4%</div>
                            <p className="text-[9px] font-bold text-indigo-400 mt-2 tracking-widest uppercase">Rank: Alpha</p>
                        </div>
                        <div className="text-center px-10 py-6 bg-slate-800/30 rounded-[2.5rem] border border-slate-800 flex-1 sm:flex-none">
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Ledger Count</h4>
                            <div className="text-5xl font-black text-white tracking-tighter">18</div>
                            <p className="text-[9px] font-bold text-slate-500 mt-2 tracking-widest uppercase">Verified Scans</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionHistory;
