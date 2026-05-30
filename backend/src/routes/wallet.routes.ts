// ============================================================
// WALLET ROUTES
// API endpoints for unified wallet system
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WalletService } from '../services/wallet.service';

// GET /wallet
export async function getWallet(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const wallet = await WalletService.getWallet(userId);
    return reply.send(wallet);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch wallet' });
  }
}

// GET /wallet/balance
export async function getBalance(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const balance = await WalletService.getBalance(userId);
    return reply.send(balance);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch balance' });
  }
}

// GET /wallet/transactions
export async function getTransactions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt((req.query as any).limit || '50');
    const transactions = await WalletService.getTransactions(userId, limit);
    return reply.send(transactions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch transactions' });
  }
}

// GET /wallet/ledger
export async function getLedger(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt((req.query as any).limit || '100');
    const ledger = await WalletService.getLedger(userId, limit);
    return reply.send(ledger);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch ledger' });
  }
}

// GET /wallet/stats
export async function getWalletStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const stats = await WalletService.getWalletStats(userId);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch wallet stats' });
  }
}

// POST /wallet/credit
export async function creditWallet(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, type, description, referenceId, referenceType, metadata } = req.body as any;
    
    if (!amount || !type) {
      return reply.status(400).send({ error: 'Amount and type are required' });
    }

    const result = await WalletService.creditWallet(
      userId,
      amount,
      type,
      description,
      referenceId,
      referenceType,
      metadata
    );
    
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to credit wallet' });
  }
}

// POST /wallet/debit
export async function debitWallet(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, type, description, referenceId, referenceType, metadata } = req.body as any;
    
    if (!amount || !type) {
      return reply.status(400).send({ error: 'Amount and type are required' });
    }

    const result = await WalletService.debitWallet(
      userId,
      amount,
      type,
      description,
      referenceId,
      referenceType,
      metadata
    );
    
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to debit wallet' });
  }
}

// POST /wallet/transfer
export async function transferFunds(req: FastifyRequest, reply: FastifyReply) {
  try {
    const fromUserId = (req as any).user.id;
    const { toUserId, amount, description, metadata } = req.body as any;
    
    if (!toUserId || !amount) {
      return reply.status(400).send({ error: 'To user ID and amount are required' });
    }

    const result = await WalletService.transferFunds(
      fromUserId,
      toUserId,
      amount,
      description,
      metadata
    );
    
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to transfer funds' });
  }
}

// POST /wallet/withdraw
export async function requestWithdrawal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, method, details, description } = req.body as any;
    
    if (!amount || !method || !details) {
      return reply.status(400).send({ error: 'Amount, method, and details are required' });
    }

    const transaction = await WalletService.requestWithdrawal(
      userId,
      amount,
      method,
      details,
      description
    );
    
    return reply.send(transaction);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to request withdrawal' });
  }
}

// POST /wallet/withdraw/:transactionId/process
export async function processWithdrawal(req: FastifyRequest, reply: FastifyReply) {
  try {
    const adminId = (req as any).user.id;
    const { transactionId } = req.params as any;
    const { approved, reason } = req.body as any;
    
    if (approved === undefined) {
      return reply.status(400).send({ error: 'Approved status is required' });
    }

    const transaction = await WalletService.processWithdrawal(
      transactionId,
      approved,
      adminId,
      reason
    );
    
    return reply.send(transaction);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to process withdrawal' });
  }
}

// POST /wallet/deposit
export async function depositToWallet(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, method, referenceId, description } = req.body as any;
    
    if (!amount || !method) {
      return reply.status(400).send({ error: 'Amount and method are required' });
    }

    const result = await WalletService.depositToWallet(
      userId,
      amount,
      method,
      referenceId,
      description
    );
    
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to deposit to wallet' });
  }
}

// POST /wallet/refund
export async function refundToWallet(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, referenceId, referenceType, description } = req.body as any;
    
    if (!amount || !referenceId || !referenceType) {
      return reply.status(400).send({ error: 'Amount, reference ID, and reference type are required' });
    }

    const result = await WalletService.refundToWallet(
      userId,
      amount,
      referenceId,
      referenceType,
      description
    );
    
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to refund to wallet' });
  }
}

// POST /wallet/settlement
export async function processSettlement(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, referenceId, description } = req.body as any;
    
    if (!amount || !referenceId) {
      return reply.status(400).send({ error: 'Amount and reference ID are required' });
    }

    const result = await WalletService.processSettlement(
      userId,
      amount,
      referenceId,
      description
    );
    
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to process settlement' });
  }
}

// POST /wallet/freeze
export async function freezeWallet(req: FastifyRequest, reply: FastifyReply) {
  try {
    const adminId = (req as any).user.id;
    const { userId, reason } = req.body as any;
    
    if (!userId || !reason) {
      return reply.status(400).send({ error: 'User ID and reason are required' });
    }

    const wallet = await WalletService.freezeWallet(userId, reason, adminId);
    return reply.send(wallet);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to freeze wallet' });
  }
}

// POST /wallet/unfreeze
export async function unfreezeWallet(req: FastifyRequest, reply: FastifyReply) {
  try {
    const adminId = (req as any).user.id;
    const { userId } = req.body as any;
    
    if (!userId) {
      return reply.status(400).send({ error: 'User ID is required' });
    }

    const wallet = await WalletService.unfreezeWallet(userId, adminId);
    return reply.send(wallet);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to unfreeze wallet' });
  }
}

export function walletRoutes(fastify: FastifyInstance) {
  fastify.get('/wallet', { preHandler: [fastify.authenticate] }, getWallet);
  fastify.get('/wallet/balance', { preHandler: [fastify.authenticate] }, getBalance);
  fastify.get('/wallet/transactions', { preHandler: [fastify.authenticate] }, getTransactions);
  fastify.get('/wallet/ledger', { preHandler: [fastify.authenticate] }, getLedger);
  fastify.get('/wallet/stats', { preHandler: [fastify.authenticate] }, getWalletStats);
  
  fastify.post('/wallet/credit', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, creditWallet);
  fastify.post('/wallet/debit', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, debitWallet);
  fastify.post('/wallet/transfer', { preHandler: [fastify.authenticate] }, transferFunds);
  fastify.post('/wallet/withdraw', { preHandler: [fastify.authenticate] }, requestWithdrawal);
  fastify.post('/wallet/withdraw/:transactionId/process', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, processWithdrawal);
  fastify.post('/wallet/deposit', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, depositToWallet);
  fastify.post('/wallet/refund', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, refundToWallet);
  fastify.post('/wallet/settlement', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, processSettlement);
  
  fastify.post('/wallet/freeze', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, freezeWallet);
  fastify.post('/wallet/unfreeze', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, unfreezeWallet);
}
