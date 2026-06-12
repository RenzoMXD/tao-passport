import { useState } from 'react';
import { NavBar } from './components/common/NavBar';
import { useSamplePassport } from './hooks/usePassport';
import { LeaderboardPage } from './pages/Leaderboard/LeaderboardPage';
import { HomePage } from './pages/Home/HomePage';
import { PassportPage } from './pages/Passport/PassportPage';
import { SearchPage } from './pages/Search/SearchPage';
import type { PageKey } from './types/navigation';

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const passportState = useSamplePassport();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1d4ed8_0,transparent_32rem),#050816]">
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      {passportState.error && (
        <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-3 text-amber-100">
          Backend unavailable: {passportState.error}. Start the API with <code>npm run dev --workspace backend</code>.
        </div>
      )}
      {activePage === 'home' && <HomePage passport={passportState.data} onOpenPassport={() => setActivePage('passport')} />}
      {activePage === 'passport' && <PassportPage passport={passportState.data} />}
      {activePage === 'leaderboard' && <LeaderboardPage />}
      {activePage === 'search' && <SearchPage />}
    </div>
  );
}
