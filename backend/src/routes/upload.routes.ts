import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UploadService } from '../storage/upload.service';
import { ImageService } from '../storage/image.service';

const prisma = new PrismaClient();

// POST /upload/product-media
export async function uploadProductMedia(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const productId = (req.params as any).id;
    
    // Verify user is author of the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { author: true }
    });

    if (!product) {
      return reply.status(404).send({ error: 'Product not found' });
    }

    if (product.author.userId !== userId) {
      return reply.status(403).send({ error: 'You do not own this product' });
    }

    // Handle file upload
    const data = await req.file();
    
    if (!data) {
      return reply.status(400).send({ error: 'No file provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'application/pdf'];
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({ error: 'Invalid file type' });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (data.file && data.file.bytesRead > maxSize) {
      return reply.status(400).send({ error: 'File too large (max 10MB)' });
    }

    // Upload file
    const uploadResult = await UploadService.uploadProductMedia(data.file, data.filename, data.mimetype);

    // Create media record
    const media = await prisma.productMedia.create({
      data: {
        productId,
        type: data.mimetype.startsWith('image/') ? 'IMAGE' : data.mimetype.startsWith('video/') ? 'VIDEO' : 'DOCUMENT',
        url: uploadResult.url,
        alt: data.filename
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPLOAD_MEDIA',
        entity: 'ProductMedia',
        entityId: media.id,
        changes: { productId, url: uploadResult.url }
      }
    });

    reply.status(201).send(media);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to upload media' });
  }
}

// POST /upload/document
export async function uploadDocument(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    // Handle file upload
    const data = await req.file();
    
    if (!data) {
      return reply.status(400).send({ error: 'No file provided' });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({ error: 'Invalid file type' });
    }

    // Validate file size (max 5MB for documents)
    const maxSize = 5 * 1024 * 1024;
    if (data.file && data.file.bytesRead > maxSize) {
      return reply.status(400).send({ error: 'File too large (max 5MB)' });
    }

    // Upload file
    const uploadResult = await UploadService.uploadDocument(data.file, data.filename, data.mimetype);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPLOAD_DOCUMENT',
        entity: 'Document',
        entityId: uploadResult.key,
        changes: { filename: data.filename }
      }
    });

    reply.status(201).send({
      url: uploadResult.url,
      key: uploadResult.key,
      filename: data.filename
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to upload document' });
  }
}

// POST /upload/kyc-document
export async function uploadKYCDocument(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    // Handle file upload
    const data = await req.file();
    
    if (!data) {
      return reply.status(400).send({ error: 'No file provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(data.mimetype)) {
      return reply.status(400).send({ error: 'Invalid file type' });
    }

    // Validate file size (max 5MB for KYC documents)
    const maxSize = 5 * 1024 * 1024;
    if (data.file && data.file.bytesRead > maxSize) {
      return reply.status(400).send({ error: 'File too large (max 5MB)' });
    }

    // Upload file
    const uploadResult = await UploadService.uploadDocument(data.file, data.filename, data.mimetype);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPLOAD_KYC_DOCUMENT',
        entity: 'KYCDocument',
        entityId: uploadResult.key,
        changes: { filename: data.filename }
      }
    });

    reply.status(201).send({
      url: uploadResult.url,
      key: uploadResult.key,
      filename: data.filename
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to upload KYC document' });
  }
}

// POST /upload/image-optimize
export async function optimizeImage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { imageUrl, width, height, quality, format } = req.body as any;
    
    if (!imageUrl) {
      return reply.status(400).send({ error: 'Image URL is required' });
    }

    // Optimize image
    const optimizedResult = await ImageService.processImage(imageUrl, {
      width: width || 800,
      height: height || 600,
      quality: quality || 85,
      format: format || 'webp'
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'OPTIMIZE_IMAGE',
        entity: 'Image',
        entityId: optimizedResult.key,
        changes: { originalUrl: imageUrl, optimizedUrl: optimizedResult.url }
      }
    });

    reply.send(optimizedResult);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to optimize image' });
  }
}

// DELETE /upload/:key
export async function deleteUpload(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { key } = req.params as any;
    
    // Delete from storage
    await UploadService.deleteDocument(key);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE_UPLOAD',
        entity: 'Upload',
        entityId: key,
        changes: { key }
      }
    });

    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete upload' });
  }
}

export function uploadRoutes(fastify: FastifyInstance) {
  fastify.post('/upload/product-media/:id', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, uploadProductMedia);
  fastify.post('/upload/document', { preHandler: [fastify.authenticate] }, uploadDocument);
  fastify.post('/upload/kyc-document', { preHandler: [fastify.authenticate] }, uploadKYCDocument);
  fastify.post('/upload/image-optimize', { preHandler: [fastify.authenticate] }, optimizeImage);
  fastify.delete('/upload/:key', { preHandler: [fastify.authenticate] }, deleteUpload);
}
