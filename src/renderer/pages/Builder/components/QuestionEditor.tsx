import React from "react";
import { Button, Checkbox, Input, Select } from "antd";
import TextStyleControls from "@renderer/component/TextStyleControls";
import type { QuestionDefinition, QuestionVisibilityRule } from "@renderer/type/Builder";
import { getConditionSourceQuestions } from "../../../utils/questionLogic";
import {
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_OPTION_STYLE,
  DEFAULT_TITLE_STYLE
} from "../constants";

type QuestionEditorProps = {
  questions: QuestionDefinition[];
  activeQuestion: QuestionDefinition | null;
  onQuestionChange: (id: string, patch: Partial<QuestionDefinition>) => void;
  onRemoveQuestion: (id: string) => void;
};

const buildDefaultVisibilityRule = (
  sourceQuestions: QuestionDefinition[]
): QuestionVisibilityRule | undefined => {
  const firstSource = sourceQuestions[0];
  const firstValue = firstSource?.options?.[0];
  if (!firstSource || !firstValue) return undefined;
  return {
    sourceQuestionId: firstSource.id,
    expectedValue: firstValue
  };
};

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questions,
  activeQuestion,
  onQuestionChange,
  onRemoveQuestion
}) => {
  const sourceQuestions = React.useMemo(() => {
    if (!activeQuestion) return [];
    return getConditionSourceQuestions(questions, activeQuestion.id);
  }, [activeQuestion, questions]);

  if (!activeQuestion) {
    return (
      <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
        请在中间画布中选择题目，再在这里进行编辑。
      </div>
    );
  }

  const selectedSourceQuestion = sourceQuestions.find(
    (question) => question.id === activeQuestion.visibilityRule?.sourceQuestionId
  );
  const selectedSourceOptions = selectedSourceQuestion?.options ?? [];

  return (
    <>
      <div className="property-group">
        <div className="property-label">题目标题</div>
        <Input
          size="small"
          value={activeQuestion.title}
          onChange={(e) => onQuestionChange(activeQuestion.id, { title: e.target.value })}
        />
      </div>

      <TextStyleControls
        label="标题样式"
        style={activeQuestion.titleStyle ?? DEFAULT_TITLE_STYLE}
        onStyleChange={(patch) =>
          onQuestionChange(activeQuestion.id, {
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
          onChange={(e) => onQuestionChange(activeQuestion.id, { description: e.target.value })}
        />
      </div>

      <TextStyleControls
        label="描述样式"
        style={activeQuestion.descriptionStyle ?? DEFAULT_DESCRIPTION_STYLE}
        onStyleChange={(patch) =>
          onQuestionChange(activeQuestion.id, {
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
          onChange={(e) => onQuestionChange(activeQuestion.id, { required: e.target.checked })}
        >
          必答题
        </Checkbox>
      </div>

      <div className="property-group">
        <div className="property-label">条件显示</div>
        <Checkbox
          checked={!!activeQuestion.visibilityRule}
          disabled={sourceQuestions.length === 0}
          onChange={(event) => {
            if (!event.target.checked) {
              onQuestionChange(activeQuestion.id, { visibilityRule: undefined });
              return;
            }

            const defaultRule = buildDefaultVisibilityRule(sourceQuestions);
            if (defaultRule) {
              onQuestionChange(activeQuestion.id, { visibilityRule: defaultRule });
            }
          }}
        >
          仅在满足条件时显示本题
        </Checkbox>

        {sourceQuestions.length === 0 && (
          <div style={{ marginTop: 8, fontSize: "0.8rem", color: "#9ca3af" }}>
            需先创建前序选择题，才能配置条件显示。
          </div>
        )}

        {activeQuestion.visibilityRule && sourceQuestions.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>来源题目</div>
            <Select
              size="small"
              value={activeQuestion.visibilityRule.sourceQuestionId}
              options={sourceQuestions.map((question) => ({
                value: question.id,
                label: `第 ${questions.findIndex((item) => item.id === question.id) + 1} 题 · ${
                  question.title || "未命名题目"
                }`
              }))}
              onChange={(sourceQuestionId) => {
                const source = sourceQuestions.find((item) => item.id === sourceQuestionId);
                const nextExpectedValue = source?.options?.[0] ?? "";
                onQuestionChange(activeQuestion.id, {
                  visibilityRule: nextExpectedValue
                    ? {
                        sourceQuestionId,
                        expectedValue: nextExpectedValue
                      }
                    : undefined
                });
              }}
            />

            <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>触发选项</div>
            <Select
              size="small"
              value={activeQuestion.visibilityRule.expectedValue}
              options={selectedSourceOptions.map((option) => ({
                value: option,
                label: option
              }))}
              onChange={(expectedValue) => {
                if (!activeQuestion.visibilityRule) return;
                onQuestionChange(activeQuestion.id, {
                  visibilityRule: {
                    ...activeQuestion.visibilityRule,
                    expectedValue
                  }
                });
              }}
            />
          </div>
        )}
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
                <div key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.8rem", color: "#9ca3af", width: 18, textAlign: "right" }}>
                    {index + 1}.
                  </span>
                  <Input
                    size="small"
                    value={opt}
                    onChange={(e) => {
                      const next = [...(activeQuestion.options ?? [])];
                      next[index] = e.target.value;
                      onQuestionChange(activeQuestion.id, { options: next });
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
                      onQuestionChange(activeQuestion.id, { options: next });
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
                  onQuestionChange(activeQuestion.id, { options: next });
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
              onQuestionChange(activeQuestion.id, {
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
        <Button danger block onClick={() => onRemoveQuestion(activeQuestion.id)}>
          删除该题目
        </Button>
      </div>
    </>
  );
};

export default QuestionEditor;
