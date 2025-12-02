import React from "react";
import type { QuestionTemplate, TemplateConfig } from "@renderer/type/ComponentMarket";

interface PreviewPanelProps {
  template: QuestionTemplate;
  config: TemplateConfig;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ template, config }) => {
  const options = config.options;

  return (
    <section className="canvas">
      <h1
        className="canvas-title"
        style={{
          textAlign: config.titleStyle.align,
          fontSize: config.titleStyle.fontSize,
          color: config.titleStyle.color,
          fontWeight: config.titleStyle.bold ? 600 : 400,
          fontStyle: config.titleStyle.italic ? "italic" : "normal"
        }}
      >
        {config.title}
      </h1>
      {config.description && (
        <p
          className="canvas-desc"
          style={{
            textAlign: config.descriptionStyle.align,
            fontSize: config.descriptionStyle.fontSize,
            color: config.descriptionStyle.color,
            fontWeight: config.descriptionStyle.bold ? 500 : 400,
            fontStyle: config.descriptionStyle.italic ? "italic" : "normal"
          }}
        >
          {config.description}
        </p>
      )}

      {template.type === "singleChoice" && (
        <div>
          {options.map((opt) => (
            <div key={opt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="radio" disabled />
              <span
                style={{
                  fontSize: config.optionStyle.fontSize,
                  color: config.optionStyle.color,
                  fontWeight: config.optionStyle.bold ? 500 : 400,
                  fontStyle: config.optionStyle.italic ? "italic" : "normal"
                }}
              >
                {opt}
              </span>
            </div>
          ))}
        </div>
      )}

      {template.type === "multiChoice" && (
        <div>
          {options.map((opt) => (
            <div key={opt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" disabled />
              <span
                style={{
                  fontSize: config.optionStyle.fontSize,
                  color: config.optionStyle.color,
                  fontWeight: config.optionStyle.bold ? 500 : 400,
                  fontStyle: config.optionStyle.italic ? "italic" : "normal"
                }}
              >
                {opt}
              </span>
            </div>
          ))}
        </div>
      )}

      {template.type === "rating" && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {options.map((opt) => (
            <button
              key={opt}
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#fff",
                fontSize: config.optionStyle.fontSize,
                color: config.optionStyle.color,
                fontWeight: config.optionStyle.bold ? 500 : 400,
                fontStyle: config.optionStyle.italic ? "italic" : "normal"
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {template.type === "date" && (
        <input
          type="date"
          disabled
          style={{
            padding: "0.35rem 0.45rem",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: "0.85rem"
          }}
        />
      )}

      {template.type === "shortText" && (
        <input
          type="text"
          disabled
          placeholder="单行文本输入"
          style={{
            width: "100%",
            padding: "0.35rem 0.45rem",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: "0.85rem"
          }}
        />
      )}

      {template.type === "longText" && (
        <textarea
          disabled
          placeholder="多行文本输入"
          style={{
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

      {template.type === "name" && (
        <input
          type="text"
          disabled
          placeholder="姓名"
          style={{
            width: "100%",
            padding: "0.35rem 0.45rem",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: "0.85rem"
          }}
        />
      )}

      {template.type === "phone" && (
        <input
          type="tel"
          disabled
          placeholder="手机号"
          style={{
            width: "100%",
            padding: "0.35rem 0.45rem",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: "0.85rem"
          }}
        />
      )}
    </section>
  );
};

export default PreviewPanel;

