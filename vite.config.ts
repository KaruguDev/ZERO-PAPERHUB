import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/**
 * Inlines the built stylesheet into each HTML page as a <style> block. The whole
 * stylesheet is ~6 KB gzipped, so shipping it inside the HTML costs less than the
 * render-blocking round trip a separate <link rel="stylesheet"> request adds.
 */
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const page of Object.values(bundle)) {
        if (page.type !== 'asset' || !page.fileName.endsWith('.html')) continue;
        let html = String(page.source);
        for (const [fileName, css] of Object.entries(bundle)) {
          if (css.type !== 'asset' || !fileName.endsWith('.css')) continue;
          const link = new RegExp(`<link rel="stylesheet"[^>]*href="/${fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
          if (!link.test(html)) continue;
          html = html.replace(link, () => `<style>${String(css.source)}</style>`);
          delete bundle[fileName];
        }
        page.source = html;
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), inlineCss()],
    base: '/',
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      // Every browser the site supports runs ES2022 natively; the default target makes
      // Vite down-level syntax and ship transforms Lighthouse reports as legacy JavaScript.
      target: 'es2022',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
  };
});
