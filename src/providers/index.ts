import { ProviderNotFoundError } from '../utils/errors';
import { RetellProvider } from './retell';
import { VapiProvider } from './vapi';
export const PROVIDERS = {
  retell: RetellProvider,
  vapi: VapiProvider,
};

export const resolveProvider = (providerName: string) => {
  const provider = PROVIDERS[providerName as keyof typeof PROVIDERS];
  if (!provider) {
    throw new ProviderNotFoundError(`Provider ${providerName} not found`);
  }
  return provider;
};
