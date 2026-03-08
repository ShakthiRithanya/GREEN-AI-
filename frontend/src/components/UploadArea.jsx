import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import api from '../services/api';

const UploadArea = ({ onAnalyze }) => {
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null);
  const [targetCol, setTargetCol] = useState("");
  const [sensitiveCol, setSensitiveCol] = useState("");
  const [formError, setFormError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    setFormError("");
    if (!file) {
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
      formData.append("data_file", file);
      formData.append("target_column", targetCol);
      if (sensitiveCol) formData.append("sensitive_feature", sensitiveCol);

      const uploadRes = await api.post("/models/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const modelId = uploadRes.data.model_id;

      setStatus("analyzing");
      const analyzeRes = await api.post(`/models/${modelId}/analyze`);

      setStatus("done");
      onAnalyze(analyzeRes.data.baseline_metrics, modelId);
    } catch (error) {
      console.error("API call failed", error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-dark p-8 rounded-2xl flex flex-col relative overflow-hidden shadow-xl border border-white/5">
      <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-20"></div>

      <h2 className="text-2xl font-black mb-8 text-beige flex items-center gap-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary text-sm border-2 border-primary/30">1</span>
        Upload & Analyze Baseline
      </h2>

      <div className="flex flex-col gap-6 flex-1 relative z-10">
        {/* Input 1: File Picker */}
        <div>
          <label className="block text-sm font-semibold text-beige/60 mb-2">Dataset (.csv/excel) *</label>
          <div className="border border-white/10 rounded-xl p-3 flex items-center bg-white/5 relative focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all hover:bg-white/10">
            <UploadCloud className="w-5 h-5 text-primary mr-3" />
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <span className="text-beige/40 flex-1 truncate font-medium">{file ? file.name : "Choose a file..."}</span>
          </div>
        </div>

        {/* Input 2: Target Col */}
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

        {/* Input 3: Sensitive Col */}
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
        {formError && (
          <p className="text-rose-600 text-sm mb-4 font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            {formError}
          </p>
        )}
        {status === "error" && (
          <p className="text-rose-600 text-sm mb-4 font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Upload failed - check console for details
          </p>
        )}

        <button
          onClick={handleAnalyze}
          disabled={status === "uploading" || status === "analyzing"}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-beige font-black rounded-xl shadow-[0_10px_15px_rgba(22,101,52,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center gap-2"
        >
          {status === "uploading" ? (
            <><span className="animate-spin w-4 h-4 border-2 border-beige border-t-transparent rounded-full"></span> Uploading...</>
          ) : status === "analyzing" ? (
            <><span className="animate-pulse">Analyzing Data...</span></>
          ) : "Analyze Baseline"}
        </button>
      </div>
    </div>
  );
};

export default UploadArea;
