import type { LeaderboardEntry, TaoPassport } from '@tao-passport/shared-types';
import { normalizeWalletAddress } from './wallet';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const passportApi = {
  getSamplePassport: () => getJson<TaoPassport>('/api/passport/sample'),
  getPassport: (walletAddress: string) =>
    getJson<TaoPassport>(`/api/passport/${encodeURIComponent(normalizeWalletAddress(walletAddress))}`),
  getLeaderboard: () => getJson<LeaderboardEntry[]>('/api/reputation/leaderboard'),
};
