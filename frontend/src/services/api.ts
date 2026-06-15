import type { LeaderboardResponse, LeaderboardSignalCategory, LeaderboardSort, TaoPassport } from '@tao-passport/shared-types';
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
  getLeaderboard: (params?: {
    category?: LeaderboardSignalCategory;
    cursor?: string | null;
    limit?: number;
    page?: number;
    sort?: LeaderboardSort;
  }) => {
    const search = new URLSearchParams();

    if (params?.category && params.category !== 'all') {
      search.set('category', params.category);
    }

    if (params?.cursor) {
      search.set('cursor', params.cursor);
    } else if (params?.page && params.page > 1) {
      search.set('page', String(params.page));
    }

    if (params?.limit) {
      search.set('limit', String(params.limit));
    }

    if (params?.sort) {
      search.set('sort', params.sort);
    }

    const query = search.toString();
    return getJson<LeaderboardResponse>(`/api/reputation/leaderboard${query.length > 0 ? `?${query}` : ''}`);
  },
};
