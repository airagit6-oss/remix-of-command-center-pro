// ============================================================
// API VERSIONING STRATEGY
// Enterprise-grade API versioning for backward compatibility
// ============================================================

export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
}

export const API_VERSIONS = [ApiVersion.V1, ApiVersion.V2, ApiVersion.V3];

export const DEFAULT_API_VERSION = ApiVersion.V1;

export const LATEST_API_VERSION = ApiVersion.V1;

export const DEPRECATED_API_VERSIONS: ApiVersion[] = [];

export interface ApiVersionInfo {
  version: ApiVersion;
  deprecated: boolean;
  deprecationDate?: Date;
  sunsetDate?: Date;
  migrationGuide?: string;
}

export const API_VERSION_INFO: Record<ApiVersion, ApiVersionInfo> = {
  [ApiVersion.V1]: {
    version: ApiVersion.V1,
    deprecated: false,
  },
  [ApiVersion.V2]: {
    version: ApiVersion.V2,
    deprecated: false,
  },
  [ApiVersion.V3]: {
    version: ApiVersion.V3,
    deprecated: false,
  },
};

export function getApiVersionFromHeader(versionHeader?: string): ApiVersion {
  if (!versionHeader) return DEFAULT_API_VERSION;
  
  const version = versionHeader.replace(/^\/?v/i, '') as ApiVersion;
  
  if (API_VERSIONS.includes(version)) {
    return version;
  }
  
  return DEFAULT_API_VERSION;
}

export function isApiVersionDeprecated(version: ApiVersion): boolean {
  return API_VERSION_INFO[version]?.deprecated || false;
}

export function validateApiVersion(version: string): boolean {
  return API_VERSIONS.includes(version as ApiVersion);
}
