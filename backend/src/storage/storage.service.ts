// ============================================================
// STORAGE SERVICE
// Enterprise storage service for file operations
// ============================================================

import { getS3Client, BUCKETS } from './s3.client';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadOptions {
  bucket?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface FileMetadata {
  key: string;
  bucket: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
}

export class StorageService {
  private readonly defaultBucket: string;

  constructor(defaultBucket: string = BUCKETS.PRODUCTS) {
    this.defaultBucket = defaultBucket;
  }

  async upload(
    key: string,
    body: Buffer | string | Uint8Array,
    options?: UploadOptions
  ): Promise<string> {
    try {
      const client = getS3Client();
      const bucket = options?.bucket || this.defaultBucket;

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: options?.contentType || 'application/octet-stream',
        Metadata: options?.metadata,
      });

      await client.send(command);
      return key;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async download(key: string, bucket?: string): Promise<Buffer> {
    try {
      const client = getS3Client();
      const targetBucket = bucket || this.defaultBucket;

      const command = new GetObjectCommand({
        Bucket: targetBucket,
        Key: key,
      });

      const response = await client.send(command);
      
      if (!response.Body) {
        throw new Error('No body in response');
      }

      const chunks: Uint8Array[] = [];
      const stream = response.Body as any;
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  async delete(key: string, bucket?: string): Promise<void> {
    try {
      const client = getS3Client();
      const targetBucket = bucket || this.defaultBucket;

      const command = new DeleteObjectCommand({
        Bucket: targetBucket,
        Key: key,
      });

      await client.send(command);
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  async deleteMultiple(keys: string[], bucket?: string): Promise<void> {
    await Promise.all(keys.map(key => this.delete(key, bucket)));
  }

  async exists(key: string, bucket?: string): Promise<boolean> {
    try {
      await this.download(key, bucket);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getMetadata(key: string, bucket?: string): Promise<FileMetadata | null> {
    try {
      const client = getS3Client();
      const targetBucket = bucket || this.defaultBucket;

      const command = new GetObjectCommand({
        Bucket: targetBucket,
        Key: key,
      });

      const response = await client.send(command);

      return {
        key,
        bucket: targetBucket,
        size: response.ContentLength || 0,
        contentType: response.ContentType || 'application/octet-stream',
        lastModified: response.LastModified || new Date(),
        etag: response.ETag || '',
      };
    } catch (error) {
      console.error('Get metadata error:', error);
      return null;
    }
  }

  async list(prefix: string, bucket?: string): Promise<string[]> {
    try {
      const client = getS3Client();
      const targetBucket = bucket || this.defaultBucket;

      const command = new ListObjectsV2Command({
        Bucket: targetBucket,
        Prefix: prefix,
      });

      const response = await client.send(command);
      
      return response.Contents?.map(obj => obj.Key || '').filter(Boolean) || [];
    } catch (error) {
      console.error('List error:', error);
      return [];
    }
  }

  async getPresignedUrl(
    key: string,
    expiresIn: number = 3600,
    bucket?: string
  ): Promise<string> {
    try {
      const client = getS3Client();
      const targetBucket = bucket || this.defaultBucket;

      const command = new GetObjectCommand({
        Bucket: targetBucket,
        Key: key,
      });

      return await getSignedUrl(client, command, { expiresIn });
    } catch (error) {
      console.error('Get presigned URL error:', error);
      throw error;
    }
  }

  async getPresignedUploadUrl(
    key: string,
    expiresIn: number = 3600,
    contentType?: string,
    bucket?: string
  ): Promise<string> {
    try {
      const client = getS3Client();
      const targetBucket = bucket || this.defaultBucket;

      const command = new PutObjectCommand({
        Bucket: targetBucket,
        Key: key,
        ContentType: contentType,
      });

      return await getSignedUrl(client, command, { expiresIn });
    } catch (error) {
      console.error('Get presigned upload URL error:', error);
      throw error;
    }
  }
}

// Pre-configured storage instances
export const productStorage = new StorageService(BUCKETS.PRODUCTS);
export const documentStorage = new StorageService(BUCKETS.DOCUMENTS);
export const backupStorage = new StorageService(BUCKETS.BACKUPS);
export const mediaStorage = new StorageService(BUCKETS.MEDIA);
