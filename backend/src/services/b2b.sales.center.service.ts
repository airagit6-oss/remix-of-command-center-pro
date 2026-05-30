// ============================================================
// B2B SALES CENTER SERVICE
// Corporate Leads, Enterprise Leads, Bulk Deals,
// Proposal Builder, Quotation Builder, Contract Builder, Deal Pipeline
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class B2BSalesCenterService {
  // Corporate Lead Methods
  static async createCorporateLead(data: {
    companyId: string;
    companyName: string;
    industry?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    leadSource?: string;
    estimatedValue?: number;
    estimatedDealSize?: number;
    assignedTo?: string;
    notes?: string;
    metadata?: any;
  }) {
    const lead = await prisma.corporateLead.create({
      data
    });

    // Log lead creation
    await prisma.auditLog.create({
      data: {
        action: 'CORPORATE_LEAD_CREATED',
        entity: 'CorporateLead',
        entityId: lead.id,
        metadata: { companyId: lead.companyId, companyName: lead.companyName }
      }
    });

    return lead;
  }

  static async getCorporateLeads(companyId?: string, leadStatus?: any, assignedTo?: string) {
    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (leadStatus) where.leadStatus = leadStatus;
    if (assignedTo) where.assignedTo = assignedTo;

    return prisma.corporateLead.findMany({
      where,
      include: { assignedUser: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateCorporateLead(leadId: string, data: any) {
    const lead = await prisma.corporateLead.update({
      where: { id: leadId },
      data
    });

    // Log lead update
    await prisma.auditLog.create({
      data: {
        action: 'CORPORATE_LEAD_UPDATED',
        entity: 'CorporateLead',
        entityId: leadId
      }
    });

    return lead;
  }

  static async updateCorporateLeadStatus(leadId: string, leadStatus: any) {
    const lead = await prisma.corporateLead.update({
      where: { id: leadId },
      data: { leadStatus }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'CORPORATE_LEAD_STATUS_UPDATED',
        entity: 'CorporateLead',
        entityId: leadId,
        metadata: { leadStatus }
      }
    });

    return lead;
  }

  // Enterprise Lead Methods
  static async createEnterpriseLead(data: {
    companyId: string;
    companyName: string;
    industry?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    leadSource?: string;
    estimatedValue: number;
    estimatedDealSize: number;
    tier: any;
    assignedTo?: string;
    notes?: string;
    metadata?: any;
  }) {
    const lead = await prisma.enterpriseLead.create({
      data
    });

    // Log lead creation
    await prisma.auditLog.create({
      data: {
        action: 'ENTERPRISE_LEAD_CREATED',
        entity: 'EnterpriseLead',
        entityId: lead.id,
        metadata: { companyId: lead.companyId, companyName: lead.companyName, tier: lead.tier }
      }
    });

    return lead;
  }

  static async getEnterpriseLeads(companyId?: string, leadStatus?: any, tier?: any, assignedTo?: string) {
    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (leadStatus) where.leadStatus = leadStatus;
    if (tier) where.tier = tier;
    if (assignedTo) where.assignedTo = assignedTo;

    return prisma.enterpriseLead.findMany({
      where,
      include: { assignedUser: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateEnterpriseLead(leadId: string, data: any) {
    const lead = await prisma.enterpriseLead.update({
      where: { id: leadId },
      data
    });

    // Log lead update
    await prisma.auditLog.create({
      data: {
        action: 'ENTERPRISE_LEAD_UPDATED',
        entity: 'EnterpriseLead',
        entityId: leadId
      }
    });

    return lead;
  }

  static async updateEnterpriseLeadStatus(leadId: string, leadStatus: any) {
    const lead = await prisma.enterpriseLead.update({
      where: { id: leadId },
      data: { leadStatus }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'ENTERPRISE_LEAD_STATUS_UPDATED',
        entity: 'EnterpriseLead',
        entityId: leadId,
        metadata: { leadStatus }
      }
    });

    return lead;
  }

  // Bulk Deal Methods
  static async createBulkDeal(data: {
    dealName: string;
    description?: string;
    clientId: string;
    clientName: string;
    products?: any;
    totalValue: number;
    discountPercentage: number;
    finalValue: number;
    assignedTo?: string;
    validUntil?: Date;
    metadata?: any;
  }) {
    const deal = await prisma.bulkDeal.create({
      data
    });

    // Log deal creation
    await prisma.auditLog.create({
      data: {
        action: 'BULK_DEAL_CREATED',
        entity: 'BulkDeal',
        entityId: deal.id,
        metadata: { clientName: deal.clientName, finalValue: deal.finalValue }
      }
    });

    return deal;
  }

  static async getBulkDeals(dealStatus?: any, assignedTo?: string) {
    const where: any = {};
    if (dealStatus) where.dealStatus = dealStatus;
    if (assignedTo) where.assignedTo = assignedTo;

    return prisma.bulkDeal.findMany({
      where,
      include: { assignedUser: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateBulkDeal(dealId: string, data: any) {
    const deal = await prisma.bulkDeal.update({
      where: { id: dealId },
      data
    });

    // Log deal update
    await prisma.auditLog.create({
      data: {
        action: 'BULK_DEAL_UPDATED',
        entity: 'BulkDeal',
        entityId: dealId
      }
    });

    return deal;
  }

  static async updateBulkDealStatus(dealId: string, dealStatus: any) {
    const data: any = { dealStatus };
    if (dealStatus === 'SIGNED') data.signedAt = new Date();

    const deal = await prisma.bulkDeal.update({
      where: { id: dealId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'BULK_DEAL_STATUS_UPDATED',
        entity: 'BulkDeal',
        entityId: dealId,
        metadata: { dealStatus }
      }
    });

    return deal;
  }

  // Proposal Methods
  static async createProposal(data: {
    dealId?: string;
    clientId: string;
    clientName: string;
    title: string;
    content?: any;
    metadata?: any;
  }) {
    const proposal = await prisma.proposal.create({
      data
    });

    // Log proposal creation
    await prisma.auditLog.create({
      data: {
        action: 'PROPOSAL_CREATED',
        entity: 'Proposal',
        entityId: proposal.id,
        metadata: { dealId: proposal.dealId, clientName: proposal.clientName }
      }
    });

    return proposal;
  }

  static async getProposals(dealId?: string, status?: any) {
    const where: any = {};
    if (dealId) where.dealId = dealId;
    if (status) where.status = status;

    return prisma.proposal.findMany({
      where,
      include: { deal: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateProposal(proposalId: string, data: any) {
    const proposal = await prisma.proposal.update({
      where: { id: proposalId },
      data
    });

    // Log proposal update
    await prisma.auditLog.create({
      data: {
        action: 'PROPOSAL_UPDATED',
        entity: 'Proposal',
        entityId: proposalId
      }
    });

    return proposal;
  }

  static async updateProposalStatus(proposalId: string, status: any) {
    const data: any = { status };
    if (status === 'SENT') data.sentAt = new Date();
    if (status === 'VIEWED') data.viewedAt = new Date();
    if (status === 'ACCEPTED') data.acceptedAt = new Date();
    if (status === 'REJECTED') data.rejectedAt = new Date();

    const proposal = await prisma.proposal.update({
      where: { id: proposalId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'PROPOSAL_STATUS_UPDATED',
        entity: 'Proposal',
        entityId: proposalId,
        metadata: { status }
      }
    });

    return proposal;
  }

  // Quotation Methods
  static async createQuotation(data: {
    dealId?: string;
    clientId: string;
    clientName: string;
    items?: any;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    currency?: string;
    validUntil?: Date;
    metadata?: any;
  }) {
    const quotation = await prisma.quotation.create({
      data
    });

    // Log quotation creation
    await prisma.auditLog.create({
      data: {
        action: 'QUOTATION_CREATED',
        entity: 'Quotation',
        entityId: quotation.id,
        metadata: { dealId: quotation.dealId, total: quotation.total }
      }
    });

    return quotation;
  }

  static async getQuotations(dealId?: string, status?: any) {
    const where: any = {};
    if (dealId) where.dealId = dealId;
    if (status) where.status = status;

    return prisma.quotation.findMany({
      where,
      include: { deal: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateQuotation(quotationId: string, data: any) {
    const quotation = await prisma.quotation.update({
      where: { id: quotationId },
      data
    });

    // Log quotation update
    await prisma.auditLog.create({
      data: {
        action: 'QUOTATION_UPDATED',
        entity: 'Quotation',
        entityId: quotationId
      }
    });

    return quotation;
  }

  static async updateQuotationStatus(quotationId: string, status: any) {
    const data: any = { status };
    if (status === 'SENT') data.sentAt = new Date();
    if (status === 'ACCEPTED') data.acceptedAt = new Date();
    if (status === 'REJECTED') data.rejectedAt = new Date();

    const quotation = await prisma.quotation.update({
      where: { id: quotationId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'QUOTATION_STATUS_UPDATED',
        entity: 'Quotation',
        entityId: quotationId,
        metadata: { status }
      }
    });

    return quotation;
  }

  // Contract Methods
  static async createContract(data: {
    dealId?: string;
    clientId: string;
    clientName: string;
    title: string;
    content?: any;
    startDate: Date;
    endDate: Date;
    metadata?: any;
  }) {
    const contract = await prisma.contract.create({
      data
    });

    // Log contract creation
    await prisma.auditLog.create({
      data: {
        action: 'CONTRACT_CREATED',
        entity: 'Contract',
        entityId: contract.id,
        metadata: { dealId: contract.dealId, clientName: contract.clientName }
      }
    });

    return contract;
  }

  static async getContracts(dealId?: string, status?: any) {
    const where: any = {};
    if (dealId) where.dealId = dealId;
    if (status) where.status = status;

    return prisma.contract.findMany({
      where,
      include: { deal: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateContract(contractId: string, data: any) {
    const contract = await prisma.contract.update({
      where: { id: contractId },
      data
    });

    // Log contract update
    await prisma.auditLog.create({
      data: {
        action: 'CONTRACT_UPDATED',
        entity: 'Contract',
        entityId: contractId
      }
    });

    return contract;
  }

  static async updateContractStatus(contractId: string, status: any) {
    const data: any = { status };
    if (status === 'SIGNED') data.signedAt = new Date();

    const contract = await prisma.contract.update({
      where: { id: contractId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'CONTRACT_STATUS_UPDATED',
        entity: 'Contract',
        entityId: contractId,
        metadata: { status }
      }
    });

    return contract;
  }

  // Deal Pipeline Methods
  static async createDealPipeline(data: {
    dealId?: string;
    stage: any;
    probability: number;
    estimatedCloseDate?: Date;
    notes?: string;
    metadata?: any;
  }) {
    const pipeline = await prisma.dealPipeline.create({
      data
    });

    // Log pipeline creation
    await prisma.auditLog.create({
      data: {
        action: 'DEAL_PIPELINE_CREATED',
        entity: 'DealPipeline',
        entityId: pipeline.id,
        metadata: { dealId: pipeline.dealId, stage: pipeline.stage }
      }
    });

    return pipeline;
  }

  static async getDealPipelines(dealId?: string, stage?: any) {
    const where: any = {};
    if (dealId) where.dealId = dealId;
    if (stage) where.stage = stage;

    return prisma.dealPipeline.findMany({
      where,
      include: { deal: true },
      orderBy: { movedAt: 'desc' }
    });
  }

  static async updateDealPipeline(pipelineId: string, data: any) {
    const pipeline = await prisma.dealPipeline.update({
      where: { id: pipelineId },
      data: { ...data, movedAt: new Date() }
    });

    // Log pipeline update
    await prisma.auditLog.create({
      data: {
        action: 'DEAL_PIPELINE_UPDATED',
        entity: 'DealPipeline',
        entityId: pipelineId
      }
    });

    return pipeline;
  }

  static async moveDealStage(pipelineId: string, stage: any, probability: number) {
    const data: any = { stage, probability, movedAt: new Date() };
    if (stage === 'CLOSED_WON' || stage === 'CLOSED_LOST') data.actualCloseDate = new Date();

    const pipeline = await prisma.dealPipeline.update({
      where: { id: pipelineId },
      data
    });

    // Log stage move
    await prisma.auditLog.create({
      data: {
        action: 'DEAL_PIPELINE_STAGE_MOVED',
        entity: 'DealPipeline',
        entityId: pipelineId,
        metadata: { stage, probability }
      }
    });

    return pipeline;
  }

  // B2B Sales Analytics
  static async getB2BSalesAnalytics(assignedTo?: string) {
    const where = assignedTo ? { assignedTo } : {};

    const [
      totalCorporateLeads,
      totalEnterpriseLeads,
      totalBulkDeals,
      totalDealsValue,
      wonDealsCount,
      wonDealsValue,
      pendingProposals,
      pendingQuotations,
      activeContracts
    ] = await Promise.all([
      prisma.corporateLead.count({ where: assignedTo ? { assignedTo } : {} }),
      prisma.enterpriseLead.count({ where: assignedTo ? { assignedTo } : {} }),
      prisma.bulkDeal.count({ where }),
      prisma.bulkDeal.aggregate({
        where,
        _sum: { finalValue: true }
      }),
      prisma.bulkDeal.count({ where: { ...where, dealStatus: 'SIGNED' } }),
      prisma.bulkDeal.aggregate({
        where: { ...where, dealStatus: 'SIGNED' },
        _sum: { finalValue: true }
      }),
      prisma.proposal.count({ where: { status: 'SENT' } }),
      prisma.quotation.count({ where: { status: 'SENT' } }),
      prisma.contract.count({ where: { status: 'ACTIVE' } })
    ]);

    return {
      leads: {
        corporate: totalCorporateLeads,
        enterprise: totalEnterpriseLeads
      },
      deals: {
        total: totalBulkDeals,
        totalValue: totalDealsValue._sum.finalValue || 0,
        won: wonDealsCount,
        wonValue: wonDealsValue._sum.finalValue || 0
      },
      documents: {
        pendingProposals,
        pendingQuotations,
        activeContracts
      }
    };
  }
}
