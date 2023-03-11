import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/* eslint-disable import/no-default-export */
export default defineConfig( {
  build: {
    outDir: '../../dist',
    rollupOptions: {
      output: { assetFileNames: `assets/[name][extname]` },
    },
    emptyOutDir: true,
  },
  plugins: [
    react( {
      babel: {
        babelrc: true,
      },
    } ),
    tsconfigPaths(),
  ],
  server: {
    host: true,
    port: 3000,
  },
} );
