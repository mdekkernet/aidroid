import { Logger } from 'winston';
import { resolveProvider } from '../providers';
import YAML from 'yaml';
import { writeFileSync } from 'node:fs';

export const exportAction =
  ({ logger }: { logger: Logger }) =>
  async (providerName: string) => {
    const provider = resolveProvider(providerName);

    const agents = await provider.exportAgents();

    const document = YAML.stringify({ provider: providerName, agents });

    writeFileSync('agents.yml', document);

    logger.info('Wrote file agents.yml');
  };
