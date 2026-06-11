import { Router } from 'express';
import { sampleWalletAddress, findPassport } from '../../repositories/passportRepository.js';
import { normalizeSubstrateAddress } from '../../blockchain/wallet/validators.js';
import { badRequest } from '../../utils/http.js';

export const passportRouter = Router();

passportRouter.get('/sample', async (_request, response, next) => {
  try {
    response.json(await findPassport(sampleWalletAddress));
  } catch (error) {
    next(error);
  }
});

passportRouter.get('/:walletAddress', async (request, response, next) => {
  try {
    const normalizedWalletAddress = normalizeSubstrateAddress(request.params.walletAddress);

    if (normalizedWalletAddress === null) {
      return badRequest(response, 'Invalid Substrate wallet address format.');
    }

    response.json(await findPassport(normalizedWalletAddress));
  } catch (error) {
    next(error);
  }
});
