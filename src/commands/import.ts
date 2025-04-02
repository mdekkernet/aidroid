import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { Logger } from 'winston';
import { load } from 'js-yaml';
import Ajv from 'ajv/dist/2020';
import { resolveProvider } from '../providers';
import schema from '../../schema/schema.json';
import voiceAgentSchema from '../../schema/voice-agent.json';
import { DroidConfig } from '../utils/config';
import p from 'node:path';
import { Agent as VoiceAgent } from '../utils/agent';

export const importAction =
  ({ logger }: { logger: Logger }) =>
  async (fileName: string) => {
    logger.info(`Starting deployment of ${fileName}`);

    if (!existsSync(fileName)) {
      logger.error(`File ${fileName} does not exist`);
      process.exit(1);
    }

    const file = readFileSync(fileName, 'utf8');

    const document = load(file) as DroidConfig;

    const ajv = new Ajv({ allErrors: true });
    ajv.addSchema(voiceAgentSchema, 'https://aidroid.mdekker.net/schemas/voice-agent.json');

    const valid = ajv.validate(schema, document);

    if (!valid) {
      logger.error(`Validation errors: ${ajv.errorsText()}`);

      process.exit(1);
    }

    const provider = resolveProvider(document.provider);

    let agents = document['voice-agents'];
    const agentsDir = document['voice-agents-dir'];

    if (agentsDir) {
      const files = readdirSync(p.join(process.cwd(), agentsDir));

      agents = files.map(file => {
        const subDocument = load(readFileSync(p.join(process.cwd(), agentsDir, file), 'utf8'));

        const valid = ajv.validate(voiceAgentSchema, subDocument);

        if (!valid) {
          logger.error(`Validation errors: ${ajv.errorsText()}`);

          process.exit(1);
        }

        return subDocument as VoiceAgent;
      });
    }

    logger.info(`Importing ${agents.length} agents`);

    const existingAgents = await provider.listAgents();

    for (const agent of agents) {
      const existingAgent = existingAgents.find(a => a.name === agent.name);

      if (existingAgent) {
        logger.info(`Updating agent: ${agent.name}`);
        await provider.updateAgent(existingAgent.id, agent);
      } else {
        logger.info(`Creating new agent: ${agent.name}`);
        await provider.createAgent(agent);
      }
    }

    logger.info(`Deployment of ${fileName} completed`);
  };
