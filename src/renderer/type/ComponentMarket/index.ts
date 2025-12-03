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
  // exam-style types
  | "judge" // 判断题（对/错）
  | "fillBlank"; // 填空题

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
