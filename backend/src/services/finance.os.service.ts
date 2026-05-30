// ============================================================
// FINANCE OS SERVICE
// General Ledger, Income Ledger, Expense Ledger, Commission Ledger,
// Wallet Ledger, Settlement Ledger, GST Reports, TDS Reports,
// Profit & Loss, Cash Flow, Revenue Forecast
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FinanceOSService {
  // General Ledger Methods
  static async createGeneralLedgerAccount(data: {
    accountCode: string;
    accountName: string;
    accountType: any;
    metadata?: any;
  }) {
    const account = await prisma.generalLedger.create({
      data
    });

    // Log account creation
    await prisma.auditLog.create({
      data: {
        action: 'GENERAL_LEDGER_ACCOUNT_CREATED',
        entity: 'GeneralLedger',
        entityId: account.id,
        metadata: { accountCode: account.accountCode, accountType: account.accountType }
      }
    });

    return account;
  }

  static async getGeneralLedgerAccounts(accountType?: any) {
    const where = accountType ? { accountType } : {};
    return prisma.generalLedger.findMany({
      where,
      include: { entries: true },
      orderBy: { accountCode: 'asc' }
    });
  }

  static async addLedgerEntry(data: {
    ledgerId: string;
    entryType: any;
    amount: number;
    description?: string;
    referenceId?: string;
    referenceType?: string;
    metadata?: any;
  }) {
    const entry = await prisma.ledgerEntry.create({
      data
    });

    // Update ledger balance
    const ledger = await prisma.generalLedger.findUnique({
      where: { id: data.ledgerId }
    });

    if (ledger) {
      const balanceChange = data.entryType === 'DEBIT' ? data.amount : -data.amount;
      await prisma.generalLedger.update({
        where: { id: data.ledgerId },
        data: { balance: { increment: balanceChange } }
      });
    }

    return entry;
  }

  // Income Ledger Methods
  static async addIncomeEntry(data: {
    source: any;
    amount: number;
    currency?: string;
    referenceId?: string;
    referenceType?: string;
    metadata?: any;
  }) {
    return prisma.incomeLedger.create({
      data
    });
  }

  static async getIncomeLedger(source?: any, startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (source) where.source = source;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    return prisma.incomeLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Expense Ledger Methods
  static async addExpenseEntry(data: {
    category: any;
    amount: number;
    currency?: string;
    referenceId?: string;
    referenceType?: string;
    metadata?: any;
  }) {
    return prisma.expenseLedger.create({
      data
    });
  }

  static async getExpenseLedger(category?: any, startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (category) where.category = category;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    return prisma.expenseLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Commission Ledger Methods
  static async addCommissionEntry(data: {
    userId: string;
    orderId?: string;
    productId?: string;
    amount: number;
    rate: number;
    currency?: string;
    metadata?: any;
  }) {
    const entry = await prisma.commissionLedger.create({
      data
    });

    // Log commission entry
    await prisma.auditLog.create({
      data: {
        action: 'COMMISSION_ENTRY_CREATED',
        entity: 'CommissionLedger',
        entityId: entry.id,
        metadata: { userId: entry.userId, amount: entry.amount }
      }
    });

    return entry;
  }

  static async getCommissionLedger(userId?: string, status?: any) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return prisma.commissionLedger.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateCommissionStatus(entryId: string, status: any) {
    const entry = await prisma.commissionLedger.update({
      where: { id: entryId },
      data: {
        status,
        paidAt: status === 'PAID' ? new Date() : null
      }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'COMMISSION_STATUS_UPDATED',
        entity: 'CommissionLedger',
        entityId: entryId,
        metadata: { status }
      }
    });

    return entry;
  }

  // Wallet Ledger Methods
  static async addWalletLedgerEntry(data: {
    walletId: string;
    transactionType: any;
    amount: number;
    balance: number;
    referenceId?: string;
    referenceType?: string;
    metadata?: any;
  }) {
    return prisma.walletLedger.create({
      data
    });
  }

  static async getWalletLedger(walletId?: string, transactionType?: any) {
    const where: any = {};
    if (walletId) where.walletId = walletId;
    if (transactionType) where.transactionType = transactionType;

    return prisma.walletLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Settlement Ledger Methods
  static async addSettlementEntry(data: {
    userId: string;
    amount: number;
    currency?: string;
    metadata?: any;
  }) {
    const entry = await prisma.settlementLedger.create({
      data
    });

    // Log settlement entry
    await prisma.auditLog.create({
      data: {
        action: 'SETTLEMENT_ENTRY_CREATED',
        entity: 'SettlementLedger',
        entityId: entry.id,
        metadata: { userId: entry.userId, amount: entry.amount }
      }
    });

    return entry;
  }

  static async getSettlementLedger(userId?: string, status?: any) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return prisma.settlementLedger.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateSettlementStatus(entryId: string, status: any) {
    const entry = await prisma.settlementLedger.update({
      where: { id: entryId },
      data: {
        status,
        settledAt: status === 'COMPLETED' ? new Date() : null
      }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'SETTLEMENT_STATUS_UPDATED',
        entity: 'SettlementLedger',
        entityId: entryId,
        metadata: { status }
      }
    });

    return entry;
  }

  // GST Report Methods
  static async createGSTReport(data: {
    period: string;
    startDate: Date;
    endDate: Date;
    totalRevenue: number;
    totalTax: number;
    totalExpense: number;
    taxCredit: number;
    netTax: number;
    metadata?: any;
  }) {
    const report = await prisma.gSTReport.create({
      data
    });

    // Log report creation
    await prisma.auditLog.create({
      data: {
        action: 'GST_REPORT_CREATED',
        entity: 'GSTReport',
        entityId: report.id,
        metadata: { period: report.period }
      }
    });

    return report;
  }

  static async getGSTReports(period?: string, status?: any) {
    const where: any = {};
    if (period) where.period = period;
    if (status) where.status = status;

    return prisma.gSTReport.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  static async updateGSTReportStatus(reportId: string, status: any) {
    const report = await prisma.gSTReport.update({
      where: { id: reportId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'GST_REPORT_STATUS_UPDATED',
        entity: 'GSTReport',
        entityId: reportId,
        metadata: { status }
      }
    });

    return report;
  }

  // TDS Report Methods
  static async createTDSReport(data: {
    period: string;
    startDate: Date;
    endDate: Date;
    totalDeductible: number;
    totalTax: number;
    metadata?: any;
  }) {
    const report = await prisma.tDSReport.create({
      data
    });

    // Log report creation
    await prisma.auditLog.create({
      data: {
        action: 'TDS_REPORT_CREATED',
        entity: 'TDSReport',
        entityId: report.id,
        metadata: { period: report.period }
      }
    });

    return report;
  }

  static async getTDSReports(period?: string, status?: any) {
    const where: any = {};
    if (period) where.period = period;
    if (status) where.status = status;

    return prisma.tDSReport.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  static async updateTDSReportStatus(reportId: string, status: any) {
    const report = await prisma.tDSReport.update({
      where: { id: reportId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'TDS_REPORT_STATUS_UPDATED',
        entity: 'TDSReport',
        entityId: reportId,
        metadata: { status }
      }
    });

    return report;
  }

  // Profit & Loss Statement Methods
  static async createProfitLossStatement(data: {
    period: string;
    startDate: Date;
    endDate: Date;
    totalRevenue: number;
    totalExpense: number;
    grossProfit: number;
    operatingExpense: number;
    netProfit: number;
    metadata?: any;
  }) {
    const statement = await prisma.profitLossStatement.create({
      data
    });

    // Log statement creation
    await prisma.auditLog.create({
      data: {
        action: 'PROFIT_LOSS_STATEMENT_CREATED',
        entity: 'ProfitLossStatement',
        entityId: statement.id,
        metadata: { period: statement.period }
      }
    });

    return statement;
  }

  static async getProfitLossStatements(period?: string) {
    const where = period ? { period } : {};
    return prisma.profitLossStatement.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  // Cash Flow Statement Methods
  static async createCashFlowStatement(data: {
    period: string;
    startDate: Date;
    endDate: Date;
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    netCashFlow: number;
    metadata?: any;
  }) {
    const statement = await prisma.cashFlowStatement.create({
      data
    });

    // Log statement creation
    await prisma.auditLog.create({
      data: {
        action: 'CASH_FLOW_STATEMENT_CREATED',
        entity: 'CashFlowStatement',
        entityId: statement.id,
        metadata: { period: statement.period }
      }
    });

    return statement;
  }

  static async getCashFlowStatements(period?: string) {
    const where = period ? { period } : {};
    return prisma.cashFlowStatement.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  // Revenue Forecast Methods
  static async createRevenueForecast(data: {
    period: string;
    forecastType: any;
    forecastAmount: number;
    confidence?: number;
    metadata?: any;
  }) {
    const forecast = await prisma.revenueForecast.create({
      data
    });

    // Log forecast creation
    await prisma.auditLog.create({
      data: {
        action: 'REVENUE_FORECAST_CREATED',
        entity: 'RevenueForecast',
        entityId: forecast.id,
        metadata: { period: forecast.period, forecastType: forecast.forecastType }
      }
    });

    return forecast;
  }

  static async getRevenueForecasts(period?: string, forecastType?: any) {
    const where: any = {};
    if (period) where.period = period;
    if (forecastType) where.forecastType = forecastType;

    return prisma.revenueForecast.findMany({
      where,
      orderBy: { period: 'desc' }
    });
  }

  static async updateRevenueForecast(forecastId: string, data: any) {
    const forecast = await prisma.revenueForecast.update({
      where: { id: forecastId },
      data
    });

    // Log forecast update
    await prisma.auditLog.create({
      data: {
        action: 'REVENUE_FORECAST_UPDATED',
        entity: 'RevenueForecast',
        entityId: forecastId
      }
    });

    return forecast;
  }

  // Finance Statistics
  static async getFinanceStatistics() {
    const [
      totalIncome,
      totalExpense,
      totalCommission,
      pendingCommission,
      totalSettlements,
      pendingSettlements,
      totalGSTR,
      totalTDS,
      totalProfitLoss,
      totalCashFlow,
      totalForecasts
    ] = await Promise.all([
      prisma.incomeLedger.aggregate({ _sum: { amount: true } }),
      prisma.expenseLedger.aggregate({ _sum: { amount: true } }),
      prisma.commissionLedger.aggregate({ _sum: { amount: true } }),
      prisma.commissionLedger.count({ where: { status: 'PENDING' } }),
      prisma.settlementLedger.aggregate({ _sum: { amount: true } }),
      prisma.settlementLedger.count({ where: { status: 'PENDING' } }),
      prisma.gSTReport.count(),
      prisma.tDSReport.count(),
      prisma.profitLossStatement.count(),
      prisma.cashFlowStatement.count(),
      prisma.revenueForecast.count()
    ]);

    return {
      income: {
        total: totalIncome._sum.amount || 0
      },
      expense: {
        total: totalExpense._sum.amount || 0
      },
      commission: {
        total: totalCommission._sum.amount || 0,
        pending: pendingCommission
      },
      settlement: {
        total: totalSettlements._sum.amount || 0,
        pending: pendingSettlements
      },
      reports: {
        gst: totalGSTR,
        tds: totalTDS,
        profitLoss: totalProfitLoss,
        cashFlow: totalCashFlow,
        forecasts: totalForecasts
      }
    };
  }
}
