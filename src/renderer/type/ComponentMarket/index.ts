export type QuestionCategoryId = "choice" | "text" | "advanced" | "note" | "profile" | "contact";

export interface QuestionCategory {
  id: QuestionCategoryId;
  name: string;
}

export type TextAlign = "left" | "center";

export interface TextStyleConfig {
  align: TextAlign;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
}

export type QuestionTemplateType =
  | "singleChoice"
  | "multiChoice"
  | "rating"
  | "date"
  | "shortText"
  | "longText"
  | "name"
  | "phone"
  | "judge"
  | "fillBlank"
  | "slider"
  | "note";
export interface QuestionTemplate {
  id: string;
  categoryId: QuestionCategoryId;
  type: QuestionTemplateType;
  name: string;
  defaultTitle: string;
  defaultDescription?: string;
  defaultOptions?: string[];
}

export interface TemplateConfig {
  title: string;
  description: string;
  options: string[];
  titleStyle: TextStyleConfig;
  descriptionStyle: TextStyleConfig;
  optionStyle: TextStyleConfig;
}

export interface PreviewPanelProps {
  template: QuestionTemplate;
  config: TemplateConfig;
  onConfigChange: (patch: Partial<TemplateConfig>) => void;
}

export interface ConfigSiderProps {
  template: QuestionTemplate;
  config: TemplateConfig;
  onConfigChange: (patch: Partial<TemplateConfig>) => void;
  onTemplateMetaChange?: (patch: Partial<QuestionTemplate>) => void;
}
