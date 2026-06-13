/**
 * AI API Manager - Main Dashboard
 * Central nervous system of Software Vala
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiManagerService } from '../../services/apiManager';
import { DashboardMetrics, AlertType, APIStatus } from '../../types/apiManager';

const NEON = {
  bg: '#070b1a',
  border: '#1e2942',
  text: '#e1e8f0',
  mute: '#8892b0',
  cyan: '#22d3ee',
  violet: '#8b5cf6',
  pink: '#f472b6',
};

const AIAPIManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'apis' | 'providers' | 'health' | 'cost' | 'security'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = () => {
    const data = apiManagerService.getDashboardMetrics();
    setMetrics(data);
    setIsLoading(false);
  };

  if (isLoading || !metrics) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: NEON.mute }}>
        <p>Loading AI API Manager...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: NEON.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: NEON.cyan, margin: 0, marginBottom: '8px' }}>
          🤖 AI API Manager
        </h1>
        <p style={{ color: NEON.mute, margin: 0, fontSize: '14px' }}>
          Central nervous system of Software Vala · Real-time API ecosystem monitoring
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: `1px solid ${NEON.border}`,
        paddingBottom: '16px',
        overflowX: 'auto'
      }}>
        {['overview', 'apis', 'providers', 'health', 'cost', 'security'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab ? `rgba(34, 211, 238, 0.2)` : 'transparent',
              color: activeTab === tab ? NEON.cyan : NEON.mute,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'apis' && '🔌 APIs'}
            {tab === 'providers' && '🏢 Providers'}
            {tab === 'health' && '💚 Health'}
            {tab === 'cost' && '💰 Cost'}
            {tab === 'security' && '🔒 Security'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && <OverviewTab metrics={metrics} navigate={navigate} />}

      {/* APIS TAB */}
      {activeTab === 'apis' && <APIsTab navigate={navigate} />}

      {/* PROVIDERS TAB */}
      {activeTab === 'providers' && <ProvidersTab navigate={navigate} />}

      {/* HEALTH TAB */}
      {activeTab === 'health' && <HealthTab navigate={navigate} />}

      {/* COST TAB */}
      {activeTab === 'cost' && <CostTab metrics={metrics} navigate={navigate} />}

      {/* SECURITY TAB */}
      {activeTab === 'security' && <SecurityTab navigate={navigate} />}
    </div>
  );
};

// ============================================================================
// OVERVIEW TAB COMPONENT
// ============================================================================

interface OverviewTabProps {
  metrics: DashboardMetrics;
  navigate: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ metrics, navigate }) => {
  return (
    <div>
      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Total APIs */}
        <MetricCard
          icon="🔌"
          label="Total APIs Connected"
          value={metrics.totalApiCount}
          subtext={`${metrics.activeApiCount} online`}
          trend="+12% this month"
          color={NEON.cyan}
          onClick={() => navigate('/ai-api-manager/apis')}
        />

        {/* Active vs Inactive */}
        <MetricCard
          icon="✅"
          label="Active APIs"
          value={metrics.activeApiCount}
          subtext={`${metrics.inactiveApiCount} inactive`}
          trend={`${Math.round((metrics.activeApiCount / metrics.totalApiCount) * 100)}% uptime`}
          color={NEON.cyan}
          onClick={() => navigate('/ai-api-manager/apis?status=online')}
        />

        {/* AI APIs */}
        <MetricCard
          icon="🤖"
          label="AI APIs"
          value={metrics.aiApiCount}
          subtext={`${metrics.nonAiApiCount} non-AI`}
          trend="+5 this week"
          color={NEON.violet}
          onClick={() => navigate('/ai-api-manager/providers')}
        />

        {/* Usage Today */}
        <MetricCard
          icon="📈"
          label="Today's Usage"
          value={metrics.todayUsage.toLocaleString()}
          subtext={`${metrics.monthlyUsage.toLocaleString()} this month`}
          trend="+23% vs yesterday"
          color={NEON.pink}
          onClick={() => navigate('/ai-api-manager/usage')}
        />
      </div>

      {/* Secondary Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Cost Metrics */}
        <MetricCard
          icon="💰"
          label="Monthly Spend"
          value={`$${metrics.monthlySpend.toFixed(2)}`}
          subtext={`Wallet: $${metrics.walletBalance.toFixed(2)}`}
          trend="Budget: $10,000"
          color={NEON.cyan}
          onClick={() => navigate('/ai-api-manager/billing')}
        />

        {/* Health Score */}
        <ScoreCard
          icon="💚"
          label="Overall Health"
          score={Math.round(metrics.totalHealthScore)}
          color="#50d975"
          onClick={() => navigate('/ai-api-manager/health')}
        />

        {/* Reliability Score */}
        <ScoreCard
          icon="🎯"
          label="Reliability"
          score={Math.round(metrics.totalReliabilityScore)}
          color={NEON.cyan}
          onClick={() => navigate('/ai-api-manager/health')}
        />

        {/* Cost Score */}
        <ScoreCard
          icon="💳"
          label="Cost Efficiency"
          score={Math.round(metrics.totalCostScore)}
          color={NEON.pink}
          onClick={() => navigate('/ai-api-manager/billing')}
        />
      </div>

      {/* Alert Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <AlertSummaryCard
          icon="⚠️"
          label="Risk Alerts"
          count={metrics.riskAlerts}
          color="#ff6b6b"
          onClick={() => navigate('/ai-api-manager/alerts?type=risk')}
        />
        <AlertSummaryCard
          icon="🔒"
          label="Security Alerts"
          count={metrics.securityAlerts}
          color="#ff8787"
          onClick={() => navigate('/ai-api-manager/alerts?type=security')}
        />
        <AlertSummaryCard
          icon="🚨"
          label="Provider Alerts"
          count={metrics.providerAlerts}
          color="#ffa726"
          onClick={() => navigate('/ai-api-manager/alerts?type=provider')}
        />
      </div>

      {/* Provider Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <StatusCard
          label="Online Providers"
          count={metrics.onlineProviders}
          color="#50d975"
          status="online"
        />
        <StatusCard
          label="Degraded Providers"
          count={metrics.degradedProviders}
          color="#ffa726"
          status="degraded"
        />
        <StatusCard
          label="Offline Providers"
          count={metrics.offlineProviders}
          color="#ff6b6b"
          status="offline"
        />
      </div>
    </div>
  );
};

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtext: string;
  trend: string;
  color: string;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subtext, trend, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${NEON.border}`,
        background: `linear-gradient(135deg, rgba(34, 211, 238, 0.05), rgba(139, 92, 246, 0.05))`,
        cursor: 'pointer',
        transition: 'all 0.3s',
        onHover: {
          borderColor: color,
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 16px rgba(34, 211, 238, 0.1)`
        }
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as any).style.borderColor = color;
        (e.currentTarget as any).style.transform = 'translateY(-2px)';
        (e.currentTarget as any).style.boxShadow = `0 8px 16px ${color}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as any).style.borderColor = NEON.border;
        (e.currentTarget as any).style.transform = 'translateY(0)';
        (e.currentTarget as any).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <span style={{ fontSize: '12px', color: NEON.mute }}>vs last period</span>
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: NEON.mute, marginBottom: '8px' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: color, marginBottom: '8px' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <div style={{ fontSize: '12px', color: NEON.mute }}>
        <div>{subtext}</div>
        <div style={{ color: '#50d975', marginTop: '4px' }}>{trend}</div>
      </div>
    </div>
  );
};

// ============================================================================
// SCORE CARD COMPONENT
// ============================================================================

interface ScoreCardProps {
  icon: string;
  label: string;
  score: number;
  color: string;
  onClick: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ icon, label, score, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${NEON.border}`,
        background: `linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(34, 211, 238, 0.05))`,
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as any).style.borderColor = color;
        (e.currentTarget as any).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as any).style.borderColor = NEON.border;
        (e.currentTarget as any).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '13px', color: NEON.mute, marginBottom: '8px' }}>{label}</p>
          <div style={{
            fontSize: '36px',
            fontWeight: 700,
            background: `linear-gradient(135deg, ${color}, ${NEON.cyan})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {score}
          </div>
        </div>
        <div style={{
          fontSize: '40px',
          opacity: 0.3
        }}>
          {icon}
        </div>
      </div>
      <div style={{
        marginTop: '12px',
        height: '4px',
        borderRadius: '2px',
        background: NEON.border,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${score}%`,
          background: `linear-gradient(90deg, ${color}, ${NEON.cyan})`,
          borderRadius: '2px'
        }} />
      </div>
    </div>
  );
};

// ============================================================================
// ALERT SUMMARY CARD
// ============================================================================

interface AlertSummaryCardProps {
  icon: string;
  label: string;
  count: number;
  color: string;
  onClick: () => void;
}

const AlertSummaryCard: React.FC<AlertSummaryCardProps> = ({ icon, label, count, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: `2px solid ${color}30`,
        background: `${color}10`,
        cursor: 'pointer',
        transition: 'all 0.3s',
        textAlign: 'center'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as any).style.borderColor = color;
        (e.currentTarget as any).style.background = `${color}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as any).style.borderColor = `${color}30`;
        (e.currentTarget as any).style.background = `${color}10`;
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ margin: 0, fontSize: '12px', color: NEON.mute, marginBottom: '4px' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color }}>{count}</p>
    </div>
  );
};

// ============================================================================
// STATUS CARD
// ============================================================================

interface StatusCardProps {
  label: string;
  count: number;
  color: string;
  status: 'online' | 'degraded' | 'offline';
}

const StatusCard: React.FC<StatusCardProps> = ({ label, count, color, status }) => {
  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      border: `1px solid ${NEON.border}`,
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: color,
          animation: status === 'online' ? 'pulse 2s infinite' : 'none'
        }} />
        <p style={{ margin: 0, fontSize: '13px', color: NEON.mute }}>{label}</p>
      </div>
      <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color }}>{count}</p>
    </div>
  );
};

// ============================================================================
// PLACEHOLDER TABS
// ============================================================================

const APIsTab: React.FC<{ navigate: any }> = ({ navigate }) => (
  <div style={{ padding: '20px', textAlign: 'center', color: NEON.mute }}>
    <p>🔌 API Registry & Management</p>
    <p style={{ fontSize: '12px' }}>Discover, register, and manage all APIs</p>
    <button style={{
      marginTop: '16px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: NEON.cyan,
      color: NEON.bg,
      cursor: 'pointer',
      fontWeight: 600,
      borderRadius: '8px'
    }} onClick={() => navigate('/ai-api-manager/api-registry')}>
      Go to API Registry
    </button>
  </div>
);

const ProvidersTab: React.FC<{ navigate: any }> = ({ navigate }) => (
  <div style={{ padding: '20px', textAlign: 'center', color: NEON.mute }}>
    <p>🏢 Providers & Integrations</p>
    <p style={{ fontSize: '12px' }}>View provider status, health, and dependencies</p>
    <button style={{
      marginTop: '16px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: NEON.cyan,
      color: NEON.bg,
      cursor: 'pointer',
      fontWeight: 600
    }} onClick={() => navigate('/ai-api-manager/providers')}>
      Go to Providers
    </button>
  </div>
);

const HealthTab: React.FC<{ navigate: any }> = ({ navigate }) => (
  <div style={{ padding: '20px', textAlign: 'center', color: NEON.mute }}>
    <p>💚 Health Monitoring & Alerts</p>
    <p style={{ fontSize: '12px' }}>Real-time API health, uptime, and incident tracking</p>
    <button style={{
      marginTop: '16px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: NEON.cyan,
      color: NEON.bg,
      cursor: 'pointer',
      fontWeight: 600
    }} onClick={() => navigate('/ai-api-manager/health')}>
      Go to Health Center
    </button>
  </div>
);

const CostTab: React.FC<{ metrics: DashboardMetrics; navigate: any }> = ({ metrics, navigate }) => (
  <div style={{ padding: '20px' }}>
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      border: `1px solid ${NEON.border}`,
      background: `linear-gradient(135deg, rgba(244, 114, 182, 0.05), rgba(139, 92, 246, 0.05))`,
      marginBottom: '20px'
    }}>
      <p style={{ margin: 0, fontSize: '13px', color: NEON.mute, marginBottom: '8px' }}>Monthly Spending</p>
      <p style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: NEON.pink }}>
        ${metrics.monthlySpend.toFixed(2)}
      </p>
      <p style={{ margin: 0, fontSize: '12px', color: NEON.mute, marginTop: '8px' }}>
        Budget: $10,000 · {Math.round((metrics.monthlySpend / 10000) * 100)}% spent
      </p>
    </div>

    <button style={{
      marginTop: '16px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: NEON.cyan,
      color: NEON.bg,
      cursor: 'pointer',
      fontWeight: 600
    }} onClick={() => navigate('/ai-api-manager/billing')}>
      View Billing Details
    </button>
  </div>
);

const SecurityTab: React.FC<{ navigate: any }> = ({ navigate }) => (
  <div style={{ padding: '20px', textAlign: 'center', color: NEON.mute }}>
    <p>🔒 Security & Access Control</p>
    <p style={{ fontSize: '12px' }}>API keys, permissions, threat detection, and audit trails</p>
    <button style={{
      marginTop: '16px',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: NEON.cyan,
      color: NEON.bg,
      cursor: 'pointer',
      fontWeight: 600
    }} onClick={() => navigate('/ai-api-manager/security')}>
      Go to Security Center
    </button>
  </div>
);

export default AIAPIManagerDashboard;
