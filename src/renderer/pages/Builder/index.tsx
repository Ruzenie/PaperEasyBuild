import React from "react";
import { useNavigate } from "react-router-dom";
import type { QuestionDefinition, QuestionType } from "@renderer/type/Builder";

const mockQuestions: QuestionDefinition[] = [
  {
    id: "q1",
    title: "您的职业 / 行业？",
    type: "shortText"
  },
  {
    id: "q2",
    title: "您最常使用问卷的场景？",
    type: "singleChoice",
    required: true,
    options: ["活动报名", "满意度调查", "产品调研"]
  },
  {
    id: "q3",
    title: "您关注的功能（可多选）",
    type: "multiChoice",
    options: ["拖拽编辑", "问卷模板", "数据可视化"]
  }
];

const BuilderPage: React.FC = () => {
  // 这里先用本地 state，后面可以替换成拖拽生成 / 持久化的 schema
  const [questions, setQuestions] = React.useState<QuestionDefinition[]>(mockQuestions);
  const [selectedQuestionId, setSelectedQuestionId] = React.useState<string | null>(
    mockQuestions[0]?.id ?? null
  );
  // 问卷级标题 / 描述，直接在画布顶部编辑
  const [formTitle, setFormTitle] = React.useState<string>("新建问卷");
  const [formDescription, setFormDescription] = React.useState<string>(
    "在左侧拖入题目，在右侧配置属性。"
  );
  const navigate = useNavigate();

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) ?? null;

  const updateQuestion = (id: string, patch: Partial<QuestionDefinition>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-title">
          <span className="logo" />
          <span>PaperEasy 问卷低代码平台</span>
        </div>
        <div className="app-header-actions">
          <button className="btn btn-ghost" onClick={() => navigate("/preview")}>
            预览
          </button>
          <button className="btn btn-primary">发布问卷</button>
        </div>
      </header>

      <div className="app-body">
        {/* 左侧组件面板 */}
        <aside className="panel">
          <div className="panel-title">题目组件</div>
          <div className="component-list">
            <div className="component-item">单选题</div>
            <div className="component-item">多选题</div>
            <div className="component-item">简答题</div>
            <div className="component-item">评分题</div>
            <div className="component-item">矩阵题</div>
          </div>
        </aside>

        {/* 中间问卷画布 */}
        <main className="canvas-wrapper">
          <section className="canvas">
            {/* 画布标题可直接编辑 */}
            <input
              className="canvas-title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: 0,
                background: "transparent"
              }}
            />
            {/* 画布描述可直接编辑 */}
            <textarea
              className="canvas-desc"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: 0,
                resize: "none",
                background: "transparent"
              }}
            />

            {questions.map((question) => (
              <article
                key={question.id}
                className="question-item"
                onClick={() => setSelectedQuestionId(question.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: question.id === selectedQuestionId ? "#eff6ff" : "transparent",
                  borderRadius: question.id === selectedQuestionId ? "0.375rem" : undefined,
                  padding: question.id === selectedQuestionId ? "0.75rem" : undefined
                }}
              >
                <div className="question-label">
                  {question.required && <span style={{ color: "#ef4444", marginRight: 4 }}>*</span>}
                  {/* 在画布中直接编辑题目文字 */}
                  {question.id === selectedQuestionId ? (
                    <input
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          title: e.target.value
                        })
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        padding: 0,
                        background: "transparent",
                        fontSize: "0.9rem"
                      }}
                    />
                  ) : (
                    question.title
                  )}
                </div>
                <div className="question-meta">
                  {/* 在画布上直接切换题目类型 */}
                  <select
                    style={{ marginRight: 8 }}
                    value={question.type}
                    onChange={(e) => {
                      const nextType = e.target.value as QuestionType;
                      const isChoice =
                        nextType === "singleChoice" || nextType === "multiChoice";
                      updateQuestion(question.id, {
                        type: nextType,
                        options:
                          isChoice && (!question.options || question.options.length === 0)
                            ? ["选项一", "选项二", "选项三"]
                            : isChoice
                            ? question.options
                            : undefined
                      });
                    }}
                  >
                    <option value="singleChoice">单选题</option>
                    <option value="multiChoice">多选题</option>
                    <option value="shortText">简答题</option>
                  </select>
                  {question.type === "singleChoice" && "单选题"}
                  {question.type === "multiChoice" && "多选题"}
                  {question.type === "shortText" && "简答题 · 示例输入框"}
                </div>
                {(question.type === "singleChoice" || question.type === "multiChoice") && (
                  <div style={{ marginTop: 6, paddingLeft: 4 }}>
                    {(question.options && question.options.length > 0
                      ? question.options
                      : ["选项一", "选项二"]
                    ).map((opt, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: index === 0 ? 0 : 4
                        }}
                      >
                        <input
                          type={question.type === "singleChoice" ? "radio" : "checkbox"}
                          disabled
                        />
                        <input
                          value={opt}
                          onChange={(e) => {
                            const nextOptions =
                              question.options && question.options.length > 0
                                ? [...question.options]
                                : ["选项一", "选项二"];
                            nextOptions[index] = e.target.value;
                            updateQuestion(question.id, { options: nextOptions });
                          }}
                          style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            padding: 0,
                            background: "transparent",
                            fontSize: "0.8rem"
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            fontSize: "0.75rem",
                            color: "#ef4444",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const source =
                              question.options && question.options.length > 0
                                ? question.options
                                : ["选项一", "选项二"];
                            if (source.length <= 2) return;
                            const nextOptions = source.filter((_, i) => i !== index);
                            updateQuestion(question.id, { options: nextOptions });
                          }}
                          disabled={
                            (question.options && question.options.length <= 2) ||
                            !question.options
                          }
                        >
                          删除
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      style={{
                        marginTop: 4,
                        fontSize: "0.75rem",
                        color: "#2563eb",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const base =
                          question.options && question.options.length > 0
                            ? question.options
                            : ["选项一", "选项二"];
                        const nextOptions = [...base, `选项${base.length + 1}`];
                        updateQuestion(question.id, { options: nextOptions });
                      }}
                    >
                      + 新增选项
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        </main>

        {/* 右侧属性配置面板 */}
        <aside className="panel panel-right">
          <div className="panel-title">属性配置</div>

          {selectedQuestion ? (
            <>
              <div className="property-group">
                <div className="property-label">题目标题</div>
                <input
                  className="property-input"
                  value={selectedQuestion.title}
                  onChange={(e) =>
                    updateQuestion(selectedQuestion.id, {
                      title: e.target.value
                    })
                  }
                />
              </div>

              <div className="property-group">
                <div className="property-label">题目类型</div>
                <select
                  className="property-select"
                  value={selectedQuestion.type}
                  onChange={(e) => {
                    const nextType = e.target.value as QuestionType;
                    const isChoice = nextType === "singleChoice" || nextType === "multiChoice";
                    updateQuestion(selectedQuestion.id, {
                      type: nextType,
                      options:
                        isChoice &&
                        (!selectedQuestion.options || selectedQuestion.options.length === 0)
                          ? ["选项一", "选项二", "选项三"]
                          : isChoice
                          ? selectedQuestion.options
                          : undefined
                    });
                  }}
                >
                  <option value="singleChoice">单选题</option>
                  <option value="multiChoice">多选题</option>
                  <option value="shortText">简答题</option>
                </select>
              </div>

              <div className="property-group">
                <label
                  style={{ fontSize: "0.8rem", display: "flex", gap: 4, alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={!!selectedQuestion.required}
                    onChange={(e) =>
                      updateQuestion(selectedQuestion.id, {
                        required: e.target.checked
                      })
                    }
                  />{" "}
                  必填
                </label>
              </div>

              <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                当前只是静态示例。下一步可以：
                <br />
                - 把问卷保存成 JSON Schema
                <br />
                - 支持拖拽排序 / 删除题目
                <br />- 通过 Electron IPC 保存到本地或调用后端
              </p>
            </>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>请选择一题进行配置。</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BuilderPage;
