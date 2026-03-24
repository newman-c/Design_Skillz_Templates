import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DesignSkill } from './types';

const app = express();
const PORT = 3000;
const SKILLS_DIR = path.join(__dirname, '../skills');
const PUBLIC_DIR = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

function loadSkills(): DesignSkill[] {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR)
    .filter(f => f.endsWith('.yaml'))
    .map(f => {
      const raw = fs.readFileSync(path.join(SKILLS_DIR, f), 'utf8');
      return yaml.load(raw) as DesignSkill;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function loadSkill(slug: string): DesignSkill | null {
  const skillPath = path.join(SKILLS_DIR, `${slug}.yaml`);
  if (!fs.existsSync(skillPath)) return null;
  return yaml.load(fs.readFileSync(skillPath, 'utf8')) as DesignSkill;
}

// GET all skills
app.get('/api/skills', (_req, res) => {
  res.json(loadSkills());
});

// GET single skill
app.get('/api/skills/:slug', (req, res) => {
  const skill = loadSkill(req.params.slug);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  res.json(skill);
});

// GET skill as Claude-ready prompt text
app.get('/api/skills/:slug/prompt', (req, res) => {
  const skill = loadSkill(req.params.slug);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  const prompt = `# Design Skill: ${skill.name}
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

  res.type('text/plain').send(prompt);
});

// PATCH update skill colors/fonts
app.patch('/api/skills/:slug', (req, res) => {
  const skillPath = path.join(SKILLS_DIR, `${req.params.slug}.yaml`);
  if (!fs.existsSync(skillPath)) return res.status(404).json({ error: 'Skill not found' });

  const skill = yaml.load(fs.readFileSync(skillPath, 'utf8')) as DesignSkill;
  const { colors, typography, spacing } = req.body;

  if (colors) Object.assign(skill.colors, colors);
  if (typography) Object.assign(skill.typography, typography);
  if (spacing) Object.assign(skill.spacing, spacing);

  fs.writeFileSync(skillPath, yaml.dump(skill, { lineWidth: 120 }), 'utf8');
  res.json(skill);
});

app.listen(PORT, () => {
  console.log(`\n  TypeUI Web — running at http://localhost:${PORT}\n`);
});
