import React from "react";
import { Layout, Button, Spin, Empty, Tag, Space, message } from "antd";
import { LeftOutlined, EditOutlined, ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaperHeader from "../../component/PaperHeader";
import PaperFooter from "../../component/PaperFooter";
import QuestionPreview from "@renderer/component/QuestionPreview";
import { getQuestionnaire, getLatestQuestionnaire, type QuestionnaireRecord } from "@renderer/db";
import { PAPER_SIZE_PRESETS } from "../Builder/constants";
import { getQuestionTypeLabel } from "../Builder/utils";
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

  const handleExportPdf = React.useCallback(async () => {
    if (!questionnaire) return;

    const api = window.paperEasyAPI ?? window.electron;
    const exportFn = api?.exportPreviewPdf;

    const suggestedFileName = questionnaire.name || "试卷";
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
      message.error(err.message || "导出 PDF 失败，请重试。");
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
                <div>
                  <div className="preview-title">{questionnaire.name}</div>
                  <div className="preview-meta">
                    {paperSize && (
                      <span>
                        纸张：{paperSize.label}（{paperSize.description}）
                      </span>
                    )}
                    <span>题目数：{questionnaire.questions.length}</span>
                  </div>
                </div>
                <div className="preview-updated">
                  最近更新：{new Date(questionnaire.updatedAt).toLocaleString()}
                </div>
              </div>

              <div className="preview-question-list">
                {questionnaire.questions.length === 0 ? (
                  <Empty description="问卷暂无题目" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  questionnaire.questions.map((q, index) => (
                    <div key={q.id} className="preview-question-card">
                      <div className="preview-question-header">
                        <div className="preview-question-label">
                          <span className="preview-question-index">第 {index + 1} 题</span>
                          <span className="preview-question-type">{getQuestionTypeLabel(q.type)}</span>
                        </div>
                        {q.required && <Tag color="red">必答</Tag>}
                      </div>
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
