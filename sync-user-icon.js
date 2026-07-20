import path from 'path'
import sharp from 'sharp'
import fs from 'fs'

const userIconPath = path.resolve('public/pwa-192x192.png')

async function syncIcons() {
  const tempPath = path.resolve('public/pwa-192x192-temp.png')
  
  // Backup user image
  fs.copyFileSync(userIconPath, tempPath)

  // Generate PNGs for PWA & iOS
  await sharp(tempPath).resize(192, 192, { fit: 'contain', background: { r: 9, g: 23, b: 44, alpha: 1 } }).toFile(userIconPath)
  await sharp(tempPath).resize(512, 512, { fit: 'contain', background: { r: 9, g: 23, b: 44, alpha: 1 } }).toFile('public/pwa-512x512.png')
  await sharp(tempPath).resize(180, 180, { fit: 'contain', background: { r: 9, g: 23, b: 44, alpha: 1 } }).toFile('public/apple-touch-icon.png')
  await sharp(tempPath).resize(64, 64, { fit: 'contain', background: { r: 9, g: 23, b: 44, alpha: 1 } }).toFile('public/favicon.png')

  // Clean temp
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath)
  }

  console.log('All icons resized and synchronized from user pwa-192x192.png!')
}

syncIcons().catch(console.error)
