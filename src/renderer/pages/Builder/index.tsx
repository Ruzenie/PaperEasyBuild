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
    required: true
  },
  {
    id: "q3",
    title: "您关注的功能（可多选）",
    type: "multiChoice"
  }
];

const BuilderPage: React.FC = () => {
  // 这里先用静态数据，后面可以替换成拖拽生成的 schema
  const [selectedQuestionId, setSelectedQuestionId] = React.useState<string | null>("q1");
  const navigate = useNavigate();

  const selectedQuestion = mockQuestions.find((q) => q.id === selectedQuestionId) ?? null;

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
            <h1 className="canvas-title">新建问卷</h1>
            <p className="canvas-desc">在左侧拖入题目，在右侧配置属性。</p>

            {mockQuestions.map((question) => (
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
                  {question.title}
                </div>
                <div className="question-meta">
                  {question.type === "singleChoice" && "单选题 · 示例选项 A / B / C"}
                  {question.type === "multiChoice" && "多选题 · 示例选项 A / B / C"}
                  {question.type === "shortText" && "简答题 · 示例输入框"}
                </div>
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
                  readOnly
                  // 后续可改为 onChange => 更新 schema
                />
              </div>

              <div className="property-group">
                <div className="property-label">题目类型</div>
                <select className="property-select" value={selectedQuestion.type} disabled>
                  <option value="singleChoice">单选题</option>
                  <option value="multiChoice">多选题</option>
                  <option value="shortText">简答题</option>
                </select>
              </div>

              <div className="property-group">
                <label
                  style={{ fontSize: "0.8rem", display: "flex", gap: 4, alignItems: "center" }}
                >
                  <input type="checkbox" checked={!!selectedQuestion.required} readOnly /> 必填
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
