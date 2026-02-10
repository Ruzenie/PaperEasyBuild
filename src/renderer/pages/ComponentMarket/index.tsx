import React from "react";
import { Layout, Button, Spin, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, PlusOutlined, CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import PaperHeader from "../../component/PaperHeader";
import PaperFooter from "../../component/PaperFooter";
import type {
  QuestionCategoryId,
  QuestionTemplate,
  TemplateConfig
} from "@renderer/type/ComponentMarket";
import {
  QUESTION_CATEGORIES,
  BASE_QUESTION_TEMPLATES,
  BASE_TEMPLATE_IDS
} from "@renderer/config/questionTemplates";
import PreviewPanel from "./components/PreviewPanel";
import ConfigSider from "./components/ConfigSider";
import TemplateSider from "../../component/TextStyleControls/TemplateSider";
import {
  buildDefaultConfigFromTemplate,
  loadTemplateConfigs,
  loadTemplates,
  saveTemplate,
  saveTemplateConfig,
  deleteTemplate
} from "@renderer/db";
import "./index.css";

const { Content } = Layout;

const ComponentMarket: React.FC = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = React.useState<QuestionTemplate[]>([]);
  const [activeCategoryId, setActiveCategoryId] = React.useState<QuestionCategoryId>("choice");
  const [activeTemplateId, setActiveTemplateId] = React.useState<string>("");
  const [configById, setConfigById] = React.useState<Record<string, TemplateConfig>>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      setLoading(true);
      const [tpls, configs] = await Promise.all([loadTemplates(), loadTemplateConfigs()]);
      if (!mounted) return;

      const configMap: Record<string, TemplateConfig> = {};
      for (const tpl of tpls) {
        configMap[tpl.id] = configs[tpl.id] ?? buildDefaultConfigFromTemplate(tpl);
      }

      setTemplates(tpls);
      setConfigById(configMap);
      setActiveTemplateId((prev) => prev || tpls[0]?.id || "");
      setActiveCategoryId((prev) => prev || tpls[0]?.categoryId || "choice");
      setLoading(false);
    };

    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const activeTemplates = React.useMemo(
    () => templates.filter((t) => t.categoryId === activeCategoryId),
    [templates, activeCategoryId]
  );

  const activeTemplate =
    templates.find((t) => t.id === activeTemplateId) ?? activeTemplates[0] ?? templates[0];

  const activeConfig: TemplateConfig = activeTemplate
    ? configById[activeTemplate.id] ?? buildDefaultConfigFromTemplate(activeTemplate)
    : buildDefaultConfigFromTemplate(BASE_QUESTION_TEMPLATES[0]);

  const handleConfigChange = (patch: Partial<TemplateConfig>) => {
    if (!activeTemplate) return;
    setConfigById((prev) => ({
      ...prev,
      [activeTemplate.id]: {
        ...activeConfig,
        ...patch
      }
    }));
    saveTemplateConfig(activeTemplate.id, { ...activeConfig, ...patch });
  };

  const handleTemplateMetaChange = (patch: Partial<QuestionTemplate>) => {
    if (!activeTemplate) return;
    setTemplates((prev) => prev.map((t) => (t.id === activeTemplate.id ? { ...t, ...patch } : t)));
    saveTemplate({ ...activeTemplate, ...patch });
  };

  const handleCreateTemplateFromCurrent = async () => {
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
    await saveTemplate(newTemplate);
    await saveTemplateConfig(newId, { ...activeConfig });
  };

  const handleDeleteCurrentTemplate = async () => {
    if (!activeTemplate) return;
    if (BASE_TEMPLATE_IDS.has(activeTemplate.id)) {
      message.warning("默认题型不可删除");
      return;
    }
    try {
      await deleteTemplate(activeTemplate.id);
      setTemplates((prev) => prev.filter((t) => t.id !== activeTemplate.id));
      setConfigById((prev) => {
        const next = { ...prev };
        delete next[activeTemplate.id];
        return next;
      });

      const nextTemplate = templates.find((t) => t.id !== activeTemplate.id);
      setActiveTemplateId(nextTemplate?.id ?? "");
      setActiveCategoryId(nextTemplate?.categoryId ?? activeCategoryId);
      message.success("已删除该题型");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "删除失败");
    }
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
            <Popconfirm
              title="确认删除该题型？"
              okText="删除"
              cancelText="取消"
              onConfirm={handleDeleteCurrentTemplate}
              disabled={!activeTemplate || BASE_TEMPLATE_IDS.has(activeTemplate.id)}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                disabled={!activeTemplate || BASE_TEMPLATE_IDS.has(activeTemplate.id)}
              >
                删除题型
              </Button>
            </Popconfirm>
          </div>

          <Layout className="app-body market-body">
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
            <Content className="canvas-wrapper">
              {loading || !activeTemplate ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%"
                  }}
                >
                  <Spin />
                </div>
              ) : (
                <PreviewPanel
                  template={activeTemplate}
                  config={activeConfig}
                  onConfigChange={handleConfigChange}
                />
              )}
            </Content>
            {activeTemplate && (
              <ConfigSider
                template={activeTemplate}
                config={activeConfig}
                onConfigChange={handleConfigChange}
                onTemplateMetaChange={handleTemplateMetaChange}
              />
            )}
          </Layout>
        </Content>
        <PaperFooter />
      </Layout>
    </div>
  );
};

export default ComponentMarket;
