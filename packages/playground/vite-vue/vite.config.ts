import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/tbc-nest": {
        target: "http://21tb-vuelibrary.21tb.com/tbc-nest",
        changeOrigin: true,
      },
      "/login": {
        target: "http://cloud.21tb.com",
        changeOrigin: true,
      },
    },
  },
});
