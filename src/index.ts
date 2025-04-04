#!/usr/bin/env node

import { Argument, Command } from 'commander';
import { importAction } from './commands/import';
import { exportAction } from './commands/export';
import logger from './utils/logger';
import { PROVIDERS } from './providers';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program.name('aidroid').description('Tools for Agentic AI development').version('0.0.2');

program.addCommand(
  new Command()
    .name('import')
    .addArgument(new Argument('<file>', 'The file to import').argRequired())
    .description('Deploy ai configuration from file to specified provider')
    .action(importAction({ logger }))
);

program.addCommand(
  new Command()
    .name('export')
    .description('Download ai configuration from specified provider')
    .addArgument(
      new Argument('<provider>', 'The provider to download from')
        .choices(Object.keys(PROVIDERS))
        .argRequired()
    )
    .action(exportAction({ logger }))
);

program.parse();
