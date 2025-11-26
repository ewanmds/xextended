import { forwardRef } from 'react';

interface PNLCardProps {
    estimatedValue: number;
    selectedChar: string;
    xp: number;
}

export const PNLCard = forwardRef<HTMLDivElement, PNLCardProps>(({ estimatedValue, selectedChar, xp }, ref) => {
    const formattedValue = estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const formattedXp = xp.toLocaleString();

    return (
        <div className="flex justify-center my-8">
            <div
                ref={ref}
                className="relative w-[600px] h-[315px] bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center border border-white/10 shadow-2xl rounded-xl"
                style={{
                    background: 'linear-gradient(180deg, #111 0%, #050505 100%)',
                }}
            >
                {/* Logo Top Left */}
                <div className="absolute top-6 left-6">
                    <img src="/assets/logo_final.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                </div>

                {/* Website URL Top Right */}
                <div className="absolute top-6 right-6">
                    <span className="text-gray-600 text-xs font-bold tracking-[0.2em] uppercase">xextended.xyz</span>
                </div>

                {/* Main Content */}
                <div data-capture-target="content" className="relative z-10 w-full h-full flex flex-col items-center justify-center mt-4 -translate-x-12">
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mb-2">ESTIMATED AIRDROP</span>
                    <h1 className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        ${formattedValue}
                    </h1>
                    <div className="mt-4 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-base font-bold uppercase tracking-wider">
                        {formattedXp} XP
                    </div>
                </div>

                {/* Character - Absolute Right */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-0 opacity-80 mix-blend-lighten pointer-events-none">
                    {/* Burst effect behind character */}
                    <div data-capture-hide="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-extended-green/10 blur-[60px] rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-t from-extended-green/20 to-transparent opacity-50 rotate-45 transform scale-150" />

                    <img
                        src={`/assets/${selectedChar}.png`}
                        alt="Character"
                        className="relative w-48 h-48 object-contain drop-shadow-2xl transform rotate-6"
                    />
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-extended-green/5 to-transparent opacity-50 pointer-events-none" />

                {/* Queen Image */}
                <div className="absolute bottom-0 left-0 pointer-events-none">
                    <div
                        className="w-64 h-64 opacity-20 mix-blend-screen -translate-x-1/4 translate-y-1/4"
                        style={{
                            backgroundImage: 'url(/assets/queen.png)',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

PNLCard.displayName = 'PNLCard';
