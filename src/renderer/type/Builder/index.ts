/** Builder（问卷/题目）相关类型定义。 */
import type { QuestionTemplateType, TextStyleConfig } from "@renderer/type/ComponentMarket";
export type QuestionType = QuestionTemplateType;

export type QuestionnaireHeaderConfig = {
  title?: string;
  subtitle?: string;
  titleStyle?: TextStyleConfig;
  subtitleStyle?: TextStyleConfig;
};

export type QuestionVisibilityRule = {
  sourceQuestionId: string;
  expectedValue: string;
};

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
  visibilityRule?: QuestionVisibilityRule;
}
export type PaperSizeId = "A4" | "A5" | "Letter" | "ExamSingle" | "ExamDouble";

export type QuestionAnswerValue = string | string[] | null;
export type QuestionnaireAnswers = Record<string, QuestionAnswerValue>;
