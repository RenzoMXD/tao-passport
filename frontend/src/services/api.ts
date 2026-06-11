<<<<<<< HEAD
import type { ApiErrorCode, ApiErrorPayload, LeaderboardEntry, TaoPassport } from '@tao-passport/shared-types';
=======
import type { LeaderboardEntry, TaoPassport } from '@tao-passport/shared-types';
import { normalizeWalletAddress } from './wallet';
>>>>>>> 3d30bfe7b19a81cc60c75aebff2b33d23861efe5

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: ApiErrorCode,
    readonly retryable: boolean,
    readonly source: ApiErrorPayload['error']['source'] = 'api',
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  if (!value || typeof value !== 'object' || !('error' in value)) {
    return false;
  }

  const error = (value as { error: unknown }).error;
  return Boolean(error && typeof error === 'object' && 'code' in error && 'message' in error);
}

async function getJson<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new ApiRequestError('TAO Passport API is unavailable. Check that the backend service is running.', 0, 'INTERNAL_SERVER_ERROR', true, 'api');
  }

  if (!response.ok) {
    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (isApiErrorPayload(payload)) {
      throw new ApiRequestError(
        payload.error.message,
        response.status,
        payload.error.code,
        payload.error.retryable,
        payload.error.source,
      );
    }

    throw new ApiRequestError(`API request failed: ${response.status}`, response.status, 'INTERNAL_SERVER_ERROR', false, 'api');
  }

  return response.json() as Promise<T>;
}

export const passportApi = {
  getSamplePassport: () => getJson<TaoPassport>('/api/passport/sample'),
  getPassport: (walletAddress: string) =>
    getJson<TaoPassport>(`/api/passport/${encodeURIComponent(normalizeWalletAddress(walletAddress))}`),
  getLeaderboard: () => getJson<LeaderboardEntry[]>('/api/reputation/leaderboard'),
};
