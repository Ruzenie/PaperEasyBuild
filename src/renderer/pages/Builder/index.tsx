import React from "react";
import { Layout, Button, message, Select, Input, Spin, Modal } from "antd";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { CompassOutlined, LeftOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaperFooter from "../../component/PaperFooter";
import PaperHeader from "../../component/PaperHeader";
import TemplateSider from "../../component/TextStyleControls/TemplateSider";
import QuestionCanvas from "./components/QuestionCanvas";
import QuestionEditor from "./components/QuestionEditor";
import type { PaperSizeId, QuestionDefinition, QuestionType } from "@renderer/type/Builder";
import type { QuestionCategoryId, QuestionTemplate } from "@renderer/type/ComponentMarket";
import { QUESTION_CATEGORIES } from "@renderer/config/questionTemplates";
import {
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_OPTION_STYLE,
  DEFAULT_TITLE_STYLE,
  PAPER_SIZE_PRESETS
} from "./constants";
import { getQuestionnaire, loadTemplates, saveQuestionnaire } from "@renderer/db";
import "./index.css";

const { Content, Sider } = Layout;

const Builder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategoryId, setActiveCategoryId] = React.useState<QuestionCategoryId>("choice");
  const [questions, setQuestions] = React.useState<QuestionDefinition[]>([]);
  const [activeQuestionId, setActiveQuestionId] = React.useState<string | null>(null);
  const [paperSize, setPaperSize] = React.useState<PaperSizeId>("A4");
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);
  const [activeTemplateId, setActiveTemplateId] = React.useState<string | null>(null);
  const [paperTitle, setPaperTitle] = React.useState<string>("未命名问卷");
  const [currentQuestionnaireId, setCurrentQuestionnaireId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [templates, setTemplates] = React.useState<QuestionTemplate[]>([]);
  const [saving, setSaving] = React.useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    })
  );

  const handleSave = async () => {
    const name = paperTitle.trim();
    if (!name) {
      message.warning("请先输入问卷名称再保存");
      return;
    }
    if (name === "未命名问卷") {
      message.warning("请为问卷重命名再保存");
      return;
    }
    try {
      setSaving(true);
      const record = await saveQuestionnaire({
        id: currentQuestionnaireId ?? undefined,
        name,
        paperSize,
        questions
      });
      setCurrentQuestionnaireId(record.id);
      message.success("问卷已保存到本地");
    } finally {
      setSaving(false);
    }
  };
  const handlePreview = () => {
    const name = paperTitle.trim();
    if (!name) {
      message.warning("请先输入问卷名称再预览");
      return;
    }
    if (name === "未命名问卷") {
      message.warning("请为问卷重命名再保存");
      return;
    }
    if (currentQuestionnaireId) {
      navigate(`/preview?id=${currentQuestionnaireId}`);
      return;
    }

    Modal.confirm({
      title: "预览前需要保存，是否保存？",
      okText: "保存并预览",
      cancelText: "取消",
      onOk: async () => {
        try {
          setSaving(true);
          const record = await saveQuestionnaire({
            id: currentQuestionnaireId ?? undefined,
            name,
            paperSize,
            questions
          });
          setCurrentQuestionnaireId(record.id);
          message.success("已保存，正在前往预览");
          navigate(`/preview?id=${record.id}`);
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const activeSize = PAPER_SIZE_PRESETS[paperSize];

  const handleAddQuestionFromTemplate = (template: QuestionTemplate) => {
    const newId = `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const baseOptions =
      template.defaultOptions && template.defaultOptions.length >= 2
        ? template.defaultOptions
        : ["选项1", "选项2"];

    const newQuestion: QuestionDefinition = {
      id: newId,
      title: template.defaultTitle,
      type: template.type as QuestionType,
      required: false,
      description: template.defaultDescription,
      titleStyle: { ...DEFAULT_TITLE_STYLE },
      descriptionStyle: { ...DEFAULT_DESCRIPTION_STYLE },
      optionStyle: { ...DEFAULT_OPTION_STYLE },
      options:
        template.type === "singleChoice" ||
        template.type === "multiChoice" ||
        template.type === "rating" ||
        template.type === "judge" ||
        template.type === "slider"
          ? [...baseOptions]
          : undefined
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestionId(newId);
  };

  const handleQuestionChange = (id: string, patch: Partial<QuestionDefinition>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setActiveQuestionId((current) => (current === id ? null : current));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || active.id === over.id) return;

    setQuestions((prev) => {
      const fromIndex = prev.findIndex((q) => q.id === active.id);
      const toIndex = prev.findIndex((q) => q.id === over.id);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const activeQuestion =
    activeQuestionId != null ? questions.find((q) => q.id === activeQuestionId) ?? null : null;

  React.useEffect(() => {
    let mounted = true;
    const loadDraft = async () => {
      setLoading(true);
      const targetId = searchParams.get("id");

      if (targetId) {
        const draft = await getQuestionnaire(targetId);
        if (!mounted) return;
        if (draft) {
          setCurrentQuestionnaireId(draft.id);
          setPaperTitle(draft.name);
          setPaperSize(draft.paperSize);
          setQuestions(draft.questions);
          setActiveQuestionId(draft.questions[0]?.id ?? null);
        } else {
          message.warning("未找到指定的问卷，已为你创建新问卷");
          setCurrentQuestionnaireId(null);
          setPaperTitle("未命名问卷");
          setPaperSize("A4");
          setQuestions([]);
          setActiveQuestionId(null);
        }
      } else {
        setCurrentQuestionnaireId(null);
        setPaperTitle("未命名问卷");
        setPaperSize("A4");
        setQuestions([]);
        setActiveQuestionId(null);
      }
      setLoading(false);
    };

    loadDraft();
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  React.useEffect(() => {
    let mounted = true;
    loadTemplates().then((tpls) => {
      if (!mounted) return;
      setTemplates(tpls);
      if (!activeTemplateId && tpls[0]) {
        setActiveTemplateId(tpls[0].id);
        setActiveCategoryId(tpls[0].categoryId);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <PaperHeader />
      <Content
        style={{
          padding: "24px",
          height: "calc(100vh - 64px - 64px)",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          position: "relative"
        }}
      >
        {(loading || saving) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5
            }}
          >
            <Spin />
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexShrink: 0
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <Button icon={<LeftOutlined />} onClick={() => navigate("/")}>
              返回主页
            </Button>
            <Button
              icon={<CompassOutlined />}
              color="cyan"
              variant="solid"
              onClick={() => navigate("/market")}
            >
              组件市场
            </Button>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Input
              size="middle"
              style={{ width: 260 }}
              value={paperTitle}
              placeholder="输入问卷名称"
              onChange={(e) => setPaperTitle(e.target.value)}
            />
            <Button icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
              保存问卷
            </Button>
            <Button icon={<EyeOutlined />} type="primary" loading={saving} onClick={handlePreview}>
              页面预览
            </Button>
          </div>
        </div>

        <Layout
          style={{
            flex: 1,
            overflow: "hidden",
            minHeight: 0
          }}
        >
          <TemplateSider
            width={260}
            className="panel builder-sider-left"
            categories={QUESTION_CATEGORIES}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
            templates={templates}
            activeTemplateId={activeTemplateId ?? undefined}
            onTemplateClick={(tpl) => {
              setActiveTemplateId(tpl.id);
              handleAddQuestionFromTemplate(tpl);
            }}
            templateTitle="从组件市场添加题目"
            categoryVariant="inline"
          />

          <Content
            style={{
              padding: "0 12px",
              overflow: "hidden",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              minHeight: 0
            }}
          >
            <div className="builder-canvas-container">
              <div className="builder-canvas-toolbar">
                <span className="builder-canvas-toolbar-label">试卷大小：</span>
                <Select
                  size="middle"
                  style={{ width: 260 }}
                  value={paperSize}
                  options={Object.entries(PAPER_SIZE_PRESETS).map(([id, cfg]) => ({
                    label: `${cfg.label}（${cfg.description}）`,
                    value: id
                  }))}
                  onChange={(value) => setPaperSize(value as PaperSizeId)}
                />
              </div>

              <QuestionCanvas
                paperSize={paperSize}
                activeSize={activeSize}
                questions={questions}
                sensors={sensors}
                activeQuestionId={activeQuestionId}
                activeDragId={activeDragId}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveDragId(null)}
                onQuestionClick={setActiveQuestionId}
              />
            </div>
          </Content>

          <Sider width={280} className="panel panel-right builder-sider-right" theme="light">
            <div className="panel-title">题目设置</div>
            <QuestionEditor
              activeQuestion={activeQuestion}
              onQuestionChange={handleQuestionChange}
              onRemoveQuestion={handleRemoveQuestion}
            />
          </Sider>
        </Layout>
      </Content>
      <PaperFooter />
    </Layout>
  );
};

export default Builder;
