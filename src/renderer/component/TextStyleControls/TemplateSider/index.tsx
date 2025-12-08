import React from "react";
import { Button, Layout } from "antd";
import type {
  QuestionCategory,
  QuestionCategoryId,
  QuestionTemplate
} from "@renderer/type/ComponentMarket";
import "./index.css";

const { Sider } = Layout;

export type TemplateSiderVariant = "inline" | "sticky";

export interface TemplateSiderProps {
  categories: QuestionCategory[];
  activeCategoryId: QuestionCategoryId;
  onCategoryChange: (id: QuestionCategoryId) => void;
  templates: QuestionTemplate[];
  activeTemplateId?: string;
  onTemplateClick: (template: QuestionTemplate) => void;
  width?: number;
  className?: string;
  title?: string;
  templateTitle?: string;
  categoryVariant?: TemplateSiderVariant;
}

const TemplateSider: React.FC<TemplateSiderProps> = ({
  categories,
  activeCategoryId,
  onCategoryChange,
  templates,
  activeTemplateId,
  onTemplateClick,
  width = 240,
  className = "panel",
  title = "题型组件",
  templateTitle = "题型列表",
  categoryVariant = "inline"
}) => {
  const visibleTemplates = templates.filter((t) => t.categoryId === activeCategoryId);

  return (
    <Sider
      width={width}
      className={`template-sider ${
        categoryVariant === "sticky" ? "template-sider--sticky" : ""
      } ${className}`}
      theme="light"
    >
      {title && <div className="panel-title">{title}</div>}

      <div className="property-group">
        <div className="property-label">题型分组</div>
        {categoryVariant === "sticky" ? (
          <div className="template-sider-strip">
            {categories.map((cat) => {
              const active = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={"template-sider-tag" + (active ? " template-sider-tag--active" : "")}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  <span className="template-sider-tag-label">{cat.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="small"
                type={cat.id === activeCategoryId ? "primary" : "default"}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="property-group">
        <div className="property-label">{templateTitle}</div>
        <div className="component-list">
          {visibleTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className={"component-item" + (tpl.id === activeTemplateId ? " component-item--active" : "")}
              onClick={() => onTemplateClick(tpl)}
            >
              {tpl.name}
            </div>
          ))}
        </div>
      </div>
    </Sider>
  );
};

export default TemplateSider;
