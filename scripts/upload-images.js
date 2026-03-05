const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types'); // Need to install this or manually map if missing
require('dotenv').config();

const client = new S3Client({
    endpoint: process.env.HETZNER_S3_ENDPOINT,
    region: 'fsn1',
    credentials: {
        accessKeyId: process.env.HETZNER_S3_ACCESS_KEY,
        secretAccessKey: process.env.HETZNER_S3_SECRET_KEY,
    },
    forcePathStyle: true
});

const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const map = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };
    return map[ext] || 'application/octet-stream';
};

async function uploadFile(localPath, s3Key) {
    try {
        const fileStream = fs.createReadStream(localPath);
        const contentType = getContentType(localPath);
        const command = new PutObjectCommand({
            Bucket: process.env.HETZNER_S3_BUCKET,
            Key: s3Key,
            Body: fileStream,
            ContentType: contentType,
            ACL: 'public-read' // Just to make sure it's publicly readable, depending on bucket config
        });

        await client.send(command);
        console.log(`✅ Uploaded ${localPath} -> ${s3Key}`);
    } catch (error) {
        console.error(`❌ Failed to upload ${localPath}:`, error);
    }
}

async function uploadFolder(dirPath, basePath = '') {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'fonts') { // skip fonts for now unless needed
                await uploadFolder(fullPath, path.join(basePath, file));
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(ext)) {
                // We will upload them under "images/" in the CDN, except if they're already in a folder.
                // Actually, let's just stick them under "images/" exactly like the root.
                // Wait, LogoCarousel uses `${CDN_URL}/logos/IBM.png`. Let's upload root images directly and keep subdirectory names.

                let s3Key = path.join(basePath, file).replace(/\\/g, '/');
                // Specifically for the logos, LogoCarousel expects `/logos/IBM.png`. 
                // Are the logos currently in `public/logos` or just `public/IBM.png`?
                // Earlier `find_by_name` found `IBM.png` directly in `public`.
                // If `LogoCarousel` looks for `/logos/IBM.png`, we can just upload it to `logos/IBM.png`. 
                // To be safe, if a file matches a known logo, we prepend "logos/". 
                const logoFiles = ["GURUDEV.png", "HONEY HERBAL.png", "IBM.png", "KANTI.png", "MATEX.png", "MY GARDEN.png"];
                if (logoFiles.includes(file) && basePath === '') {
                    s3Key = 'logos/' + file;
                }

                await uploadFile(fullPath, s3Key);
            }
        }
    }
}

async function main() {
    const publicDir = path.join(__dirname, '..', 'public');
    console.log(`Scanning ${publicDir}...`);
    await uploadFolder(publicDir);
    console.log('Done uploading images from public directory.');
}

main();
