import React, { useState } from 'react';
import UploadArea from '../components/UploadArea';
import MetricsDashboard from '../components/MetricsDashboard';

const FromDataPage = () => {
    const [baselineMetrics, setBaselineMetrics] = useState(null);
    const [modelId, setModelId] = useState(null);

    const handleAnalyzeComplete = (metrics, id) => {
        setBaselineMetrics(metrics);
        setModelId(id);
    };

    return (
        <div className="w-full h-full flex flex-col gap-8 pb-12 animate-fade-in relative z-10">
            <div className="mb-2">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-dark to-primary">Mode A – Build & Optimize from Dataset</h1>
                <p className="text-dark/70 mt-2 text-lg max-w-2xl font-medium">Upload your CSV to automatically train a baseline and compare against a compressed eco-model.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
                <div className="lg:col-span-4">
                    <UploadArea onAnalyze={handleAnalyzeComplete} />
                </div>
                <div className="lg:col-span-8 bg-dark p-6 rounded-2xl h-full flex flex-col relative overflow-hidden shadow-xl border border-white/5">
                    <MetricsDashboard baselineMetrics={baselineMetrics} modelId={modelId} emptyMessage="Run baseline analysis to see metrics." />
                </div>
            </div>
        </div>
    );
};

export default FromDataPage;

