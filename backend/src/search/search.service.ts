// ============================================================
// SEARCH SERVICE
// Enterprise search service with advanced filtering and ranking
// ============================================================

import { getMeilisearchClient } from './meilisearch.client';

export interface SearchResult<T> {
  hits: T[];
  estimatedTotalHits: number;
  limit: number;
  offset: number;
  processingTimeMs: number;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filter?: string | string[];
  sort?: string[];
  facets?: string[];
  attributesToRetrieve?: string[];
  attributesToHighlight?: string[];
  highlightPreTag?: string;
  highlightPostTag?: string;
  matchingStrategy?: 'all' | 'last';
}

export class SearchService {
  private readonly indexName: string;

  constructor(indexName: string) {
    this.indexName = indexName;
  }

  private getIndex() {
    const client = getMeilisearchClient();
    return client.index(this.indexName);
  }

  async search<T>(query: string, options?: SearchOptions): Promise<SearchResult<T>> {
    try {
      const index = this.getIndex();
      const searchParams: any = {
        q: query,
        limit: options?.limit || 20,
        offset: options?.offset || 0,
      };

      if (options?.filter) {
        searchParams.filter = options.filter;
      }

      if (options?.sort) {
        searchParams.sort = options.sort;
      }

      if (options?.facets) {
        searchParams.facets = options.facets;
      }

      if (options?.attributesToRetrieve) {
        searchParams.attributesToRetrieve = options.attributesToRetrieve;
      }

      if (options?.attributesToHighlight) {
        searchParams.attributesToHighlight = options.attributesToHighlight;
      }

      if (options?.highlightPreTag) {
        searchParams.highlightPreTag = options.highlightPreTag;
      }

      if (options?.highlightPostTag) {
        searchParams.highlightPostTag = options.highlightPostTag;
      }

      if (options?.matchingStrategy) {
        searchParams.matchingStrategy = options.matchingStrategy;
      }

      const results = await index.search<T>(query, searchParams);
      
      return {
        hits: results.hits,
        estimatedTotalHits: results.estimatedTotalHits,
        limit: results.limit,
        offset: results.offset,
        processingTimeMs: results.processingTimeMs,
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        hits: [],
        estimatedTotalHits: 0,
        limit: options?.limit || 20,
        offset: options?.offset || 0,
        processingTimeMs: 0,
      };
    }
  }

  async addDocuments<T>(documents: T[]): Promise<void> {
    try {
      const index = this.getIndex();
      await index.addDocuments(documents);
    } catch (error) {
      console.error('Add documents error:', error);
      throw error;
    }
  }

  async updateDocuments<T>(documents: T[]): Promise<void> {
    try {
      const index = this.getIndex();
      await index.updateDocuments(documents);
    } catch (error) {
      console.error('Update documents error:', error);
      throw error;
    }
  }

  async deleteDocuments(documentIds: string[]): Promise<void> {
    try {
      const index = this.getIndex();
      await index.deleteDocuments(documentIds);
    } catch (error) {
      console.error('Delete documents error:', error);
      throw error;
    }
  }

  async deleteAllDocuments(): Promise<void> {
    try {
      const index = this.getIndex();
      await index.deleteAllDocuments();
    } catch (error) {
      console.error('Delete all documents error:', error);
      throw error;
    }
  }

  async getDocument<T>(documentId: string): Promise<T | null> {
    try {
      const index = this.getIndex();
      return await index.getDocument<T>(documentId);
    } catch (error) {
      console.error('Get document error:', error);
      return null;
    }
  }

  async getDocuments<T>(options?: { limit?: number; offset?: number }): Promise<T[]> {
    try {
      const index = this.getIndex();
      const results = await index.getDocuments<T>(options);
      return results.results;
    } catch (error) {
      console.error('Get documents error:', error);
      return [];
    }
  }

  async updateSettings(settings: any): Promise<void> {
    try {
      const index = this.getIndex();
      await index.updateSettings(settings);
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  async getSettings(): Promise<any> {
    try {
      const index = this.getIndex();
      return await index.getSettings();
    } catch (error) {
      console.error('Get settings error:', error);
      return {};
    }
  }

  async createIndex(): Promise<void> {
    try {
      const client = getMeilisearchClient();
      await client.createIndex(this.indexName);
    } catch (error) {
      console.error('Create index error:', error);
      throw error;
    }
  }

  async deleteIndex(): Promise<void> {
    try {
      const client = getMeilisearchClient();
      await client.deleteIndex(this.indexName);
    } catch (error) {
      console.error('Delete index error:', error);
      throw error;
    }
  }

  async getIndexStats(): Promise<any> {
    try {
      const index = this.getIndex();
      return await index.getStats();
    } catch (error) {
      console.error('Get index stats error:', error);
      return {};
    }
  }
}
