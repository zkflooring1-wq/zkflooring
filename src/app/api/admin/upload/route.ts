import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Validate R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'zkboost';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

let s3Client: S3Client | null = null;
if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function POST(request: Request) {
  try {
    if (!s3Client) {
      return NextResponse.json({ error: 'R2 is not configured on the server.' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Generate safe unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${folder}/${uniqueSuffix}-${originalName}`;

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return the public URL
    const publicUrl = `${R2_PUBLIC_URL}/${filename}`;

    return NextResponse.json({ success: true, url: publicUrl, path: filename });
  } catch (error: any) {
    console.error('R2 Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file to R2.', details: error.message }, { status: 500 });
  }
}
