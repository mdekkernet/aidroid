import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { Logger } from 'winston';
import { load } from 'js-yaml';
import Ajv from 'ajv/dist/2020';
import { resolveProvider } from '../providers';
import schema from '../../schema/schema.json';
import voiceAgentSchema from '../../schema/voice-agent.json';
import toolSchema from '../../schema/tool.json';
import knowledgeSchema from '../../schema/knowledge.json';
import workflowSchema from '../../schema/workflow.json';
import { DroidConfig } from '../types/config';
import p from 'node:path';

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
    ajv.addSchema(toolSchema, 'https://aidroid.mdekker.net/schemas/tool.json');
    ajv.addSchema(knowledgeSchema, 'https://aidroid.mdekker.net/schemas/knowledge.json');
    ajv.addSchema(workflowSchema, 'https://aidroid.mdekker.net/schemas/workflow.json');

    const valid = ajv.validate(schema, document);

    if (!valid) {
      logger.error(`Validation errors: ${ajv.errorsText()}`);

      process.exit(1);
    }

    const provider = resolveProvider(document.provider);

    const agents = document['voice-agents'] || [];
    const tools = document['tools'] || [];
    const knowledge = document['knowledge'] || [];
    const workflows = document['workflows'] || [];

    const importDirs = {
      'voice-agents-dir': { target: agents, schema: voiceAgentSchema },
      'tools-dir': { target: tools, schema: toolSchema },
      'knowledge-dir': { target: knowledge, schema: knowledgeSchema },
      'workflows-dir': { target: workflows, schema: workflowSchema },
    };

    Object.entries(importDirs).forEach(([key, { target, schema }]) => {
      const dir = (document as any)[key];
      const files = readdirSync(p.join(process.cwd()));

      (target as any[]).concat(
        files.map(file => {
          const subDocument = load(readFileSync(p.join(process.cwd(), dir, file), 'utf8'));

          const valid = ajv.validate(schema, subDocument);

          if (!valid) {
            logger.error(`Validation errors: ${ajv.errorsText()}`);

            process.exit(1);
          }

          return subDocument;
        })
      );
    });

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

    // TODO: Add tools
    // TODO: Add knowledge
    // TODO: Add workflows

    logger.info(`Deployment of ${fileName} completed`);
  };
