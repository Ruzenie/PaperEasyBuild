import React from "react";
import { Layout } from "antd";
import type { QuestionCategory, QuestionCategoryId, QuestionTemplate } from "@renderer/type/ComponentMarket";

const { Sider } = Layout;

interface CategorySiderProps {
  categories: QuestionCategory[];
  activeCategoryId: QuestionCategoryId;
  onCategoryChange: (id: QuestionCategoryId) => void;
  templates: QuestionTemplate[];
  activeTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

const CategorySider: React.FC<CategorySiderProps> = ({
  categories,
  activeCategoryId,
  onCategoryChange,
  templates,
  activeTemplateId,
  onTemplateChange
}) => {
  const visibleTemplates = templates.filter((t) => t.categoryId === activeCategoryId);

  return (
    <Sider width={200} className="panel market-panel" theme="light">
      <div className="market-category-strip">
        {categories.map((cat) => {
          const active = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              type="button"
              className={"market-category-tag" + (active ? " market-category-tag--active" : "")}
              onClick={() => onCategoryChange(cat.id)}
            >
              <span className="market-category-tag-label">{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="panel-title" style={{ marginTop: 4, marginLeft: 8 }}>
        题型模板
      </div>
      <div className="component-list">
        {visibleTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="component-item"
            style={{
              cursor: "pointer",
              borderColor: tpl.id === activeTemplateId ? "#2563eb" : "rgba(209,213,219,1)",
              background: tpl.id === activeTemplateId ? "rgba(239,246,255,1)" : "#fff"
            }}
            onClick={() => onTemplateChange(tpl.id)}
          >
            {tpl.name}
          </div>
        ))}
      </div>
    </Sider>
  );
};

export default CategorySider;

