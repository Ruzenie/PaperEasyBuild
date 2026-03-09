import React from "react";
import { Layout, Button, Space, Table, Drawer, Empty, Spin, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaperHeader from "@renderer/component/PaperHeader";
import PaperFooter from "@renderer/component/PaperFooter";
import { getQuestionnaire, listSubmissions, type SubmissionRecord } from "@renderer/db";
import { formatAnswerValue } from "@renderer/pages/Preview/utils";
import "./index.css";

const { Content } = Layout;

const formatTime = (timestamp: number): string => new Date(timestamp).toLocaleString();

const SubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionnaireId = searchParams.get("questionnaireId")?.trim() || undefined;

  const [loading, setLoading] = React.useState(false);
  const [questionnaireName, setQuestionnaireName] = React.useState<string>("");
  const [submissions, setSubmissions] = React.useState<SubmissionRecord[]>([]);
  const [activeSubmission, setActiveSubmission] = React.useState<SubmissionRecord | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [records, questionnaire] = await Promise.all([
        listSubmissions(questionnaireId),
        questionnaireId ? getQuestionnaire(questionnaireId) : Promise.resolve(undefined)
      ]);
      setSubmissions(records);
      setQuestionnaireName(questionnaire?.name ?? "");
    } catch (error) {
      const msg = error instanceof Error && error.message ? error.message : "加载提交记录失败";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  }, [questionnaireId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const columns: ColumnsType<SubmissionRecord> = [
    {
      title: "提交时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (value: number) => formatTime(value)
    },
    {
      title: "问卷名称",
      dataIndex: "questionnaireName",
      key: "questionnaireName"
    },
    {
      title: "作答进度",
      key: "progress",
      width: 150,
      render: (_, record) => `${record.answeredQuestions}/${record.totalQuestions}`
    },
    {
      title: "操作",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => setActiveSubmission(record)}>
          查看详情
        </Button>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PaperHeader />
      <Content className="submissions-content">
        <div className="submissions-toolbar">
          <Space>
            <Button icon={<LeftOutlined />} onClick={() => navigate("/")}>
              返回主页
            </Button>
            {questionnaireId && (
              <Button onClick={() => navigate("/submissions")}>查看全部记录</Button>
            )}
            <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              刷新
            </Button>
          </Space>
          <Space>
            {questionnaireId ? (
              <Tag color="blue">当前筛选: {questionnaireName || questionnaireId}</Tag>
            ) : (
              <Tag>当前筛选: 全部问卷</Tag>
            )}
          </Space>
        </div>

        {loading ? (
          <div className="submissions-loading">
            <Spin size="large" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="submissions-empty">
            <Empty description="暂无提交记录" />
          </div>
        ) : (
          <Table<SubmissionRecord>
            bordered
            rowKey="id"
            columns={columns}
            dataSource={submissions}
            pagination={{ pageSize: 10 }}
          />
        )}

        <Drawer
          title={activeSubmission ? `提交详情 · ${activeSubmission.questionnaireName}` : "提交详情"}
          open={!!activeSubmission}
          width={560}
          onClose={() => setActiveSubmission(null)}
        >
          {!activeSubmission ? null : activeSubmission.questionSnapshot.length === 0 ? (
            <Empty description="暂无题目快照" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <div className="submission-detail-list">
              <div className="submission-detail-meta">提交时间: {formatTime(activeSubmission.createdAt)}</div>
              {activeSubmission.questionSnapshot.map((question, index) => {
                const answer = formatAnswerValue(activeSubmission.answers[question.id]);
                return (
                  <div key={question.id} className="submission-detail-item">
                    <div className="submission-detail-title">
                      {question.required ? <span className="submission-required">*</span> : null}
                      <span>{`第 ${index + 1} 题 · ${question.title || "未命名题目"}`}</span>
                    </div>
                    <div className="submission-detail-answer">{answer}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Drawer>
      </Content>
      <PaperFooter />
    </Layout>
  );
};

export default SubmissionsPage;
