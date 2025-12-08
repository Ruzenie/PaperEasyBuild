import type { QuestionTemplateType, TextStyleConfig } from "@renderer/type/ComponentMarket";

// Builder 中题目类型与组件市场的模板类型保持一致
export type QuestionType = QuestionTemplateType;

export interface QuestionDefinition {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  // 描述文案，参考组件市场右侧边栏
  description?: string;
  // 文本样式，参考组件市场右侧边栏
  titleStyle?: TextStyleConfig;
  descriptionStyle?: TextStyleConfig;
  optionStyle?: TextStyleConfig;
  // 仅选择题使用，画布中可直接编辑
  options?: string[];
}

// 试卷画布预设尺寸（后续可扩展更多纸张规格）
// A4 / A5 / Letter 是通用纸张；
// ExamSingle / ExamDouble 更偏向考试卷或双页试卷的布局预设。
export type PaperSizeId = "A4" | "A5" | "Letter" | "ExamSingle" | "ExamDouble";
