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
                <div className="inline-flex items-center space-x-2 text-orange-400 mb-2.5">
                    <History className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Ledger</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Academic History</h1>
                <p className="text-slate-500 font-medium mt-1 leading-relaxed max-w-2xl text-sm">
                    Review your original work audit trails and official GradeBook certifications.
                </p>
            </header>

            {/* AI Alert Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[2.5rem] flex items-start space-x-6 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 blur-[100px] rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="bg-rose-500/10 p-4 rounded-2xl relative z-10 border border-rose-500/10">
                    <AlertCircle className="w-8 h-8 text-rose-400" />
                </div>
                <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-black text-rose-400 text-[10px] uppercase tracking-[0.2em]">Security Alert: High Similarity</h4>
                        <span className="text-[10px] font-black text-rose-400/50 uppercase tracking-[0.2em]">Action Required</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                        Your artifact <span className="text-white font-bold underline decoration-rose-500/30 italic">'Computational Linguistics Final'</span> has triggered a 55% match with internal Institutional databases. Please coordinate with your department centre.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {mockHistory.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-orange-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-50"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-xl group-hover:scale-105 transition-transform group-hover:neon-border">
                                <FileText className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${item.status === 'Graded' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/5 text-orange-400 border-orange-500/20'
                                }`}>
                                {item.status}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1.5">{item.code}</p>
                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight h-14 tracking-tight">{item.title}</h3>
                            <div className="flex items-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-4 pb-6 border-b border-white/5">
                                <Clock className="w-3.5 h-3.5 mr-2.5 text-slate-600" />
                                Logged: {item.date}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-8 relative z-10">
                            <div>
                                <p className="text-[9px] uppercase font-black text-slate-700 tracking-[0.3em] mb-2">Integrity</p>
                                <div className={`flex items-center text-2xl font-black ${item.similarity > 70 ? 'text-rose-400' : item.similarity > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {item.similarity}%
                                    {item.similarity > 40 && <TrendingDown className="w-5 h-5 ml-2" />}
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-black text-slate-700 tracking-[0.3em] mb-2">Assessment</p>
                                <div className="text-2xl font-black text-slate-300">
                                    {item.marks ? `${item.marks}/100` : <span className="text-slate-800 italic font-medium">—</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-10 relative z-10">
                            <button className="flex-1 bg-white/5 border border-white/5 py-4 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center group/btn">
                                <Eye className="w-4 h-4 mr-2.5" />
                                Traceability Report
                            </button>
                            <button className="p-4 bg-white/5 border border-white/5 rounded-2xl text-slate-500 hover:text-orange-400 hover:bg-white/10 transition-all">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Academic Integrity Board Stats */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-md">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 gradebook-gradient rounded-xl flex items-center justify-center shadow-2xl neon-border">
                                <Shapes className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-2xl font-extrabold text-white tracking-tight">Compliance Quotient</h4>
                        </div>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                            Your overall originality quotient is measured against high-fidelity academic benchmarks. Keep refining your research protocols.
                        </p>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 px-6 py-3.5 rounded-2xl inline-flex items-center text-emerald-400 shadow-xl">
                            <CheckCircle2 className="w-5 h-5 mr-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Status: Compliant</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto">
                        <div className="text-center px-12 py-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex-1 sm:flex-none shadow-2xl">
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Mean Similarity</h4>
                            <div className="text-5xl font-black text-white tracking-tighter text-glow">12.4%</div>
                            <p className="text-[9px] font-black text-orange-400 mt-3 tracking-[0.2em] uppercase">Rank: Alpha-1</p>
                        </div>
                        <div className="text-center px-12 py-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex-1 sm:flex-none shadow-2xl">
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Verified Scans</h4>
                            <div className="text-5xl font-black text-white tracking-tighter text-glow">18</div>
                            <p className="text-[9px] font-black text-slate-700 mt-3 tracking-[0.2em] uppercase">Audit Ledger</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionHistory;
