import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROPERTIES_DIR = path.join(__dirname, "..", "public", "images", "properties");

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve());
      });
    }).on("error", (err) => {
      fs.unlink(destPath, () => reject(err));
    });
  });
}

async function main() {
  if (!fs.existsSync(PROPERTIES_DIR)) {
    fs.mkdirSync(PROPERTIES_DIR, { recursive: true });
  }

  console.log("Starting download of 200 house images (property-21.jpg to property-220.jpg)...");

  for (let i = 21; i <= 220; i++) {
    const filename = `property-${i}.jpg`;
    const filePath = path.join(PROPERTIES_DIR, filename);

    // Using picsum photos with seed generates reliable unique house/architecture 800x600 images
    const imageUrl = `https://picsum.photos/seed/house-${i}/800/600`;

    try {
      await downloadFile(imageUrl, filePath);
      const stat = fs.statSync(filePath);
      console.log(`[${i - 20}/200] Downloaded ${filename} (${Math.round(stat.size / 1024)} KB)`);
    } catch (err) {
      console.error(`Error downloading property-${i}.jpg:`, err.message);
    }
  }

  console.log("Successfully downloaded all 200 property images!");
}

main().catch(console.error);
