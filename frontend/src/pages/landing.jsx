import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    ShieldCheck,
    Cpu,
    ArrowRight,
    CheckCircle,
    Zap,
    ExternalLink,
    Award
} from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: <Cpu className="w-8 h-8 text-orange-400" />,
            title: "AI Similarity Detection",
            description: "State-of-the-art semantic analysis using Sentence Transformers to detect plagiarism beyond word-matching."
        },
        {
            icon: <FileText className="w-8 h-8 text-amber-400" />,
            title: "TrOCR Handwriting Recognition",
            description: "Advanced OCR pipeline powered by Microsoft's TrOCR to process handwritten PDF submissions."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
            title: "Secure Authentication",
            description: "Role-based access control for Students and Teachers with JWT-encrypted sessions."
        }
    ];

    const stats = [
        { label: "Processing Speed", value: "< 2s" },
        { label: "Accuracy", value: "99.8%" },
        { label: "Supported Formats", value: "PDF/IMG" }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-orange-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradebook-gradient rounded-xl flex items-center justify-center neon-border">
                            <Award className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-400">
                            GradeBook AI
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-medium hover:text-orange-400 transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-5 py-2.5 gradebook-gradient text-white text-sm font-bold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-orange-500/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full -z-10" />

                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-8 inline-block">
                            Next-Gen Academic Integrity
                        </span>
                        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
                            Smarter Grading with <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
                                AI Similarity Analyse
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            An advanced assignment similarity detection system for Gurukul Kangri (Deemed to be University).
                            Experience the future of academic evaluation.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup" className="group px-8 py-4 gradebook-gradient text-white font-bold rounded-2xl flex items-center gap-2 hover:shadow-2xl hover:shadow-orange-500/40 transition-all">
                                Create Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="px-8 py-4 bg-slate-800/20 hover:bg-slate-800/40 border border-white/5 text-white font-bold rounded-2xl transition-all">
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 glass-morphism rounded-[2.5rem] border border-white/5"
                    >
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <span className="text-4xl font-bold text-white mb-1">{stat.value}</span>
                                <span className="text-xs font-bold text-orange-500/80 uppercase tracking-widest">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-slate-950/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Powerful Core Engine</h2>
                        <p className="text-slate-400 font-light">Precision-engineered for the modern academic landscape.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-8 glass-morphism rounded-3xl border border-white/5 hover:border-orange-500/30 transition-all group"
                            >
                                <div className="mb-6 p-4 bg-orange-500/10 rounded-2xl w-fit group-hover:neon-border transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-light text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto gradebook-gradient rounded-[3rem] p-16 text-center relative overflow-hidden shadow-2xl shadow-orange-500/20">
                    <Zap className="absolute top-10 left-10 w-32 h-32 text-white/10 -rotate-12" />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Elevate Academic Standards</h2>
                        <p className="text-orange-50-100 mb-10 text-lg font-light max-w-xl mx-auto opacity-90">
                            Empower your institution with state-of-the-art AI integrity tools.
                        </p>
                        <Link to="/signup" className="px-10 py-4 bg-white text-orange-600 font-extrabold rounded-2xl hover:scale-105 transition-all inline-block shadow-xl">
                            Get Started for Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 gradebook-gradient rounded-md shadow-lg shadow-orange-500/20" />
                        <span className="font-bold text-white">GradeBook AI</span>
                    </div>
                    <div className="text-slate-500 text-xs font-medium">
                        © 2026 Gurukul Kangri (Deemed to be University). All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="https://github.com/MadhurGahlot" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-orange-400 transition-colors"><ExternalLink className="w-5 h-5" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
