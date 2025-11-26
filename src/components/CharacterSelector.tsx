import React from 'react';

interface CharacterSelectorProps {
    selectedChar: string;
    onSelect: (char: string) => void;
}

const CHARACTERS = [
    { id: 'otter_fire', src: '/assets/otter_fire.png', alt: 'This is Fine' },
    { id: 'otter_laptop', src: '/assets/otter_laptop.png', alt: 'Otter Working' },
    { id: 'otter_gun', src: '/assets/otter_gun.png', alt: 'Otter with Gun' },
    { id: 'pepe_crying', src: '/assets/pepe_crying.png', alt: 'Pepe Crying' },
    { id: 'green_guy', src: '/assets/green_guy.png', alt: 'Feels Good' },
    { id: 'otter_chips', src: '/assets/otter_chips.png', alt: 'Otter Chips' },
    { id: 'pepe_wine', src: '/assets/pepe_wine.png', alt: 'Pepe Wine' },
];

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ selectedChar, onSelect }) => {
    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">

            <div className="flex justify-center gap-4 overflow-x-auto p-4 no-scrollbar">
                {CHARACTERS.map((char) => (
                    <button
                        key={char.id}
                        onClick={() => onSelect(char.id)}
                        className={`relative group p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${selectedChar === char.id
                            ? 'bg-extended-green/10 ring-1 ring-extended-green shadow-[0_0_20px_rgba(0,255,0,0.15)]'
                            : 'bg-white/5 hover:bg-white/10 ring-1 ring-white/5 hover:ring-white/10'
                            }`}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                            <img
                                src={char.src}
                                alt={char.alt}
                                className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
