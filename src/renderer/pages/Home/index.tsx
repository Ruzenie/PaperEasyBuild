import React from "react";
import { Layout, Button, Table, Space, Popconfirm } from "antd";
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
import type { TemplateRecord } from "@renderer/type/Home";

const { Content } = Layout;

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = React.useState<TemplateRecord[]>([
    {
      key: "1",
      createdAt: "2025-01-01 10:00",
      name: "用户满意度调查",
      questionCount: 10,
      updatedAt: "2025-01-02 09:30"
    },
    {
      key: "2",
      createdAt: "2025-01-03 14:20",
      name: "产品功能反馈",
      questionCount: 8,
      updatedAt: "2025-01-04 11:15"
    }
  ]);

  const columns = [
    {
      title: "创建日期",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180
    },
    {
      title: "模板名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "题目数",
      dataIndex: "questionCount",
      key: "questionCount",
      width: 100
    },
    {
      title: "最近更新日期",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (_: unknown, record: TemplateRecord) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate("/builder")}>
            编辑
          </Button>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate("/preview")} ghost>
            预览
          </Button>
          <Popconfirm
            title="确认删除该模板？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => {
              setTemplates((prev) => prev.filter((item) => item.key !== record.key));
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
            onClick={() => {
              navigate("/market");
            }}
          >
            组件市场
          </Button>
        </div>

        <Table<TemplateRecord>
          bordered
          columns={columns}
          dataSource={templates}
          pagination={false}
        />
      </Content>
      <PaperFooter />
    </Layout>
  );
};

export default Home;
