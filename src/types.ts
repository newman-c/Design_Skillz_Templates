export interface SkillColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface SkillTypography {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  baseSize: string;
  scaleRatio: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface SkillSpacing {
  unit: string;
  containerMaxWidth: string;
  sectionPadding: string;
  componentGap: string;
  borderRadius: string;
}

export interface DesignSkill {
  name: string;
  slug: string;
  version: string;
  description: string;
  mood: string[];
  colors: SkillColors;
  typography: SkillTypography;
  spacing: SkillSpacing;
  designPrinciples: string[];
  componentStyle: string;
  prompt: string;
  exampleUseCase: string;
}
