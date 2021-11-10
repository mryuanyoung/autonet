import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hooks': path.resolve('./src/hooks'),
      '@components': path.resolve('./src/components'),
      '@api': path.resolve('./src/api'),
      '@utils': path.resolve('./src/utils'),
    }
  }
})
