import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new S3Client({
    endpoint: process.env.HETZNER_S3_ENDPOINT,
    region: "us-east-1", // Hetzner requires a region, though it might be ignored
    credentials: {
        accessKeyId: process.env.HETZNER_S3_ACCESS_KEY,
        secretAccessKey: process.env.HETZNER_S3_SECRET_KEY,
    },
});

const BUCKET = process.env.HETZNER_S3_BUCKET;
const PUBLIC_DIR = path.join(__dirname, "../public");

const IGNORE_DIRS = ["fonts"];
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"];

async function uploadFile(filePath, relativePath) {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: relativePath.replace(/\\/g, "/"), // Ensure S3 uses forward slashes
        Body: fileContent,
        ContentType: contentType,
        ACL: "public-read",
    });

    try {
        await client.send(command);
        console.log(`✅ Uploaded: ${relativePath}`);
    } catch (err) {
        console.error(`❌ Failed to upload ${relativePath}:`, err.message);
    }
}

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case ".png": return "image/png";
        case ".jpg":
        case ".jpeg": return "image/jpeg";
        case ".svg": return "image/svg+xml";
        case ".webp": return "image/webp";
        case ".gif": return "image/gif";
        default: return "application/octet-stream";
    }
}

async function walkDir(dir, baseDir = "") {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const relativePath = path.join(baseDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (IGNORE_DIRS.includes(file)) continue;
            await walkDir(filePath, relativePath);
        } else {
            if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
                await uploadFile(filePath, relativePath);
            }
        }
    }
}

console.log("🚀 Starting image upload to CDN...");
walkDir(PUBLIC_DIR).then(() => {
    console.log("✨ Migration complete!");
}).catch(err => {
    console.error("💥 Migration failed:", err);
});
