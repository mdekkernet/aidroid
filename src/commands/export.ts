import { Logger } from 'winston';
import { resolveProvider } from '../providers';
import YAML from 'js-yaml';
import { writeFileSync } from 'node:fs';

export const exportAction =
  ({ logger }: { logger: Logger }) =>
  async (providerName: string) => {
    const provider = resolveProvider(providerName);

    const voiceAgents = await provider.listAgents();

    const document = YAML.dump({ provider: providerName, 'voice-agents': voiceAgents });

    writeFileSync('agents.yml', document);

    logger.info('Wrote file agents.yml');
  };
