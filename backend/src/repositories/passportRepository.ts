import { canonicalizeWalletAddress } from '@tao-passport/shared-utils';
import type { TaoPassport } from '@tao-passport/shared-types';
import { buildPassport } from '../services/passport/passportService.js';

export const sampleWalletAddress = '5FAbc123TAOPassportDemoWalletAddress999999999999';

export async function findPassport(walletAddress: string): Promise<TaoPassport> {
  const canonicalWalletAddress = canonicalizeWalletAddress(walletAddress);

  if (canonicalWalletAddress === null) {
    throw new Error('Invalid Substrate wallet address format.');
  }

  return buildPassport(canonicalWalletAddress);
}
