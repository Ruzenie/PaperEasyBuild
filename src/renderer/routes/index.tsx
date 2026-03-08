import React from "react";
import { createHashRouter, Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";

const BuilderPage = React.lazy(() => import("../pages/Builder"));
const PreviewPage = React.lazy(() => import("../pages/Preview"));
const Home = React.lazy(() => import("../pages/Home"));
const ComponentMarket = React.lazy(() => import("../pages/ComponentMarket"));

const RootLayout: React.FC = () => {
  return <Outlet />;
};

const SuspensePage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense
    fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    }
  >
    {children}
  </React.Suspense>
);

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspensePage>
            <Home />
          </SuspensePage>
        )
      },
      {
        path: "builder",
        element: (
          <SuspensePage>
            <BuilderPage />
          </SuspensePage>
        )
      },
      {
        path: "preview",
        element: (
          <SuspensePage>
            <PreviewPage />
          </SuspensePage>
        )
      },
      {
        path: "market",
        element: (
          <SuspensePage>
            <ComponentMarket />
          </SuspensePage>
        )
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
