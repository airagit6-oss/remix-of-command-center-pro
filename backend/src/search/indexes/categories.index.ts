// ============================================================
// CATEGORIES SEARCH INDEX
// Category search for navigation and filtering
// ============================================================

import { SearchService } from '../search.service';

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

export const categoriesSearch = new SearchService<CategoryDocument>('categories');

export async function initializeCategoriesIndex(): Promise<void> {
  try {
    await categoriesSearch.createIndex();
    
    await categoriesSearch.updateSettings({
      searchableAttributes: ['name', 'description'],
      filterableAttributes: ['parentCategoryId', 'isActive'],
      sortableAttributes: ['productCount', 'order', 'name', 'createdAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'productCount:desc',
      ],
      displayedAttributes: [
        'id',
        'name',
        'slug',
        'description',
        'parentCategoryId',
        'productCount',
        'icon',
        'order',
        'isActive',
        'createdAt',
      ],
    });
    
    console.log('Categories search index initialized');
  } catch (error) {
    console.error('Failed to initialize categories index:', error);
    throw error;
  }
}

export async function indexCategory(category: CategoryDocument): Promise<void> {
  await categoriesSearch.addDocuments([category]);
}

export async function indexCategories(categories: CategoryDocument[]): Promise<void> {
  await categoriesSearch.addDocuments(categories);
}

export async function updateCategoryIndex(category: CategoryDocument): Promise<void> {
  await categoriesSearch.updateDocuments([category]);
}

export async function removeCategoryFromIndex(categoryId: string): Promise<void> {
  await categoriesSearch.deleteDocuments([categoryId]);
}

export async function searchCategories(
  query: string,
  options?: {
    parentCategoryId?: string;
    isActive?: boolean;
    minProductCount?: number;
    sortBy?: 'productCount' | 'order' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }
) {
  const filters: string[] = [];
  
  if (options?.parentCategoryId) {
    filters.push(`parentCategoryId = "${options.parentCategoryId}"`);
  }
  
  if (options?.isActive !== undefined) {
    filters.push(`isActive = ${options.isActive}`);
  }
  
  if (options?.minProductCount !== undefined) {
    filters.push(`productCount >= ${options.minProductCount}`);
  }

  const sort = options?.sortBy ? [`${options.sortBy}:${options.sortOrder || 'desc'}`] : undefined;

  return categoriesSearch.search<CategoryDocument>(query, {
    filter: filters.length > 0 ? filters.join(' AND ') : undefined,
    sort,
    limit: options?.limit,
    offset: options?.offset,
  });
}
