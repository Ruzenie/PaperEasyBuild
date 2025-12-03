import React from "react";
import { Layout, Button, Input, InputNumber, Radio } from "antd";
import type {
  QuestionTemplate,
  TemplateConfig,
  TextStyleConfig
} from "@renderer/type/ComponentMarket";

const { Sider } = Layout;

interface ConfigSiderProps {
  template: QuestionTemplate;
  config: TemplateConfig;
  onConfigChange: (patch: Partial<TemplateConfig>) => void;
}

const renderTextStyleControls = (
  label: string,
  style: TextStyleConfig,
  onStyleChange: (patch: Partial<TextStyleConfig>) => void
) => (
  <div className="property-group">
    <div className="property-label">{label}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>对齐</span>
      <Radio.Group
        size="small"
        value={style.align}
        onChange={(e) => onStyleChange({ align: e.target.value })}
        optionType="button"
      >
        <Radio.Button value="left">左</Radio.Button>
        <Radio.Button value="center">中</Radio.Button>
      </Radio.Group>
      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>字号</span>
      <InputNumber
        size="small"
        min={10}
        max={40}
        value={style.fontSize}
        onChange={(value) => {
          if (typeof value === "number") {
            onStyleChange({ fontSize: value });
          }
        }}
      />
      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>颜色</span>
      <input
        type="color"
        value={style.color}
        onChange={(e) => onStyleChange({ color: e.target.value })}
        style={{
          width: 32,
          height: 24,
          border: "none",
          padding: 0,
          background: "transparent"
        }}
      />
      <Button
        size="small"
        type={style.bold ? "primary" : "default"}
        onClick={() => onStyleChange({ bold: !style.bold })}
      >
        B
      </Button>
      <Button
        size="small"
        type={style.italic ? "primary" : "default"}
        onClick={() => onStyleChange({ italic: !style.italic })}
      >
        I
      </Button>
    </div>
  </div>
);

const ConfigSider: React.FC<ConfigSiderProps> = ({ template, config, onConfigChange }) => {
  const options = config.options;

  return (
    <Sider width={280} className="panel panel-right" theme="light">
      <div className="panel-title">默认配置</div>

      <div className="property-group">
        <div className="property-label">题目标题</div>
        <Input
          size="small"
          value={config.title}
          onChange={(e) => onConfigChange({ title: e.target.value })}
        />
      </div>

      {renderTextStyleControls("标题样式", config.titleStyle, (patch) =>
        onConfigChange({
          titleStyle: { ...config.titleStyle, ...patch }
        })
      )}

      <div className="property-group">
        <div className="property-label">描述</div>
        <Input.TextArea
          rows={2}
          value={config.description}
          onChange={(e) => onConfigChange({ description: e.target.value })}
        />
      </div>

      {renderTextStyleControls("描述样式", config.descriptionStyle, (patch) =>
        onConfigChange({
          descriptionStyle: { ...config.descriptionStyle, ...patch }
        })
      )}

      {(template.type === "singleChoice" ||
        template.type === "multiChoice" ||
        template.type === "rating" ||
        template.type === "judge") && (
        <div className="property-group">
          <div className="property-label">题目选项（至少 2 个）</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {options.map((opt, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    const next = [...options];
                    next[index] = e.target.value;
                    onConfigChange({ options: next });
                  }}
                />
                <Button
                  size="small"
                  danger
                  disabled={options.length <= 2}
                  onClick={() => {
                    if (options.length <= 2) return;
                    const next = options.filter((_, i) => i !== index);
                    onConfigChange({ options: next });
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
                const next = [...options, `选项${options.length + 1}`];
                onConfigChange({ options: next });
              }}
            >
              新增选项
            </Button>
          </div>

          {renderTextStyleControls("选项样式", config.optionStyle, (patch) =>
            onConfigChange({
              optionStyle: { ...config.optionStyle, ...patch }
            })
          )}
        </div>
      )}
    </Sider>
  );
};

export default ConfigSider;
