import { useAuthorDashboard, useAuthorAnalytics, useAuthorEarnings } from '@/hooks/useAuthor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, DollarSign, Package, Users, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// NO MOCK DATA - All real API calls
export default function AuthorDashboardPage() {
  const { t } = useTranslation('common');
  const { data: dashboard, isLoading: dashboardLoading } = useAuthorDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useAuthorAnalytics();
  const { data: earnings, isLoading: earningsLoading } = useAuthorEarnings();

  const isLoading = dashboardLoading || analyticsLoading || earningsLoading;

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('author_dashboard')}</h1>
      
      {/* KPI Cards - Real Data Only */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics?.totalRevenue?.toLocaleString() ?? '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('lifetime_earnings')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_sales')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalSales?.toLocaleString() ?? '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.totalProducts} {t('products')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('followers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.followers?.toLocaleString() ?? '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('total_followers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('rating')}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.rating?.toFixed(1) ?? '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('average_rating')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Balance */}
      <Card>
        <CardHeader>
          <CardTitle>{t('available_balance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${earnings?.availableBalance?.toLocaleString() ?? '0'}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {t('pending_balance')}: ${earnings?.pendingBalance?.toLocaleString() ?? '0'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
