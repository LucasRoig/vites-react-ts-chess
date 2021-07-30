import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    cors: true,
    proxy: {
      '/api/v1': 'http://localhost:8000'
    }
  }
})
