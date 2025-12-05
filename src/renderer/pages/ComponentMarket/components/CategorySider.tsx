import React from "react";
import { Layout } from "antd";
import type { CategorySiderProps } from "@renderer/type/ComponentMarket";

const { Sider } = Layout;

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
            className={
              "component-item" + (tpl.id === activeTemplateId ? " component-item--active" : "")
            }
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
