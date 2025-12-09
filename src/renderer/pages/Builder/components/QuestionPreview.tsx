import React from "react";
import type { QuestionDefinition } from "@renderer/type/Builder";
import {
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_OPTION_STYLE,
  DEFAULT_TITLE_STYLE
} from "../constants";

type QuestionPreviewProps = {
  question: QuestionDefinition;
};

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ question }) => {
  const titleStyle = question.titleStyle ?? DEFAULT_TITLE_STYLE;
  const descriptionStyle = question.descriptionStyle ?? DEFAULT_DESCRIPTION_STYLE;
  const optionStyle = question.optionStyle ?? DEFAULT_OPTION_STYLE;
  const options = question.options ?? ["选项1", "选项2"];

  return (
    <div style={{ marginTop: 6 }}>
      <div
        style={{
          textAlign: titleStyle.align,
          fontSize: titleStyle.fontSize,
          color: titleStyle.color,
          fontWeight: titleStyle.bold ? 600 : 400,
          fontStyle: titleStyle.italic ? "italic" : "normal",
          marginBottom: question.description ? 4 : 8
        }}
      >
        {question.title || "未命名题目"}
      </div>

      {question.description && (
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
          {question.description}
        </div>
      )}

      {(question.type === "singleChoice" || question.type === "judge") && (
        <div>
          {options.map((opt, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
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

      {question.type === "multiChoice" && (
        <div>
          {options.map((opt, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
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

      {question.type === "rating" && (
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

      {question.type === "slider" && (
        <div style={{ marginTop: 8 }}>
          <input type="range" min={0} max={Math.max(options.length - 1, 1)} disabled style={{ width: "100%" }} />
          {options.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
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

      {question.type === "date" && (
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

      {(question.type === "shortText" || question.type === "fillBlank") && (
        <input
          type="text"
          disabled
          placeholder={question.type === "fillBlank" ? "在此填写答案" : "单行文本输入"}
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

      {question.type === "longText" && (
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

      {question.type === "name" && (
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

      {question.type === "phone" && (
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

      {question.type === "note" && (
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
          {question.description || "备注说明"}
        </div>
      )}
    </div>
  );
};

export default QuestionPreview;
