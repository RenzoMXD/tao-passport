export type ApiErrorCode =
  | 'BITTENSOR_DATA_UNAVAILABLE'
  | 'INVALID_WALLET_ADDRESS'
  | 'INTERNAL_SERVER_ERROR';

export type ApiErrorPayload = {
  error: {
    code: ApiErrorCode;
    message: string;
    retryable: boolean;
    source?: 'bittensor' | 'api' | 'validation';
  };
};
