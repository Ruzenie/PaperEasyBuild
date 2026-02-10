/** 问卷预览页：加载本地问卷并展示排版效果。 */
import React from "react";
import { Layout, Button, Spin, Empty, Space, message } from "antd";
import { LeftOutlined, EditOutlined, ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaperHeader from "../../component/PaperHeader";
import PaperFooter from "../../component/PaperFooter";
import QuestionPreview from "@renderer/component/QuestionPreview";
import QuestionnaireHeader from "@renderer/component/QuestionnaireHeader";
import { getQuestionnaire, getLatestQuestionnaire, type QuestionnaireRecord } from "@renderer/db";
import { PAPER_SIZE_PRESETS } from "../Builder/constants";
import { normalizeQuestionnaireHeader } from "@renderer/config/questionnaireHeader";
import "./index.css";

const { Content } = Layout;

const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questionnaire, setQuestionnaire] = React.useState<QuestionnaireRecord | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [exportingPdf, setExportingPdf] = React.useState(false);

  const loadQuestionnaire = React.useCallback(async () => {
    setLoading(true);
    const id = searchParams.get("id");
    let record: QuestionnaireRecord | undefined;

    try {
      if (id) {
        record = await getQuestionnaire(id);
        if (!record) {
          message.warning("未找到指定的问卷，已为你加载最新的问卷。");
          record = await getLatestQuestionnaire();
        }
      } else {
        record = await getLatestQuestionnaire();
      }

      if (!record) {
        message.info("暂无可预览的问卷，请先创建并保存。");
      }
      setQuestionnaire(record ?? null);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  React.useEffect(() => {
    loadQuestionnaire();
  }, [loadQuestionnaire]);

  const paperSize = questionnaire ? PAPER_SIZE_PRESETS[questionnaire.paperSize] : null;
  const headerConfig = questionnaire ? normalizeQuestionnaireHeader(questionnaire.header) : null;
  const displayTitle =
    questionnaire && headerConfig && headerConfig.title.trim() ? headerConfig.title : questionnaire?.name ?? "未命名问卷";

  const handleExportPdf = React.useCallback(async () => {
    if (!questionnaire) return;

    const api = window.paperEasyAPI ?? window.electron;
    const exportFn = api?.exportPreviewPdf;

    const header = normalizeQuestionnaireHeader(questionnaire.header);
    const titleForFileName = header.title.trim() ? header.title : questionnaire.name;
    const suggestedFileName = titleForFileName.trim() || "试卷";
    const normalizedPaperSize =
      questionnaire.paperSize === "A5" ? "A5" : questionnaire.paperSize === "Letter" ? "Letter" : "A4";

    if (typeof exportFn !== "function") {
      message.info("当前环境不支持一键导出 PDF，将打开打印对话框。");
      window.print();
      return;
    }

    setExportingPdf(true);
    try {
      const result = await exportFn({
        suggestedFileName,
        pageSize: normalizedPaperSize,
        landscape: questionnaire.paperSize === "ExamDouble"
      });

      if (!result.canceled) {
        message.success(`已导出 PDF：${result.filePath}`);
      }
    } catch (error) {
      const err = error as Error;
      const msg = err?.message || "";

      if (msg.includes("No handler registered") && msg.includes("paperEasy:exportPreviewPdf")) {
        message.info("导出服务未就绪，将打开打印对话框。");
        window.print();
        return;
      }

      message.error(msg || "导出 PDF 失败，请重试。");
    } finally {
      setExportingPdf(false);
    }
  }, [questionnaire]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PaperHeader />
      <Content className="preview-content">
        <div className="preview-toolbar">
          <Space>
            <Button icon={<LeftOutlined />} onClick={() => navigate("/")}>
              返回主页
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              disabled={!questionnaire}
              onClick={() => questionnaire && navigate(`/builder?id=${questionnaire.id}`)}
            >
              返回编辑
            </Button>
          </Space>
          <Space>
            <Button
              icon={<DownloadOutlined />}
              disabled={!questionnaire}
              loading={exportingPdf}
              onClick={handleExportPdf}
            >
              下载 PDF
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadQuestionnaire} loading={loading}>
              刷新
            </Button>
          </Space>
        </div>

        {loading ? (
          <div className="preview-loading">
            <Spin size="large" />
          </div>
        ) : !questionnaire ? (
          <div className="preview-empty">
            <Empty description="暂无可预览的问卷" />
          </div>
        ) : (
          <div className="preview-paper-wrapper">
            <div
              className="preview-paper"
              style={{
                width: paperSize ? Math.min(paperSize.width, 1120) : 940
              }}
            >
              <div className="preview-paper-header">
                {headerConfig && (
                  <QuestionnaireHeader
                    title={displayTitle}
                    subtitle={headerConfig.subtitle}
                    titleStyle={headerConfig.titleStyle}
                    subtitleStyle={headerConfig.subtitleStyle}
                  />
                )}
              </div>

              <div className="preview-question-list">
                {questionnaire.questions.length === 0 ? (
                  <Empty description="问卷暂无题目" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  questionnaire.questions.map((q) => (
                    <div key={q.id} className="preview-question-card">
                      <QuestionPreview question={q} disabled={false} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Content>
      <PaperFooter />
    </Layout>
  );
};

export default PreviewPage;
