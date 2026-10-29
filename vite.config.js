import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Production builds are served from https://<server>/treasure_hunt/ (see deploy/README.md).
// Set BASE_PATH (e.g. BASE_PATH=/ npm run build) to serve from somewhere else.
const DEPLOY_BASE = '/treasure_hunt/'

const normalizeBase = (path) => `/${path.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: process.env.BASE_PATH
    ? normalizeBase(process.env.BASE_PATH)
    : command === 'build' || isPreview
      ? DEPLOY_BASE
      : '/',
  plugins: [react()],
}))
