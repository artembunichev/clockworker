import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

/* eslint-disable import/no-default-export */
export default defineConfig({
  build: {
    outDir: '../../dist',
    rollupOptions: {
      output: { assetFileNames: `assets/[name][extname]` },
    },
    emptyOutDir: true,
  },
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
    checker({
      eslint: {
        lintCommand: `eslint ${path.join(__dirname, './src/**/*.{ts,tsx}')}`,
      },
      typescript: { root: './processes/renderer', tsconfigPath: './tsconfig.json' },
      overlay: false,
    }),
    tsconfigPaths(),
  ],
  server: {
    host: true,
    port: 3000,
  },
})
