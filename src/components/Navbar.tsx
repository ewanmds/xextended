interface NavbarProps {
    currentView: 'home' | 'otc';
    onNavigate: (view: 'home' | 'otc') => void;
}

export function Navbar({ currentView, onNavigate }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 pointer-events-none">
            <div className="inline-flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-2xl pointer-events-auto">
                <button
                    onClick={() => onNavigate('home')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'home'
                        ? 'bg-white/10 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Estimator
                </button>
                <button
                    onClick={() => onNavigate('otc')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentView === 'otc'
                        ? 'bg-extended-green/20 text-extended-green shadow-lg shadow-extended-green/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    OTC Market
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-extended-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-extended-green"></span>
                    </span>
                </button>
            </div>
        </nav>
    );
}
