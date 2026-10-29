import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Production builds are served from https://<server>/treasure_hunt/ (see deploy/README.md).
// Set BASE_PATH (e.g. BASE_PATH=/ npm run build) to serve from somewhere else.
const DEPLOY_BASE = '/treasure_hunt/'

const normalizeBase = (path) => `/${path.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

/**
 * The game posts wins to <base>api/certificate. On the server nginx forwards that to the
 * Rajyotsav certificate API; locally these settings decide what answers it:
 *   (default)       a stand-in that returns a sample QR, so testing creates no real certificates
 *   CERT_API=fail   the stand-in answers 503, to try the error and Retry state
 *   CERT_API=real   forward to the real API (each win then creates a real PDF on their server)
 */
const CERT_API = process.env.CERT_API || 'mock'
const CERT_API_URL = process.env.CERT_API_URL || 'https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate'
const CERT_PATH = /\/api\/certificate$/

const SAMPLE_QR =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" shape-rendering="crispEdges"><rect width="29" height="29" fill="#fff"/>` +
      [[2, 2], [20, 2], [2, 20]].map(([x, y]) => `<path d="M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z" fill="#000" fill-rule="evenodd"/>`).join('') +
      `<text x="14.5" y="16" font-size="3.4" font-family="sans-serif" text-anchor="middle" fill="#b4442f">SAMPLE</text></svg>`
  ).toString('base64')

function certificateStandIn() {
  const handle = (req, res, next) => {
    if (!CERT_PATH.test(req.url.split('?')[0])) return next()
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      setTimeout(() => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('{"message":"POST only"}')
        }
        if (CERT_API === 'fail') {
          res.statusCode = 503
          return res.end('{"message":"Stand-in failure (CERT_API=fail)"}')
        }
        const { username = '', gameName = '', timeTaken = '' } = JSON.parse(body || '{}')
        console.log(`[certificate stand-in] ${gameName} · ${username} · ${timeTaken}`)
        res.end(
          JSON.stringify({
            message: 'Certificate generated (local stand-in)',
            certificateUrl: 'https://example.invalid/sample-certificate.pdf',
            qrCode: SAMPLE_QR
          })
        )
      }, 900)
    })
  }
  // Block bodies on purpose: a function returned from these hooks would be run as a post-hook
  return {
    name: 'certificate-stand-in',
    configureServer(server) {
      server.middlewares.use(handle)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle)
    }
  }
}

const realApiProxy = () => {
  const target = new URL(CERT_API_URL)
  return {
    '^.*/api/certificate$': { target: target.origin, changeOrigin: true, rewrite: () => target.pathname }
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: process.env.BASE_PATH
    ? normalizeBase(process.env.BASE_PATH)
    : command === 'build' || isPreview
      ? DEPLOY_BASE
      : '/',
  plugins: [react(), ...(CERT_API === 'real' ? [] : [certificateStandIn()])],
  server: CERT_API === 'real' ? { proxy: realApiProxy() } : {},
  preview: CERT_API === 'real' ? { proxy: realApiProxy() } : {},
}))
