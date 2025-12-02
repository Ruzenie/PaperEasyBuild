import React from "react";
import { Layout, Avatar, Tooltip } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import logo from "../../../assets/PaperEasyBuild.svg";
import { useNavigate } from "react-router-dom";
import "./index.css";

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000000",
  height: 64,
  paddingInline: 48,
  backgroundColor: "#ffffffff",
  borderBottom: "1px solid #e8e8e8",
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

function openGithub() {
  const url = "https://github.com/Ruzenie/PaperEasyBuild";
  try {
    const anyWindow = window as unknown as {
      electron?: { shell?: { openExternal?: (url: string) => void } };
      paperEasyAPI?: { shell?: { openExternal?: (url: string) => void } };
      open: (url: string, target?: string, features?: string) => Window | null;
    };

    const api = anyWindow.electron ?? anyWindow.paperEasyAPI;

    if (api && api.shell && typeof api.shell.openExternal === "function") {
      api.shell.openExternal(url);
    } else {
      anyWindow.open(url, "_blank", "noopener,noreferrer");
    }
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

const PaperHeader: React.FC = () => {
  const navigate = useNavigate();

  const returnRouter = () => {
    navigate("/");
  };

  return (
    <Header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={logo}
          size={40}
          style={{ marginRight: 10, cursor: "pointer" }}
          onClick={returnRouter}
        />
        <span>PaperEasyBuild</span>
      </div>
      <Tooltip title="Github" placement="bottom">
        <GithubOutlined className="github-icon" onClick={openGithub} />
      </Tooltip>
    </Header>
  );
};

export default PaperHeader;
