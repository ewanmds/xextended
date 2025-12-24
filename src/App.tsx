import { useState } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from './pages/Home';
import { ExtendedOTC } from './pages/ExtendedOTC';
import { Markets } from './pages/Markets';
import { Navbar } from './components/Navbar';
import { ReferralBanner } from './components/ReferralBanner';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'otc' | 'markets'>('home');
  const [direction, setDirection] = useState(0);

  const tabOrder = ['home', 'markets', 'otc'];

  const handleNavigate = (newView: 'home' | 'otc' | 'markets') => {
    if (newView === currentView) return;
    const currentIndex = tabOrder.indexOf(currentView);
    const newIndex = tabOrder.indexOf(newView);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentView(newView);
  };

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3
  } as const;

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-extended-green selection:text-black overflow-x-hidden relative">
        {/* Static Background - Persistent across pages for performance and smoothness */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1500px] h-[1500px] bg-extended-green/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-extended-green/5 rounded-full blur-[200px]" />
        </div>

        <Navbar currentView={currentView} onNavigate={handleNavigate} />

        <div className="relative z-10">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {currentView === 'home' && (
              <motion.div
                key="home"
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Home />
              </motion.div>
            )}

            {currentView === 'markets' && (
              <motion.div
                key="markets"
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Markets />
              </motion.div>
            )}

            {currentView === 'otc' && (
              <motion.div
                key="otc"
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ExtendedOTC />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ReferralBanner />
        <Analytics />
      </div>
    </>
  );
}

export default App;
