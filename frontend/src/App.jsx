import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FromDataPage from './pages/FromDataPage';
import FromModelPage from './pages/FromModelPage';
import AboutPage from './pages/AboutPage';
import VisualizerPage from './pages/VisualizerPage';
import { MetricsProvider } from './context/MetricsContext';
import { Leaf } from 'lucide-react';

function App() {
    return (
        <MetricsProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-beige-light text-dark relative overflow-hidden font-sans selection:bg-primary/20">
                    {/* Background ambient blobs - now deep green on beige */}
                    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-dark rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob"></div>
                    <div className="absolute top-0 right-[-10%] w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-dark rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-4000"></div>

                    {/* Navbar - now Dark Green with Beige links */}
                    <nav className="w-full bg-dark sticky top-0 z-50 border-b border-white/5 relative shadow-2xl">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
                            <NavLink to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight text-beige group">
                                <Leaf className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-beige to-white">
                                    Green AI Compressor
                                </span>
                            </NavLink>
                            <div className="flex gap-1 md:gap-2 text-sm font-medium">
                                {[
                                    { to: "/", label: "Home" },
                                    { to: "/from-data", label: "Build From Data" },
                                    { to: "/from-model", label: "Build From Model" },
                                    { to: "/visualizer", label: "CO₂ Story" },
                                    { to: "/docs", label: "Docs" }
                                ].map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-full transition-all duration-300 ${isActive
                                                ? "bg-beige text-dark font-black shadow-lg"
                                                : "text-beige/60 hover:text-beige hover:bg-white/5"
                                            }`
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <main className="relative z-10 p-4 md:p-8 animate-fade-in w-full max-w-7xl mx-auto min-h-[calc(100vh-160px)]">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/from-data" element={<FromDataPage />} />
                            <Route path="/from-model" element={<FromModelPage />} />
                            <Route path="/visualizer" element={<VisualizerPage />} />
                            <Route path="/docs" element={<AboutPage />} />

                            {/* Redirect legacy routes if needed */}
                            <Route path="/optimize" element={<Navigate to="/from-model" replace />} />
                            <Route path="/about" element={<Navigate to="/docs" replace />} />
                        </Routes>
                    </main>

                    {/* Footer - dark green balanced with beige */}
                    <footer className="w-full bg-dark text-beige/40 py-8 px-6 border-t border-white/5 relative z-10 mt-auto">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-primary" />
                                <span className="font-black text-beige/80 tracking-tight">Green AI Compressor</span>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-center md:text-right">
                                © 2026 Sustainable AI Initiative • Built for a Greener Future
                            </div>
                        </div>
                    </footer>
                </div>
            </BrowserRouter>
        </MetricsProvider>
    );
}

export default App;

