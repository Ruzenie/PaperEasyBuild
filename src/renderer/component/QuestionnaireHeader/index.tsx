/** 问卷页眉渲染组件（标题 + 可选副标题）。 */
import React from "react";
import type { TextStyleConfig } from "@renderer/type/ComponentMarket";

type QuestionnaireHeaderProps = {
  title: string;
  subtitle?: string;
  titleStyle: TextStyleConfig;
  subtitleStyle: TextStyleConfig;
};

const QuestionnaireHeader: React.FC<QuestionnaireHeaderProps> = ({
  title,
  subtitle,
  titleStyle,
  subtitleStyle
}) => {
  const safeTitle = title.trim() || "未命名问卷";
  const safeSubtitle = (subtitle ?? "").trim();

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          textAlign: titleStyle.align,
          fontSize: titleStyle.fontSize,
          color: titleStyle.color,
          fontWeight: titleStyle.bold ? 700 : 400,
          fontStyle: titleStyle.italic ? "italic" : "normal"
        }}
      >
        {safeTitle}
      </div>

      {safeSubtitle && (
        <div
          style={{
            marginTop: 6,
            textAlign: subtitleStyle.align,
            fontSize: subtitleStyle.fontSize,
            color: subtitleStyle.color,
            fontWeight: subtitleStyle.bold ? 600 : 400,
            fontStyle: subtitleStyle.italic ? "italic" : "normal"
          }}
        >
          {safeSubtitle}
        </div>
      )}
    </div>
  );
};

export default QuestionnaireHeader;

