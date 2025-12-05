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
  | "fillBlank" // 填空题
  // 新增基础题型示例：滑块题
  | "slider"
  | "note"; // 备注说明题

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

// 组件市场页面内部使用的 Props 类型
export interface CategorySiderProps {
  categories: QuestionCategory[];
  activeCategoryId: QuestionCategoryId;
  onCategoryChange: (id: QuestionCategoryId) => void;
  templates: QuestionTemplate[];
  activeTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export interface PreviewPanelProps {
  template: QuestionTemplate;
  config: TemplateConfig;
  // 允许在画布中直接编辑标题 / 描述 / 选项
  onConfigChange: (patch: Partial<TemplateConfig>) => void;
}

export interface ConfigSiderProps {
  template: QuestionTemplate;
  config: TemplateConfig;
  onConfigChange: (patch: Partial<TemplateConfig>) => void;
  // 允许修改模板自身的元信息（例如模板名称）
  onTemplateMetaChange?: (patch: Partial<QuestionTemplate>) => void;
}
