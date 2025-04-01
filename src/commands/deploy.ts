import { readFileSync, existsSync } from 'node:fs';
import { Logger } from 'winston';
import { load } from 'js-yaml';
import Ajv from 'ajv';
import { resolveProvider } from '../providers';
import schema from '../../schema/schema.json';
import { DroidConfig } from '../utils/config';
import yamlInclude from 'yaml-include';
import p from 'node:path';

export const deployAction =
  ({ logger }: { logger: Logger }) =>
  async (fileName: string) => {
    logger.info(`Starting deployment of ${fileName}`);

    if (!existsSync(fileName)) {
      logger.error(`File ${fileName} does not exist`);
      process.exit(1);
    }

    yamlInclude.setBaseFile(p.join(process.cwd(), fileName));

    const file = readFileSync(fileName, 'utf8');

    const document = load(file, {
      schema: yamlInclude.YAML_INCLUDE_SCHEMA,
      filename: yamlInclude.basefile,
    }) as DroidConfig;

    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(schema, document);

    if (!valid) {
      logger.error(`Validation errors: ${ajv.errorsText()}`);

      process.exit(1);
    }

    const provider = resolveProvider(document.provider);

    const agents = document.agents;

    logger.info(`Importing ${agents.length} agents`);
    await provider.importAgents(agents);

    logger.info(`Deployment of ${fileName} completed`);
  };
