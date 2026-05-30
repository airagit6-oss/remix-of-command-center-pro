// ============================================================
// UPLOAD SERVICE
// Enterprise upload service with validation and processing
// ============================================================

import { productStorage, documentStorage, mediaStorage, UploadOptions } from './storage.service';

export interface UploadValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export class UploadService {
  static validateFile(
    file: Buffer,
    filename: string,
    contentType: string,
    options?: UploadValidationOptions
  ): { valid: boolean; error?: string } {
    const size = file.length;

    // Check file size
    if (options?.maxSize && size > options.maxSize) {
      const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      };
    }

    // Check content type
    if (options?.allowedTypes && !options.allowedTypes.includes(contentType)) {
      return {
        valid: false,
        error: `File type ${contentType} is not allowed`,
      };
    }

    // Check file extension
    if (options?.allowedExtensions) {
      const extension = filename.split('.').pop()?.toLowerCase();
      if (!extension || !options.allowedExtensions.includes(extension)) {
        return {
          valid: false,
          error: `File extension .${extension} is not allowed`,
        };
      }
    }

    return { valid: true };
  }

  static async uploadProductMedia(
    file: Buffer,
    filename: string,
    contentType: string,
    options?: UploadOptions & UploadValidationOptions
  ): Promise<UploadResult> {
    const validation = this.validateFile(file, filename, contentType, options);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const key = this.generateKey(filename, 'products');
    await productStorage.upload(key, file, { contentType, ...options });

    return {
      key,
      url: await productStorage.getPresignedUrl(key),
      size: file.length,
      contentType,
    };
  }

  static async uploadDocument(
    file: Buffer,
    filename: string,
    contentType: string,
    options?: UploadOptions & UploadValidationOptions
  ): Promise<UploadResult> {
    const validation = this.validateFile(file, filename, contentType, options);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const key = this.generateKey(filename, 'documents');
    await documentStorage.upload(key, file, { contentType, ...options });

    return {
      key,
      url: await documentStorage.getPresignedUrl(key),
      size: file.length,
      contentType,
    };
  }

  static async uploadMedia(
    file: Buffer,
    filename: string,
    contentType: string,
    options?: UploadOptions & UploadValidationOptions
  ): Promise<UploadResult> {
    const validation = this.validateFile(file, filename, contentType, options);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const key = this.generateKey(filename, 'media');
    await mediaStorage.upload(key, file, { contentType, ...options });

    return {
      key,
      url: await mediaStorage.getPresignedUrl(key),
      size: file.length,
      contentType,
    };
  }

  static async uploadProductMediaBulk(
    files: Array<{ file: Buffer; filename: string; contentType: string }>,
    options?: UploadOptions & UploadValidationOptions
  ): Promise<UploadResult[]> {
    return Promise.all(
      files.map(({ file, filename, contentType }) =>
        this.uploadProductMedia(file, filename, contentType, options)
      )
    );
  }

  static async deleteProductMedia(key: string): Promise<void> {
    await productStorage.delete(key);
  }

  static async deleteDocument(key: string): Promise<void> {
    await documentStorage.delete(key);
  }

  static async deleteMedia(key: string): Promise<void> {
    await mediaStorage.delete(key);
  }

  static generateKey(filename: string, prefix: string): string {
    const timestamp = Date.now();
    const random = crypto.randomUUID().slice(0, 8);
    const extension = filename.split('.').pop();
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${prefix}/${timestamp}-${random}-${sanitizedName}`;
  }

  static getPresignedUploadUrl(
    filename: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const key = this.generateKey(filename, 'products');
    return productStorage.getPresignedUploadUrl(key, expiresIn, contentType);
  }
}

// Pre-configured validation rules
export const IMAGE_VALIDATION: UploadValidationOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
};

export const DOCUMENT_VALIDATION: UploadValidationOptions = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ],
  allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
};

export const VIDEO_VALIDATION: UploadValidationOptions = {
  maxSize: 500 * 1024 * 1024, // 500MB
  allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  allowedExtensions: ['mp4', 'webm', 'mov'],
};

export const AUDIO_VALIDATION: UploadValidationOptions = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  allowedExtensions: ['mp3', 'wav', 'ogg'],
};
