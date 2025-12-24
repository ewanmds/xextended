import { useState } from 'react';
import { X } from 'lucide-react';

export function ReferralBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
            <style>{`
          @keyframes slideInRight {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>

            <div className="relative group">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsVisible(false);
                    }}
                    className="absolute -top-2 -right-2 z-20 p-1 bg-black/80 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-black transition-colors opacity-0 group-hover:opacity-100 duration-200"
                >
                    <X size={12} />
                </button>

                <a
                    href="https://app.extended.exchange/join/RAPIDO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative bg-gradient-to-br from-extended-green/20 to-extended-green/5 backdrop-blur-md border border-extended-green/30 rounded-2xl p-4 shadow-[0_0_40px_rgba(0,255,0,0.15)] hover:shadow-[0_0_60px_rgba(0,255,0,0.25)] transition-all duration-300 hover:scale-105"
                    style={{
                        animation: 'slideInRight 0.8s ease-out forwards'
                    }}
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-extended-green/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 bg-extended-green/20 rounded-full flex items-center justify-center border border-extended-green/40">
                            <svg className="w-5 h-5 text-extended-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm leading-tight">Trade on Extended</span>
                            <span className="text-extended-green text-xs font-semibold">Get 10% Fee Discount</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}
