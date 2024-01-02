import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  resolve: {
    alias: {
      '@dneroswap/awgmi/core': r('./core/src/index.ts'),
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    setupFiles: ['./core/test/setup.ts'],
  },
})
