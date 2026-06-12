import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      "/static": "http://localhost:8000",
    },
    // Allow ngrok tunnels for external testing. Without this Vite returns
    // "Blocked request. This host is not allowed." for the public URL.
    allowedHosts: [
      ".ngrok-free.app",
      ".ngrok-free.dev",
      ".ngrok.app",
      ".ngrok.io",
      ".ngrok.dev",
    ],
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
