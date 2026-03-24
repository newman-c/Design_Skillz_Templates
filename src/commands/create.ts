import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DesignSkill } from '../types';

export function createSkill(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const skillsDir = path.join(__dirname, '../../skills');
  const outPath = path.join(skillsDir, `${slug}.yaml`);

  if (fs.existsSync(outPath)) {
    console.log(chalk.yellow(`\n  Skill "${slug}" already exists.\n`));
    return;
  }

  const template = fs.readFileSync(path.join(__dirname, '../../skill-template.yaml'), 'utf8');
  const skill = yaml.load(template) as DesignSkill;

  skill.name = name;
  skill.slug = slug;
  skill.description = `Custom design skill: ${name}`;

  fs.writeFileSync(outPath, yaml.dump(skill, { lineWidth: 120 }), 'utf8');
  console.log(chalk.green(`\n  Created: skills/${slug}.yaml`));
  console.log(chalk.dim(`  Edit the file to customize colors, fonts, and prompt.\n`));
}
