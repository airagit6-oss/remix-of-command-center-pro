import { useResellerEarnings, useResellerPayouts, useRequestResellerPayout, useCancelResellerPayout } from '@/hooks/useReseller';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Wallet, History, ArrowUpCircle, XCircle, Users, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'sonner';

// NO MOCK DATA - REAL API ONLY
export default function ResellerEarningsPage() {
  const { t } = useTranslation('common');
  const { data: earnings, isLoading: earningsLoading } = useResellerEarnings();
  const { data: payouts, isLoading: payoutsLoading } = useResellerPayouts();
  const requestPayout = useRequestResellerPayout();
  const cancelPayout = useCancelResellerPayout();
  
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    if (amount <= 0 || amount > (earnings?.availableBalance ?? 0)) {
      toast.error(t('invalid_payout_amount'));
      return;
    }
    
    requestPayout.mutate({
      amount,
      method: payoutMethod,
      accountDetails: {},
    }, {
      onSuccess: () => setPayoutAmount('')
    });
  };

  const handleCancelPayout = (id: string) => {
    if (confirm(t('confirm_cancel_payout'))) {
      cancelPayout.mutate(id);
    }
  };

  const isLoading = earningsLoading || payoutsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('reseller_earnings')}</h1>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('available_balance')}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings?.availableBalance?.toLocaleString() ?? '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('ready_for_payout')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_referrals')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings?.totalReferrals?.toLocaleString() ?? '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('total_leads')}: {earnings?.totalLeads ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('lifetime_earnings')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings?.totalLifetimeEarnings?.toLocaleString() ?? '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('conversion_rate')}: {(earnings?.conversionRate ?? 0).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Request Payout */}
      <Card>
        <CardHeader>
          <CardTitle>{t('request_payout')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">{t('amount')}</label>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="0.00"
                max={earnings?.availableBalance}
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="w-48">
              <label className="text-sm font-medium mb-2 block">{t('method')}</label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="bank_transfer">{t('bank_transfer')}</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">{t('crypto')}</option>
              </select>
            </div>
            <Button 
              onClick={handleRequestPayout}
              disabled={!payoutAmount || parseFloat(payoutAmount) <= 0 || requestPayout.isPending}
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              {t('request_payout')}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {t('min_payout')}: $50 | {t('processing_time')}: 3-5 {t('business_days')}
          </p>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('payout_history')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {payouts?.map((payout: { id: string; amount: number; method: string; status: string; requestedAt: string; processedAt?: string }) => (
              <div key={payout.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">${payout.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {payout.method} | {new Date(payout.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    payout.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : payout.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : payout.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(payout.status)}
                  </span>
                  {payout.status === 'pending' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCancelPayout(payout.id)}
                    >
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {payouts?.length === 0 && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">{t('no_payouts_yet')}</p>
              <p className="text-sm text-muted-foreground">
                {t('request_first_payout')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
