import { useEffect, useState } from 'react';
import type { LeaderboardEntry } from '@tao-passport/shared-types';
import { NavBar } from './components/common/NavBar';
import { useSamplePassport } from './hooks/usePassport';
import { LeaderboardPage } from './pages/Leaderboard/LeaderboardPage';
import { HomePage } from './pages/Home/HomePage';
import { PassportPage } from './pages/Passport/PassportPage';
import { SearchPage } from './pages/Search/SearchPage';
import { ApiRequestError, passportApi } from './services/api';
import type { PageKey } from './types/navigation';

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardError, setLeaderboardError] = useState<ApiRequestError | Error | null>(null);
  const passportState = useSamplePassport();

  useEffect(() => {
    passportApi
      .getLeaderboard()
      .then((entries) => {
        setLeaderboard(entries);
        setLeaderboardError(null);
      })
      .catch((error: Error) => {
        setLeaderboard([]);
        setLeaderboardError(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1d4ed8_0,transparent_32rem),#050816]">
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      {passportState.error && <ApiErrorBanner error={passportState.error} context="passport data" />}
      {leaderboardError && <ApiErrorBanner error={leaderboardError} context="leaderboard data" />}
      {activePage === 'home' && <HomePage passport={passportState.data} onOpenPassport={() => setActivePage('passport')} />}
      {activePage === 'passport' && <PassportPage passport={passportState.data} />}
      {activePage === 'leaderboard' && <LeaderboardPage entries={leaderboard} />}
      {activePage === 'search' && <SearchPage />}
    </div>
  );
}

function ApiErrorBanner({ error, context }: { error: ApiRequestError | Error; context: string }) {
  const isBittensorUnavailable = error instanceof ApiRequestError && error.code === 'BITTENSOR_DATA_UNAVAILABLE';
  const title = isBittensorUnavailable ? 'Bittensor data is temporarily unavailable' : `Unable to load ${context}`;
  const action = isBittensorUnavailable
    ? 'Cached or demo passport data will remain visible when available. Retry after the chain adapter reconnects.'
    : 'Start the API with npm run dev --workspace backend and retry the request.';

  return (
    <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-amber-100">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-amber-100/85">
        {error.message} {action}
      </p>
    </div>
  );
}
