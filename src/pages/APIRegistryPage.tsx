/**
 * AI API Manager - API Registry
 * Discover, register, and manage all APIs
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiManagerService } from '../../services/apiManager';
import { APIRegistryEntry, APIStatus, APICategory, DiscoveryResult } from '../../types/apiManager';

const NEON = {
  bg: '#070b1a',
  border: '#1e2942',
  text: '#e1e8f0',
  mute: '#8892b0',
  cyan: '#22d3ee',
  violet: '#8b5cf6',
  pink: '#f472b6',
};

const APIRegistryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [apis, setApis] = useState<APIRegistryEntry[]>([]);
  const [filteredApis, setFilteredApis] = useState<APIRegistryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResult | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<APIStatus | 'all'>(searchParams.get('status') as APIStatus || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAPIForm, setShowNewAPIForm] = useState(false);

  useEffect(() => {
    loadAPIs();
  }, []);

  useEffect(() => {
    filterAPIs();
  }, [apis, selectedStatus, searchTerm]);

  const loadAPIs = () => {
    const allApis = apiManagerService.getAllAPIs();
    setApis(allApis);
    setIsLoading(false);
  };

  const filterAPIs = () => {
    let filtered = [...apis];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(api => api.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(api =>
        api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        api.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApis(filtered);
  };

  const startDiscovery = async () => {
    setIsDiscovering(true);
    const result = await apiManagerService.discoverAPIs();
    setDiscoveryResult(result);
    loadAPIs();
    setIsDiscovering(false);
  };

  const getStatusBadgeColor = (status: APIStatus): string => {
    switch (status) {
      case APIStatus.ONLINE: return '#50d975';
      case APIStatus.OFFLINE: return '#ff6b6b';
      case APIStatus.DEGRADED: return '#ffa726';
      case APIStatus.EXPIRED: return '#a0aec0';
      case APIStatus.SUSPENDED: return '#ff7a7a';
      case APIStatus.FAILED: return '#ff5252';
      case APIStatus.PENDING_DISCOVERY: return NEON.mute;
      default: return NEON.mute;
    }
  };

  const getCategoryIcon = (category: APICategory): string => {
    switch (category) {
      case APICategory.AI_MODEL: return '🤖';
      case APICategory.PAYMENT: return '💳';
      case APICategory.MESSAGING: return '💬';
      case APICategory.EMAIL: return '📧';
      case APICategory.ANALYTICS: return '📊';
      case APICategory.STORAGE: return '💾';
      case APICategory.COMPUTE: return '⚙️';
      case APICategory.DATABASE: return '🗄️';
      case APICategory.AUTHENTICATION: return '🔐';
      case APICategory.WEBHOOK: return '🪝';
      case APICategory.CUSTOM: return '🔧';
      default: return '🔌';
    }
  };

  return (
    <div style={{ padding: '40px', background: NEON.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: NEON.cyan, margin: 0, marginBottom: '4px' }}>
              🔌 API Registry
            </h1>
            <p style={{ color: NEON.mute, margin: 0, fontSize: '14px' }}>
              Discover, register, and manage all APIs {filteredApis.length > 0 && `(${filteredApis.length} found)`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: `1px solid ${NEON.cyan}`,
              background: 'transparent',
              color: NEON.cyan,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.3s'
            }} onClick={startDiscovery} disabled={isDiscovering}>
              {isDiscovering ? '🔍 Scanning...' : '🔍 Scan for APIs'}
            </button>
            <button style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: NEON.cyan,
              color: NEON.bg,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.3s'
            }} onClick={() => setShowNewAPIForm(!showNewAPIForm)}>
              ➕ Register API
            </button>
          </div>
        </div>

        {/* Discovery Result */}
        {discoveryResult && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: `rgba(80, 217, 117, 0.1)`,
            border: `1px solid rgba(80, 217, 117, 0.3)`,
            color: '#50d975',
            fontSize: '13px'
          }}>
            ✅ Discovery complete: Found {discoveryResult.registeredCount} APIs, {discoveryResult.pendingCount} pending registration
          </div>
        )}
      </div>

      {/* Filters */}
      <div style({
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        alignItems: 'center',
        flexWrap: 'wrap'
      })>
        <input
          type="text"
          placeholder="Search APIs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid ${NEON.border}`,
            background: NEON.bg,
            color: NEON.text,
            fontSize: '13px',
            flex: 1,
            minWidth: '200px'
          }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', APIStatus.ONLINE, APIStatus.OFFLINE, APIStatus.DEGRADED, APIStatus.PENDING_DISCOVERY].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as any)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${selectedStatus === status ? NEON.cyan : NEON.border}`,
                background: selectedStatus === status ? `rgba(34, 211, 238, 0.1)` : 'transparent',
                color: selectedStatus === status ? NEON.cyan : NEON.mute,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* APIs Table */}
      <div style={{
        borderRadius: '12px',
        border: `1px solid ${NEON.border}`,
        overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(34, 211, 238, 0.02), rgba(139, 92, 246, 0.02))`
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${NEON.border}`, background: `rgba(34, 211, 238, 0.05)` }}>
                <th style={{ padding: '12px', textAlign: 'left', color: NEON.mute, fontWeight: 600 }}>API Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: NEON.mute, fontWeight: 600 }}>Provider</th>
                <th style={{ padding: '12px', textAlign: 'left', color: NEON.mute, fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: NEON.mute, fontWeight: 600 }}>Usage</th>
                <th style={{ padding: '12px', textAlign: 'left', color: NEON.mute, fontWeight: 600 }}>Health</th>
                <th style={{ padding: '12px', textAlign: 'left', color: NEON.mute, fontWeight: 600 }}>Cost</th>
                <th style={{ padding: '12px', textAlign: 'center', color: NEON.mute, fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApis.map((api, idx) => (
                <tr
                  key={api.id}
                  style={{
                    borderBottom: `1px solid ${NEON.border}`,
                    background: idx % 2 === 0 ? 'transparent' : `rgba(34, 211, 238, 0.02)`,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `rgba(34, 211, 238, 0.08)`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : `rgba(34, 211, 238, 0.02)`)}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{getCategoryIcon(api.category)}</span>
                      <span style={{ color: NEON.text, fontWeight: 500 }}>{api.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: NEON.mute }}>{api.provider}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: `${getStatusBadgeColor(api.status)}20`,
                      color: getStatusBadgeColor(api.status),
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {api.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: NEON.mute }}>{api.monthlyUsage.toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '6px',
                        borderRadius: '3px',
                        background: NEON.border,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${api.healthScore}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, #50d975, ${NEON.cyan})`,
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span style={{ color: NEON.mute, fontSize: '11px' }}>{Math.round(api.healthScore)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: NEON.pink, fontWeight: 600 }}>${api.cost.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${NEON.cyan}`,
                      background: 'transparent',
                      color: NEON.cyan,
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }} onClick={() => navigate(`/ai-api-manager/api/${api.id}`)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApis.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: NEON.mute }}>
            <p>No APIs found. Start by scanning for existing APIs or registering a new one.</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div style({
        marginTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: NEON.mute
      })>
        <div>Showing {filteredApis.length} of {apis.length} APIs</div>
        <div>Last updated: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default APIRegistryPage;
