import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Served from https://nathanwbailey.github.io/carbon_tracking_mcp/
export default defineConfig({
  base: "/carbon_tracking_mcp/",
  plugins: [react()],
});
