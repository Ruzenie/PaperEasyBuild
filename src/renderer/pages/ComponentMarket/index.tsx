import React from "react";
import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import PaperHeader from "../../component/PaperHeader";
import PaperFooter from "../../component/PaperFooter";
import type {
  QuestionCategory,
  QuestionCategoryId,
  QuestionTemplate,
  TemplateConfig
} from "@renderer/type/ComponentMarket";
import CategorySider from "./components/CategorySider";
import PreviewPanel from "./components/PreviewPanel";
import ConfigSider from "./components/ConfigSider";
import "./index.css";

const { Content } = Layout;

const CATEGORIES: QuestionCategory[] = [
  { id: "choice", name: "选择题" },
  { id: "text", name: "文本输入" },
  { id: "advanced", name: "高级题型" },
  { id: "note", name: "备注说明" },
  { id: "profile", name: "个人信息" },
  { id: "contact", name: "联系方式" }
];

const TEMPLATES: QuestionTemplate[] = [
  {
    id: "singleChoice-basic",
    categoryId: "choice",
    type: "singleChoice",
    name: "单选题",
    defaultTitle: "请选择一个选项",
    defaultDescription: "单选题示例：用户只能选择一个选项。",
    defaultOptions: ["选项一", "选项二", "选项三"]
  },
  {
    id: "multiChoice-basic",
    categoryId: "choice",
    type: "multiChoice",
    name: "多选题",
    defaultTitle: "可以选择多个选项",
    defaultDescription: "多选题示例：用户可以勾选多个选项。",
    defaultOptions: ["选项一", "选项二", "选项三"]
  },
  {
    id: "rating-basic",
    categoryId: "advanced",
    type: "rating",
    name: "打分题",
    defaultTitle: "请为本次服务打分",
    defaultDescription: "1 分非常不满意，5 分非常满意。",
    defaultOptions: ["1", "2", "3", "4", "5"]
  },
  // 考试场景：选择题
  {
    id: "exam-singleChoice",
    categoryId: "choice",
    type: "singleChoice",
    name: "单选题（考试）",
    defaultTitle: "【单选题】题干示例",
    defaultDescription: "请选择一个最符合题意的选项。",
    defaultOptions: ["A. 选项一", "B. 选项二", "C. 选项三", "D. 选项四"]
  },
  {
    id: "exam-multiChoice",
    categoryId: "choice",
    type: "multiChoice",
    name: "多选题（考试）",
    defaultTitle: "【多选题】题干示例",
    defaultDescription: "可选择一个或多个选项。",
    defaultOptions: ["A. 选项一", "B. 选项二", "C. 选项三", "D. 选项四"]
  },
  {
    id: "exam-judge",
    categoryId: "choice",
    type: "judge",
    name: "判断题",
    defaultTitle: "【判断题】题干示例",
    defaultDescription: "判断正误，选择“对”或“错”。",
    defaultOptions: ["对", "错"]
  },
  {
    id: "date-basic",
    categoryId: "advanced",
    type: "date",
    name: "日期题",
    defaultTitle: "请选择日期",
    defaultDescription: "用于选择日期，例如预约时间、生日等。"
  },
  {
    id: "shortText-basic",
    categoryId: "text",
    type: "shortText",
    name: "单行输入",
    defaultTitle: "请输入内容",
    defaultDescription: "适合输入较短的内容，例如名称、城市等。"
  },
  {
    id: "longText-basic",
    categoryId: "text",
    type: "longText",
    name: "多行输入",
    defaultTitle: "请详细描述",
    defaultDescription: "适合输入较长的内容，例如意见反馈、问题描述等。"
  },
  // 考试场景：填空 / 简答
  {
    id: "exam-fillBlank",
    categoryId: "text",
    type: "fillBlank",
    name: "填空题",
    defaultTitle: "【填空题】在括号或下划线处填写答案",
    defaultDescription: "例如：1. （  ）是我国的首都。"
  },
  {
    id: "exam-shortAnswer",
    categoryId: "text",
    type: "longText",
    name: "简答题",
    defaultTitle: "【简答题】题干示例",
    defaultDescription: "请简要作答，说明理由或步骤。"
  },
  {
    id: "name-basic",
    categoryId: "profile",
    type: "name",
    name: "姓名",
    defaultTitle: "您的姓名",
    defaultDescription: "用于收集用户的真实姓名。"
  },
  {
    id: "phone-basic",
    categoryId: "contact",
    type: "phone",
    name: "手机号",
    defaultTitle: "您的手机号",
    defaultDescription: "用于收集联系手机号，用于通知或回访。"
  }
];

const buildInitialConfig = (): Record<string, TemplateConfig> => {
  const result: Record<string, TemplateConfig> = {};
  for (const t of TEMPLATES) {
    const baseOptions =
      t.defaultOptions && t.defaultOptions.length >= 2 ? t.defaultOptions : ["选项一", "选项二"];

    result[t.id] = {
      title: t.defaultTitle,
      description: t.defaultDescription ?? "",
      options: baseOptions,
      titleStyle: {
        align: "left",
        fontSize: 18,
        color: "#111827",
        bold: true,
        italic: false
      },
      descriptionStyle: {
        align: "left",
        fontSize: 13,
        color: "#6b7280",
        bold: false,
        italic: false
      },
      optionStyle: {
        align: "left",
        fontSize: 14,
        color: "#374151",
        bold: false,
        italic: false
      }
    };
  }
  return result;
};

const ComponentMarket: React.FC = () => {
  const navigate = useNavigate();

  const [activeCategoryId, setActiveCategoryId] = React.useState<QuestionCategoryId>("choice");
  const [activeTemplateId, setActiveTemplateId] = React.useState<string>("singleChoice-basic");
  const [configById, setConfigById] = React.useState<Record<string, TemplateConfig>>(() =>
    buildInitialConfig()
  );

  const activeTemplates = React.useMemo(
    () => TEMPLATES.filter((t) => t.categoryId === activeCategoryId),
    [activeCategoryId]
  );

  const activeTemplate =
    TEMPLATES.find((t) => t.id === activeTemplateId) ?? activeTemplates[0] ?? TEMPLATES[0];

  const activeConfig: TemplateConfig = configById[activeTemplate.id] ?? {
    title: activeTemplate.defaultTitle,
    description: activeTemplate.defaultDescription ?? "",
    options:
      activeTemplate.defaultOptions && activeTemplate.defaultOptions.length >= 2
        ? activeTemplate.defaultOptions
        : ["选项一", "选项二"],
    titleStyle: {
      align: "left",
      fontSize: 18,
      color: "#111827",
      bold: true,
      italic: false
    },
    descriptionStyle: {
      align: "left",
      fontSize: 13,
      color: "#6b7280",
      bold: false,
      italic: false
    },
    optionStyle: {
      align: "left",
      fontSize: 14,
      color: "#374151",
      bold: false,
      italic: false
    }
  };

  const handleConfigChange = (patch: Partial<TemplateConfig>) => {
    setConfigById((prev) => ({
      ...prev,
      [activeTemplate.id]: {
        ...activeConfig,
        ...patch
      }
    }));
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <PaperHeader />
        <Content style={{ padding: "24px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Button icon={<LeftOutlined />} onClick={() => navigate("/")}>
              返回主页
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/builder")}>
              模板创建
            </Button>
          </div>

          <Layout className="app-body market-body">
            {/* 左侧：题型分组与列表 */}
            <CategorySider
              categories={CATEGORIES}
              activeCategoryId={activeCategoryId}
              onCategoryChange={setActiveCategoryId}
              templates={TEMPLATES}
              activeTemplateId={activeTemplateId}
              onTemplateChange={setActiveTemplateId}
            />

            {/* 中间：题目实时预览 */}
            <Content className="canvas-wrapper">
              <PreviewPanel
                template={activeTemplate}
                config={activeConfig}
                onConfigChange={handleConfigChange}
              />
            </Content>

            {/* 右侧：配置面板 */}
            <ConfigSider
              template={activeTemplate}
              config={activeConfig}
              onConfigChange={handleConfigChange}
            />
          </Layout>
        </Content>
        <PaperFooter />
      </Layout>
    </div>
  );
};

export default ComponentMarket;
