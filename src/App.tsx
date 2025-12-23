import { useState } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { Home } from './pages/Home';
import { ExtendedOTC } from './pages/ExtendedOTC';
import { Navbar } from './components/Navbar';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'otc'>('home');

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-extended-green selection:text-black overflow-x-hidden relative">
        <Navbar currentView={currentView} onNavigate={setCurrentView} />

        <div className={currentView === 'home' ? 'block' : 'hidden'}>
          <Home />
        </div>

        <div className={currentView === 'otc' ? 'block' : 'hidden'}>
          <ExtendedOTC />
        </div>

        <Analytics />
      </div>
    </>
  );
}

export default App;
