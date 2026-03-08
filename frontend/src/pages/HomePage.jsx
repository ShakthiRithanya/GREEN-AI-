import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Box, ArrowRight, Zap, Leaf, ShieldCheck, TrendingDown, Activity } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center max-w-6xl mx-auto py-12 px-4 text-center">
            {/* Hero Section */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-8 animate-fade-in shadow-sm">
                <Leaf className="w-4 h-4 text-primary" />
                <span>Pioneering Sustainable AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-dark via-primary to-dark mb-6 tracking-tight drop-shadow-sm pb-2">
                Green AI Compressor
            </h1>

            <p className="text-lg md:text-xl text-dark/70 mb-12 max-w-2xl leading-relaxed font-medium">
                Reduce the carbon footprint and storage size of your machine learning models while preserving their fairness and accuracy. Choose an optimization path below to begin.
            </p>

            {/* Main Action Cards (Smaller than before) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-20 relative z-20">
                {/* From Data Card */}
                <button
                    onClick={() => navigate("/from-data")}
                    className="group flex flex-col md:flex-row items-center text-left bg-white p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-xl border border-dark/5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-500"></div>

                    <div className="bg-dark/5 p-4 rounded-full mb-4 md:mb-0 md:mr-6 border border-dark/10 group-hover:border-primary transition-colors shadow-sm flex-shrink-0">
                        <Database className="w-8 h-8 text-primary" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-black text-dark mb-2 group-hover:underline transition-colors decoration-primary decoration-2 underline-offset-4">Build from Data</h2>
                        <p className="text-dark/60 text-sm leading-relaxed mb-4 font-medium">
                            Upload a CSV dataset. We'll automatically train a baseline model, measure its CO₂ footprint, and prune it.
                        </p>
                        <div className="flex items-center gap-2 text-primary font-black text-sm group-hover:gap-3 transition-all">
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </button>

                {/* From Model Card */}
                <button
                    onClick={() => navigate("/from-model")}
                    className="group flex flex-col md:flex-row items-center text-left bg-white p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-xl border border-dark/5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-500"></div>

                    <div className="bg-dark/5 p-4 rounded-full mb-4 md:mb-0 md:mr-6 border border-dark/10 group-hover:border-primary transition-colors shadow-sm flex-shrink-0">
                        <Box className="w-8 h-8 text-primary" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-xl font-black text-dark mb-2 group-hover:underline transition-colors decoration-primary decoration-2 underline-offset-4">Bring Your Own Model</h2>
                        <p className="text-dark/60 text-sm leading-relaxed mb-4 font-medium">
                            Upload your <code className="text-primary bg-dark/5 px-1 py-0.5 rounded text-xs border border-dark/10 font-bold">.pkl</code> model along with a test dataset. We'll construct a greener counterpart.
                        </p>
                        <div className="flex items-center gap-2 text-primary font-black text-sm group-hover:gap-3 transition-all">
                            <span>Optimize Model</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </button>
            </div>

            {/* Key Value Props */}
            <div className="w-full relative z-10">
                <div className="inline-block relative">
                    <h3 className="text-2xl font-black text-dark mb-8 border-b border-dark/10 pb-4">Why Green AI?</h3>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-dark/20 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-beige p-6 rounded-2xl flex flex-col items-center text-center shadow-md border border-dark/5 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border border-primary/20">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-dark mb-2">Reduce Emissions</h4>
                        <p className="text-dark/60 text-sm leading-relaxed font-medium">Lower carbon footprint of model inference while keeping response times fast and lean.</p>
                    </div>

                    <div className="bg-beige p-6 rounded-2xl flex flex-col items-center text-center shadow-md border border-dark/5 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border border-primary/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-dark mb-2">Preserve Fairness</h4>
                        <p className="text-dark/60 text-sm leading-relaxed font-medium">Built-in protections to ensure compression doesn't inadvertently exacerbate demographic biases.</p>
                    </div>

                    <div className="bg-beige p-6 rounded-2xl flex flex-col items-center text-center shadow-md border border-dark/5 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 border border-primary/20">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-dark mb-2">Maintain Accuracy</h4>
                        <p className="text-dark/60 text-sm leading-relaxed font-medium">Intelligent pruning algorithms ensure performance remains highly competitive with baselines.</p>
                    </div>
                </div>
            </div>

            <div className="mt-16 flex items-center justify-center gap-2 text-dark/40 text-sm font-black py-2 px-6 rounded-full border border-dark/10 bg-dark/5">
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-bold tracking-wide">Powered by precise, real-world CodeCarbon telemetry</span>
            </div>
        </div>
    );
};

export default HomePage;

