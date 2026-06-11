import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import { supabase } from '../lib/supabase';

export function resellerRoutes(fastify: FastifyInstance) {
  // GET /reseller/profile - Get reseller profile
  fastify.get(
    '/reseller/profile',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { data, error } = await supabase
          .from('ResellerProfile')
          .select('*')
          .eq('userId', userId)
          .single();

        if (error) throw error;
        return reply.send(data);
      } catch (error: any) {
        console.error('Failed to fetch reseller profile:', error);
        return reply.status(500).send({ error: 'Failed to fetch profile' });
      }
    }
  );

  // GET /reseller/commission-stats - Get commission statistics
  fastify.get(
    '/reseller/commission-stats',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { data, error } = await supabase
          .from('Wallet')
          .select('balance')
          .eq('userId', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        return reply.send({
          rate: '25%',
          thisMonth: data ? `$${(data.balance * 0.25).toFixed(2)}` : '$0',
          lifetime: data ? `$${data.balance}` : '$0',
        });
      } catch (error: any) {
        console.error('Failed to fetch commission stats:', error);
        return reply.status(500).send({ error: 'Failed to fetch commission stats' });
      }
    }
  );

  // GET /reseller/commissions - Get commissions
  fastify.get(
    '/reseller/commissions',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { data, error } = await supabase
          .from('Order')
          .select('id, totalPrice, createdAt')
          .eq('resellerId', userId)
          .limit(50);

        if (error) throw error;

        const commissions = (data || []).map((order: any) => ({
          id: order.id,
          client: 'Client',
          plan: 'Premium',
          amount: (order.totalPrice * 0.25).toFixed(2),
          date: new Date(order.createdAt).toLocaleDateString(),
        }));

        return reply.send(commissions);
      } catch (error: any) {
        console.error('Failed to fetch commissions:', error);
        return reply.status(500).send({ error: 'Failed to fetch commissions' });
      }
    }
  );

  // GET /reseller/payouts - Get payouts history
  fastify.get(
    '/reseller/payouts',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { data, error } = await supabase
          .from('Wallet')
          .select('*')
          .eq('userId', userId);

        if (error) throw error;

        const payouts = (data || []).map((wallet: any) => ({
          id: wallet.id,
          date: new Date(wallet.updatedAt).toLocaleDateString(),
          method: 'Bank Transfer',
          reference: wallet.id.substring(0, 8),
          amount: `$${wallet.balance}`,
          status: 'COMPLETED',
        }));

        return reply.send(payouts);
      } catch (error: any) {
        console.error('Failed to fetch payouts:', error);
        return reply.status(500).send({ error: 'Failed to fetch payouts' });
      }
    }
  );

  // POST /reseller/payout-request - Request payout
  fastify.post(
    '/reseller/payout-request',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { amount, method } = request.body || {};

        const { data, error } = await supabase
          .from('Wallet')
          .update({ balance: 0 })
          .eq('userId', userId)
          .select()
          .single();

        if (error) throw error;

        return reply.status(201).send({
          id: data.id,
          amount,
          method,
          status: 'PENDING',
          date: new Date().toISOString(),
        });
      } catch (error: any) {
        console.error('Failed to request payout:', error);
        return reply.status(500).send({ error: 'Failed to request payout' });
      }
    }
  );

  // GET /reseller/reports - Get sales reports
  fastify.get(
    '/reseller/reports',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { data, error } = await supabase
          .from('Order')
          .select('totalPrice')
          .eq('resellerId', userId);

        if (error) throw error;

        const totalSales = (data || []).reduce((sum: number, order: any) => sum + order.totalPrice, 0);
        const commission = totalSales * 0.25;

        return reply.send({
          totalSales: totalSales.toFixed(2),
          totalCommission: commission.toFixed(2),
          thisMonth: (totalSales * 0.3).toFixed(2),
          thisMonthCommission: (totalSales * 0.3 * 0.25).toFixed(2),
          referrals: (data || []).length,
        });
      } catch (error: any) {
        console.error('Failed to fetch reports:', error);
        return reply.status(500).send({ error: 'Failed to fetch reports' });
      }
    }
  );

  // GET /reseller/marketing-assets - Get marketing assets
  fastify.get(
    '/reseller/marketing-assets',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        return reply.send([
          { id: '1', name: 'Banner 1', url: 'https://example.com/banner1.jpg', type: 'banner' },
          { id: '2', name: 'Email Template', url: 'https://example.com/template1.html', type: 'email' },
        ]);
      } catch (error: any) {
        console.error('Failed to fetch marketing assets:', error);
        return reply.status(500).send({ error: 'Failed to fetch marketing assets' });
      }
    }
  );

  // GET /reseller/referral-link - Get referral link
  fastify.get(
    '/reseller/referral-link',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { data, error } = await supabase
          .from('ResellerProfile')
          .select('referralCode')
          .eq('userId', userId)
          .single();

        if (error) throw error;

        return reply.send({
          url: `https://saashub.app/?ref=${data?.referralCode || 'default'}`,
        });
      } catch (error: any) {
        console.error('Failed to fetch referral link:', error);
        return reply.status(500).send({ error: 'Failed to fetch referral link' });
      }
    }
  );

  // PATCH /reseller/profile - Update profile
  fastify.patch(
    '/reseller/profile',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const userId = (request as any).user?.id || 'test-user';
        const { data, error } = await supabase
          .from('ResellerProfile')
          .update(request.body)
          .eq('userId', userId)
          .select()
          .single();

        if (error) throw error;
        return reply.send(data);
      } catch (error: any) {
        console.error('Failed to update profile:', error);
        return reply.status(500).send({ error: 'Failed to update profile' });
      }
    }
  );
}
