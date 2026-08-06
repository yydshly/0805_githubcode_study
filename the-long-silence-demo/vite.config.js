import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  base: './',
  build: {
    outDir: 'site',
  },
  resolve: {
    dedupe: ['three'],
  },
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
});
