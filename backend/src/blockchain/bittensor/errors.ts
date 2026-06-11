export class BittensorDataUnavailableError extends Error {
  readonly code = 'BITTENSOR_DATA_UNAVAILABLE';
  readonly retryable = true;
  readonly source = 'bittensor';

  constructor(message = 'Bittensor data is temporarily unavailable.') {
    super(message);
    this.name = 'BittensorDataUnavailableError';
  }
}

export function isBittensorDataUnavailableError(error: unknown): error is BittensorDataUnavailableError {
  return error instanceof BittensorDataUnavailableError;
}
