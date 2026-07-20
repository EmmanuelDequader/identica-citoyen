import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect x="4" y="4" width="120" height="120" rx="30" fill="#09172c" stroke="#1c2f4c" stroke-width="2"/>
  <g transform="translate(28, 28) scale(3)" stroke="#00e58b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M12 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-7 0V15"/>
    <path d="M17 14.5a8.5 8.5 0 0 1-8.5 8.5"/>
    <path d="M12 10c-2.8 0-5 2.2-5 5v2a9 9 0 0 0 9 9"/>
    <path d="M12 10c-5 0-9 4-9 9v.5"/>
    <path d="M12 10c5 0 9 4 9 9v.5"/>
  </g>
  <circle cx="110" cy="18" r="10" fill="#00e58b" stroke="#09172c" stroke-width="3"/>
</svg>`

const publicDir = path.resolve('public')

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent)
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.svg'), svgContent)
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.svg'), svgContent)

async function generatePngs() {
  const svgBuffer = Buffer.from(svgContent)
  
  await sharp(svgBuffer).resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'))
  await sharp(svgBuffer).resize(192, 192).toFile(path.join(publicDir, 'pwa-192x192.png'))
  await sharp(svgBuffer).resize(512, 512).toFile(path.join(publicDir, 'pwa-512x512.png'))

  console.log('Icons generated successfully!')
}

generatePngs().catch(console.error)
