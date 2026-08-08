import { readFile, realpath } from 'node:fs/promises'
import { isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const LOCAL_CONTENT_ROUTE = '/__local-content__/'
const LOCAL_CONTENT_ROOT = fileURLToPath(new URL('./content-local/', import.meta.url))

function isPathInside(rootPath: string, candidatePath: string): boolean {
  const relativePath = relative(rootPath, candidatePath)
  return relativePath.length > 0 && !relativePath.startsWith('..') && !isAbsolute(relativePath)
}

function localContentPlugin(): Plugin {
  return {
    name: 'witch-archive-local-content',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestUrl = request.url ?? ''
        const rawPath = requestUrl.split('?', 1)[0]
        if (!rawPath.startsWith(LOCAL_CONTENT_ROUTE)) {
          next()
          return
        }

        const sendError = (status: number, message: string) => {
          response.statusCode = status
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.setHeader('Cache-Control', 'no-store')
          response.setHeader('X-Content-Type-Options', 'nosniff')
          response.end(JSON.stringify({ error: message }))
        }

        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.setHeader('Allow', 'GET, HEAD')
          sendError(405, 'Method not allowed.')
          return
        }

        let decodedPath: string
        try {
          decodedPath = decodeURIComponent(rawPath.slice(LOCAL_CONTENT_ROUTE.length)).replaceAll('\\', '/')
        } catch {
          sendError(400, 'Invalid content path.')
          return
        }

        const pathSegments = decodedPath.split('/')
        if (
          pathSegments.some((segment) => segment.length === 0 || segment === '.' || segment === '..') ||
          !decodedPath.toLowerCase().endsWith('.json')
        ) {
          sendError(404, 'Local content file not found.')
          return
        }

        try {
          const contentRoot = await realpath(LOCAL_CONTENT_ROOT)
          const requestedPath = resolve(contentRoot, ...pathSegments)
          if (!isPathInside(contentRoot, requestedPath)) {
            sendError(403, 'Local content path is not allowed.')
            return
          }

          const resolvedFile = await realpath(requestedPath)
          if (!isPathInside(contentRoot, resolvedFile)) {
            sendError(403, 'Local content path is not allowed.')
            return
          }

          const content = await readFile(resolvedFile)
          response.statusCode = 200
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.setHeader('Content-Length', content.byteLength)
          response.setHeader('Cache-Control', 'no-store')
          response.setHeader('X-Content-Type-Options', 'nosniff')
          response.end(request.method === 'HEAD' ? undefined : content)
        } catch {
          sendError(404, 'Local content file not found.')
        }
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [react(), ...(command === 'serve' ? [localContentPlugin()] : [])],
}))
