#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { listSkills } from './commands/list';
import { showSkill } from './commands/show';
import { applySkill } from './commands/apply';
import { updateSkill } from './commands/update';
import { createSkill } from './commands/create';

const program = new Command();

console.log(chalk.bold.cyan('\n  TypeUI') + chalk.gray(' — Design Skill Files for AI'));

program
  .name('typeui')
  .description('Design Skill Files — AI-ready style themes for Claude and agent-based tools')
  .version('1.0.0');

program
  .command('list')
  .alias('ls')
  .description('List all available design skills')
  .action(() => listSkills());

program
  .command('show <slug>')
  .description('Show full details of a design skill')
  .action((slug: string) => showSkill(slug));

program
  .command('apply <slug>')
  .description('Output the full AI prompt for a skill (ready to paste into Claude)')
  .option('-o, --output <file>', 'Write prompt to a file instead of stdout')
  .action((slug: string, opts: { output?: string }) => applySkill(slug, opts.output));

program
  .command('update <slug>')
  .description('Update specific properties of a skill')
  .option('--primary <color>', 'Set primary color (hex)')
  .option('--secondary <color>', 'Set secondary color (hex)')
  .option('--accent <color>', 'Set accent color (hex)')
  .option('--background <color>', 'Set background color (hex)')
  .option('--heading-font <font>', 'Set heading font')
  .option('--body-font <font>', 'Set body font')
  .option('--radius <value>', 'Set border radius')
  .action((slug: string, opts) => updateSkill(slug, {
    primary: opts.primary,
    secondary: opts.secondary,
    accent: opts.accent,
    background: opts.background,
    headingFont: opts.headingFont,
    bodyFont: opts.bodyFont,
    radius: opts.radius,
  }));

program
  .command('create <name>')
  .description('Create a new skill from the template')
  .action((name: string) => createSkill(name));

program.parse(process.argv);
