import React from "react";
import { Button, InputNumber, Radio } from "antd";
import type { TextStyleConfig } from "@renderer/type/ComponentMarket";

interface TextStyleControlsProps {
  label: string;
  style: TextStyleConfig;
  onStyleChange: (patch: Partial<TextStyleConfig>) => void;
}

const TextStyleControls: React.FC<TextStyleControlsProps> = ({ label, style, onStyleChange }) => (
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

export default TextStyleControls;
