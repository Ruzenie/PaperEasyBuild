import React from "react";
import { Layout, Button, message, Select, Input, Checkbox } from "antd";
import {
  DndContext,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import PaperFooter from "../../component/PaperFooter";
import PaperHeader from "../../component/PaperHeader";
import TemplateSider from "../../component/TextStyleControls/TemplateSider";
import TextStyleControls from "../../component/TextStyleControls";
import { CompassOutlined, LeftOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons";
import type { PaperSizeId, QuestionDefinition, QuestionType } from "@renderer/type/Builder";
import type { QuestionCategoryId, QuestionTemplate, TextStyleConfig } from "@renderer/type/ComponentMarket";
import { QUESTION_CATEGORIES, BASE_QUESTION_TEMPLATES } from "@renderer/config/questionTemplates";
import "./index.css";

const { Content, Sider } = Layout;

const PAPER_SIZE_PRESETS: Record<
  PaperSizeId,
  { label: string; width: number; height: number; description: string }
> = {
  A4: {
    label: "A4 纵向",
    // 约等于 210mm × 297mm 在 96DPI 下的像素尺寸
    width: 794,
    height: 1123,
    description: "210 × 297 mm"
  },
  A5: {
    label: "A5 纵向",
    width: 559,
    height: 794,
    description: "148 × 210 mm"
  },
  ExamSingle: {
    label: "A4 试卷（单页）",
    width: 794,
    height: 1123,
    description: "适合单页考试试卷"
  },
  ExamDouble: {
    label: "A4 试卷（双页）",
    // 近似为两张 A4 竖版并排，中间预留一点装订空白
    width: 794 * 2 + 48,
    height: 1123,
    description: "左右两页双栏试卷版式"
  },
  Letter: {
    label: "Letter 纵向",
    width: 816,
    height: 1056,
    description: "8.5 × 11 in"
  }
};

const DEFAULT_TITLE_STYLE: TextStyleConfig = {
  align: "left",
  fontSize: 18,
  color: "#111827",
  bold: true,
  italic: false
};

const DEFAULT_DESCRIPTION_STYLE: TextStyleConfig = {
  align: "left",
  fontSize: 13,
  color: "#6b7280",
  bold: false,
  italic: false
};

const DEFAULT_OPTION_STYLE: TextStyleConfig = {
  align: "left",
  fontSize: 14,
  color: "#374151",
  bold: false,
  italic: false
};

type DraggableQuestionProps = {
  question: QuestionDefinition;
  isActive: boolean;
  label: string;
  onClick: (id: string) => void;
  renderContent: (q: QuestionDefinition) => React.ReactNode;
};

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  question,
  isActive,
  label,
  onClick,
  renderContent
}) => {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: question.id
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging
  } = useDraggable({
    id: question.id
  });

  const setRef = (node: HTMLElement | null) => {
    setDropRef(node);
    setDragRef(node);
  };

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10
      }
    : undefined;

  return (
    <div
      ref={setRef}
      className={
        "builder-question-item" +
        (isActive ? " builder-question-item--active" : "") +
        (isDragging ? " builder-question-item--dragging" : "") +
        (!isDragging && isOver ? " builder-question-item--over" : "")
      }
      style={dragStyle}
      onClick={() => onClick(question.id)}
      {...attributes}
      {...listeners}
    >
      <div className="builder-question-meta">{label}</div>
      {renderContent(question)}
    </div>
  );
};

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

  const activeQuestion =
    activeQuestionId != null ? questions.find((q) => q.id === activeQuestionId) ?? null : null;

  const getQuestionTypeLabel = (type: QuestionType): string => {
    switch (type) {
      case "singleChoice":
        return "单选题";
      case "multiChoice":
        return "多选题";
      case "rating":
        return "打分题";
      case "date":
        return "日期题";
      case "shortText":
        return "单行输入";
      case "longText":
        return "多行输入";
      case "name":
        return "姓名";
      case "phone":
        return "手机号";
      case "judge":
        return "判断题";
      case "fillBlank":
        return "填空题";
      case "slider":
        return "滑块题";
      case "note":
        return "备注说明";
      default:
        return type;
    }
  };

  const renderQuestionContent = (q: QuestionDefinition) => {
    const titleStyle = q.titleStyle ?? DEFAULT_TITLE_STYLE;
    const descriptionStyle = q.descriptionStyle ?? DEFAULT_DESCRIPTION_STYLE;
    const optionStyle = q.optionStyle ?? DEFAULT_OPTION_STYLE;
    const options = q.options ?? ["选项1", "选项2"];

    return (
      <div style={{ marginTop: 6 }}>
        {/* 标题 */}
        <div
          style={{
            textAlign: titleStyle.align,
            fontSize: titleStyle.fontSize,
            color: titleStyle.color,
            fontWeight: titleStyle.bold ? 600 : 400,
            fontStyle: titleStyle.italic ? "italic" : "normal",
            marginBottom: q.description ? 4 : 8
          }}
        >
          {q.title || "未命名题目"}
        </div>

        {/* 描述 */}
        {q.description && (
          <div
            style={{
              textAlign: descriptionStyle.align,
              fontSize: descriptionStyle.fontSize,
              color: descriptionStyle.color,
              fontWeight: descriptionStyle.bold ? 500 : 400,
              fontStyle: descriptionStyle.italic ? "italic" : "normal",
              marginBottom: 8
            }}
          >
            {q.description}
          </div>
        )}

        {/* 选择类题目 */}
        {(q.type === "singleChoice" || q.type === "judge") && (
          <div>
            {options.map((opt, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}
              >
                <input type="radio" disabled />
                <span
                  style={{
                    fontSize: optionStyle.fontSize,
                    color: optionStyle.color,
                    fontWeight: optionStyle.bold ? 500 : 400,
                    fontStyle: optionStyle.italic ? "italic" : "normal"
                  }}
                >
                  {opt}
                </span>
              </div>
            ))}
          </div>
        )}

        {q.type === "multiChoice" && (
          <div>
            {options.map((opt, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}
              >
                <input type="checkbox" disabled />
                <span
                  style={{
                    fontSize: optionStyle.fontSize,
                    color: optionStyle.color,
                    fontWeight: optionStyle.bold ? 500 : 400,
                    fontStyle: optionStyle.italic ? "italic" : "normal"
                  }}
                >
                  {opt}
                </span>
              </div>
            ))}
          </div>
        )}

        {q.type === "rating" && (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {options.map((opt, index) => (
              <div
                key={index}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <span
                  style={{
                    fontSize: optionStyle.fontSize,
                    color: optionStyle.color,
                    fontWeight: optionStyle.bold ? 500 : 400,
                    fontStyle: optionStyle.italic ? "italic" : "normal"
                  }}
                >
                  {opt}
                </span>
              </div>
            ))}
          </div>
        )}

        {q.type === "slider" && (
          <div style={{ marginTop: 8 }}>
            <input
              type="range"
              min={0}
              max={Math.max(options.length - 1, 1)}
              disabled
              style={{ width: "100%" }}
            />
            {options.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 4
                }}
              >
                {options.map((opt, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: optionStyle.fontSize - 1,
                      color: optionStyle.color,
                      fontWeight: optionStyle.bold ? 500 : 400,
                      fontStyle: optionStyle.italic ? "italic" : "normal"
                    }}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {q.type === "date" && (
          <input
            type="date"
            disabled
            style={{
              marginTop: 4,
              padding: "0.35rem 0.45rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "0.85rem"
            }}
          />
        )}

        {(q.type === "shortText" || q.type === "fillBlank") && (
          <input
            type="text"
            disabled
            placeholder={q.type === "fillBlank" ? "在此填写答案" : "单行文本输入"}
            style={{
              marginTop: 4,
              width: "100%",
              padding: "0.35rem 0.45rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "0.85rem"
            }}
          />
        )}

        {q.type === "longText" && (
          <textarea
            disabled
            placeholder="多行文本输入"
            style={{
              marginTop: 4,
              width: "100%",
              minHeight: 80,
              padding: "0.35rem 0.45rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "0.85rem",
              resize: "vertical"
            }}
          />
        )}

        {q.type === "name" && (
          <input
            type="text"
            disabled
            placeholder="姓名"
            style={{
              marginTop: 4,
              width: "100%",
              padding: "0.35rem 0.45rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "0.85rem"
            }}
          />
        )}

        {q.type === "phone" && (
          <input
            type="tel"
            disabled
            placeholder="手机号"
            style={{
              marginTop: 4,
              width: "100%",
              padding: "0.35rem 0.45rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "0.85rem"
            }}
          />
        )}

        {q.type === "note" && (
          <div
            style={{
              marginTop: 4,
              padding: "0.5rem 0.75rem",
              borderRadius: 6,
              background: "#f9fafb",
              border: "1px dashed #e5e7eb",
              fontSize: descriptionStyle.fontSize,
              color: descriptionStyle.color,
              fontWeight: descriptionStyle.bold ? 500 : 400,
              fontStyle: descriptionStyle.italic ? "italic" : "normal"
            }}
          >
            {q.description || "备注说明"}
          </div>
        )}
      </div>
    );
  };

  const estimateQuestionHeight = (q: QuestionDefinition): number => {
    // 估算每道题在画布上的高度（像素），用于自动分页
    let height = 56; // meta 行 + 标题行 + 卡片内边距

    if (q.description) {
      height += 28;
    }

    const optionCount = q.options?.length ?? 0;

    if (q.type === "singleChoice" || q.type === "multiChoice" || q.type === "judge") {
      // 每个选项大约一行
      height += optionCount * 28;
    } else if (q.type === "rating") {
      height += 52; // 一行圆形打分按钮
    } else if (q.type === "slider") {
      height += 64; // 滑条 + 底部刻度
    } else if (
      q.type === "shortText" ||
      q.type === "fillBlank" ||
      q.type === "date" ||
      q.type === "name" ||
      q.type === "phone"
    ) {
      height += 40; // 一行输入框
    } else if (q.type === "longText") {
      height += 96; // 多行输入框
    } else if (q.type === "note") {
      height += 60; // 备注块
    }

    // 预留题目之间的间距（gap）
    return height + 12;
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
          {/* 左侧：题型组件侧边栏，复用组件市场的题型 */}
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

          {/* 中间：试卷画布 */}
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
            {/* 画布尺寸选择 + 试卷画布 */}
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

              <div className="builder-canvas-wrapper">
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={() => setActiveDragId(null)}
                >
                  {(() => {
                    // 根据题目内容动态计算每页可放多少题
                    const pageHeight = activeSize.height;
                    // 扣除上下 padding、标题条等区域，得到可用内容高度
                    const usableHeight = Math.max(pageHeight - 48 - 32 - 40, 200);
                    const columnCount = paperSize === "ExamDouble" ? 2 : 1;

                    const createEmptyPage = () => ({
                      columns: Array.from({ length: columnCount }, () => [] as QuestionDefinition[]),
                      heights: Array(columnCount).fill(0)
                    });

                    const pages: { columns: QuestionDefinition[][]; heights: number[] }[] = [];
                    let currentPage = createEmptyPage();
                    pages.push(currentPage);
                    let columnIndex = 0;

                    for (const q of questions) {
                      const h = estimateQuestionHeight(q);

                      for (;;) {
                        const currentHeight = currentPage.heights[columnIndex];
                        const canFit = currentHeight + h <= usableHeight || currentHeight === 0;

                        if (canFit) {
                          currentPage.columns[columnIndex].push(q);
                          currentPage.heights[columnIndex] += h;
                          break;
                        }

                        if (columnIndex < columnCount - 1) {
                          columnIndex += 1;
                          continue;
                        }

                        // 开新页
                        currentPage = createEmptyPage();
                        pages.push(currentPage);
                        columnIndex = 0;
                      }
                    }

                    let globalQuestionIndex = 0;

                    return pages.map((page, pageIndex) => (
                      <div
                        key={pageIndex}
                        className="builder-canvas"
                        style={{
                          // 不再缩放，直接使用纸张预设的真实像素宽高
                          width: activeSize.width,
                          height: activeSize.height,
                          marginBottom: 24
                        }}
                      >
                        <div className="builder-canvas-size-label">
                          {activeSize.label} · {activeSize.description} · 第 {pageIndex + 1} 页
                        </div>
                        {questions.length === 0 && pageIndex === 0 ? (
                          <div className="builder-canvas-placeholder">
                            从左侧选择题型，点击即可添加到试卷中
                          </div>
                        ) : columnCount === 1 ? (
                          <div className="builder-question-list">
                            {page.columns[0].map((q) => {
                              const globalIndex = globalQuestionIndex++;
                              const label = `第 ${globalIndex + 1} 题 · ${getQuestionTypeLabel(
                                q.type
                              )} · ${q.required ? "必答" : "选答"}`;

                              return (
                                <DraggableQuestion
                                  key={q.id}
                                  question={q}
                                  label={label}
                                  isActive={q.id === activeQuestionId || q.id === activeDragId}
                                  onClick={setActiveQuestionId}
                                  renderContent={renderQuestionContent}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div className="builder-double">
                            {page.columns.map((col, colIndex) => (
                              <React.Fragment key={colIndex}>
                                {colIndex === 1 && <div className="builder-double-divider" />}
                                <div className="builder-double-column">
                                  <div className="builder-question-list">
                                    {col.map((q) => {
                                      const globalIndex = globalQuestionIndex++;
                                      const label = `第 ${globalIndex + 1} 题 · ${getQuestionTypeLabel(
                                        q.type
                                      )} · ${q.required ? "必答" : "选答"}`;

                                      return (
                                        <DraggableQuestion
                                          key={q.id}
                                          question={q}
                                          label={label}
                                          isActive={q.id === activeQuestionId || q.id === activeDragId}
                                          onClick={setActiveQuestionId}
                                          renderContent={renderQuestionContent}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </DndContext>
              </div>
            </div>
          </Content>

          {/* 右侧：题目编辑侧边栏 */}
          <Sider width={280} className="panel panel-right builder-sider-right" theme="light">
            <div className="panel-title">题目设置</div>

            {!activeQuestion && (
              <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                请在中间画布中选择题目，再在这里进行编辑。
              </div>
            )}

            {activeQuestion && (
              <>
                <div className="property-group">
                  <div className="property-label">题目标题</div>
                  <Input
                    size="small"
                    value={activeQuestion.title}
                    onChange={(e) =>
                      handleQuestionChange(activeQuestion.id, { title: e.target.value })
                    }
                  />
                </div>

                <TextStyleControls
                  label="标题样式"
                  style={activeQuestion.titleStyle ?? DEFAULT_TITLE_STYLE}
                  onStyleChange={(patch) =>
                    handleQuestionChange(activeQuestion.id, {
                      titleStyle: {
                        ...(activeQuestion.titleStyle ?? DEFAULT_TITLE_STYLE),
                        ...patch
                      }
                    })
                  }
                />

                <div className="property-group">
                  <div className="property-label">描述</div>
                  <Input.TextArea
                    rows={2}
                    value={activeQuestion.description ?? ""}
                    onChange={(e) =>
                      handleQuestionChange(activeQuestion.id, { description: e.target.value })
                    }
                  />
                </div>

                <TextStyleControls
                  label="描述样式"
                  style={activeQuestion.descriptionStyle ?? DEFAULT_DESCRIPTION_STYLE}
                  onStyleChange={(patch) =>
                    handleQuestionChange(activeQuestion.id, {
                      descriptionStyle: {
                        ...(activeQuestion.descriptionStyle ?? DEFAULT_DESCRIPTION_STYLE),
                        ...patch
                      }
                    })
                  }
                />

                <div className="property-group">
                  <Checkbox
                    checked={!!activeQuestion.required}
                    onChange={(e) =>
                      handleQuestionChange(activeQuestion.id, { required: e.target.checked })
                    }
                  >
                    必答题
                  </Checkbox>
                </div>

                {(activeQuestion.type === "singleChoice" ||
                  activeQuestion.type === "multiChoice" ||
                  activeQuestion.type === "rating" ||
                  activeQuestion.type === "judge" ||
                  activeQuestion.type === "slider") && (
                  <>
                    <div className="property-group">
                      <div className="property-label">题目选项（至少 2 个）</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {(activeQuestion.options ?? []).map((opt, index) => (
                          <div
                            key={index}
                            style={{ display: "flex", alignItems: "center", gap: 8 }}
                          >
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                                width: 18,
                                textAlign: "right"
                              }}
                            >
                              {index + 1}.
                            </span>
                            <Input
                              size="small"
                              value={opt}
                              onChange={(e) => {
                                const next = [...(activeQuestion.options ?? [])];
                                next[index] = e.target.value;
                                handleQuestionChange(activeQuestion.id, { options: next });
                              }}
                            />
                            <Button
                              size="small"
                              danger
                              disabled={(activeQuestion.options ?? []).length <= 2}
                              onClick={() => {
                                const currentOptions = activeQuestion.options ?? [];
                                if (currentOptions.length <= 2) return;
                                const next = currentOptions.filter((_, i) => i !== index);
                                handleQuestionChange(activeQuestion.id, { options: next });
                              }}
                            >
                              删除
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="small"
                          type="dashed"
                          onClick={() => {
                            const base = activeQuestion.options ?? ["选项1", "选项2"];
                            const next = [...base, `选项${base.length + 1}`];
                            handleQuestionChange(activeQuestion.id, { options: next });
                          }}
                        >
                          新增选项
                        </Button>
                      </div>
                    </div>

                    <TextStyleControls
                      label="选项样式"
                      style={activeQuestion.optionStyle ?? DEFAULT_OPTION_STYLE}
                      onStyleChange={(patch) =>
                        handleQuestionChange(activeQuestion.id, {
                          optionStyle: {
                            ...(activeQuestion.optionStyle ?? DEFAULT_OPTION_STYLE),
                            ...patch
                          }
                        })
                      }
                    />
                  </>
                )}

                <div className="property-group">
                  <Button danger block onClick={() => handleRemoveQuestion(activeQuestion.id)}>
                    删除该题目
                  </Button>
                </div>
              </>
            )}
          </Sider>
        </Layout>
      </Content>
      <PaperFooter />
    </Layout>
  );
};
export default Builder;
