import { useResellerDashboard, useReferrals, useCommissions, useResellerEarnings, useResellerAnalytics } from '@/hooks/useReseller';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, DollarSign, TrendingUp, UserPlus, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// NO MOCK DATA - All real API calls
export default function ResellerDashboardPage() {
  const { t } = useTranslation('common');
  const { data: dashboard, isLoading: dashboardLoading } = useResellerDashboard();
  const { data: referrals, isLoading: referralsLoading } = useReferrals();
  const { data: commissions, isLoading: commissionsLoading } = useCommissions();
  const { data: earnings, isLoading: earningsLoading } = useResellerEarnings();
  const { data: analytics, isLoading: analyticsLoading } = useResellerAnalytics();

  const isLoading = dashboardLoading || referralsLoading || commissionsLoading || earningsLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Calculate real conversion rate
  const totalReferrals = referrals?.length ?? 0;
  const convertedReferrals = referrals?.filter(r => r.status === 'converted').length ?? 0;
  const conversionRate = totalReferrals > 0 ? (convertedReferrals / totalReferrals) * 100 : 0;

  // Calculate real commission stats
  const totalCommissions = commissions?.reduce((sum, c) => sum + c.amount, 0) ?? 0;
  const pendingCommissions = commissions?.filter(c => c.status === 'pending').length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('reseller_dashboard')}</h1>
      
      {/* KPI Cards - Real Data Only */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_referrals')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {convertedReferrals} {t('converted')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('conversion_rate')}</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.conversionRate?.toFixed(1) ?? '0'}% {t('avg')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_commissions')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCommissions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCommissions} {t('pending')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('available_earnings')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings?.availableBalance?.toLocaleString() ?? '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('lifetime')}: ${earnings?.totalLifetimeEarnings?.toLocaleString() ?? '0'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Leads */}
      <Card>
        <CardHeader>
          <CardTitle>{t('active_leads')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {analytics?.totalLeads ?? 0}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {analytics?.qualifiedLeads ?? 0} {t('qualified')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
