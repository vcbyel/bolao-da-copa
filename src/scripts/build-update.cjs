const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const DIST_DIR = path.join(ROOT, "dist");
const OUTPUT_DIR = path.join(ROOT, "public", "updates");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "update.zip");
const MANIFEST_FILE = path.join(ROOT, "public", "manifest.json");

function buildUpdate() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  if (fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE);
  }

  console.log("Criando bundle de update...");
  execSync(
    `powershell -Command "Compress-Archive -Path '${DIST_DIR}\\*' -DestinationPath '${OUTPUT_FILE}' -Force"`,
    { stdio: "inherit" }
  );

  const stats = fs.statSync(OUTPUT_FILE);
  const size = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`Bundle criado: ${OUTPUT_FILE} (${size} MB)`);
}

function updateManifest(version) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  manifest.version = version;
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Manifest atualizado: versao ${version}`);
}

function main() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(ROOT, "package.json"), "utf8")
  );
  const version = pkg.version;
  console.log(`Versao do app: ${version}`);

  buildUpdate();
  updateManifest(version);

  console.log("\nProximos passos:");
  console.log("1. Faca deploy no Vercel (git push)");
  console.log("2. Os usuarios receberao a atualizacao automaticamente");
}

main();
