import React from 'react';
import { Download } from 'lucide-react';

const ASSETS = [
    { name: 'Extended Logo', src: '/assets/logo_final.jpg', type: 'Logo' },
    { name: 'Character 1', src: '/assets/otter_fire.png', type: 'Meme' },
    { name: 'Character 2', src: '/assets/otter_laptop.png', type: 'Meme' },
    { name: 'Character 3', src: '/assets/otter_gun.png', type: 'Meme' },
    { name: 'Character 4', src: '/assets/pepe_crying.png', type: 'Meme' },
    { name: 'Character 5', src: '/assets/green_guy.png', type: 'Meme' },
    { name: 'Character 6', src: '/assets/otter_chips.png', type: 'Meme' },
    { name: 'Character 7', src: '/assets/pepe_wine.png', type: 'Meme' },
];

export const MediaKit: React.FC = () => {
    return (
        <div className="w-full max-w-6xl mx-auto mt-24 px-4">
            <div className="flex flex-col items-center mb-12">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-4">MEDIA KIT</h2>
                <p className="text-gray-500 text-center max-w-xl">
                    Download high-quality assets and memes for your content.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {ASSETS.map((asset) => (
                    <div key={asset.name} className="group relative bg-zinc-900/50 border border-white/5 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-extended-green/30 transition-all">
                        <div className="h-24 w-full flex items-center justify-center">
                            <img
                                src={asset.src}
                                alt={asset.name}
                                className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2 w-full">
                            <span className="text-sm font-bold text-gray-400">{asset.name}</span>
                            <a
                                href={asset.src}
                                download
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-extended-green hover:text-black text-white text-xs font-bold rounded-lg transition-all w-full justify-center"
                            >
                                <Download size={14} />
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
