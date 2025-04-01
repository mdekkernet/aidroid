import { Logger } from 'winston';

export const deployAction =
  ({ logger }: { logger: Logger }) =>
  async (file: string) => {
    logger.info(`Starting deployment of ${file}`);
  };
