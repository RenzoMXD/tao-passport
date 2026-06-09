import { BittensorDataUnavailableError } from './errors.js';

export type ChainWalletSnapshot = {
  walletAddress: string;
  validatorScore: number;
  minerScore: number;
  governanceVotes: number;
  subnetsParticipated: number;
  firstSeenAt: string;
};

export function assertBittensorDataAvailable() {
  if (process.env.TAO_PASSPORT_FORCE_BITTENSOR_UNAVAILABLE === 'true') {
    throw new BittensorDataUnavailableError(
      'Bittensor data is temporarily unavailable. Please retry after the chain adapter reconnects.',
    );
  }
}

export async function getWalletSnapshot(walletAddress: string): Promise<ChainWalletSnapshot> {
  assertBittensorDataAvailable();

  return {
    walletAddress,
    validatorScore: 92,
    minerScore: 76,
    governanceVotes: 14,
    subnetsParticipated: 6,
    firstSeenAt: '2023-02-01T00:00:00.000Z',
  };
}
