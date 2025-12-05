import React from "react";
import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, PlusOutlined, CopyOutlined } from "@ant-design/icons";
import PaperHeader from "../../component/PaperHeader";
import PaperFooter from "../../component/PaperFooter";
import type {
  QuestionCategory,
  QuestionCategoryId,
  QuestionTemplate,
  TemplateConfig
} from "@renderer/type/ComponentMarket";
import CategorySider from "./components/CategorySider";
import PreviewPanel from "./components/PreviewPanel";
import ConfigSider from "./components/ConfigSider";
import "./index.css";

const { Content } = Layout;

const CATEGORIES: QuestionCategory[] = [
  { id: "choice", name: "选择题" },
  { id: "text", name: "文本输入" },
  { id: "advanced", name: "高级题型" },
  { id: "note", name: "备注说明" },
  { id: "profile", name: "个人信息" },
  { id: "contact", name: "联系方式" }
];

const BASE_TEMPLATES: QuestionTemplate[] = [
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
    defaultOptions: ["选项一", "选项二", "选项三"]
  },
  {
    id: "multiChoice-basic",
    categoryId: "choice",
    type: "multiChoice",
    name: "多选题",
    defaultTitle: "可以选择多个选项",
    defaultDescription: "多选题示例：用户可以勾选多个选项。",
    defaultOptions: ["选项一", "选项二", "选项三"]
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
  // 考试场景：填空 / 简答
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

const buildInitialConfig = (templates: QuestionTemplate[]): Record<string, TemplateConfig> => {
  const result: Record<string, TemplateConfig> = {};
  for (const t of templates) {
    const baseOptions =
      t.defaultOptions && t.defaultOptions.length >= 2 ? t.defaultOptions : ["选项一", "选项二"];

    result[t.id] = {
      title: t.defaultTitle,
      description: t.defaultDescription ?? "",
      options: baseOptions,
      titleStyle: {
        align: "left",
        fontSize: 18,
        color: "#111827",
        bold: true,
        italic: false
      },
      descriptionStyle: {
        align: "left",
        fontSize: 13,
        color: "#6b7280",
        bold: false,
        italic: false
      },
      optionStyle: {
        align: "left",
        fontSize: 14,
        color: "#374151",
        bold: false,
        italic: false
      }
    };
  }
  return result;
};

const ComponentMarket: React.FC = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = React.useState<QuestionTemplate[]>(BASE_TEMPLATES);
  const [activeCategoryId, setActiveCategoryId] = React.useState<QuestionCategoryId>("choice");
  const [activeTemplateId, setActiveTemplateId] = React.useState<string>("singleChoice-basic");
  const [configById, setConfigById] = React.useState<Record<string, TemplateConfig>>(() =>
    buildInitialConfig(BASE_TEMPLATES)
  );

  const activeTemplates = React.useMemo(
    () => templates.filter((t) => t.categoryId === activeCategoryId),
    [templates, activeCategoryId]
  );

  const activeTemplate =
    templates.find((t) => t.id === activeTemplateId) ?? activeTemplates[0] ?? templates[0];

  const activeConfig: TemplateConfig = configById[activeTemplate.id] ?? {
    title: activeTemplate.defaultTitle,
    description: activeTemplate.defaultDescription ?? "",
    options:
      activeTemplate.defaultOptions && activeTemplate.defaultOptions.length >= 2
        ? activeTemplate.defaultOptions
        : ["选项一", "选项二"],
    titleStyle: {
      align: "left",
      fontSize: 18,
      color: "#111827",
      bold: true,
      italic: false
    },
    descriptionStyle: {
      align: "left",
      fontSize: 13,
      color: "#6b7280",
      bold: false,
      italic: false
    },
    optionStyle: {
      align: "left",
      fontSize: 14,
      color: "#374151",
      bold: false,
      italic: false
    }
  };

  const handleConfigChange = (patch: Partial<TemplateConfig>) => {
    setConfigById((prev) => ({
      ...prev,
      [activeTemplate.id]: {
        ...activeConfig,
        ...patch
      }
    }));
  };

  const handleTemplateMetaChange = (patch: Partial<QuestionTemplate>) => {
    setTemplates((prev) => prev.map((t) => (t.id === activeTemplate.id ? { ...t, ...patch } : t)));
  };

  const handleCreateTemplateFromCurrent = () => {
    if (!activeTemplate) return;

    const baseName = activeTemplate.name || "新题型";
    const timestamp = Date.now().toString(36);
    const newId = `${activeTemplate.type}-${timestamp}`;

    const newTemplate: QuestionTemplate = {
      ...activeTemplate,
      id: newId,
      name: `${baseName}（副本）`,
      defaultTitle: activeConfig.title,
      defaultDescription: activeConfig.description,
      defaultOptions: [...activeConfig.options]
    };

    setTemplates((prev) => [...prev, newTemplate]);
    setConfigById((prev) => ({
      ...prev,
      [newId]: {
        ...activeConfig
      }
    }));
    setActiveTemplateId(newId);
    setActiveCategoryId(newTemplate.categoryId);
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <PaperHeader />
        <Content style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button icon={<LeftOutlined />} onClick={() => navigate("/")}>
              返回主页
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/builder")}>
              模板创建
            </Button>
            <Button icon={<CopyOutlined />} onClick={handleCreateTemplateFromCurrent}>
              新建题型模板
            </Button>
          </div>

          <Layout className="app-body market-body">
            {/* 左侧：题型分组与列表 */}
            <CategorySider
              categories={CATEGORIES}
              activeCategoryId={activeCategoryId}
              onCategoryChange={setActiveCategoryId}
              templates={templates}
              activeTemplateId={activeTemplateId}
              onTemplateChange={setActiveTemplateId}
            />

            {/* 中间：题目实时预览 */}
            <Content className="canvas-wrapper">
              <PreviewPanel
                template={activeTemplate}
                config={activeConfig}
                onConfigChange={handleConfigChange}
              />
            </Content>

            {/* 右侧：配置面板 */}
            <ConfigSider
              template={activeTemplate}
              config={activeConfig}
              onConfigChange={handleConfigChange}
              onTemplateMetaChange={handleTemplateMetaChange}
            />
          </Layout>
        </Content>
        <PaperFooter />
      </Layout>
    </div>
  );
};

export default ComponentMarket;
