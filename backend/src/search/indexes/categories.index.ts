// ============================================================
// CATEGORIES SEARCH INDEX (STUB)
// Category search not implemented
// ============================================================

export interface CategoryDocument {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string;
  productCount: number;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function initializeCategoriesIndex(): Promise<void> {
  // Stub
}

export async function indexCategory(doc: CategoryDocument): Promise<void> {
  // Stub
}

export async function indexCategories(docs: CategoryDocument[]): Promise<void> {
  // Stub
}

export async function updateCategoryIndex(doc: CategoryDocument): Promise<void> {
  // Stub
}

export async function removeCategoryFromIndex(categoryId: string): Promise<void> {
  // Stub
}

export async function searchCategories(query: string): Promise<CategoryDocument[]> {
  return [];
}
