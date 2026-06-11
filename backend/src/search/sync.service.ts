// ============================================================
// SEARCH SYNC SERVICE (STUB)
// Minimal stub - Search indexes not implemented
// ============================================================

export class SearchSyncService {
  static async syncProduct(productId: string): Promise<void> {
    // Stub
  }

  static async syncAllProducts(): Promise<void> {
    // Stub
  }

  static async syncAuthor(authorId: string): Promise<void> {
    // Stub
  }

  static async syncAllAuthors(): Promise<void> {
    // Stub
  }

  static async syncCategory(categoryId: string): Promise<void> {
    // Stub
  }

  static async syncAllCategories(): Promise<void> {
    // Stub
  }

  static async syncAll(): Promise<void> {
    // Stub
  }

  static handleProductCreated(productId: string): Promise<void> {
    return Promise.resolve();
  }

  static handleProductUpdated(productId: string): Promise<void> {
    return Promise.resolve();
  }

  static handleProductDeleted(productId: string): Promise<void> {
    return Promise.resolve();
  }

  static handleAuthorCreated(authorId: string): Promise<void> {
    return Promise.resolve();
  }

  static handleAuthorUpdated(authorId: string): Promise<void> {
    return Promise.resolve();
  }

  static handleAuthorDeleted(authorId: string): Promise<void> {
    return Promise.resolve();
  }
}
