import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TradeoffChart = ({ baselineMetrics, compressedMetrics }) => {
    if (!baselineMetrics || !compressedMetrics) return null;

    const data = [
        {
            name: 'Baseline',
            CO2: baselineMetrics.co2_emissions_kg || 0,
            Accuracy: baselineMetrics.accuracy || 0,
            Fairness: baselineMetrics.fairness_score || 0,
        },
        {
            name: 'Compressed',
            CO2: compressedMetrics.co2_emissions_kg || 0,
            Accuracy: compressedMetrics.accuracy || 0,
            Fairness: compressedMetrics.fairness_score || 0,
        },
    ];

    return (
        <div className="bg-white/5 p-6 rounded-2xl mt-8 col-span-1 lg:col-span-3 shadow-2xl border border-white/5">
            <h3 className="font-black text-beige mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(22,101,52,0.5)]"></span> Trade-off Comparison
            </h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff40" tick={{ fill: '#FAF9F6', fontWeight: 'bold' }} />

                        {/* Left Y-axis for metrics 0 to 1+ */}
                        <YAxis yAxisId="left" orientation="left" stroke="#166534" tick={{ fill: '#FAF9F6' }} />

                        {/* Right Y-axis for CO2 tracking (very small values) */}
                        <YAxis yAxisId="right" orientation="right" stroke="#D4B483" tick={{ fill: '#FAF9F6' }} />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#0B201A', borderColor: '#ffffff20', borderRadius: '0.5rem', color: '#FAF9F6' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', color: '#FAF9F6' }} />
                        <Bar yAxisId="right" dataKey="CO2" fill="#D4B483" name="CO2 Emissions (kg)" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="left" dataKey="Accuracy" fill="#166534" name="Accuracy" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="left" dataKey="Fairness" fill="#FAF9F6" name="Fairness Score" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-sm text-center text-beige/40 mt-6 bg-white/5 py-2 rounded-lg inline-block w-full font-black uppercase tracking-widest">
                Goal: keep fairness stable while reducing CO2 emissions and storage size.
            </p>
        </div>
    );
};

export default TradeoffChart;
