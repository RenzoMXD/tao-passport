import { canonicalizeWalletAddress } from '@tao-passport/shared-utils';

export function shortenWallet(address: string): string {
  if (address.length <= 14) {
    return address;
  }

  return `${address.slice(0, 7)}...${address.slice(-6)}`;
}

export function isLikelySubstrateAddress(address: string): boolean {
  return canonicalizeWalletAddress(address) !== null;
}

export function normalizeWalletAddress(address: string): string {
  return canonicalizeWalletAddress(address) ?? address.trim();
}
