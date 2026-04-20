import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      'react-router-dom': path.resolve(rootDir, 'node_modules/react-router-dom'),
      '@mp-src': path.resolve(rootDir, 'src'),
      '@mp-stories': path.resolve(rootDir, 'src/stories'),
      '@mp-assets': path.resolve(rootDir, 'src/assets')
    }
  },
  define: {
    global: 'globalThis'
  },
  server: {
    fs: {
      allow: [rootDir]
    }
  }
});
