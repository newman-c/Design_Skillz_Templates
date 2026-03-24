import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DesignSkill } from '../types';

export function listSkills() {
  const skillsDir = path.join(__dirname, '../../skills');

  if (!fs.existsSync(skillsDir)) {
    console.log(chalk.red('No skills directory found.'));
    return;
  }

  const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.yaml'));

  if (files.length === 0) {
    console.log(chalk.yellow('No skill files found in skills/'));
    return;
  }

  console.log(chalk.bold.cyan('\n  TypeUI Design Skills\n'));
  console.log(chalk.gray('  ─────────────────────────────────────────\n'));

  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(skillsDir, file), 'utf8');
      const skill = yaml.load(content) as DesignSkill;

      const moodTags = skill.mood.map(m => chalk.bgGray.white(` ${m} `)).join(' ');
      console.log(`  ${chalk.bold.white(skill.name.padEnd(20))} ${chalk.gray(skill.slug)}`);
      console.log(`  ${chalk.dim(skill.description)}`);
      console.log(`  ${moodTags}`);
      console.log(`  ${chalk.cyan('Primary:')} ${skill.colors.primary}  ${chalk.cyan('BG:')} ${skill.colors.background}`);
      console.log();
    } catch {
      console.log(chalk.red(`  Error reading: ${file}`));
    }
  });

  console.log(chalk.gray('  ─────────────────────────────────────────'));
  console.log(chalk.dim(`\n  ${files.length} skill(s) available\n`));
  console.log(chalk.dim('  Usage: typeui show <slug>  |  typeui apply <slug>\n'));
}
