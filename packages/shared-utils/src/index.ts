export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function weightedAverage(values: Array<{ score: number; weight: number }>): number {
  const totalWeight = values.reduce((sum, value) => sum + value.weight, 0);

  if (totalWeight === 0) {
    return 0;
  }

  return clampScore(values.reduce((sum, value) => sum + value.score * value.weight, 0) / totalWeight);
}

export { canonicalizeWalletAddress, isCanonicalSubstrateAddress, normalizeWalletAddressInput } from './wallet.js';
