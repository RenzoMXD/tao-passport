const substrateAddressPattern = /^[A-Za-z0-9]{40,64}$/;

export function normalizeWalletAddressInput(address: string): string {
  return address.normalize('NFKC').trim();
}

export function isCanonicalSubstrateAddress(address: string): boolean {
  return substrateAddressPattern.test(address);
}

export function canonicalizeWalletAddress(address: string): string | null {
  const normalizedAddress = normalizeWalletAddressInput(address);

  if (!isCanonicalSubstrateAddress(normalizedAddress)) {
    return null;
  }

  return normalizedAddress;
}
