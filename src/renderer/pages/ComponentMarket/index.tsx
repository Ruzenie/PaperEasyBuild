import React from "react";
import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, PlusOutlined, CopyOutlined } from "@ant-design/icons";
import PaperHeader from "../../component/PaperHeader";
import PaperFooter from "../../component/PaperFooter";
import type {
  QuestionCategoryId,
  QuestionTemplate,
  TemplateConfig
} from "@renderer/type/ComponentMarket";
import { QUESTION_CATEGORIES, BASE_QUESTION_TEMPLATES } from "@renderer/config/questionTemplates";
import PreviewPanel from "./components/PreviewPanel";
import ConfigSider from "./components/ConfigSider";
import TemplateSider from "../../component/TextStyleControls/TemplateSider";
import "./index.css";

const { Content } = Layout;

const buildInitialConfig = (templates: QuestionTemplate[]): Record<string, TemplateConfig> => {
  const result: Record<string, TemplateConfig> = {};
  for (const t of templates) {
    const baseOptions =
      t.defaultOptions && t.defaultOptions.length >= 2 ? t.defaultOptions : ["选项1", "选项2"];

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

  const [templates, setTemplates] = React.useState<QuestionTemplate[]>(BASE_QUESTION_TEMPLATES);
  const [activeCategoryId, setActiveCategoryId] = React.useState<QuestionCategoryId>("choice");
  const [activeTemplateId, setActiveTemplateId] = React.useState<string>("singleChoice-basic");
  const [configById, setConfigById] = React.useState<Record<string, TemplateConfig>>(() =>
    buildInitialConfig(BASE_QUESTION_TEMPLATES)
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
        : ["选项1", "选项2"],
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
            <TemplateSider
              width={200}
              className="panel market-panel"
              categories={QUESTION_CATEGORIES}
              activeCategoryId={activeCategoryId}
              onCategoryChange={setActiveCategoryId}
              templates={templates}
              activeTemplateId={activeTemplateId}
              onTemplateClick={(tpl) => setActiveTemplateId(tpl.id)}
              title="题型模板"
              templateTitle="模板列表"
              categoryVariant="sticky"
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
