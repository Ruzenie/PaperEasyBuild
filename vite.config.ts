import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Vite config for the React renderer process
export default defineConfig({
  root: path.resolve(__dirname, "src/renderer"),
  plugins: [react()],
  resolve: {
    alias: {
      "@renderer": path.resolve(__dirname, "src/renderer")
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: path.resolve(__dirname, "dist/renderer"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@ant-design/icons")) {
            return "vendor-ant-icons";
          }
          if (id.includes("rc-")) {
            return "vendor-ant-rc";
          }
          if (id.includes("antd")) {
            return "vendor-antd";
          }
          if (id.includes("react-router")) {
            return "vendor-router";
          }
          if (id.includes("@dnd-kit")) {
            return "vendor-dnd";
          }
          if (id.includes("react") || id.includes("scheduler")) {
            return "vendor-react";
          }
          return "vendor";
        }
      }
    }
  },
  base: "./"
});
