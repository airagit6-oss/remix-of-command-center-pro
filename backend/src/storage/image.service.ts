// ============================================================
// IMAGE SERVICE
// Enterprise image optimization and processing service
// ============================================================

import sharp from 'sharp';

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  background?: string;
  progressive?: boolean;
}

export interface ImageVariant {
  name: string;
  width: number;
  height?: number;
  quality: number;
  format: string;
}

export class ImageService {
  static async processImage(
    buffer: Buffer,
    options: ImageProcessingOptions
  ): Promise<Buffer> {
    try {
      let pipeline = sharp(buffer);

      // Resize
      if (options.width || options.height) {
        pipeline = pipeline.resize(options.width, options.height, {
          fit: options.fit || 'cover',
          background: options.background || { r: 255, g: 255, b: 255, alpha: 1 },
        });
      }

      // Convert format
      switch (options.format) {
        case 'jpeg':
          pipeline = pipeline.jpeg({
            quality: options.quality || 80,
            progressive: options.progressive || false,
          });
          break;
        case 'png':
          pipeline = pipeline.png({
            quality: options.quality || 80,
            progressive: options.progressive || false,
          });
          break;
        case 'webp':
          pipeline = pipeline.webp({
            quality: options.quality || 80,
          });
          break;
        case 'avif':
          pipeline = pipeline.avif({
            quality: options.quality || 80,
          });
          break;
        default:
          pipeline = pipeline.jpeg({ quality: options.quality || 80 });
      }

      return await pipeline.toBuffer();
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    }
  }

  static async generateVariants(
    buffer: Buffer,
    variants: ImageVariant[]
  ): Promise<Map<string, Buffer>> {
    const results = new Map<string, Buffer>();

    for (const variant of variants) {
      try {
        const processed = await this.processImage(buffer, {
          width: variant.width,
          height: variant.height,
          quality: variant.quality,
          format: variant.format as any,
        });
        results.set(variant.name, processed);
      } catch (error) {
        console.error(`Failed to generate variant ${variant.name}:`, error);
      }
    }

    return results;
  }

  static async generateThumbnail(
    buffer: Buffer,
    width: number = 200,
    height: number = 200,
    quality: number = 70
  ): Promise<Buffer> {
    return this.processImage(buffer, {
      width,
      height,
      quality,
      format: 'webp',
      fit: 'cover',
    });
  }

  static async optimizeImage(buffer: Buffer, format: 'webp' | 'avif' = 'webp'): Promise<Buffer> {
    return this.processImage(buffer, {
      format,
      quality: 75,
    });
  }

  static async getImageMetadata(buffer: Buffer): Promise<sharp.Metadata> {
    try {
      const metadata = await sharp(buffer).metadata();
      return metadata;
    } catch (error) {
      console.error('Get image metadata error:', error);
      throw error;
    }
  }

  static async getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    const metadata = await this.getImageMetadata(buffer);
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  }

  static async getImageFormat(buffer: Buffer): Promise<string> {
    const metadata = await this.getImageMetadata(buffer);
    return metadata.format || 'unknown';
  }

  static async compressImage(buffer: Buffer, quality: number = 70): Promise<Buffer> {
    const format = await this.getImageFormat(buffer);
    return this.processImage(buffer, {
      quality,
      format: format as any,
    });
  }

  static async convertToWebP(buffer: Buffer, quality: number = 75): Promise<Buffer> {
    return this.processImage(buffer, {
      format: 'webp',
      quality,
    });
  }

  static async convertToAVIF(buffer: Buffer, quality: number = 75): Promise<Buffer> {
    return this.processImage(buffer, {
      format: 'avif',
      quality,
    });
  }
}

// Pre-configured image variants for product images
export const PRODUCT_IMAGE_VARIANTS: ImageVariant[] = [
  { name: 'thumbnail', width: 200, height: 200, quality: 70, format: 'webp' },
  { name: 'small', width: 400, height: 400, quality: 75, format: 'webp' },
  { name: 'medium', width: 800, height: 800, quality: 80, format: 'webp' },
  { name: 'large', width: 1200, height: 1200, quality: 85, format: 'webp' },
  { name: 'original', width: 1920, height: 1920, quality: 90, format: 'webp' },
];

// Pre-configured image variants for author avatars
export const AUTHOR_AVATAR_VARIANTS: ImageVariant[] = [
  { name: 'thumbnail', width: 64, height: 64, quality: 70, format: 'webp' },
  { name: 'small', width: 128, height: 128, quality: 75, format: 'webp' },
  { name: 'medium', width: 256, height: 256, quality: 80, format: 'webp' },
];

// Pre-configured image variants for banners
export const BANNER_IMAGE_VARIANTS: ImageVariant[] = [
  { name: 'mobile', width: 768, height: 400, quality: 75, format: 'webp' },
  { name: 'tablet', width: 1024, height: 500, quality: 80, format: 'webp' },
  { name: 'desktop', width: 1920, height: 600, quality: 85, format: 'webp' },
];
