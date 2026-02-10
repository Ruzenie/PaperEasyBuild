/** Builder 右侧栏问卷页眉配置编辑器（标题/副标题/样式）。 */
import React from "react";
import { Input } from "antd";
import TextStyleControls from "@renderer/component/TextStyleControls";
import type { NormalizedQuestionnaireHeader } from "@renderer/config/questionnaireHeader";

type QuestionnaireHeaderEditorProps = {
  header: NormalizedQuestionnaireHeader;
  onHeaderChange: (next: NormalizedQuestionnaireHeader) => void;
};

const QuestionnaireHeaderEditor: React.FC<QuestionnaireHeaderEditorProps> = ({ header, onHeaderChange }) => {
  return (
    <>
      <div className="property-group">
        <div className="property-label">问卷标题（显示在题目上方）</div>
        <Input
          size="small"
          value={header.title}
          placeholder="留空则使用问卷名称"
          onChange={(e) =>
            onHeaderChange({
              ...header,
              title: e.target.value
            })
          }
        />
      </div>

      <TextStyleControls
        label="标题样式"
        style={header.titleStyle}
        onStyleChange={(patch) =>
          onHeaderChange({
            ...header,
            titleStyle: {
              ...header.titleStyle,
              ...patch
            }
          })
        }
      />

      <div className="property-group">
        <div className="property-label">副标题</div>
        <Input.TextArea
          rows={2}
          value={header.subtitle}
          placeholder="可选：填写副标题/说明"
          onChange={(e) =>
            onHeaderChange({
              ...header,
              subtitle: e.target.value
            })
          }
        />
      </div>

      <TextStyleControls
        label="副标题样式"
        style={header.subtitleStyle}
        onStyleChange={(patch) =>
          onHeaderChange({
            ...header,
            subtitleStyle: {
              ...header.subtitleStyle,
              ...patch
            }
          })
        }
      />
    </>
  );
};

export default QuestionnaireHeaderEditor;

