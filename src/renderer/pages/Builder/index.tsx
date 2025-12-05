import React from "react";
import PaperFooter from "../../component/PaperFooter";
import PaperHeader from "../../component/PaperHeader";
import { Layout } from "antd";

const Builder: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <PaperHeader />
      <div>Builder Page</div>
      <PaperFooter />
    </Layout>
  );
};
export default Builder;
