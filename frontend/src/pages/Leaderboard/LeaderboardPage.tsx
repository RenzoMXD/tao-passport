import { useEffect, useState } from 'react';
import type { LeaderboardEntry, LeaderboardResponse, LeaderboardSignalCategory, LeaderboardSort } from '@tao-passport/shared-types';
import { passportApi } from '../../services/api';
import { shortenWallet } from '../../services/wallet';
import { scoreColor } from '../../utils/score';

const categoryOptions: Array<{ value: LeaderboardSignalCategory; label: string }> = [
  { value: 'all', label: 'All signals' },
  { value: 'validator', label: 'Validator' },
  { value: 'miner', label: 'Miner' },
  { value: 'governance', label: 'Governance' },
  { value: 'subnet', label: 'Subnet' },
  { value: 'community', label: 'Community' },
  { value: 'gittensor', label: 'GitTensor' },
];

const sortOptions: Array<{ value: LeaderboardSort; label: string }> = [
  { value: 'trustScore:desc', label: 'Highest score' },
  { value: 'trustScore:asc', label: 'Lowest score' },
];

function categoryBadgeLabel(category: LeaderboardEntry['matchedCategories'][number]): string {
  return category === 'gittensor' ? 'GitTensor' : `${category.slice(0, 1).toUpperCase()}${category.slice(1)}`;
}

export function LeaderboardPage() {
  const [response, setResponse] = useState<LeaderboardResponse | null>(null);
  const [category, setCategory] = useState<LeaderboardSignalCategory>('all');
  const [sort, setSort] = useState<LeaderboardSort>('trustScore:desc');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError(null);

    passportApi
      .getLeaderboard({ category, limit: 2, page, sort })
      .then((nextResponse) => {
        if (!isMounted) {
          return;
        }

        setResponse(nextResponse);
      })
      .catch((nextError: Error) => {
        if (!isMounted) {
          return;
        }

        setResponse(null);
        setError(nextError.message);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [category, page, sort]);

  const entries = response?.items ?? [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-bold text-white">Trusted TAO Wallets</h1>
      <p className="mt-3 text-slate-300">Paginated leaderboard with deterministic score sorting and signal-based filtering.</p>
      <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[1fr_1fr_auto]">
        <label className="text-sm text-slate-300">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Signal Filter</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as LeaderboardSignalCategory);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Sort</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as LeaderboardSort);
              setPage(1);
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="self-end rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
          {response ? `${response.total} result${response.total === 1 ? '' : 's'} • page ${response.page}` : 'Loading results'}
        </div>
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        {isLoading ? <div className="px-5 py-8 text-slate-300">Loading leaderboard…</div> : null}
        {error ? <div className="px-5 py-8 text-amber-100">Leaderboard unavailable: {error}</div> : null}
        {!isLoading && !error && entries.length === 0 ? (
          <div className="px-5 py-8 text-slate-300">
            No leaderboard entries match the selected filter.
            {category === 'gittensor' ? ' GitTensor ranking data is not indexed in this scaffold yet.' : ''}
          </div>
        ) : null}
        {entries.map((entry) => (
          <div key={entry.walletAddress} className="grid grid-cols-[64px_1fr_120px] items-center gap-4 border-b border-white/10 px-5 py-4 last:border-b-0">
            <div className="text-2xl font-black text-blue-200">#{entry.rank}</div>
            <div>
              <p className="font-semibold text-white">{shortenWallet(entry.walletAddress)}</p>
              <p className="text-sm text-slate-300">{entry.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.matchedCategories.map((matchedCategory) => (
                  <span
                    key={`${entry.walletAddress}-${matchedCategory}`}
                    className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-1 text-xs text-blue-100"
                  >
                    {categoryBadgeLabel(matchedCategory)}
                  </span>
                ))}
              </div>
            </div>
            <div className={`text-right text-2xl font-bold ${scoreColor(entry.trustScore)}`}>{entry.trustScore}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
          disabled={!response?.hasPreviousPage || isLoading}
          className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <p className="text-sm text-slate-400">
          {response ? `Showing ${entries.length} of ${response.total}` : 'Waiting for results'}
        </p>
        <button
          type="button"
          onClick={() => setPage((currentPage) => currentPage + 1)}
          disabled={!response?.hasNextPage || isLoading}
          className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}
