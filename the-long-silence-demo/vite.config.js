import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  resolve: {
    dedupe: ['three'],
  },
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
});
