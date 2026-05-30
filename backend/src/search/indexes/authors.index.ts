// ============================================================
// AUTHORS SEARCH INDEX
// Author search with filtering and ranking
// ============================================================

import { SearchService } from '../search.service';

export interface AuthorDocument {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  website?: string;
  isKYCVerified: boolean;
  totalRevenue: number;
  totalSales: number;
  followers: number;
  rating: number;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const authorsSearch = new SearchService<AuthorDocument>('authors');

export async function initializeAuthorsIndex(): Promise<void> {
  try {
    await authorsSearch.createIndex();
    
    await authorsSearch.updateSettings({
      searchableAttributes: ['name', 'bio', 'tags', 'category'],
      filterableAttributes: ['isKYCVerified', 'category', 'tags'],
      sortableAttributes: ['totalRevenue', 'totalSales', 'followers', 'rating', 'createdAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'totalRevenue:desc',
        'totalSales:desc',
        'rating:desc',
      ],
      displayedAttributes: [
        'id',
        'userId',
        'name',
        'bio',
        'website',
        'isKYCVerified',
        'totalRevenue',
        'totalSales',
        'followers',
        'rating',
        'category',
        'tags',
        'createdAt',
      ],
      stopWords: ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
    });
    
    console.log('Authors search index initialized');
  } catch (error) {
    console.error('Failed to initialize authors index:', error);
    throw error;
  }
}

export async function indexAuthor(author: AuthorDocument): Promise<void> {
  await authorsSearch.addDocuments([author]);
}

export async function indexAuthors(authors: AuthorDocument[]): Promise<void> {
  await authorsSearch.addDocuments(authors);
}

export async function updateAuthorIndex(author: AuthorDocument): Promise<void> {
  await authorsSearch.updateDocuments([author]);
}

export async function removeAuthorFromIndex(authorId: string): Promise<void> {
  await authorsSearch.deleteDocuments([authorId]);
}

export async function searchAuthors(
  query: string,
  options?: {
    isKYCVerified?: boolean;
    category?: string;
    minRevenue?: number;
    minSales?: number;
    minRating?: number;
    sortBy?: 'totalRevenue' | 'totalSales' | 'followers' | 'rating' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }
) {
  const filters: string[] = [];
  
  if (options?.isKYCVerified !== undefined) {
    filters.push(`isKYCVerified = ${options.isKYCVerified}`);
  }
  
  if (options?.category) {
    filters.push(`category = "${options.category}"`);
  }
  
  if (options?.minRevenue !== undefined) {
    filters.push(`totalRevenue >= ${options.minRevenue}`);
  }
  
  if (options?.minSales !== undefined) {
    filters.push(`totalSales >= ${options.minSales}`);
  }
  
  if (options?.minRating !== undefined) {
    filters.push(`rating >= ${options.minRating}`);
  }

  const sort = options?.sortBy ? [`${options.sortBy}:${options.sortOrder || 'desc'}`] : undefined;

  return authorsSearch.search<AuthorDocument>(query, {
    filter: filters.length > 0 ? filters.join(' AND ') : undefined,
    sort,
    limit: options?.limit,
    offset: options?.offset,
  });
}
