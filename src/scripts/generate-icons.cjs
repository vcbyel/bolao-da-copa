const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SOURCE = path.join(__dirname, "..", "..", "public", "logo.png");
const RES_DIR = path.join(__dirname, "..", "..", "android", "app", "src", "main", "res");

const sizes = [
  { dir: "mipmap-mdpi", size: 48 },
  { dir: "mipmap-hdpi", size: 72 },
  { dir: "mipmap-xhdpi", size: 96 },
  { dir: "mipmap-xxhdpi", size: 144 },
  { dir: "mipmap-xxxhdpi", size: 192 },
];

async function generate() {
  console.log(`Gerando icones a partir de: ${SOURCE}`);

  for (const { dir, size } of sizes) {
    const outDir = path.join(RES_DIR, dir);
    fs.mkdirSync(outDir, { recursive: true });

    await sharp(SOURCE)
      .resize(size, size, { fit: "cover" })
      .png()
      .toFile(path.join(outDir, "ic_launcher.png"));

    await sharp(SOURCE)
      .resize(size, size, { fit: "cover" })
      .png()
      .toFile(path.join(outDir, "ic_launcher_round.png"));

    await sharp(SOURCE)
      .resize(size, size, { fit: "cover" })
      .png()
      .toFile(path.join(outDir, "ic_launcher_foreground.png"));

    console.log(`  ${dir} (${size}x${size}) OK`);
  }

  console.log("\nIcones gerados com sucesso!");
}

generate().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});
