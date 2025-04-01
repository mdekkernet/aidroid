#!/usr/bin/env node

import { Argument, Command } from 'commander';
import { deployAction } from './commands/deploy';
import { exportAction } from './commands/export';
import logger from './utils/logger';
import { PROVIDERS } from './providers';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program.name('aidroid').description('Tools for AI development').version('0.0.1');

program.addCommand(
  new Command()
    .name('deploy')
    .addArgument(new Argument('<file>', 'The file to deploy').argRequired())
    .description('Deploy a model')
    .action(deployAction({ logger }))
);

program.addCommand(
  new Command()
    .name('export')
    .description('Fetch a model')
    .addArgument(
      new Argument('<provider>', 'The provider to download from')
        .choices(Object.keys(PROVIDERS))
        .argRequired()
    )
    .action(exportAction({ logger }))
);

program.parse();
