import type { QuestionCategory, QuestionTemplate } from "@renderer/type/ComponentMarket";

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  { id: "choice", name: "选择题" },
  { id: "text", name: "文本输入" },
  { id: "advanced", name: "高级题型" },
  { id: "note", name: "备注说明" },
  { id: "profile", name: "个人信息" },
  { id: "contact", name: "联系方式" }
];

export const BASE_QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    id: "note-basic",
    categoryId: "note",
    type: "note",
    name: "备注说明",
    defaultTitle: "这是一个备注说明",
    defaultDescription: "用于向用户提供额外的信息或说明。"
  },
  {
    id: "singleChoice-basic",
    categoryId: "choice",
    type: "singleChoice",
    name: "单选题",
    defaultTitle: "请选择一个选项",
    defaultDescription: "单选题示例：用户只能选择一个选项。",
    defaultOptions: ["选项1", "选项2", "选项3"]
  },
  {
    id: "multiChoice-basic",
    categoryId: "choice",
    type: "multiChoice",
    name: "多选题",
    defaultTitle: "可以选择多个选项",
    defaultDescription: "多选题示例：用户可以勾选多个选项。",
    defaultOptions: ["选项1", "选项2", "选项3"]
  },
  {
    id: "rating-basic",
    categoryId: "advanced",
    type: "rating",
    name: "打分题",
    defaultTitle: "请为本次服务打分",
    defaultDescription: "1 分非常不满意，5 分非常满意。",
    defaultOptions: ["1", "2", "3", "4", "5"]
  },
  {
    id: "slider-basic",
    categoryId: "advanced",
    type: "slider",
    name: "滑块题",
    defaultTitle: "通过滑块选择数值",
    defaultDescription: "例如：在 0 到 100 之间选择一个分值。",
    defaultOptions: ["0", "25", "50", "75", "100"]
  },
  {
    id: "exam-judge",
    categoryId: "choice",
    type: "judge",
    name: "判断题",
    defaultTitle: "【判断题】题干示例",
    defaultDescription: "判断正误，选择“对”或“错”。",
    defaultOptions: ["对", "错"]
  },
  {
    id: "date-basic",
    categoryId: "advanced",
    type: "date",
    name: "日期题",
    defaultTitle: "请选择日期",
    defaultDescription: "用于选择日期，例如预约时间、生日等。"
  },
  {
    id: "shortText-basic",
    categoryId: "text",
    type: "shortText",
    name: "单行输入",
    defaultTitle: "请输入内容",
    defaultDescription: "适合输入较短的内容，例如名称、城市等。"
  },
  {
    id: "longText-basic",
    categoryId: "text",
    type: "longText",
    name: "多行输入",
    defaultTitle: "请详细描述",
    defaultDescription: "适合输入较长的内容，例如意见反馈、问题描述等。"
  },
  {
    id: "exam-fillBlank",
    categoryId: "text",
    type: "fillBlank",
    name: "填空题",
    defaultTitle: "【填空题】在括号或下划线处填写答案",
    defaultDescription: "例如：1. （  ）是我国的首都。"
  },
  {
    id: "exam-shortAnswer",
    categoryId: "text",
    type: "longText",
    name: "简答题",
    defaultTitle: "【简答题】题干示例",
    defaultDescription: "请简要作答，说明理由或步骤。"
  },
  {
    id: "name-basic",
    categoryId: "profile",
    type: "name",
    name: "姓名",
    defaultTitle: "您的姓名",
    defaultDescription: "用于收集用户的真实姓名。"
  },
  {
    id: "phone-basic",
    categoryId: "contact",
    type: "phone",
    name: "手机号",
    defaultTitle: "您的手机号",
    defaultDescription: "用于收集联系手机号，用于通知或回访。"
  }
];

export const BASE_TEMPLATE_IDS = new Set(BASE_QUESTION_TEMPLATES.map((t) => t.id));
