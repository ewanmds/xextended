import React from 'react';

interface FDVGridProps {
    xp: number;
}

const FDV_SCENARIOS = [
    { label: 'FDV: 500M', value: 500_000_000 },
    { label: 'FDV: 750M', value: 750_000_000 },
    { label: 'FDV: 1B', value: 1_000_000_000 },
    { label: 'FDV: 5B', value: 5_000_000_000 },
    { label: 'FDV: 10B', value: 10_000_000_000 },
];

const TOTAL_XP_SUPPLY = 50_000_000;
const AIRDROP_ALLOCATION = 0.30; // 30%

export const FDVGrid: React.FC<FDVGridProps> = ({ xp }) => {
    const calculateValue = (fdv: number) => {
        if (xp === 0) return 0;
        const userShare = xp / TOTAL_XP_SUPPLY;
        const totalAirdropValue = fdv * AIRDROP_ALLOCATION;
        return userShare * totalAirdropValue;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl mx-auto">
            {FDV_SCENARIOS.map((scenario) => {
                const val = calculateValue(scenario.value);
                return (
                    <div key={scenario.label} className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 border border-white/5 rounded-xl gap-2 hover:border-extended-green/30 transition-all">
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{scenario.label}</span>
                        <span className="text-2xl font-black text-white tracking-tight">
                            ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
