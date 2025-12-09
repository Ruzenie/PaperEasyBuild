import React from "react";
import { Layout, Button, Table, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  CompassOutlined
} from "@ant-design/icons";
import PaperHeader from "@renderer/component/PaperHeader";
import PaperFooter from "@renderer/component/PaperFooter";
import type { QuestionnaireRecord } from "@renderer/db";
import { deleteQuestionnaire, listQuestionnaires } from "@renderer/db";

const { Content } = Layout;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = React.useState<QuestionnaireRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchTemplates = React.useCallback(async () => {
    setLoading(true);
    const records = await listQuestionnaires();
    setTemplates(records);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const columns = [
    {
      title: "创建日期",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: number) => formatTime(value)
    },
    {
      title: "模板名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "题目数",
      key: "questionCount",
      width: 100,
      render: (_: unknown, record: QuestionnaireRecord) => record.questions.length
    },
    {
      title: "最近更新日期",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (value: number) => formatTime(value)
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (_: unknown, record: QuestionnaireRecord) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/builder?id=${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/preview?id=${record.id}`)}
            ghost
          >
            预览
          </Button>
          <Popconfirm
            title="确认删除该模板？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => {
              deleteQuestionnaire(record.id).then(() => {
                message.success("已删除");
                fetchTemplates();
              });
            }}
          >
            <Button type="primary" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PaperHeader />
      <Content style={{ padding: "24px" }}>
        <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/builder")}
            style={{ color: "#fff" }}
          >
            创建模板
          </Button>
          <Button
            icon={<CompassOutlined />}
            color="cyan"
            variant="solid"
            onClick={() => {
              navigate("/market");
            }}
          >
            组件市场
          </Button>
        </div>

        <Table<QuestionnaireRecord>
          bordered
          columns={columns}
          dataSource={templates}
          pagination={false}
          loading={loading}
          rowKey="id"
        />
      </Content>
      <PaperFooter />
    </Layout>
  );
};

export default Home;
