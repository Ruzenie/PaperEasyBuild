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
    emptyOutDir: true
  },
  base: "./"
});

