import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Load env vars manually to avoid dotenv dependency
const envFile = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
for (const line of envFile.split("\n")) {
  if (line.includes("=") && !line.startsWith("#")) {
    const [key, ...rest] = line.split("=");
    process.env[key.trim()] = rest.join("=").trim();
  }
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

const FRONTEND_PUBLIC_DIR = "d:\\Web_Apps\\ZK Flooring\\zkflooring\\public";

const validExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"]);

const getMimeType = (ext: string) => {
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif"
  };
  return map[ext] || "application/octet-stream";
};

async function uploadFile(filePath: string, relativePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (!validExtensions.has(ext)) return;

  const contentType = getMimeType(ext);
  
  // Clean up key path (R2 uses forward slashes)
  // Prefixing with "frontend/" to keep them organized
  const key = `frontend/${relativePath.replace(/\\/g, "/")}`;

  try {
    const body = fs.readFileSync(filePath);
    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
    console.log(`✅ Uploaded: ${key}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${key}:`, err);
  }
}

async function processDirectory(dir: string, baseDir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Ignore node_modules, .git, etc just in case
    if (entry.name.startsWith(".")) continue;

    if (entry.isDirectory()) {
      await processDirectory(fullPath, baseDir);
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      await uploadFile(fullPath, relativePath);
    }
  }
}

async function run() {
  console.log("Starting upload of frontend media to R2...");
  await processDirectory(FRONTEND_PUBLIC_DIR, FRONTEND_PUBLIC_DIR);
  console.log("Upload complete! Now calling the sync endpoint...");

  // Trigger sync endpoint to update Supabase
  try {
    const res = await fetch("http://localhost:3001/api/media/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ force: false }), 
    });
    const data = await res.json();
    console.log("Sync Response:", data);
  } catch (err) {
    console.error("Failed to call sync endpoint", err);
  }
}

run();
