import { canonicalizeWalletAddress } from '@tao-passport/shared-utils';

export function isSubstrateAddress(address: string): boolean {
  return canonicalizeWalletAddress(address) !== null;
}

export function normalizeSubstrateAddress(address: string): string | null {
  return canonicalizeWalletAddress(address);
}
