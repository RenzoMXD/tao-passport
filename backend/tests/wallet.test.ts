import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalizeWalletAddress } from '@tao-passport/shared-utils';
import { findPassport, sampleWalletAddress } from '../src/repositories/passportRepository.js';
import { normalizeSubstrateAddress } from '../src/blockchain/wallet/validators.js';

test('canonicalizeWalletAddress trims surrounding whitespace', () => {
  assert.equal(
    canonicalizeWalletAddress(`  \n${sampleWalletAddress}\t `),
    sampleWalletAddress,
  );
});

test('normalizeSubstrateAddress rejects invalid input after normalization', () => {
  assert.equal(normalizeSubstrateAddress('   not-a-wallet   '), null);
});

test('findPassport uses canonical wallet address before building profile data', async () => {
  const passport = await findPassport(`\n${sampleWalletAddress}  `);

  assert.equal(passport.walletAddress, sampleWalletAddress);
});
