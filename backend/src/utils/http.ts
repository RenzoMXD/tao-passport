import type { Response } from 'express';
import type { ApiErrorCode, ApiErrorPayload } from '@tao-passport/shared-types';

export function badRequest(response: Response, message: string) {
  return sendApiError(response, 400, 'INVALID_WALLET_ADDRESS', message, false, 'validation');
}

export function sendApiError(
  response: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  retryable: boolean,
  source: ApiErrorPayload['error']['source'] = 'api',
) {
  const payload: ApiErrorPayload = {
    error: {
      code,
      message,
      retryable,
      source,
    },
  };

  return response.status(status).json(payload);
}
