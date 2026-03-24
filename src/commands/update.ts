import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DesignSkill } from '../types';

interface UpdateOptions {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  headingFont?: string;
  bodyFont?: string;
  radius?: string;
}

export function updateSkill(slug: string, options: UpdateOptions) {
  const skillPath = path.join(__dirname, '../../skills', `${slug}.yaml`);

  if (!fs.existsSync(skillPath)) {
    console.log(chalk.red(`\n  Skill "${slug}" not found.\n`));
    return;
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const skill = yaml.load(content) as DesignSkill;

  let changed = false;

  if (options.primary) { skill.colors.primary = options.primary; changed = true; }
  if (options.secondary) { skill.colors.secondary = options.secondary; changed = true; }
  if (options.accent) { skill.colors.accent = options.accent; changed = true; }
  if (options.background) { skill.colors.background = options.background; changed = true; }
  if (options.headingFont) { skill.typography.headingFont = options.headingFont; changed = true; }
  if (options.bodyFont) { skill.typography.bodyFont = options.bodyFont; changed = true; }
  if (options.radius) { skill.spacing.borderRadius = options.radius; changed = true; }

  if (!changed) {
    console.log(chalk.yellow('\n  No changes specified. Use --primary, --body-font, etc.\n'));
    return;
  }

  fs.writeFileSync(skillPath, yaml.dump(skill, { lineWidth: 120 }), 'utf8');
  console.log(chalk.green(`\n  Updated skill: ${skill.name} (${slug}.yaml)\n`));
}
