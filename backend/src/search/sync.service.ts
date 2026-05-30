// ============================================================
// SEARCH SYNC SERVICE
// Synchronizes database data with search indexes
// ============================================================

import { PrismaClient } from '@prisma/client';
import { 
  indexProduct, 
  indexProducts, 
  updateProductIndex, 
  removeProductFromIndex,
  ProductDocument 
} from './indexes/products.index';
import { 
  indexAuthor, 
  indexAuthors, 
  updateAuthorIndex, 
  removeAuthorFromIndex,
  AuthorDocument 
} from './indexes/authors.index';
import { 
  indexCategory, 
  indexCategories, 
  updateCategoryIndex, 
  removeCategoryFromIndex,
  CategoryDocument 
} from './indexes/categories.index';

const prisma = new PrismaClient();

export class SearchSyncService {
  // Product sync
  static async syncProduct(productId: string): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { author: true },
    });

    if (!product) {
      await removeProductFromIndex(productId);
      return;
    }

    const document: ProductDocument = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category || '',
      tags: product.tags,
      price: parseFloat(product.price.toString()),
      rating: parseFloat(product.rating.toString()),
      reviews: product.reviews,
      sales: product.sales,
      authorId: product.authorId,
      authorName: product.author.user.name,
      status: product.status,
      publishedAt: product.publishedAt?.toISOString() || '',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    await updateProductIndex(document);
  }

  static async syncAllProducts(): Promise<void> {
    const products = await prisma.product.findMany({
      include: { author: true },
      where: { status: 'PUBLISHED' },
    });

    const documents: ProductDocument[] = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category || '',
      tags: product.tags,
      price: parseFloat(product.price.toString()),
      rating: parseFloat(product.rating.toString()),
      reviews: product.reviews,
      sales: product.sales,
      authorId: product.authorId,
      authorName: product.author.user.name,
      status: product.status,
      publishedAt: product.publishedAt?.toISOString() || '',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    await indexProducts(documents);
  }

  // Author sync
  static async syncAuthor(authorId: string): Promise<void> {
    const author = await prisma.authorProfile.findUnique({
      where: { id: authorId },
      include: { user: true },
    });

    if (!author) {
      await removeAuthorFromIndex(authorId);
      return;
    }

    const document: AuthorDocument = {
      id: author.id,
      userId: author.userId,
      name: author.user.name,
      bio: author.bio || undefined,
      website: author.website || undefined,
      isKYCVerified: author.isKYCVerified,
      totalRevenue: parseFloat(author.totalRevenue.toString()),
      totalSales: author.totalSales,
      followers: author.followers,
      rating: parseFloat(author.rating.toString()),
      createdAt: author.createdAt.toISOString(),
      updatedAt: author.updatedAt.toISOString(),
    };

    await updateAuthorIndex(document);
  }

  static async syncAllAuthors(): Promise<void> {
    const authors = await prisma.authorProfile.findMany({
      include: { user: true },
    });

    const documents: AuthorDocument[] = authors.map(author => ({
      id: author.id,
      userId: author.userId,
      name: author.user.name,
      bio: author.bio || undefined,
      website: author.website || undefined,
      isKYCVerified: author.isKYCVerified,
      totalRevenue: parseFloat(author.totalRevenue.toString()),
      totalSales: author.totalSales,
      followers: author.followers,
      rating: parseFloat(author.rating.toString()),
      createdAt: author.createdAt.toISOString(),
      updatedAt: author.updatedAt.toISOString(),
    }));

    await indexAuthors(documents);
  }

  // Category sync
  static async syncCategory(categoryId: string): Promise<void> {
    // Note: Categories are not in the current schema, this is a placeholder
    // for when categories are added as a separate model
    console.log(`Sync category ${categoryId} - not implemented yet`);
  }

  static async syncAllCategories(): Promise<void> {
    // Note: Categories are not in the current schema, this is a placeholder
    // for when categories are added as a separate model
    console.log('Sync all categories - not implemented yet');
  }

  // Full sync
  static async syncAll(): Promise<void> {
    await Promise.all([
      this.syncAllProducts(),
      this.syncAllAuthors(),
      this.syncAllCategories(),
    ]);
  }

  // Real-time sync handlers
  static handleProductCreated(productId: string): Promise<void> {
    return this.syncProduct(productId);
  }

  static handleProductUpdated(productId: string): Promise<void> {
    return this.syncProduct(productId);
  }

  static handleProductDeleted(productId: string): Promise<void> {
    return removeProductFromIndex(productId);
  }

  static handleAuthorCreated(authorId: string): Promise<void> {
    return this.syncAuthor(authorId);
  }

  static handleAuthorUpdated(authorId: string): Promise<void> {
    return this.syncAuthor(authorId);
  }

  static handleAuthorDeleted(authorId: string): Promise<void> {
    return removeAuthorFromIndex(authorId);
  }
}
