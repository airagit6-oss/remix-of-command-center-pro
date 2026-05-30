// ============================================================
// MEILISEARCH CLIENT
// Enterprise-grade search client for full-text search
// ============================================================

import MeiliSearch from 'meilisearch';

let meilisearchClient: MeiliSearch | null = null;

export function getMeilisearchClient(): MeiliSearch {
  if (!meilisearchClient) {
    meilisearchClient = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY || undefined,
    });
  }

  return meilisearchClient;
}

export async function closeMeilisearchClient(): Promise<void> {
  // MeiliSearch client doesn't have a close method
  meilisearchClient = null;
}

export function isMeilisearchConnected(): boolean {
  return meilisearchClient !== null;
}

export async function checkMeilisearchHealth(): Promise<boolean> {
  try {
    const client = getMeilisearchClient();
    await client.health();
    return true;
  } catch (error) {
    console.error('Meilisearch health check failed:', error);
    return false;
  }
}
