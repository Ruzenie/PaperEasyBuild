export type QuestionType = "singleChoice" | "multiChoice" | "shortText";

export interface QuestionDefinition {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  // 仅选择题使用，画布中可直接编辑
  options?: string[];
}
