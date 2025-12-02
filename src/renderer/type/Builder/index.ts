export type QuestionType = "singleChoice" | "multiChoice" | "shortText";

export interface QuestionDefinition {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
}

