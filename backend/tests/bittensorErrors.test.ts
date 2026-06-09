import assert from 'node:assert/strict';
import test from 'node:test';
import { BittensorDataUnavailableError } from '../src/blockchain/bittensor/errors.js';
import { getWalletSnapshot } from '../src/blockchain/bittensor/client.js';

test('throws a retryable typed error when Bittensor data is unavailable', async () => {
  const previousValue = process.env.TAO_PASSPORT_FORCE_BITTENSOR_UNAVAILABLE;
  process.env.TAO_PASSPORT_FORCE_BITTENSOR_UNAVAILABLE = 'true';

  try {
    await assert.rejects(
      () => getWalletSnapshot('5FAbc123TAOPassportDemoWalletAddress999999999999'),
      (error: unknown) => {
        assert.ok(error instanceof BittensorDataUnavailableError);
        assert.equal(error.code, 'BITTENSOR_DATA_UNAVAILABLE');
        assert.equal(error.retryable, true);
        assert.equal(error.source, 'bittensor');
        return true;
      },
    );
  } finally {
    if (previousValue === undefined) {
      delete process.env.TAO_PASSPORT_FORCE_BITTENSOR_UNAVAILABLE;
    } else {
      process.env.TAO_PASSPORT_FORCE_BITTENSOR_UNAVAILABLE = previousValue;
    }
  }
});
