import { defineConfig } from 'vite'
import vue              from '@vitejs/plugin-vue'
import { resolve }      from 'path'

export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      // Package entry point
      entry:    resolve(__dirname, 'resources/js/index.js'),
      name:     'GoalCaptcha',
      fileName: (format) => `goal-captcha.${format}.js`,
    },

    rollupOptions: {
      // Vue is a peer dependency — do not bundle it
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },

        // CSS is extracted to goal-captcha.css
        assetFileNames: (info) =>
          info.name === 'style.css' ? 'goal-captcha.css' : info.name,
      },
    },

    // Output to resources/dist — published to public/vendor/goal-captcha
    outDir:        'resources/dist',
    emptyOutDir:   true,
    sourcemap:     true,
    minify:        'esbuild',
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
    },
  },

  test: {
    environment: 'jsdom',
    globals:     true,
  },
})
