import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DesignSkill } from '../types';

export function showSkill(slug: string) {
  const skillPath = path.join(__dirname, '../../skills', `${slug}.yaml`);

  if (!fs.existsSync(skillPath)) {
    console.log(chalk.red(`\n  Skill "${slug}" not found.`));
    console.log(chalk.dim('  Run: typeui list\n'));
    return;
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const skill = yaml.load(content) as DesignSkill;

  console.log(chalk.bold.cyan(`\n  ${skill.name}`) + chalk.gray(` v${skill.version}`));
  console.log(chalk.dim(`  ${skill.description}\n`));

  console.log(chalk.bold('  Mood'));
  console.log('  ' + skill.mood.map(m => chalk.bgGray.white(` ${m} `)).join(' ') + '\n');

  console.log(chalk.bold('  Colors'));
  const c = skill.colors;
  const colorLine = (label: string, value: string) =>
    `  ${chalk.gray(label.padEnd(14))} ${chalk.bold(value)}`;
  console.log(colorLine('Primary:', c.primary));
  console.log(colorLine('Secondary:', c.secondary));
  console.log(colorLine('Accent:', c.accent));
  console.log(colorLine('Background:', c.background));
  console.log(colorLine('Surface:', c.surface));
  console.log(colorLine('Text:', c.text));
  console.log(colorLine('Text Muted:', c.textMuted));
  console.log(colorLine('Border:', c.border));

  console.log(chalk.bold('\n  Typography'));
  const t = skill.typography;
  console.log(`  ${chalk.gray('Heading Font:'.padEnd(14))} ${t.headingFont}`);
  console.log(`  ${chalk.gray('Body Font:'.padEnd(14))} ${t.bodyFont}`);
  console.log(`  ${chalk.gray('Mono Font:'.padEnd(14))} ${t.monoFont}`);
  console.log(`  ${chalk.gray('Base Size:'.padEnd(14))} ${t.baseSize}`);

  console.log(chalk.bold('\n  Spacing & Layout'));
  console.log(`  ${chalk.gray('Border Radius:'.padEnd(14))} ${skill.spacing.borderRadius}`);
  console.log(`  ${chalk.gray('Max Width:'.padEnd(14))} ${skill.spacing.containerMaxWidth}`);

  console.log(chalk.bold('\n  Design Principles'));
  skill.designPrinciples.forEach(p => console.log(`  ${chalk.cyan('•')} ${p}`));

  console.log(chalk.bold('\n  AI Prompt (for Claude)'));
  console.log(chalk.dim('  ─────────────────────────────────────────'));
  const lines = skill.prompt.split('\n');
  lines.forEach(line => console.log(`  ${chalk.italic.white(line)}`));
  console.log(chalk.dim('  ─────────────────────────────────────────'));

  console.log(chalk.bold('\n  Example Use Case'));
  console.log(`  ${skill.exampleUseCase}\n`);
}
