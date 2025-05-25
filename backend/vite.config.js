import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const serverBaseURL = "http://localhost:300";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": serverBaseURL,
      "/profile": serverBaseURL,
      "/explore": serverBaseURL,
      "/course": serverBaseURL,
    },
  },
});
