import React, { useState } from 'react';
import { AlertTriangle, DownloadCloud, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMetrics } from '../context/MetricsContext';
import api from '../services/api';
import TradeoffChart from './TradeoffChart';

const MetricsDashboard = ({ baselineMetrics, modelId, emptyMessage }) => {
    const navigate = useNavigate();
    const { setMetricsData } = useMetrics();
    const [compressing, setCompressing] = useState(false);
    const [compressedResult, setCompressedResult] = useState(null);
    const [targetSizeRatio, setTargetSizeRatio] = useState(50); // Int representation of 0.5 (percent)

    if (!baselineMetrics) {
        return (
            <div className="flex flex-col gap-6 h-full relative z-10">
                <h2 className="text-2xl font-black text-beige border-b border-white/10 pb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary text-sm border-2 border-primary/30">2</span>
                    Compress & Compare
                </h2>
                <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-beige/40 bg-white/5 p-6 text-center shadow-inner">
                    <p className="text-lg font-bold">{emptyMessage || "Run baseline analysis to see metrics."}</p>
                </div>
            </div>
        );
    }

    const handleCompress = async () => {
        try {
            setCompressing(true);
            const payload = {
                target_size_ratio: targetSizeRatio / 100,
                method: "pruning",
                preserve_fairness: true
            };
            const res = await api.post(`/models/${modelId}/compress`, payload);
            setCompressedResult(res.data);

            // Send metrics to global state
            setMetricsData({
                baseline: baselineMetrics,
                compressed: res.data.compressed_metrics,
                savings: res.data.savings
            });

        } catch (e) {
            console.error(e);
            alert("Error compressing model. Ensure baseline was run and backend is healthy.");
        } finally {
            setCompressing(false);
        }
    };

    const handleExport = async () => {
        try {
            const res = await api.get(`/models/${modelId}/export`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${modelId}_compressed.pkl`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (e) {
            console.error("Error exporting model:", e);
            alert("Error exporting model.");
        }
    };

    const cMetrics = compressedResult?.compressed_metrics;
    const savings = compressedResult?.savings;

    // UX logic for high compression trade-off
    const accuracyDrop = cMetrics ? ((baselineMetrics.accuracy - cMetrics.accuracy) * 100).toFixed(2) : 0;
    const showWarning = cMetrics && accuracyDrop > 5.0;

    // UX logic for fairness tradeoff
    const bFairness = baselineMetrics?.fairness_score;
    const cFairness = cMetrics?.fairness_score;
    const fairnessDrop = (bFairness && cFairness) ? Math.abs(bFairness - cFairness) / bFairness : 0;
    const showFairnessWarning = cMetrics && fairnessDrop > 0.1;

    const renderFairnessBadge = (score) => {
        if (score === null || score === undefined) return <span className="text-sm font-black text-beige/40">N/A</span>;
        if (score >= 0.8 && score <= 1.25) return <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded ml-2 border border-primary/20">Fair ({score.toFixed(2)})</span>;
        return <span className="text-xs font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded ml-2 border border-rose-200">At Risk ({score.toFixed(2)})</span>;
    };

    return (
        <div className="flex flex-col gap-6 h-full relative z-10">
            <h2 className="text-2xl font-black text-beige border-b border-white/10 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary text-sm border-2 border-primary/30">2</span>
                    Compress & Compare
                </div>
                <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Pruning target: {targetSizeRatio}%</span>
            </h2>

            {showWarning && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-700 px-4 py-3 rounded flex items-center gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <p className="font-bold text-sm">High compression trade-off: Model accuracy dropped by {accuracyDrop}% from the baseline.</p>
                </div>
            )}

            {showFairnessWarning && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-700 px-4 py-3 rounded flex items-center gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="font-bold text-sm">Warning: Compression significantly affected fairness. Consider a lower compression ratio.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Baseline Card */}
                <div className="bg-white/5 p-6 rounded-2xl flex flex-col border border-white/5 transition-colors">
                    <h3 className="font-black text-beige/80 mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-beige/20 shadow-sm"></span> Baseline Metrics
                    </h3>
                    <div className="space-y-3 flex-1 mt-2">
                        <div className="flex justify-between items-center flex-wrap gap-2 font-bold"><span className="text-beige/60">CO2 Emissions</span><span className="font-black text-beige bg-dark/40 px-2 py-1 rounded w-full sm:w-auto text-right border border-white/5">{baselineMetrics.co2_emissions_kg?.toFixed(6) || 0} kg</span></div>
                        <div className="flex justify-between items-center flex-wrap gap-2 font-bold"><span className="text-beige/60">Accuracy</span><span className="font-black text-beige bg-dark/40 px-2 py-1 rounded w-full sm:w-auto text-right border border-white/5">{(baselineMetrics.accuracy * 100).toFixed(2)}%</span></div>
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <span className="flex flex-col"><span className="text-beige/60 font-black leading-tight">Fairness</span><span className="text-[10px] text-beige/30 uppercase tracking-widest mt-0.5 font-bold">Disparate Impact</span></span>
                            <div className="w-full sm:w-auto text-right">{renderFairnessBadge(bFairness)}</div>
                        </div>
                        <div className="flex justify-between items-center flex-wrap gap-2 font-bold"><span className="text-beige/60">Model Size</span><span className="font-black text-beige bg-dark/40 px-2 py-1 rounded w-full sm:w-auto text-right border border-white/5">{baselineMetrics.model_size_mb?.toFixed(2)} MB</span></div>
                        <div className="flex justify-between items-center flex-wrap gap-2 font-bold"><span className="text-beige/60">Inference Time</span><span className="font-black text-beige bg-dark/40 px-2 py-1 rounded w-full sm:w-auto text-right border border-white/5">{baselineMetrics.inference_time_ms?.toFixed(2)} ms</span></div>
                    </div>
                </div>

                {/* Compression Card */}
                <div className="bg-white/5 p-6 rounded-2xl flex flex-col border border-primary/20 transition-colors">
                    <h3 className="font-black text-primary mb-5 border-b border-primary/20 pb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(22,101,52,0.6)]"></span> Compressed Metrics
                    </h3>
                    {!compressedResult ? (
                        <div className="flex flex-col flex-1 pb-4">
                            <div className="flex-1 flex flex-col items-center justify-center text-beige/40">
                                <p className="text-sm mb-4 font-black">No compression applied yet.</p>
                                <p className="text-xs text-beige/30 text-center max-w-[200px] font-bold">Run baseline analysis first to configure compression parameters.</p>
                            </div>

                            <div className="mt-auto border-t border-white/10 pt-5 px-1">
                                <div className="mb-6">
                                    <label className="flex justify-between text-sm font-black text-beige/60 mb-3">
                                        <span>Target Size Ratio</span>
                                        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded text-xs border border-primary/20">{targetSizeRatio}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="30" max="90" step="5"
                                        value={targetSizeRatio}
                                        onChange={(e) => setTargetSizeRatio(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-colors"
                                    />
                                    <div className="flex justify-between text-xs text-beige/20 mt-2 font-black uppercase tracking-widest">
                                        <span>30%</span>
                                        <span>90%</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCompress}
                                    disabled={compressing}
                                    className="w-full bg-primary text-beige py-3 rounded-xl font-black transition-all disabled:opacity-50 shadow-lg hover:shadow-primary/20"
                                >
                                    {compressing ? "Compressing..." : `Run Compression (${targetSizeRatio}%)`}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full animate-slide-up">
                            <div className="space-y-3 flex-1 mt-2 font-bold">
                                <div className="flex justify-between items-center flex-wrap gap-2 text-primary"><span className="text-beige/60">CO2 Emissions</span><span className="font-black bg-primary/10 px-2 py-1 rounded w-full sm:w-auto text-right border border-primary/10">{cMetrics.co2_emissions_kg.toFixed(6)} kg</span></div>
                                <div className="flex justify-between items-center flex-wrap gap-2"><span className="text-beige/60">Accuracy</span><span className={`font-black px-2 py-1 rounded w-full sm:w-auto text-right border ${showWarning ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-beige bg-dark/40 border-white/5'}`}>{(cMetrics.accuracy * 100).toFixed(2)}%</span></div>
                                <div className="flex justify-between items-center flex-wrap gap-2 font-bold">
                                    <span className="flex flex-col"><span className="text-beige/60 font-black leading-tight">Fairness</span><span className="text-[10px] text-beige/30 uppercase tracking-widest mt-0.5 font-bold">Disparate Impact</span></span>
                                    <div className="w-full sm:w-auto text-right">{renderFairnessBadge(cFairness)}</div>
                                </div>
                                <div className="flex justify-between items-center flex-wrap gap-2 text-primary"><span className="text-beige/60">Model Size</span><span className="font-black bg-primary/10 px-2 py-1 rounded w-full sm:w-auto text-right border border-primary/10">{cMetrics.model_size_mb.toFixed(2)} MB</span></div>
                                <div className="flex justify-between items-center flex-wrap gap-2 text-primary"><span className="text-beige/60">Inference Time</span><span className="font-black bg-primary/10 px-2 py-1 rounded w-full sm:w-auto text-right border border-primary/10">{cMetrics.inference_time_ms.toFixed(2)} ms</span></div>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <button onClick={() => navigate('/visualizer')} className="w-full flex items-center justify-center gap-2 bg-primary text-beige py-3 rounded-xl font-black transition-all shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5">
                                    View CO₂ Story <ArrowRight className="w-5 h-5" />
                                </button>
                                <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary/5 py-3 rounded-xl font-black transition-all">
                                    <DownloadCloud className="w-5 h-5" /> Export Compressed Model
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Savings Card */}
                <div className="bg-primary p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    <h3 className="font-black text-beige/80 mb-6 uppercase tracking-widest text-sm relative z-10 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-beige"></span> Overall Reductions
                    </h3>

                    <div className="w-full h-full flex flex-col justify-around py-4 relative z-10 gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-beige/60 font-bold uppercase tracking-wider">CO2 Save</span>
                            <span className="text-4xl lg:text-5xl font-black text-beige drop-shadow-lg">{compressedResult ? savings.co2_reduction_pct.toFixed(1) : "0.0"}%</span>
                        </div>
                        <div className="h-px w-2/3 mx-auto bg-beige/20"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-beige/60 font-bold uppercase tracking-wider">Storage Save</span>
                            <span className="text-4xl lg:text-5xl font-black text-beige drop-shadow-lg">{compressedResult ? savings.size_reduction_pct.toFixed(1) : "0.0"}%</span>
                        </div>
                        <div className="h-px w-2/3 mx-auto bg-beige/20"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-beige/60 font-bold uppercase tracking-wider">Speedup</span>
                            <span className="text-4xl lg:text-5xl font-black text-beige drop-shadow-lg">{compressedResult ? savings.speedup_pct.toFixed(1) : "0.0"}%</span>
                        </div>
                    </div>
                </div>

            </div>
            {cMetrics && <TradeoffChart baselineMetrics={baselineMetrics} compressedMetrics={cMetrics} />}
        </div >
    );
};

export default MetricsDashboard;

