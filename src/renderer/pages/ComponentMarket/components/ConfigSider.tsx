import React from "react";
import { Layout, Button, Input } from "antd";
import TextStyleControls from "@renderer/component/TextStyleControls";
import type { ConfigSiderProps } from "@renderer/type/ComponentMarket";

const { Sider } = Layout;

const ConfigSider: React.FC<ConfigSiderProps> = ({
  template,
  config,
  onConfigChange,
  onTemplateMetaChange
}) => {
  const options = config.options;

  return (
    <Sider width={280} className="panel panel-right" theme="light">
      <div className="panel-title">默认配置</div>

      {onTemplateMetaChange && (
        <div className="property-group">
          <div className="property-label">模板名称</div>
          <Input
            size="small"
            value={template.name}
            onChange={(e) => onTemplateMetaChange({ name: e.target.value })}
          />
        </div>
      )}

      <div className="property-group">
        <div className="property-label">题目标题</div>
        <Input
          size="small"
          value={config.title}
          onChange={(e) => onConfigChange({ title: e.target.value })}
        />
      </div>

      <TextStyleControls
        label="标题样式"
        style={config.titleStyle}
        onStyleChange={(patch) =>
          onConfigChange({
            titleStyle: { ...config.titleStyle, ...patch }
          })
        }
      />

      <div className="property-group">
        <div className="property-label">描述</div>
        <Input.TextArea
          rows={2}
          value={config.description}
          onChange={(e) => onConfigChange({ description: e.target.value })}
        />
      </div>

      <TextStyleControls
        label="描述样式"
        style={config.descriptionStyle}
        onStyleChange={(patch) =>
          onConfigChange({
            descriptionStyle: { ...config.descriptionStyle, ...patch }
          })
        }
      />

      {(template.type === "singleChoice" ||
        template.type === "multiChoice" ||
        template.type === "rating" ||
        template.type === "judge" ||
        template.type === "slider") && (
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

          <TextStyleControls
            label="选项样式"
            style={config.optionStyle}
            onStyleChange={(patch) =>
              onConfigChange({
                optionStyle: { ...config.optionStyle, ...patch }
              })
            }
          />
        </div>
      )}
    </Sider>
  );
};

export default ConfigSider;
