import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Allows external access (e.g., from Render's environment)
    port: 5000, // Specify the port Render expects (default: 3000)
  },
});
