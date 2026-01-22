export async function getAssetPath(relativePath: string): Promise<string> {
  try {
    if (typeof window !== 'undefined') {
      const protocol = window.location?.protocol || ''
      console.log('[getAssetPath] Current protocol:', protocol, 'electronAPI exists:', !!(window as any).electronAPI)
      
      // If running in a web dev server (http/https), use web-served path
      if (protocol === 'http:' || protocol === 'https:') {
        const webPath = `/${relativePath.replace(/^\//, '')}`
        console.log('[getAssetPath] Web mode:', relativePath, '->', webPath)
        return webPath
      }

      // In Electron (file:// protocol), use custom velo-asset:// protocol
      // This is handled by the main process protocol handler
      if (protocol === 'file:' || (window as any).electronAPI) {
        const assetUrl = `velo-asset:///${relativePath.replace(/^\//, '')}`
        console.log('[getAssetPath] Electron mode:', relativePath, '->', assetUrl)
        return assetUrl
      }
    }
  } catch (err) {
    console.error('[getAssetPath] Error:', err)
  }

  // Fallback
  const fallback = `/${relativePath.replace(/^\//, '')}`
  console.log('[getAssetPath] Fallback:', relativePath, '->', fallback)
  return fallback
}

export default getAssetPath;
