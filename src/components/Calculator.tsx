import React from 'react';

interface CalculatorProps {
    xp: string;
    onXpChange: (value: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ xp, onXpChange }) => {
    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
            <label className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">ENTER YOUR SEASON 2 XP</label>
            <div className="relative w-full group">
                <input
                    type="text"
                    value={xp}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^[\d,]*$/.test(val)) {
                            onXpChange(val);
                        }
                    }}
                    placeholder="0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-8 text-6xl font-black text-center text-white placeholder-gray-800 focus:border-extended-green focus:outline-none focus:ring-1 focus:ring-extended-green transition-all"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600 font-bold pointer-events-none text-xl">XP</div>
            </div>
            <p className="text-gray-600 text-sm">Based on estimated 50M Total XP & 30% Supply Allocation</p>
        </div>
    );
};
