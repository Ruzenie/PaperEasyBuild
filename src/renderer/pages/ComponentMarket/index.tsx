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
const CONFIG_SAVE_DEBOUNCE_MS = 320;
const TEMPLATE_SAVE_DEBOUNCE_MS = 320;

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message ? error.message : fallback;

const ComponentMarket: React.FC = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = React.useState<QuestionTemplate[]>([]);
  const [activeCategoryId, setActiveCategoryId] = React.useState<QuestionCategoryId>("choice");
  const [activeTemplateId, setActiveTemplateId] = React.useState<string>("");
  const [configById, setConfigById] = React.useState<Record<string, TemplateConfig>>({});
  const [loading, setLoading] = React.useState(false);
  const configSaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const templateSaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingConfigSavesRef = React.useRef<Record<string, TemplateConfig>>({});
  const pendingTemplateSavesRef = React.useRef<Record<string, QuestionTemplate>>({});

  const flushConfigSaves = React.useCallback(async () => {
    const entries = Object.entries(pendingConfigSavesRef.current);
    if (entries.length === 0) return;
    pendingConfigSavesRef.current = {};

    const results = await Promise.allSettled(entries.map(([id, config]) => saveTemplateConfig(id, config)));
    const failedEntries = entries.filter((_, index) => results[index]?.status === "rejected");

    if (failedEntries.length > 0) {
      for (const [id, config] of failedEntries) {
        pendingConfigSavesRef.current[id] = config;
      }
      message.error(`有 ${failedEntries.length} 个模板配置保存失败，系统将自动重试`);
      if (!configSaveTimerRef.current) {
        configSaveTimerRef.current = setTimeout(() => {
          configSaveTimerRef.current = null;
          void flushConfigSaves();
        }, CONFIG_SAVE_DEBOUNCE_MS * 2);
      }
    }
  }, []);

  const flushTemplateSaves = React.useCallback(async () => {
    const entries = Object.entries(pendingTemplateSavesRef.current);
    if (entries.length === 0) return;
    pendingTemplateSavesRef.current = {};

    const results = await Promise.allSettled(entries.map(([, template]) => saveTemplate(template)));
    const failedEntries = entries.filter((_, index) => results[index]?.status === "rejected");

    if (failedEntries.length > 0) {
      for (const [id, template] of failedEntries) {
        pendingTemplateSavesRef.current[id] = template;
      }
      message.error(`有 ${failedEntries.length} 个模板元数据保存失败，系统将自动重试`);
      if (!templateSaveTimerRef.current) {
        templateSaveTimerRef.current = setTimeout(() => {
          templateSaveTimerRef.current = null;
          void flushTemplateSaves();
        }, TEMPLATE_SAVE_DEBOUNCE_MS * 2);
      }
    }
  }, []);

  const scheduleConfigSave = React.useCallback(
    (templateId: string, config: TemplateConfig) => {
      pendingConfigSavesRef.current[templateId] = config;
      if (configSaveTimerRef.current) {
        clearTimeout(configSaveTimerRef.current);
      }
      configSaveTimerRef.current = setTimeout(() => {
        configSaveTimerRef.current = null;
        void flushConfigSaves();
      }, CONFIG_SAVE_DEBOUNCE_MS);
    },
    [flushConfigSaves]
  );

  const scheduleTemplateSave = React.useCallback(
    (template: QuestionTemplate) => {
      pendingTemplateSavesRef.current[template.id] = template;
      if (templateSaveTimerRef.current) {
        clearTimeout(templateSaveTimerRef.current);
      }
      templateSaveTimerRef.current = setTimeout(() => {
        templateSaveTimerRef.current = null;
        void flushTemplateSaves();
      }, TEMPLATE_SAVE_DEBOUNCE_MS);
    },
    [flushTemplateSaves]
  );

  React.useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      if (mounted) {
        setLoading(true);
      }
      try {
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
      } catch (error) {
        if (!mounted) return;
        message.error(getErrorMessage(error, "加载组件市场失败，请刷新重试"));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void bootstrap();
    return () => {
      mounted = false;
      if (configSaveTimerRef.current) {
        clearTimeout(configSaveTimerRef.current);
        configSaveTimerRef.current = null;
      }
      if (templateSaveTimerRef.current) {
        clearTimeout(templateSaveTimerRef.current);
        templateSaveTimerRef.current = null;
      }
      void flushConfigSaves();
      void flushTemplateSaves();
    };
  }, [flushConfigSaves, flushTemplateSaves]);

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
    setConfigById((prev) => {
      const current = prev[activeTemplate.id] ?? buildDefaultConfigFromTemplate(activeTemplate);
      const nextConfig = { ...current, ...patch };
      scheduleConfigSave(activeTemplate.id, nextConfig);
      return {
        ...prev,
        [activeTemplate.id]: nextConfig
      };
    });
  };

  const handleTemplateMetaChange = (patch: Partial<QuestionTemplate>) => {
    if (!activeTemplate) return;
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id !== activeTemplate.id) return t;
        const nextTemplate = { ...t, ...patch };
        scheduleTemplateSave(nextTemplate);
        return nextTemplate;
      })
    );
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

    try {
      await saveTemplate(newTemplate);
      await saveTemplateConfig(newId, { ...activeConfig });
      setTemplates((prev) => [...prev, newTemplate]);
      setConfigById((prev) => ({
        ...prev,
        [newId]: {
          ...activeConfig
        }
      }));
      setActiveTemplateId(newId);
      setActiveCategoryId(newTemplate.categoryId);
      message.success("已创建题型模板副本");
    } catch (error) {
      message.error(getErrorMessage(error, "创建题型模板失败，请稍后重试"));
    }
  };

  const handleDeleteCurrentTemplate = async () => {
    if (!activeTemplate) return;
    if (BASE_TEMPLATE_IDS.has(activeTemplate.id)) {
      message.warning("默认题型不可删除");
      return;
    }
    try {
      await deleteTemplate(activeTemplate.id);
      const nextTemplates = templates.filter((t) => t.id !== activeTemplate.id);
      setTemplates(nextTemplates);
      setConfigById((prev) => {
        const next = { ...prev };
        delete next[activeTemplate.id];
        return next;
      });
      delete pendingConfigSavesRef.current[activeTemplate.id];
      delete pendingTemplateSavesRef.current[activeTemplate.id];

      const nextTemplate =
        nextTemplates.find((t) => t.categoryId === activeCategoryId) ?? nextTemplates[0];
      setActiveTemplateId(nextTemplate?.id ?? "");
      setActiveCategoryId(nextTemplate?.categoryId ?? "choice");
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
