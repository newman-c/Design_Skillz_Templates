import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DesignSkill } from '../types';

export function applySkill(slug: string, outputPath?: string) {
  const skillPath = path.join(__dirname, '../../skills', `${slug}.yaml`);

  if (!fs.existsSync(skillPath)) {
    console.log(chalk.red(`\n  Skill "${slug}" not found.`));
    console.log(chalk.dim('  Run: typeui list\n'));
    return;
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const skill = yaml.load(content) as DesignSkill;

  const prompt = buildFullPrompt(skill);

  if (outputPath) {
    const outFile = path.resolve(outputPath);
    fs.writeFileSync(outFile, prompt, 'utf8');
    console.log(chalk.green(`\n  Prompt written to: ${outFile}\n`));
  } else {
    console.log(chalk.bold.cyan(`\n  Claude Prompt — ${skill.name}\n`));
    console.log(chalk.dim('  Copy this into Claude to build your site in this style:\n'));
    console.log(chalk.dim('  ═══════════════════════════════════════════════════════'));
    console.log('\n' + prompt + '\n');
    console.log(chalk.dim('  ═══════════════════════════════════════════════════════\n'));
  }
}

function buildFullPrompt(skill: DesignSkill): string {
  return `# Design Skill: ${skill.name}
# ${skill.description}
# Mood: ${skill.mood.join(', ')}

## Style Instructions
${skill.prompt}

## Color Palette
- Primary: ${skill.colors.primary}
- Secondary: ${skill.colors.secondary}
- Accent: ${skill.colors.accent}
- Background: ${skill.colors.background}
- Surface: ${skill.colors.surface}
- Text: ${skill.colors.text}
- Text Muted: ${skill.colors.textMuted}
- Border: ${skill.colors.border}

## Typography
- Heading Font: ${skill.typography.headingFont}
- Body Font: ${skill.typography.bodyFont}
- Monospace Font: ${skill.typography.monoFont}
- Base Font Size: ${skill.typography.baseSize}
- Scale Ratio: ${skill.typography.scaleRatio}
- Heading Weight: ${skill.typography.headingWeight}
- Body Weight: ${skill.typography.bodyWeight}

## Spacing & Layout
- Spacing Unit: ${skill.spacing.unit}
- Max Container Width: ${skill.spacing.containerMaxWidth}
- Section Padding: ${skill.spacing.sectionPadding}
- Component Gap: ${skill.spacing.componentGap}
- Border Radius: ${skill.spacing.borderRadius}

## Design Principles
${skill.designPrinciples.map(p => `- ${p}`).join('\n')}

## Component Style
${skill.componentStyle}

---
Apply this design system consistently across all components, pages, and UI elements.
`;
}
