import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    ArrowUpDown,
    ExternalLink,
    Download,
    AlertTriangle,
    CheckCircle2,
    MoreVertical,
    MinusCircle,
    FileSearch,
    ChevronRight
} from 'lucide-react';

const mockReports = [
    { id: 1, s1: 'Alex Johnson', s2: 'Jordan Smith', similarity: 82, date: 'Oct 18, 2023', marks: 0, type: 'Archive Match' },
    { id: 2, s1: 'Emma Wilson', s2: 'Liam Brown', similarity: 45, date: 'Oct 17, 2023', marks: 50, type: 'Peer Match' },
    { id: 3, s1: 'Noah Garcia', s2: 'Global Web (AI)', similarity: 12, date: 'Oct 15, 2023', marks: 95, type: 'Original' },
    { id: 4, s1: 'Olivia Taylor', s2: 'Ethan Miller', similarity: 68, date: 'Oct 14, 2023', marks: 30, type: 'Critical' },
    { id: 5, s1: 'Sophia Davis', s2: 'James Wilson', similarity: 5, date: 'Oct 12, 2023', marks: 100, type: 'Original' },
];

const SimilarityReports = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const getSimilarityColor = (score) => {
        if (score > 70) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    };

    const getSimilarityIcon = (score) => {
        if (score > 70) return <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />;
        if (score >= 40) return <MinusCircle className="w-3.5 h-3.5 mr-1.5" />;
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                        <FileSearch className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Console</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Similarity Archive</h1>
                    <p className="text-slate-500 font-medium mt-1">Cross-referencing Gurukul Kangri archives and global repositories.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="flex items-center bg-slate-800 text-slate-300 border border-slate-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-xl">
                        <Download className="w-4 h-4 mr-2" />
                        Legacy Export
                    </button>
                    <button className="flex items-center gradebook-gradient px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Initiate Batch
                    </button>
                </div>
            </header>

            {/* Modern Filter Bar */}
            <div className="bg-slate-900/50 backdrop-blur-xl p-3 md:p-4 rounded-[2rem] border border-slate-800 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by student identifier or artifact name..."
                        className="w-full bg-slate-800 pl-13 pr-6 py-4 rounded-2xl border border-slate-700 focus:border-indigo-500/50 outline-none text-sm font-medium text-slate-200 placeholder:text-slate-600 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto px-2">
                    <button className="flex-1 md:flex-none flex items-center justify-center bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">
                        <Filter className="w-4 h-4 mr-2" />
                        Scope
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Sort
                    </button>
                </div>
            </div>

            {/* Reports Table */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden"
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800/40 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800">
                            <tr>
                                <th className="px-10 py-6">Primary Artifact</th>
                                <th className="px-10 py-6">Source Comparison</th>
                                <th className="px-10 py-6 text-center">Sim Index</th>
                                <th className="px-10 py-6 text-center">Score Delta</th>
                                <th className="px-10 py-6">Timestamp</th>
                                <th className="px-10 py-6 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {mockReports.map((report) => (
                                <tr key={report.id} className="hover:bg-indigo-500/[0.02] focus-within:bg-indigo-500/[0.02] transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{report.s1}</div>
                                        <div className="text-[10px] font-black text-slate-600 mt-1 uppercase tracking-tighter">GKV-AUD-2024-X4</div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="text-slate-400 font-bold text-sm tracking-tight">{report.s2}</div>
                                        <div className="text-[10px] text-slate-600 font-black uppercase mt-1 tracking-widest">{report.type}</div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-black border ${getSimilarityColor(report.similarity)}`}>
                                            {getSimilarityIcon(report.similarity)}
                                            {report.similarity}%
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className={`text-sm font-black tracking-tight ${report.marks <= 30 ? 'text-rose-400' : 'text-slate-300'}`}>
                                            {report.marks ? `${report.marks}/100` : 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-slate-500 text-[10px] font-black uppercase tracking-widest">{report.date}</td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="w-10 h-10 flex items-center justify-center bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-xl transition-all border border-slate-700/50" title="Drill Down">
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                            <button className="w-10 h-10 flex items-center justify-center bg-transparent text-slate-600 hover:text-slate-400 rounded-xl transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modern Pagination */}
                <div className="px-10 py-6 bg-slate-800/20 border-t border-slate-800/50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Showing Integrity Metrics</span>
                        <span className="text-xs font-bold text-slate-400 mt-0.5">Records 1 - 05 of 244 in GKV Cluster</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-600 cursor-not-allowed uppercase tracking-widest">Previous</button>
                        <button className="px-5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black text-slate-300 hover:bg-slate-700 uppercase tracking-widest transition-colors">Next Sequence</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SimilarityReports;
