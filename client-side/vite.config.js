import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: true, // Allows external access (e.g., from Render's environment)
    port: 3000, // Specify the port Render expects (default: 3000)
  },
});
