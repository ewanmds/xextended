import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Calculator } from '../components/Calculator';
import { CharacterSelector } from '../components/CharacterSelector';
import { PNLCard } from '../components/PNLCard';
import { MediaKit } from '../components/MediaKit';
import { FDVGrid, TOTAL_XP_SUPPLY } from '../components/FDVGrid';
import { Download, Share2, Copy } from 'lucide-react';

export function Home() {
    const [xp, setXp] = useState<string>('');
    const [selectedChar, setSelectedChar] = useState<string>('otter_fire');
    const [selectedFdv, setSelectedFdv] = useState<number>(1_000_000_000);
    const cardRef = useRef<HTMLDivElement>(null);

    const xpNum = parseFloat(xp.replace(/,/g, '')) || 0;

    // Calculate estimated value based on selected FDV
    const cardEstimatedValue = (xpNum / TOTAL_XP_SUPPLY) * (selectedFdv * 0.30);

    const captureCard = async () => {
        if (!cardRef.current) return null;

        // Clone the card to modify it for capture without affecting the UI
        const clone = cardRef.current.cloneNode(true) as HTMLElement;

        // Hide specific elements for capture (like the green glow)
        const elementsToHide = clone.querySelectorAll('[data-capture-hide="true"]');
        elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');

        // Fix alignment for the capture: Enforce strict layout but keep visual positioning
        const contentDiv = clone.querySelector('[data-capture-target="content"]') as HTMLElement;
        if (contentDiv) {
            // We keep the -translate-x-12 class (or equivalent shift) because the user prefers the visual center which is left-shifted.

            // Force strict layout on the container to ensure internal alignment
            contentDiv.style.position = 'absolute';
            contentDiv.style.top = '0';
            contentDiv.style.left = '0';
            contentDiv.style.width = '100%';
            contentDiv.style.height = '100%';
            // Do NOT reset transform, let the class apply the shift

            contentDiv.style.display = 'flex';
            contentDiv.style.flexDirection = 'column';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.justifyContent = 'center';

            // Fix spacing between elements
            const children = contentDiv.children;
            // 0: Label ("ESTIMATED AIRDROP")
            // 1: Dollar Amount (H1)
            // 2: XP Pill (DIV)

            if (children[1]) {
                (children[1] as HTMLElement).style.textAlign = 'center';
                (children[1] as HTMLElement).style.width = '100%';
                (children[1] as HTMLElement).style.marginBottom = '40px'; // Increase space below dollar
                (children[1] as HTMLElement).style.marginTop = '-15px'; // Reduce space between label and dollar slightly
            }

            if (children[2]) {
                const xpPill = children[2] as HTMLElement;
                xpPill.style.marginTop = '0'; // Reset margin since we added it to the dollar
                xpPill.style.display = 'inline-flex'; // Ensure pill shape holds content correctly
                xpPill.style.alignItems = 'center';
                xpPill.style.justifyContent = 'center';
                xpPill.style.width = 'auto'; // Let it size to content
                // Reset to balanced padding and fix line-height for centering
                xpPill.style.padding = '0px 24px 15px 24px'; // Top Right Bottom Left - Less top padding to move text up
                xpPill.style.lineHeight = '1.2';
            }
        }

        // Append to body to render it (required for html2canvas)
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        document.body.appendChild(clone);

        try {
            const canvas = await html2canvas(clone, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });
            return canvas;
        } catch (err) {
            console.error('Failed to generate image', err);
            return null;
        } finally {
            document.body.removeChild(clone);
        }
    };

    const handleDownload = async () => {
        const canvas = await captureCard();
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'xextended-airdrop.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const handleShare = () => {
        const formattedValue = cardEstimatedValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        const text = `Checking my Extended airdrop! 🪂\n\nXP: ${xp}\nEst. value: ${formattedValue}\n\nCheck yours at xextended.xyz @extendedapp\n\nExtendio`;
        const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
        window.open(url, '_blank');
    };

    const handleCopy = async () => {
        const canvas = await captureCard();
        if (canvas) {
            canvas.toBlob(async (blob) => {
                if (blob) {
                    try {
                        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                        alert('Image copied to clipboard!');
                    } catch (err) {
                        console.error('Failed to write to clipboard', err);
                        alert('Failed to copy to clipboard. Please try downloading instead.');
                    }
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center relative pb-24 w-full">




            <div className="relative z-10 container mx-auto px-4 pt-24 flex flex-col items-center gap-12 w-full max-w-6xl">

                {/* 1. Header */}
                <header className="flex flex-col items-center gap-6 text-center">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm">
                        <img src="/assets/logo_final.jpg" alt="Extended" className="w-16 h-16 object-contain rounded-lg" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                        Airdrop Estimator
                    </h1>
                </header>

                {/* 2. Input */}
                <Calculator xp={xp} onXpChange={setXp} />

                {/* 3. FDV Grid & PNL Card Section - Only show if XP > 0 */}
                {xpNum > 0 && (
                    <>
                        {/* 3. FDV Grid */}
                        <FDVGrid
                            xp={xpNum}
                            selectedFdv={selectedFdv}
                            onSelectFdv={setSelectedFdv}
                        />

                        {/* 4. PNL Card Section */}
                        <div className="flex flex-col items-center gap-8 mt-12 w-full">
                            <h2 className="text-xl font-bold text-white tracking-tight">Generate Your PNL Card</h2>

                            {/* Character Selector */}
                            <CharacterSelector selectedChar={selectedChar} onSelect={setSelectedChar} />

                            {/* Card Preview */}
                            <div className="transform scale-75 sm:scale-100 origin-top transition-transform">
                                <PNLCard
                                    ref={cardRef}
                                    estimatedValue={cardEstimatedValue}
                                    selectedChar={selectedChar}
                                    xp={xpNum}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 justify-center mt-[-60px] sm:mt-0">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                                >
                                    <Copy size={18} />
                                    Copy Image
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    <Download size={18} />
                                    Download
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white font-bold rounded-full hover:bg-[#1a91da] transition-all shadow-[0_0_20px_rgba(29,161,242,0.3)]"
                                >
                                    <Share2 size={18} />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* 5. Media Kit */}
                        <MediaKit />
                    </>
                )}

                {/* Footer */}
                <footer className="mt-12 text-center text-gray-600 text-sm">
                    <p>Unofficial Tool. Not financial advice.</p>
                </footer>
            </div>

            {/* Referral Banner - Fixed Bottom Right */}

        </div>
    );
}
