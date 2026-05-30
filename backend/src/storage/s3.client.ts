// ============================================================
// S3 CLIENT
// Enterprise-grade S3-compatible object storage client
// ============================================================

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    });
  }

  return s3Client;
}

export function closeS3Client(): void {
  s3Client = null;
}

export function isS3Connected(): boolean {
  return s3Client !== null;
}

export const BUCKETS = {
  PRODUCTS: process.env.S3_BUCKET_PRODUCTS || 'softwarevala-products',
  DOCUMENTS: process.env.S3_BUCKET_DOCUMENTS || 'softwarevala-documents',
  BACKUPS: process.env.S3_BUCKET_BACKUPS || 'softwarevala-backups',
  MEDIA: process.env.S3_BUCKET_MEDIA || 'softwarevala-media',
};
