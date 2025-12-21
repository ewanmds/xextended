import React from 'react';

interface FDVGridProps {
    xp: number;
}

const FDV_SCENARIOS = [
    { label: 'FDV: 250M', value: 250_000_000 },
    { label: 'FDV: 500M', value: 500_000_000 },
    { label: 'FDV: 750M', value: 750_000_000 },
    { label: 'FDV: 1B', value: 1_000_000_000 },
    { label: 'FDV: 5B', value: 5_000_000_000 },
    { label: 'FDV: 10B', value: 10_000_000_000 },
    { label: 'FDV: 20B', value: 20_000_000_000 },
];

export const TOTAL_XP_SUPPLY = 70_000_000;
const AIRDROP_ALLOCATION = 0.30; // 30%

interface FDVGridProps {
    xp: number;
    selectedFdv: number;
    onSelectFdv: (fdv: number) => void;
}

export const FDVGrid: React.FC<FDVGridProps> = ({ xp, selectedFdv, onSelectFdv }) => {
    const calculateValue = (fdv: number) => {
        if (xp === 0) return 0;
        const userShare = xp / TOTAL_XP_SUPPLY;
        const totalAirdropValue = fdv * AIRDROP_ALLOCATION;
        return userShare * totalAirdropValue;
    };

    return (
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl mx-auto px-4">
            {FDV_SCENARIOS.map((scenario) => {
                const val = calculateValue(scenario.value);
                const isSelected = selectedFdv === scenario.value;

                return (
                    <div
                        key={scenario.label}
                        onClick={() => onSelectFdv(scenario.value)}
                        className={`
                            relative flex flex-col items-center justify-center 
                            w-[45%] md:w-[30%] lg:w-[18%] min-w-[140px]
                            p-6 
                            cursor-pointer
                            backdrop-blur-sm
                            border rounded-xl gap-2 
                            transition-all duration-300 ease-out
                            group
                            ${isSelected
                                ? 'bg-zinc-800 border-extended-green shadow-[0_0_20px_rgba(0,255,0,0.1)] -translate-y-2'
                                : 'bg-zinc-900/60 border-white/5 hover:border-extended-green/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-extended-green/10'
                            }
                        `}
                    >
                        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isSelected ? 'text-extended-green' : 'text-gray-500 group-hover:text-extended-green/80'}`}>
                            {scenario.label}
                        </span>
                        <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                            ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
