// ============================================================
// MEILISEARCH CLIENT (STUB)
// Meilisearch module not installed
// ============================================================

let meilisearchClient: any = null;

export function getMeilisearchClient(): any {
  return meilisearchClient;
}

export async function closeMeilisearchClient(): Promise<void> {
  meilisearchClient = null;
}

export function isMeilisearchConnected(): boolean {
  return false;
}

export async function checkMeilisearchHealth(): Promise<boolean> {
  return false;
}
