import type { Plugin } from 'vite'
import path from 'node:path'

// A simple Vite plugin that optimizes emitted image assets with sharp during build
// It runs in generateBundle to ensure we only process final assets.

export type SharpOptimizeOptions = {
  include?: (string | RegExp)[]
  exclude?: (string | RegExp)[]
  jpegQuality?: number
  pngQuality?: number // 0-100
  webpQuality?: number
  avifQuality?: number
}

function matches(filename: string, patterns?: (string | RegExp)[]): boolean {
  if (!patterns || patterns.length === 0) return true
  return patterns.some((p) =>
    typeof p === 'string' ? filename.includes(p) : (p as RegExp).test(filename)
  )
}

export default function sharpOptimize(options: SharpOptimizeOptions = {}): Plugin {
  const {
    include,
    exclude,
    jpegQuality = 75,
    pngQuality = 75,
    webpQuality = 75,
    avifQuality = 50,
  } = options

  // lazy require to avoid loading sharp in non-build contexts and allow it to be externalized
  let _sharp: typeof import('sharp') | null = null
  const getSharp = async () => {
    if (!_sharp) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const sharpModule = await import('sharp')
      _sharp = (sharpModule.default ?? sharpModule) as typeof import('sharp')
    }
    return _sharp!
  }

  const imageExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])

  return {
    name: 'jetlinks-sharp-optimize',
    apply: 'build',
    enforce: 'post',
    async generateBundle(_opts, bundle) {
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type !== 'asset') continue
        const ext = path.extname(fileName).toLowerCase()
        if (!imageExts.has(ext)) continue
        if (exclude && matches(fileName, exclude)) continue
        if (include && !matches(fileName, include)) continue

        try {
          const sourceBuffer = Buffer.isBuffer(asset.source)
            ? (asset.source as Buffer)
            : Buffer.from(String(asset.source))

          const sharp = await getSharp()
          let instance = sharp(sourceBuffer)

          switch (ext) {
            case '.jpg':
            case '.jpeg':
              instance = instance.jpeg({ quality: jpegQuality, mozjpeg: true })
              break
            case '.png':
              // sharp png quality maps to zlib level & palette; 0-100
              instance = instance.png({ quality: pngQuality, compressionLevel: 9 })
              break
            case '.webp':
              instance = instance.webp({ quality: webpQuality })
              break
            case '.avif':
              instance = instance.avif({ quality: avifQuality })
              break
            default:
              break
          }

          const optimized = await instance.toBuffer()
          asset.source = optimized
        } catch (err) {
          this.warn(`sharp optimize failed for ${fileName}: ${String(err)}`)
        }
      }
    },
  }
}
