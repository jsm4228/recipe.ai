import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT, 10) || 5173, // Parse the port value to a number
  },
});
