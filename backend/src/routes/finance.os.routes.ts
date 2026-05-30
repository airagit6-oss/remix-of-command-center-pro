// ============================================================
// FINANCE OS ROUTES
// API endpoints for finance management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { FinanceOSService } from '../services/finance.os.service';

// POST /finance/general-ledger
export async function createGeneralLedgerAccount(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const account = await FinanceOSService.createGeneralLedgerAccount(data);
    return reply.send(account);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create account' });
  }
}

// GET /finance/general-ledger
export async function getGeneralLedgerAccounts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const accountType = (req.query as any).accountType;
    const accounts = await FinanceOSService.getGeneralLedgerAccounts(accountType);
    return reply.send(accounts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch accounts' });
  }
}

// POST /finance/general-ledger/entries
export async function addLedgerEntry(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const entry = await FinanceOSService.addLedgerEntry(data);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add entry' });
  }
}

// POST /finance/income
export async function addIncomeEntry(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const entry = await FinanceOSService.addIncomeEntry(data);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add income' });
  }
}

// GET /finance/income
export async function getIncomeLedger(req: FastifyRequest, reply: FastifyReply) {
  try {
    const source = (req.query as any).source;
    const startDate = (req.query as any).startDate ? new Date(req.query.startDate) : undefined;
    const endDate = (req.query as any).endDate ? new Date(req.query.endDate) : undefined;
    const ledger = await FinanceOSService.getIncomeLedger(source, startDate, endDate);
    return reply.send(ledger);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch income ledger' });
  }
}

// POST /finance/expense
export async function addExpenseEntry(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const entry = await FinanceOSService.addExpenseEntry(data);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add expense' });
  }
}

// GET /finance/expense
export async function getExpenseLedger(req: FastifyRequest, reply: FastifyReply) {
  try {
    const category = (req.query as any).category;
    const startDate = (req.query as any).startDate ? new Date(req.query.startDate) : undefined;
    const endDate = (req.query as any).endDate ? new Date(req.query.endDate) : undefined;
    const ledger = await FinanceOSService.getExpenseLedger(category, startDate, endDate);
    return reply.send(ledger);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch expense ledger' });
  }
}

// POST /finance/commission
export async function addCommissionEntry(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const entry = await FinanceOSService.addCommissionEntry(data);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add commission' });
  }
}

// GET /finance/commission
export async function getCommissionLedger(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const status = (req.query as any).status;
    const ledger = await FinanceOSService.getCommissionLedger(userId, status);
    return reply.send(ledger);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch commission ledger' });
  }
}

// PATCH /finance/commission/:entryId/status
export async function updateCommissionStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { entryId } = req.params as any;
    const { status } = req.body as any;
    const entry = await FinanceOSService.updateCommissionStatus(entryId, status);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update status' });
  }
}

// POST /finance/wallet-ledger
export async function addWalletLedgerEntry(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const entry = await FinanceOSService.addWalletLedgerEntry(data);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add entry' });
  }
}

// GET /finance/wallet-ledger
export async function getWalletLedger(req: FastifyRequest, reply: FastifyReply) {
  try {
    const walletId = (req.query as any).walletId;
    const transactionType = (req.query as any).transactionType;
    const ledger = await FinanceOSService.getWalletLedger(walletId, transactionType);
    return reply.send(ledger);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch wallet ledger' });
  }
}

// POST /finance/settlement
export async function addSettlementEntry(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const entry = await FinanceOSService.addSettlementEntry(data);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to add settlement' });
  }
}

// GET /finance/settlement
export async function getSettlementLedger(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req.query as any).userId;
    const status = (req.query as any).status;
    const ledger = await FinanceOSService.getSettlementLedger(userId, status);
    return reply.send(ledger);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch settlement ledger' });
  }
}

// PATCH /finance/settlement/:entryId/status
export async function updateSettlementStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { entryId } = req.params as any;
    const { status } = req.body as any;
    const entry = await FinanceOSService.updateSettlementStatus(entryId, status);
    return reply.send(entry);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update status' });
  }
}

// POST /finance/gst-reports
export async function createGSTReport(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const report = await FinanceOSService.createGSTReport(data);
    return reply.send(report);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create report' });
  }
}

// GET /finance/gst-reports
export async function getGSTReports(req: FastifyRequest, reply: FastifyReply) {
  try {
    const period = (req.query as any).period;
    const status = (req.query as any).status;
    const reports = await FinanceOSService.getGSTReports(period, status);
    return reply.send(reports);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch reports' });
  }
}

// PATCH /finance/gst-reports/:reportId/status
export async function updateGSTReportStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { reportId } = req.params as any;
    const { status } = req.body as any;
    const report = await FinanceOSService.updateGSTReportStatus(reportId, status);
    return reply.send(report);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update status' });
  }
}

// POST /finance/tds-reports
export async function createTDSReport(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const report = await FinanceOSService.createTDSReport(data);
    return reply.send(report);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create report' });
  }
}

// GET /finance/tds-reports
export async function getTDSReports(req: FastifyRequest, reply: FastifyReply) {
  try {
    const period = (req.query as any).period;
    const status = (req.query as any).status;
    const reports = await FinanceOSService.getTDSReports(period, status);
    return reply.send(reports);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch reports' });
  }
}

// PATCH /finance/tds-reports/:reportId/status
export async function updateTDSReportStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { reportId } = req.params as any;
    const { status } = req.body as any;
    const report = await FinanceOSService.updateTDSReportStatus(reportId, status);
    return reply.send(report);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update status' });
  }
}

// POST /finance/profit-loss
export async function createProfitLossStatement(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const statement = await FinanceOSService.createProfitLossStatement(data);
    return reply.send(statement);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create statement' });
  }
}

// GET /finance/profit-loss
export async function getProfitLossStatements(req: FastifyRequest, reply: FastifyReply) {
  try {
    const period = (req.query as any).period;
    const statements = await FinanceOSService.getProfitLossStatements(period);
    return reply.send(statements);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch statements' });
  }
}

// POST /finance/cash-flow
export async function createCashFlowStatement(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const statement = await FinanceOSService.createCashFlowStatement(data);
    return reply.send(statement);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create statement' });
  }
}

// GET /finance/cash-flow
export async function getCashFlowStatements(req: FastifyRequest, reply: FastifyReply) {
  try {
    const period = (req.query as any).period;
    const statements = await FinanceOSService.getCashFlowStatements(period);
    return reply.send(statements);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch statements' });
  }
}

// POST /finance/revenue-forecast
export async function createRevenueForecast(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const forecast = await FinanceOSService.createRevenueForecast(data);
    return reply.send(forecast);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create forecast' });
  }
}

// GET /finance/revenue-forecast
export async function getRevenueForecasts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const period = (req.query as any).period;
    const forecastType = (req.query as any).forecastType;
    const forecasts = await FinanceOSService.getRevenueForecasts(period, forecastType);
    return reply.send(forecasts);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch forecasts' });
  }
}

// PATCH /finance/revenue-forecast/:forecastId
export async function updateRevenueForecast(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { forecastId } = req.params as any;
    const data = req.body as any;
    const forecast = await FinanceOSService.updateRevenueForecast(forecastId, data);
    return reply.send(forecast);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update forecast' });
  }
}

// GET /finance/statistics
export async function getFinanceStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const stats = await FinanceOSService.getFinanceStatistics();
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch statistics' });
  }
}

export function financeOSRoutes(fastify: FastifyInstance) {
  // General Ledger
  fastify.post('/finance/general-ledger', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createGeneralLedgerAccount);
  fastify.get('/finance/general-ledger', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getGeneralLedgerAccounts);
  fastify.post('/finance/general-ledger/entries', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addLedgerEntry);
  
  // Income Ledger
  fastify.post('/finance/income', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addIncomeEntry);
  fastify.get('/finance/income', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getIncomeLedger);
  
  // Expense Ledger
  fastify.post('/finance/expense', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addExpenseEntry);
  fastify.get('/finance/expense', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getExpenseLedger);
  
  // Commission Ledger
  fastify.post('/finance/commission', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addCommissionEntry);
  fastify.get('/finance/commission', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCommissionLedger);
  fastify.patch('/finance/commission/:entryId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateCommissionStatus);
  
  // Wallet Ledger
  fastify.post('/finance/wallet-ledger', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addWalletLedgerEntry);
  fastify.get('/finance/wallet-ledger', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getWalletLedger);
  
  // Settlement Ledger
  fastify.post('/finance/settlement', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, addSettlementEntry);
  fastify.get('/finance/settlement', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getSettlementLedger);
  fastify.patch('/finance/settlement/:entryId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateSettlementStatus);
  
  // GST Reports
  fastify.post('/finance/gst-reports', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createGSTReport);
  fastify.get('/finance/gst-reports', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getGSTReports);
  fastify.patch('/finance/gst-reports/:reportId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateGSTReportStatus);
  
  // TDS Reports
  fastify.post('/finance/tds-reports', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createTDSReport);
  fastify.get('/finance/tds-reports', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getTDSReports);
  fastify.patch('/finance/tds-reports/:reportId/status', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateTDSReportStatus);
  
  // Profit & Loss
  fastify.post('/finance/profit-loss', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createProfitLossStatement);
  fastify.get('/finance/profit-loss', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getProfitLossStatements);
  
  // Cash Flow
  fastify.post('/finance/cash-flow', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createCashFlowStatement);
  fastify.get('/finance/cash-flow', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getCashFlowStatements);
  
  // Revenue Forecast
  fastify.post('/finance/revenue-forecast', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createRevenueForecast);
  fastify.get('/finance/revenue-forecast', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getRevenueForecasts);
  fastify.patch('/finance/revenue-forecast/:forecastId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateRevenueForecast);
  
  // Statistics
  fastify.get('/finance/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFinanceStatistics);
}
