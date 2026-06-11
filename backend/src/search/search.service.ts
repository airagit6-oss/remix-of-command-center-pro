// ============================================================
// SEARCH SERVICE (STUB)
// Search service not implemented
// ============================================================

export interface SearchResult {
  hits: any[];
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

  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    return {
      hits: [],
      estimatedTotalHits: 0,
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      processingTimeMs: 0,
    };
  }

  async addDocuments(documents: any[]): Promise<void> {
    // Stub
  }

  async updateDocuments(documents: any[]): Promise<void> {
    // Stub
  }

  async deleteDocuments(documentIds: string[]): Promise<void> {
    // Stub
  }

  async deleteAllDocuments(): Promise<void> {
    // Stub
  }

  async getDocument(documentId: string): Promise<any> {
    return null;
  }

  async getDocuments(options?: { limit?: number; offset?: number }): Promise<any[]> {
    return [];
  }

  async updateSettings(settings: any): Promise<void> {
    // Stub
  }

  async getSettings(): Promise<any> {
    return {};
  }

  async createIndex(): Promise<void> {
    // Stub
  }

  async deleteIndex(): Promise<void> {
    // Stub
  }

  async getIndexStats(): Promise<any> {
    return {};
  }
}
