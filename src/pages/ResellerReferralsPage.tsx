import { useReferrals, useReferralCode, useGenerateReferralCode } from '@/hooks/useReseller';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, RefreshCw, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// NO MOCK DATA - REAL API ONLY
export default function ResellerReferralsPage() {
  const { t } = useTranslation('common');
  const { data: referrals, isLoading: referralsLoading } = useReferrals();
  const { data: referralCode, isLoading: codeLoading } = useReferralCode();
  const generateCode = useGenerateReferralCode();

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode?.code}`;
    navigator.clipboard.writeText(link);
    toast.success(t('referral_link_copied'));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'converted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (referralsLoading || codeLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('my_referrals')}</h1>

      {/* Referral Code Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('your_referral_code')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-2xl font-bold font-mono">{referralCode?.code}</p>
              <p className="text-sm text-muted-foreground">
                {referrals?.length ?? 0} {t('total_signups')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyReferralLink}>
                <Copy className="mr-2 h-4 w-4" />
                {t('copy_link')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => generateCode.mutate()}
                disabled={generateCode.isPending}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${generateCode.isPending ? 'animate-spin' : ''}`} />
                {t('new_code')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('referral_history')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {referrals?.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(referral.status)}
                  <div>
                    <p className="font-medium">{referral.referredUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {referral.referredUser.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {referral.status === 'converted' && referral.commission > 0 && (
                      <span className="text-green-600">+${referral.commission}</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    referral.status === 'converted' 
                      ? 'bg-green-100 text-green-800' 
                      : referral.status === 'expired'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(referral.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {referrals?.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">{t('no_referrals_yet')}</p>
              <p className="text-sm text-muted-foreground">
                {t('share_your_link_to_start')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
