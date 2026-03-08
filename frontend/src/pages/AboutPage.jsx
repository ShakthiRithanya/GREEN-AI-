import React from 'react';

const AboutPage = () => {
    return (
        <div className="w-full max-w-4xl mx-auto mt-12 px-4 pb-16 relative z-10 animate-fade-in font-medium">
            <div className="bg-beige p-8 md:p-12 rounded-3xl relative overflow-hidden text-dark/80 shadow-2xl border border-dark/5">
                <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-dark to-primary mb-8 border-b border-dark/10 pb-6 inline-block w-full text-glow">About Green AI Compressor</h1>

                    <h2 className="text-2xl font-black text-dark mt-10 mb-4 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary/40"></span>The Problem: AI's Carbon Footprint & Bias</h2>
                    <p className="mb-4 text-lg leading-relaxed font-bold">
                        Modern Machine Learning algorithms are powerful but incredibly energy-hungry. Training and running models at scale consumes vast amounts of electricity, directly contributing to global carbon emissions. Simultaneously, many AI models inherently mirror bias found in their datasets, inadvertently discriminating against marginalized demographics.
                    </p>
                    <p className="mb-8 text-lg leading-relaxed">
                        This project proves that we can aggressively "Compress" a bulky model into an Eco-friendly variant, mapping the trade-offs to ensure we don't accidentally sacrifice marginalized group fairness while saving power.
                    </p>

                    <h2 className="text-2xl font-black text-dark mt-12 mb-6 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary/40"></span>How it Works</h2>
                    <ul className="list-none space-y-6 mb-10 text-dark/70">
                        <li className="flex gap-4">
                            <span className="text-primary font-black mt-1">01.</span>
                            <div><strong className="text-dark">CodeCarbon Tracking:</strong> During model execution, we hook into your computer's CPU and RAM APIs using the CodeCarbon library to accurately estimate the physical Kilowatt Hours (kWh) and resulting CO2 kilograms your script generates.</div>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-primary font-black mt-1">02.</span>
                            <div><strong className="text-dark">Disparate Impact Ratio:</strong> We check how the model treats a specific "Sensitive Group" (like predicting healthcare for rural vs urban patients). An ideal model has a ratio of 1.0. Our dashboard clearly badges ratios between 0.8 - 1.25 as <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">Fair</span>. If compression destroys accuracy for minorities, it triggers an <span className="text-xs font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded border border-rose-200">At Risk</span> Warning!</div>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-primary font-black mt-1">03.</span>
                            <div><strong className="text-dark">Model Pruning:</strong> "Compressing" an AI means mathematically locating redundant or useless branches in a model's logic tree and deleting them. This makes the model physically smaller (saving storage) and significantly faster (saving electricity) while aiming to keep accuracy the same.</div>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-black text-dark mt-12 mb-6 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary/40"></span>How to Use the App</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-dark/5 p-6 rounded-2xl border border-dark/10 hover:border-primary/30 transition-colors shadow-inner">
                            <h3 className="text-lg font-black text-primary mb-4 pb-2 border-b border-dark/10">Mode A: From Dataset</h3>
                            <ol className="list-decimal pl-5 space-y-3 text-dark/80 marker:text-primary font-bold">
                                <li>Upload a .csv dataset.</li>
                                <li>Declare your Target and Sensitive feature columns.</li>
                                <li>Click Analyze to automatically train a Baseline algorithm.</li>
                                <li>Select a Compression Ratio and hit Compress!</li>
                            </ol>
                        </div>
                        <div className="bg-dark/5 p-6 rounded-2xl border border-dark/10 hover:border-primary/30 transition-colors shadow-inner">
                            <h3 className="text-lg font-black text-primary mb-4 pb-2 border-b border-dark/10">Mode B: From Model</h3>
                            <ol className="list-decimal pl-5 space-y-3 text-dark/80 marker:text-primary font-bold">
                                <li>Upload your existing scikit-learn <code className="text-primary bg-white/50 px-1 py-0.5 rounded font-black">.pkl</code> model file.</li>
                                <li>Upload your testing <code className="text-primary bg-white/50 px-1 py-0.5 rounded font-black">.csv</code> dataset.</li>
                                <li>Declare Target/Sensitive columns.</li>
                                <li>We test your pre-built model and let you compress it!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

