import React from "react";
import { createHashRouter, Navigate, Outlet } from "react-router-dom";
import BuilderPage from "../pages/Builder";
import PreviewPage from "../pages/Preview";
import Home  from "../pages/Home";

const RootLayout: React.FC = () => {
  return <Outlet />;
};

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "builder",
        element: <BuilderPage />
      },
      {
        path: "preview",
        element: <PreviewPage />
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);
