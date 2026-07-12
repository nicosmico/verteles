import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const configXml = path.join(rootDir, 'config.xml');
const wgtPath = path.join(rootDir, 'verteles.wgt');

function main() {
  console.log('📦 Starting Tizen packaging pipeline...');

  // Verify dist folder exists
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: "dist" folder not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Copy config.xml to dist
  console.log('📄 Copying config.xml to dist...');
  fs.copyFileSync(configXml, path.join(distDir, 'config.xml'));

  // If there's an existing wgt, remove it
  if (fs.existsSync(wgtPath)) {
    fs.unlinkSync(wgtPath);
  }

  // Run zip command to package the .wgt
  console.log('⚡ Zipping dist folder into verteles.wgt...');
  try {
    // Zip contents of dist folder from within the dist folder
    execSync('zip -r ../verteles.wgt .', { cwd: distDir, stdio: 'inherit' });
    console.log(`✅ Packaging successful! Widget saved to: ${wgtPath}`);
  } catch (error) {
    console.error('❌ Error zipping package:', error);
    process.exit(1);
  }
}

main();
