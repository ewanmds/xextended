# Extended Airdrop Estimator

A viral airdrop estimation tool for the Extended community.

## Features
- **XP Calculator**: Estimate airdrop value based on XP and FDV.
- **Viral PNL Card**: Generate shareable images with meme characters.
- **Media Kit**: Download official assets and memes.
- **Responsive Design**: Works perfectly on mobile and desktop.

## Tech Stack
- React + Vite
- Tailwind CSS
- html2canvas (for image generation)
- Lucide React (icons)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Customization
- **Assets**: Place new images in `public/assets`.
- **Characters**: Update `src/components/CharacterSelector.tsx`.
- **FDV Options**: Update `FDV_OPTIONS` in `src/components/Calculator.tsx`.
