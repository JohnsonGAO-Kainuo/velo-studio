const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const srcSvg = path.resolve(__dirname, '..', 'public', 'vite.svg');
  if (!fs.existsSync(srcSvg)) {
    console.error('Source SVG not found:', srcSvg);
    process.exit(1);
  }

  const outPngDir = path.resolve(__dirname, '..', 'icons', 'icons', 'png');
  if (!fs.existsSync(outPngDir)) fs.mkdirSync(outPngDir, { recursive: true });

  const sizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
  const svgBuffer = fs.readFileSync(srcSvg);

  console.log('Generating PNGs from', srcSvg);
  for (const s of sizes) {
    const outPath = path.join(outPngDir, `${s}x${s}.png`);
    // sharp will rasterize the svg at the requested size
    await sharp(svgBuffer)
      .resize(s, s, { fit: 'contain' })
      .png({ quality: 100 })
      .toFile(outPath);
    console.log('Wrote', outPath);
  }

  // Also update top-level openscreen.png (use 512 if available)
  const openscreenOut = path.resolve(__dirname, '..', 'openscreen.png');
  const src512 = path.join(outPngDir, '512x512.png');
  if (fs.existsSync(src512)) {
    fs.copyFileSync(src512, openscreenOut);
    console.log('Updated', openscreenOut);
  } else {
    await sharp(svgBuffer).resize(512, 512).png({ quality: 100 }).toFile(openscreenOut);
    console.log('Created', openscreenOut);
  }

  console.log('\nPNG icon generation complete.');
  console.log('Next: If you want an .ico/.icns generated automatically, I can install additional tools (png-to-ico and png2icons) and create them.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
