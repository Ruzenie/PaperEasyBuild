import React from "react";
import { useNavigate } from "react-router-dom";

const PreviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1>问卷预览</h1>
        <p style={{ color: "#6b7280" }}>这里将展示根据 schema 渲染出的问卷预览。</p>
        <p style={{ fontSize: "0.85rem", marginTop: "1rem" }}>
          TODO: 从 Dexie / Redux 获取当前问卷，再渲染给受访者填写
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: "2rem" }}
          onClick={() => navigate("/")}
        >
          返回编辑器
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;

