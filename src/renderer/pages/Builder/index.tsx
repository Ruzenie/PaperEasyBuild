import React from "react";
import { Layout, Button, message, Select } from "antd";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { CompassOutlined, LeftOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PaperFooter from "../../component/PaperFooter";
import PaperHeader from "../../component/PaperHeader";
import TemplateSider from "../../component/TextStyleControls/TemplateSider";
import QuestionCanvas from "./components/QuestionCanvas";
import QuestionEditor from "./components/QuestionEditor";
import type { PaperSizeId, QuestionDefinition, QuestionType } from "@renderer/type/Builder";
import type { QuestionCategoryId, QuestionTemplate } from "@renderer/type/ComponentMarket";
import { QUESTION_CATEGORIES, BASE_QUESTION_TEMPLATES } from "@renderer/config/questionTemplates";
import {
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_OPTION_STYLE,
  DEFAULT_TITLE_STYLE,
  PAPER_SIZE_PRESETS
} from "./constants";
import "./index.css";

const { Content, Sider } = Layout;

const Builder: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = React.useState<QuestionCategoryId>("choice");
  const [questions, setQuestions] = React.useState<QuestionDefinition[]>([]);
  const [activeQuestionId, setActiveQuestionId] = React.useState<string | null>(null);
  const [paperSize, setPaperSize] = React.useState<PaperSizeId>("A4");
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);
  const [activeTemplateId, setActiveTemplateId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6
      }
    })
  );

  const handleSave = () => {
    // TODO: 接入真实保存逻辑，目前仅做示例提示
    message.success("问卷已保存（示例）");
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
          minHeight: 0
        }}
      >
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
          <div style={{ display: "flex", gap: 12 }}>
            <Button icon={<SaveOutlined />} onClick={handleSave}>
              保存问卷
            </Button>
            <Button icon={<EyeOutlined />} type="primary" onClick={() => navigate("/preview")}>
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
            templates={BASE_QUESTION_TEMPLATES}
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
