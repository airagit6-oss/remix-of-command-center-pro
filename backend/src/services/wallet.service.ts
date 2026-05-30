import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WalletService {
  // Get or create wallet for user
  static async getWallet(userId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      // Determine wallet type based on user role
      let walletType = 'CUSTOMER';
      if (user?.role === 'AUTHOR') walletType = 'AUTHOR';
      else if (user?.role === 'RESELLER') walletType = 'RESELLER';
      else if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') walletType = 'ADMIN';

      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          availableBalance: 0,
          pendingBalance: 0,
          currency: 'USD',
          walletType: walletType as any
        }
      });
    }

    return wallet;
  }

  // Credit wallet (add funds)
  static async creditWallet(
    userId: string,
    amount: number,
    type: string,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const wallet = await this.getWallet(userId);

    // Check if wallet is frozen
    if (wallet.isFrozen) {
      throw new Error('Wallet is frozen');
    }

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
        availableBalance: { increment: amount },
        totalCredit: { increment: amount }
      }
    });

    // Create transaction record
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: type as any,
        amount,
        balanceAfter: Number(updatedWallet.balance),
        description,
        referenceId,
        referenceType,
        metadata
      }
    });

    // Create ledger entry
    await this.createLedgerEntry(
      wallet.id,
      'CREDIT',
      amount,
      Number(wallet.balance),
      Number(updatedWallet.balance),
      description || 'Wallet credit',
      referenceId,
      referenceType,
      metadata
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREDIT_WALLET',
        entity: 'Wallet',
        entityId: wallet.id,
        changes: { amount, type, balanceAfter: Number(updatedWallet.balance) },
        metadata: { transactionId: transaction.id }
      }
    });

    return { wallet: updatedWallet, transaction };
  }

  // Debit wallet (remove funds)
  static async debitWallet(
    userId: string,
    amount: number,
    type: string,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const wallet = await this.getWallet(userId);

    // Check if wallet is frozen
    if (wallet.isFrozen) {
      throw new Error('Wallet is frozen');
    }

    // Check sufficient balance
    if (Number(wallet.availableBalance) < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        availableBalance: { decrement: amount },
        totalDebit: { increment: amount }
      }
    });

    // Create transaction record
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: type as any,
        amount: -amount,
        balanceAfter: Number(updatedWallet.balance),
        description,
        referenceId,
        referenceType,
        metadata
      }
    });

    // Create ledger entry
    await this.createLedgerEntry(
      wallet.id,
      'DEBIT',
      amount,
      Number(wallet.balance),
      Number(updatedWallet.balance),
      description || 'Wallet debit',
      referenceId,
      referenceType,
      metadata
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DEBIT_WALLET',
        entity: 'Wallet',
        entityId: wallet.id,
        changes: { amount: -amount, type, balanceAfter: Number(updatedWallet.balance) },
        metadata: { transactionId: transaction.id }
      }
    });

    return { wallet: updatedWallet, transaction };
  }

  // Add to pending balance (for commissions, etc.)
  static async addToPendingBalance(
    userId: string,
    amount: number,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const wallet = await this.getWallet(userId);

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        pendingBalance: { increment: amount }
      }
    });

    // Create ledger entry
    await this.createLedgerEntry(
      wallet.id,
      'COMMISSION',
      amount,
      Number(wallet.balance),
      Number(updatedWallet.balance),
      description || 'Pending balance added',
      referenceId,
      referenceType,
      metadata
    );

    return updatedWallet;
  }

  // Release pending balance to available balance
  static async releasePendingBalance(
    userId: string,
    amount: number,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const wallet = await this.getWallet(userId);

    if (Number(wallet.pendingBalance) < amount) {
      throw new Error('Insufficient pending balance');
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        pendingBalance: { decrement: amount },
        availableBalance: { increment: amount },
        balance: { increment: amount }
      }
    });

    // Create transaction
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'COMMISSION_EARNED' as any,
        amount,
        balanceAfter: Number(updatedWallet.balance),
        description: description || 'Pending balance released',
        referenceId,
        referenceType,
        metadata
      }
    });

    // Create ledger entry
    await this.createLedgerEntry(
      wallet.id,
      'COMMISSION',
      amount,
      Number(wallet.balance),
      Number(updatedWallet.balance),
      description || 'Pending balance released',
      referenceId,
      referenceType,
      metadata
    );

    return { wallet: updatedWallet, transaction };
  }

  // Get wallet balance
  static async getBalance(userId: string) {
    const wallet = await this.getWallet(userId);
    return {
      balance: Number(wallet.balance),
      availableBalance: Number(wallet.availableBalance),
      pendingBalance: Number(wallet.pendingBalance),
      currency: wallet.currency,
      walletType: wallet.walletType,
      isFrozen: wallet.isFrozen,
      frozenReason: wallet.frozenReason
    };
  }

  // Get wallet transactions
  static async getTransactions(userId: string, limit: number = 50) {
    const wallet = await this.getWallet(userId);
    
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return transactions.map(t => ({
      ...t,
      amount: Number(t.amount),
      balanceAfter: Number(t.balanceAfter)
    }));
  }

  // Get wallet ledger
  static async getLedger(userId: string, limit: number = 100) {
    const wallet = await this.getWallet(userId);
    
    const ledger = await prisma.walletLedger.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return ledger.map(l => ({
      ...l,
      amount: Number(l.amount),
      balanceBefore: Number(l.balanceBefore),
      balanceAfter: Number(l.balanceAfter)
    }));
  }

  // Create ledger entry
  private static async createLedgerEntry(
    walletId: string,
    entryType: string,
    amount: number,
    balanceBefore: number,
    balanceAfter: number,
    description: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ) {
    await prisma.walletLedger.create({
      data: {
        walletId,
        entryType: entryType as any,
        amount,
        balanceBefore,
        balanceAfter,
        description,
        referenceId,
        referenceType,
        metadata
      }
    });
  }

  // Freeze wallet (admin only)
  static async freezeWallet(userId: string, reason: string, adminId: string) {
    const wallet = await this.getWallet(userId);

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        isFrozen: true,
        frozenAt: new Date(),
        frozenReason: reason
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'FREEZE_WALLET',
        entity: 'Wallet',
        entityId: wallet.id,
        changes: { isFrozen: true, reason },
        metadata: { targetUserId: userId }
      }
    });

    return updated;
  }

  // Unfreeze wallet (admin only)
  static async unfreezeWallet(userId: string, adminId: string) {
    const wallet = await this.getWallet(userId);

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        isFrozen: false,
        frozenAt: null,
        frozenReason: null
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UNFREEZE_WALLET',
        entity: 'Wallet',
        entityId: wallet.id,
        changes: { isFrozen: false },
        metadata: { targetUserId: userId }
      }
    });

    return updated;
  }

  // Transfer funds between wallets
  static async transferFunds(
    fromUserId: string,
    toUserId: string,
    amount: number,
    description?: string,
    metadata?: any
  ) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (fromUserId === toUserId) {
      throw new Error('Cannot transfer to same wallet');
    }

    // Debit from sender
    const { transaction: debitTx } = await this.debitWallet(
      fromUserId,
      amount,
      'TRANSFER_OUT',
      description || `Transfer to user ${toUserId}`,
      undefined,
      undefined,
      { ...metadata, transferType: 'outgoing', toUserId }
    );

    // Credit to receiver
    const { transaction: creditTx } = await this.creditWallet(
      toUserId,
      amount,
      'TRANSFER_IN',
      description || `Transfer from user ${fromUserId}`,
      undefined,
      undefined,
      { ...metadata, transferType: 'incoming', fromUserId }
    );

    // Audit log for transfer
    await prisma.auditLog.create({
      data: {
        userId: fromUserId,
        action: 'TRANSFER_FUNDS',
        entity: 'Wallet',
        entityId: debitTx.walletId,
        changes: { amount, toUserId },
        metadata: {
          debitTransactionId: debitTx.id,
          creditTransactionId: creditTx.id
        }
      }
    });

    return { debitTx, creditTx };
  }

  // Refund to wallet
  static async refundToWallet(
    userId: string,
    amount: number,
    referenceId: string,
    referenceType: string,
    description?: string
  ) {
    return this.creditWallet(
      userId,
      amount,
      'REFUND_TO_WALLET',
      description || 'Refund to wallet',
      referenceId,
      referenceType,
      { refundType: 'wallet' }
    );
  }

  // Withdrawal request
  static async requestWithdrawal(
    userId: string,
    amount: number,
    method: string,
    details: any,
    description?: string
  ) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const wallet = await this.getWallet(userId);

    if (Number(wallet.availableBalance) < amount) {
      throw new Error('Insufficient available balance');
    }

    // Create pending withdrawal transaction
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'WITHDRAWAL' as any,
        amount: -amount,
        balanceAfter: Number(wallet.balance),
        description: description || 'Withdrawal request',
        status: 'PENDING' as any,
        metadata: { method, details }
      }
    });

    // Move from available to pending
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: { decrement: amount },
        pendingBalance: { increment: amount }
      }
    });

    // Create ledger entry
    await this.createLedgerEntry(
      wallet.id,
      'WITHDRAWAL',
      amount,
      Number(wallet.balance),
      Number(wallet.balance),
      description || 'Withdrawal requested',
      transaction.id,
      'WalletTransaction',
      { method, details }
    );

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'WITHDRAWAL_REQUESTED',
        entity: 'Wallet',
        entityId: wallet.id,
        changes: { amount, method },
        metadata: { transactionId: transaction.id }
      }
    });

    return transaction;
  }

  // Process withdrawal (admin only)
  static async processWithdrawal(
    transactionId: string,
    approved: boolean,
    adminId: string,
    reason?: string
  ) {
    const transaction = await prisma.walletTransaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.type !== 'WITHDRAWAL') {
      throw new Error('Not a withdrawal transaction');
    }

    if (transaction.status !== 'PENDING') {
      throw new Error('Transaction already processed');
    }

    if (approved) {
      // Mark as completed
      await prisma.walletTransaction.update({
        where: { id: transactionId },
        data: {
          status: 'COMPLETED' as any
        }
      });

      // Deduct from wallet balance
      await prisma.wallet.update({
        where: { id: transaction.walletId },
        data: {
          balance: { decrement: Math.abs(Number(transaction.amount)) },
          pendingBalance: { decrement: Math.abs(Number(transaction.amount)) },
          totalDebit: { increment: Math.abs(Number(transaction.amount)) }
        }
      });

      // Update ledger
      await this.createLedgerEntry(
        transaction.walletId,
        'WITHDRAWAL',
        Math.abs(Number(transaction.amount)),
        Number(transaction.balanceAfter),
        Number(transaction.balanceAfter) - Math.abs(Number(transaction.amount)),
        'Withdrawal completed',
        transactionId,
        'WalletTransaction',
        { approvedBy: adminId }
      );
    } else {
      // Reject - return funds to available balance
      await prisma.walletTransaction.update({
        where: { id: transactionId },
        data: {
          status: 'CANCELLED' as any
        }
      });

      await prisma.wallet.update({
        where: { id: transaction.walletId },
        data: {
          availableBalance: { increment: Math.abs(Number(transaction.amount)) },
          pendingBalance: { decrement: Math.abs(Number(transaction.amount)) }
        }
      });

      // Update ledger
      await this.createLedgerEntry(
        transaction.walletId,
        'ADJUSTMENT',
        Math.abs(Number(transaction.amount)),
        Number(transaction.balanceAfter),
        Number(transaction.balanceAfter),
        'Withdrawal rejected - funds returned',
        transactionId,
        'WalletTransaction',
        { approvedBy: adminId, reason }
      );
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: approved ? 'WITHDRAWAL_APPROVED' : 'WITHDRAWAL_REJECTED',
        entity: 'WalletTransaction',
        entityId: transactionId,
        changes: { approved, reason },
        metadata: { targetUserId: transaction.wallet.userId }
      }
    });

    return transaction;
  }

  // Deposit to wallet
  static async depositToWallet(
    userId: string,
    amount: number,
    method: string,
    referenceId?: string,
    description?: string
  ) {
    return this.creditWallet(
      userId,
      amount,
      'DEPOSIT',
      description || `Deposit via ${method}`,
      referenceId,
      'Deposit',
      { method }
    );
  }

  // Settlement (for authors/resellers)
  static async processSettlement(
    userId: string,
    amount: number,
    referenceId: string,
    description?: string
  ) {
    return this.releasePendingBalance(
      userId,
      amount,
      description || 'Settlement processed',
      referenceId,
      'Settlement',
      { settlementType: 'auto' }
    );
  }

  // Get wallet stats
  static async getWalletStats(userId: string) {
    const wallet = await this.getWallet(userId);
    
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id }
    });

    const credits = transactions.filter(t => t.type === 'CREDIT' || t.type === 'DEPOSIT' || t.type === 'COMMISSION_EARNED');
    const debits = transactions.filter(t => t.type === 'DEBIT' || t.type === 'WITHDRAWAL' || t.type === 'TRANSFER_OUT');

    return {
      balance: Number(wallet.balance),
      availableBalance: Number(wallet.availableBalance),
      pendingBalance: Number(wallet.pendingBalance),
      totalCredit: Number(wallet.totalCredit),
      totalDebit: Number(wallet.totalDebit),
      totalTransactions: transactions.length,
      totalCredits: credits.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
      totalDebits: debits.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
      walletType: wallet.walletType,
      isFrozen: wallet.isFrozen
    };
  }
}
