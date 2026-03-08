import React, { useState } from 'react';
import { UploadCloud, Box } from 'lucide-react';
import api from '../services/api';

const UploadModelArea = ({ onAnalyze }) => {
    const [status, setStatus] = useState("idle");
    const [modelFile, setModelFile] = useState(null);
    const [dataFile, setDataFile] = useState(null);
    const [targetCol, setTargetCol] = useState("");
    const [sensitiveCol, setSensitiveCol] = useState("");
    const [formError, setFormError] = useState("");

    const handleModelFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setModelFile(e.target.files[0]);
        }
    };

    const handleDataFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setDataFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        setFormError("");
        if (!modelFile) {
            setFormError("A Model .pkl file is required.");
            return;
        }
        if (!dataFile) {
            setFormError("A dataset CSV file is required.");
            return;
        }
        if (!targetCol) {
            setFormError("Target Column Name is required.");
            return;
        }

        try {
            setStatus("uploading");

            const formData = new FormData();
            formData.append("model_file", modelFile);
            formData.append("data_file", dataFile);
            formData.append("target_column", targetCol);
            if (sensitiveCol) formData.append("sensitive_feature", sensitiveCol);

            const uploadRes = await api.post("/models/upload-existing", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const modelId = uploadRes.data.model_id;

            setStatus("analyzing");
            const analyzeRes = await api.post(`/models/${modelId}/analyze`);

            setStatus("compressing");
            const payload = {
                target_size_ratio: 0.5,
                method: "pruning",
                preserve_fairness: true
            };
            const compressRes = await api.post(`/models/${modelId}/compress`, payload);

            setStatus("done");

            const combinedData = {
                baseline_metrics: analyzeRes.data.baseline_metrics,
                compressed_metrics: compressRes.data.compressed_metrics,
                savings: compressRes.data.savings
            };
            onAnalyze(combinedData, modelId);
        } catch (error) {
            console.error("API call failed", error);
            const msg = error.response?.data?.detail || "Upload failed - check console for details";
            setFormError(msg);
            setStatus("error");
        }
    };

    return (
        <div className="bg-dark p-8 rounded-2xl flex flex-col relative overflow-hidden shadow-xl border border-white/5">
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-20"></div>

            <h2 className="text-2xl font-black mb-8 text-beige flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary text-sm border-2 border-primary/30">1</span>
                Upload Model & Data
            </h2>

            <div className="flex flex-col gap-6 flex-1 relative z-10">
                {/* Input 1: Model File Picker */}
                <div>
                    <label className="block text-sm font-semibold text-beige/60 mb-2">Model (.pkl) *</label>
                    <div className="border border-white/10 rounded-xl p-3 flex items-center bg-white/5 relative focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all hover:bg-white/10">
                        <Box className="w-5 h-5 text-primary mr-3" />
                        <input
                            type="file"
                            onChange={handleModelFileChange}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <span className="text-beige/40 flex-1 truncate font-medium">{modelFile ? modelFile.name : "Choose a model..."}</span>
                    </div>
                </div>

                {/* Input 2: Data File Picker */}
                <div>
                    <label className="block text-sm font-semibold text-beige/60 mb-2">Dataset (.csv/excel) *</label>
                    <div className="border border-white/10 rounded-xl p-3 flex items-center bg-white/5 relative focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all hover:bg-white/10">
                        <UploadCloud className="w-5 h-5 text-primary mr-3" />
                        <input
                            type="file"
                            onChange={handleDataFileChange}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <span className="text-beige/40 flex-1 truncate font-medium">{dataFile ? dataFile.name : "Choose a dataset..."}</span>
                    </div>
                </div>

                {/* Input 3: Target Col */}
                <div>
                    <label className="block text-sm font-semibold text-beige/60 mb-2">Target Column Name *</label>
                    <input
                        type="text"
                        value={targetCol}
                        onChange={(e) => setTargetCol(e.target.value)}
                        placeholder="e.g. target, outcome"
                        className="w-full border border-white/10 rounded-xl px-4 py-3 bg-white/5 text-beige outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-beige/20 font-medium"
                    />
                </div>

                {/* Input 4: Sensitive Col */}
                <div>
                    <label className="block text-sm font-semibold text-beige/60 mb-2">Sensitive Feature Column (optional)</label>
                    <input
                        type="text"
                        value={sensitiveCol}
                        onChange={(e) => setSensitiveCol(e.target.value)}
                        placeholder="e.g. region_type"
                        className="w-full border border-white/10 rounded-xl px-4 py-3 bg-white/5 text-beige outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-beige/20 font-medium"
                    />
                </div>
            </div>

            {/* Interaction States */}
            <div className="mt-10 relative z-10">
                {(formError || status === "error") && (
                    <p className="text-rose-600 text-sm mb-4 font-black bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        {formError || "An error occurred during process."}
                    </p>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={status === "uploading" || status === "analyzing" || status === "compressing"}
                    className="w-full h-12 bg-primary text-beige font-black rounded-xl shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center gap-2"
                >
                    {status === "uploading" ? (
                        <><span className="animate-spin w-4 h-4 border-2 border-beige border-t-transparent rounded-full"></span> Uploading...</>
                    ) : status === "analyzing" ? (
                        <><span className="animate-pulse">Analyzing Baseline...</span></>
                    ) : status === "compressing" ? (
                        <><span className="animate-pulse">Building Compressed Model...</span></>
                    ) : (
                        "Analyze & Compress"
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadModelArea;
