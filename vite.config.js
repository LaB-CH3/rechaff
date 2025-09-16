import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // project root
  build: {
    lib: {
      entry: {
        Auth: path.resolve(__dirname, 'src/auth.js'),
        // add more modules here
      },
      name: 'ReChaff', // global name if used via <script>
      formats: ['es'], // output as ESM
      fileName: (format, entryName) => `${entryName}.js`, // keep separate files
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 5174,
    strictPort: true,
  },
});
