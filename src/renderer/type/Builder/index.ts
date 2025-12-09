import type { QuestionTemplateType, TextStyleConfig } from "@renderer/type/ComponentMarket";
export type QuestionType = QuestionTemplateType;

export interface QuestionDefinition {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  description?: string;
  titleStyle?: TextStyleConfig;
  descriptionStyle?: TextStyleConfig;
  optionStyle?: TextStyleConfig;
  options?: string[];
}
export type PaperSizeId = "A4" | "A5" | "Letter" | "ExamSingle" | "ExamDouble";
