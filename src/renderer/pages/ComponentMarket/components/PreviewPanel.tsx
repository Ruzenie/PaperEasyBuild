import React from "react";
import type { PreviewPanelProps } from "@renderer/type/ComponentMarket";

const PreviewPanel: React.FC<PreviewPanelProps> = ({ template, config, onConfigChange }) => {
  const options = config.options;

  const handleOptionChange = (index: number, nextValue: string) => {
    const next = [...options];
    next[index] = nextValue;
    onConfigChange({ options: next });
  };

  return (
    <section className="canvas">
      <div className="canvas-field-editable">
        <input
          className="canvas-title"
          value={config.title}
          onChange={(e) => onConfigChange({ title: e.target.value })}
          style={{
            textAlign: config.titleStyle.align,
            fontSize: config.titleStyle.fontSize,
            color: config.titleStyle.color,
            fontWeight: config.titleStyle.bold ? 600 : 400,
            fontStyle: config.titleStyle.italic ? "italic" : "normal",
            width: "100%",
            border: "none",
            outline: "none",
            padding: 0,
            background: "transparent"
          }}
        />
      </div>
      <div className="canvas-field-editable">
        <textarea
          className="canvas-desc"
          value={config.description}
          onChange={(e) => onConfigChange({ description: e.target.value })}
          placeholder="请输入描述（可选）"
          rows={2}
          style={{
            textAlign: config.descriptionStyle.align,
            fontSize: config.descriptionStyle.fontSize,
            color: config.descriptionStyle.color,
            fontWeight: config.descriptionStyle.bold ? 500 : 400,
            fontStyle: config.descriptionStyle.italic ? "italic" : "normal",
            width: "100%",
            border: "none",
            outline: "none",
            padding: 0,
            resize: "none",
            background: "transparent"
          }}
        />
      </div>

      {(template.type === "singleChoice" || template.type === "judge") && (
        <div>
          {options.map((opt, index) => (
            <div
              key={index}
              className="option-row-editable"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <input type="radio" disabled />
              <input
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: 0,
                  background: "transparent",
                  fontSize: config.optionStyle.fontSize,
                  color: config.optionStyle.color,
                  fontWeight: config.optionStyle.bold ? 500 : 400,
                  fontStyle: config.optionStyle.italic ? "italic" : "normal"
                }}
              />
            </div>
          ))}
        </div>
      )}

      {template.type === "multiChoice" && (
        <div>
          {options.map((opt, index) => (
            <div
              key={index}
              className="option-row-editable"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <input type="checkbox" disabled />
              <input
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: 0,
                  background: "transparent",
                  fontSize: config.optionStyle.fontSize,
                  color: config.optionStyle.color,
                  fontWeight: config.optionStyle.bold ? 500 : 400,
                  fontStyle: config.optionStyle.italic ? "italic" : "normal"
                }}
              />
            </div>
          ))}
        </div>
      )}

      {template.type === "rating" && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {options.map((opt, index) => (
            <div
              key={index}
              className="option-row-editable"
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
              <input
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  background: "transparent",
                  fontSize: config.optionStyle.fontSize,
                  color: config.optionStyle.color,
                  fontWeight: config.optionStyle.bold ? 500 : 400,
                  fontStyle: config.optionStyle.italic ? "italic" : "normal"
                }}
              />
            </div>
          ))}
        </div>
      )}

      {template.type === "slider" && (
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
                    fontSize: config.optionStyle.fontSize - 1,
                    color: config.optionStyle.color,
                    fontWeight: config.optionStyle.bold ? 500 : 400,
                    fontStyle: config.optionStyle.italic ? "italic" : "normal"
                  }}
                >
                  {opt}
                </span>
              ))}
            </div>
          )}
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

      {(template.type === "shortText" || template.type === "fillBlank") && (
        <input
          type="text"
          disabled
          placeholder={template.type === "fillBlank" ? "在此填写答案" : "单行文本输入"}
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
