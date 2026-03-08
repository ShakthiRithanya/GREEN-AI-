import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetrics } from '../context/MetricsContext';

export default function VisualizerPage() {
    const { metricsData } = useMetrics();
    const navigate = useNavigate();

    const [predictionsPerDay, setPredictionsPerDay] = useState(10000);
    const [deployments, setDeployments] = useState(10);

    // Empty state fallback
    if (!metricsData) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[500px] animate-fade-in">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-2 border-primary/20">
                    <span className="text-4xl">🌱</span>
                </div>
                <h2 className="text-3xl font-black text-dark mb-4">No run data yet</h2>
                <p className="text-dark/60 mb-8 max-w-md text-lg font-medium">Please go to one of the build pages, run baseline and compression, then return here.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary hover:bg-primary/90 text-beige font-black py-4 px-10 rounded-xl transition-all shadow-[0_10px_20px_rgba(22,101,52,0.2)] hover:shadow-[0_15px_25px_rgba(22,101,52,0.3)] transform hover:-translate-y-1"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const { baseline, compressed, savings } = metricsData;

    const perPredBaselineKg = baseline.co2_emissions_kg;
    const perPredCompressedKg = compressed.co2_emissions_kg;
    const daysPerYear = 365;

    const baselineYearKg = perPredBaselineKg * predictionsPerDay * deployments * daysPerYear;
    const compressedYearKg = perPredCompressedKg * predictionsPerDay * deployments * daysPerYear;
    const savedYearKg = Math.max(0, baselineYearKg - compressedYearKg);

    const KG_PER_PHONE_CHARGE = 0.007; // full smartphone charge
    const KG_PER_LED_HOUR = 0.005;     // 10W LED for 1 hour
    const KG_PER_LAPTOP_HOUR = 0.02;   // 50W laptop for 1 hour

    const phoneChargesSaved = savedYearKg / KG_PER_PHONE_CHARGE;
    const ledHoursSaved = savedYearKg / KG_PER_LED_HOUR;
    const laptopHoursSaved = savedYearKg / KG_PER_LAPTOP_HOUR;

    return (
        <div className="w-full h-full flex flex-col gap-6 relative z-10 animate-fade-in pb-12 pt-2">
            <div className="mb-2">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-dark to-primary flex items-center gap-3 pb-1">
                    <span className="text-3xl">🌍</span> CO₂ Emissions Analogy
                </h1>
                <p className="text-dark/70 mt-2 text-lg font-medium">Visualizing the real-world environmental impact of your AI compression.</p>
            </div>

            {/* Workload Sliders */}
            <div className="bg-dark p-6 rounded-3xl flex flex-col md:flex-row gap-8 items-center justify-between border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                <div className="flex flex-col gap-2 flex-1 w-full relative z-20">
                    <label className="text-xs font-black text-beige/40 uppercase tracking-widest">
                        Predictions per day per deployment
                    </label>
                    <select
                        value={predictionsPerDay}
                        onChange={e => setPredictionsPerDay(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-beige appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer font-black"
                    >
                        <option value={1000} className="bg-dark text-beige">1,000</option>
                        <option value={10000} className="bg-dark text-beige">10,000</option>
                        <option value={50000} className="bg-dark text-beige">50,000</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2 flex-1 w-full relative z-20">
                    <label className="text-xs font-black text-beige/40 uppercase tracking-widest">
                        Number of deployments
                    </label>
                    <select
                        value={deployments}
                        onChange={e => setDeployments(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-beige appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer font-black"
                    >
                        <option value={1} className="bg-dark text-beige">1</option>
                        <option value={10} className="bg-dark text-beige">10</option>
                        <option value={100} className="bg-dark text-beige">100</option>
                        <option value={1000} className="bg-dark text-beige">1,000</option>
                    </select>
                </div>
            </div>

            <p className="text-center text-dark/40 mt-[-10px] text-sm font-black uppercase tracking-tighter">
                Impact calculated for {deployments} deployment(s), {predictionsPerDay.toLocaleString()} predictions/day, over 1 year.
            </p>

            {/* Baseline and Compressed Stats Without Cars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
                {/* Left Panel: Before Compression */}
                <div className="bg-dark p-8 rounded-3xl flex flex-col items-center justify-center relative shadow-2xl border border-white/5 min-h-[160px]">
                    <h3 className="text-xl font-black text-beige/40 uppercase tracking-[0.2em] text-center mb-2">Before Compression</h3>
                    <p className="text-rose-500 font-mono text-xl text-center font-black">Baseline: ~{baselineYearKg.toFixed(3)} kg CO₂</p>
                </div>

                {/* Right Panel: After Compression */}
                <div className="bg-primary p-8 rounded-3xl flex flex-col items-center justify-center relative shadow-2xl border border-primary/20 min-h-[160px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    <h3 className="text-xl font-black text-beige/60 uppercase tracking-[0.2em] text-center mb-2 relative z-10">After Compression</h3>
                    <p className="text-beige font-mono text-2xl text-center font-black drop-shadow-lg relative z-10">Compressed: ~{compressedYearKg.toFixed(3)} kg CO₂</p>
                </div>
            </div>

            {/* Analogy Cards */}
            {savedYearKg > 0 && (
                <section className="mt-2 grid gap-6 md:grid-cols-3">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center shadow-lg flex flex-col justify-between hover:bg-white/10 transition-all group">
                        <div>
                            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">📱</div>
                            <h3 className="text-xs font-black text-beige/40 uppercase tracking-widest mb-1">Phone charges saved</h3>
                            <p className="mt-1 text-3xl font-black text-primary">
                                {phoneChargesSaved.toFixed(1)}
                            </p>
                        </div>
                        <p className="text-[10px] text-beige/20 mt-2 font-black uppercase tracking-tighter">
                            smartphone charges avoided
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center shadow-lg flex flex-col justify-between hover:bg-white/10 transition-all group">
                        <div>
                            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">💡</div>
                            <h3 className="text-xs font-black text-beige/40 uppercase tracking-widest mb-1">LED bulb hours saved</h3>
                            <p className="mt-1 text-3xl font-black text-primary">
                                {ledHoursSaved.toFixed(1)}
                            </p>
                        </div>
                        <p className="text-[10px] text-beige/20 mt-2 font-black uppercase tracking-tighter">
                            hours of 10W LED usage
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center shadow-lg flex flex-col justify-between hover:bg-white/10 transition-all group">
                        <div>
                            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">💻</div>
                            <h3 className="text-xs font-black text-beige/40 uppercase tracking-widest mb-1">Laptop hours saved</h3>
                            <p className="mt-1 text-3xl font-black text-primary">
                                {laptopHoursSaved.toFixed(1)}
                            </p>
                        </div>
                        <p className="text-[10px] text-beige/20 mt-2 font-black uppercase tracking-tighter">
                            hours of 50W laptop usage
                        </p>
                    </div>
                </section>
            )}

            {/* Impact Summary Text */}
            <div className="bg-dark p-8 rounded-3xl border border-white/5 text-center mt-2 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
                <h3 className="font-black text-beige text-2xl mb-4 tracking-tight">The Impact</h3>
                <p className="text-lg text-beige/70 leading-relaxed font-medium">
                    For {deployments} deployment(s) running {predictionsPerDay.toLocaleString()} predictions per day over one year,
                    compression saves about <span className="text-primary font-black underline decoration-2 underline-offset-4">{savedYearKg.toFixed(3)} kg CO₂</span>. That is roughly{" "}
                    <span className="text-primary font-black">{phoneChargesSaved.toFixed(1)}</span> phone charge(s),{" "}
                    <span className="text-primary font-black">{ledHoursSaved.toFixed(1)}</span> LED bulb hour(s),
                    and <span className="text-primary font-black">{laptopHoursSaved.toFixed(1)}</span> laptop hour(s) avoided.
                </p>
            </div>

            {/* Metric Overview */}
            <div className="bg-dark p-8 rounded-3xl border border-white/5 flex-1 relative overflow-hidden mt-2 shadow-2xl">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
                <h3 className="font-black text-beige text-xl border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                    ⚖️ Full Metric Overview
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center text-center shadow-inner hover:bg-white/10 transition-colors">
                        <span className="text-beige/40 text-xs font-black uppercase tracking-widest mb-2">CO2 Save</span>
                        <span className="text-3xl font-black text-primary">{savings.co2_reduction_pct.toFixed(1)}%</span>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center text-center shadow-inner hover:bg-white/10 transition-colors">
                        <span className="text-beige/40 text-xs font-black uppercase tracking-widest mb-2">Storage Save</span>
                        <span className="text-3xl font-black text-primary">{savings.size_reduction_pct.toFixed(1)}%</span>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center text-center shadow-inner hover:bg-white/10 transition-colors">
                        <span className="text-beige/40 text-xs font-black uppercase tracking-widest mb-2">Accuracy</span>
                        <span className="text-3xl font-black text-beige">{(compressed.accuracy * 100).toFixed(2)}%</span>
                        <span className="text-[10px] text-beige/20 mt-2 font-black uppercase tracking-widest">Base: {(baseline.accuracy * 100).toFixed(2)}%</span>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center text-center shadow-inner hover:bg-white/10 transition-colors">
                        <span className="text-beige/40 text-xs font-black uppercase tracking-widest mb-2">Fairness</span>
                        <span className={`text-3xl font-black ${compressed.fairness_score >= 0.8 && compressed.fairness_score <= 1.25 ? 'text-primary' : 'text-rose-500'}`}>
                            {compressed.fairness_score ? compressed.fairness_score.toFixed(2) : "N/A"}
                        </span>
                        <span className="text-[10px] text-beige/20 mt-2 font-black uppercase tracking-widest">Disparate Impact</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

