import fs from 'fs'
import path from 'path'

const pngBuffer = fs.readFileSync(path.resolve('public/pwa-192x192.png'))
const base64Data = pngBuffer.toString('base64')
const dataUri = `data:image/png;base64,${base64Data}`

const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <image href="${dataUri}" width="192" height="192"/>
</svg>`

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="${dataUri}" width="512" height="512"/>
</svg>`

const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <image href="${dataUri}" width="128" height="128"/>
</svg>`

fs.writeFileSync(path.resolve('public/pwa-192x192.svg'), svg192)
fs.writeFileSync(path.resolve('public/pwa-512x512.svg'), svg512)
fs.writeFileSync(path.resolve('public/favicon.svg'), svgFavicon)

console.log('SVG files updated with exact user PNG logo!')
