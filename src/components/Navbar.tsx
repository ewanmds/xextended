import { motion } from "framer-motion";

interface NavbarProps {
    currentView: 'home' | 'otc' | 'markets';
    onNavigate: (view: 'home' | 'otc' | 'markets') => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
    const tabs = [
        { id: 'home', label: 'Estimator' },
        { id: 'markets', label: 'Markets' },
        { id: 'otc', label: 'OTC Market' },
    ] as const;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 pointer-events-none">
            <div className="inline-flex items-center gap-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-2xl pointer-events-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onNavigate(tab.id)}
                        className={`relative px-5 py-2 rounded-full text-sm font-bold transition-colors z-10 ${currentView === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                            } flex items-center gap-2`}
                    >
                        {currentView === tab.id && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white/10 rounded-full -z-10 shadow-lg"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        {tab.label}
                        {tab.id === 'otc' && (
                            <span className="relative flex h-2 w-2 ml-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-extended-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-extended-green"></span>
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
}
