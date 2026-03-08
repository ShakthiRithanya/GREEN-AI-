import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMetrics } from '../context/MetricsContext';
import UploadModelArea from '../components/UploadModelArea';

const FromModelPage = () => {
    const { setMetricsData } = useMetrics();
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);

    const handleAnalyzeComplete = (data, id) => {
        if (data.compressed_metrics) {
            setMetricsData({
                baseline: data.baseline_metrics,
                compressed: data.compressed_metrics,
                savings: data.savings
            });
            setIsReady(true);
        } else {
            alert("Analysis complete but compressed model could not be evaluated.");
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-8 pb-12 animate-fade-in relative z-10">
            <div className="mb-2">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-dark to-primary">Mode B – Auto-Compress Existing Model</h1>
                <p className="text-dark/70 mt-2 text-lg max-w-3xl font-medium">Upload your uncompressed baseline model and dataset. Green AI Compressor will automatically build a compressed counterpart and provide a side-by-side environmental analysis.</p>
            </div>

            <div className="flex justify-center w-full mt-4 flex-col items-center">
                <div className="w-full max-w-3xl">
                    <UploadModelArea onAnalyze={handleAnalyzeComplete} />
                </div>
                {isReady && (
                    <div className="mt-8 animate-slide-up w-full max-w-3xl">
                        <button onClick={() => navigate('/visualizer')} className="w-full flex items-center justify-center gap-3 bg-primary text-beige py-4 rounded-xl font-black text-xl transition-all shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1">
                            Go to CO₂ Story <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FromModelPage;

