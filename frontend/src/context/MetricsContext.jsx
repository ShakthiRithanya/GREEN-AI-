import React, { createContext, useState, useContext } from 'react';

const MetricsContext = createContext();

export const useMetrics = () => useContext(MetricsContext);

export const MetricsProvider = ({ children }) => {
    const [metricsData, setMetricsData] = useState(null);

    return (
        <MetricsContext.Provider value={{ metricsData, setMetricsData }}>
            {children}
        </MetricsContext.Provider>
    );
};

