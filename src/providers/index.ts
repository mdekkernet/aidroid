import { ProviderNotFoundError } from '../utils/errors';
import { RetellProvider } from './retell';

export const PROVIDERS = {
  retell: RetellProvider,
};

export const resolveProvider = (providerName: string) => {
  const provider = PROVIDERS[providerName as keyof typeof PROVIDERS];
  if (!provider) {
    throw new ProviderNotFoundError(`Provider ${providerName} not found`);
  }
  return provider;
};
