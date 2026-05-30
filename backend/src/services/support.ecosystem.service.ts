// ============================================================
// SUPPORT ECOSYSTEM SERVICE
// Ticket System, Live Chat, WhatsApp Support, Email Support,
// Knowledge Base, Community Forum, Bug Reports, Feature Requests,
// Roadmap Voting, Customer Feedback, Escalation Engine, SLA Engine
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SupportEcosystemService {
  // Support Ticket Methods
  static async createTicket(data: {
    userId: string;
    subject: string;
    description: string;
    category: any;
    priority?: any;
    metadata?: any;
  }) {
    // Get SLA policy for category
    const slaPolicy = await prisma.sLAPolicy.findFirst({
      where: { category: data.category, enabled: true }
    });

    const slaDeadline = slaPolicy ? new Date(Date.now() + slaPolicy.responseTime * 60000) : null;

    const ticket = await prisma.supportTicket.create({
      data: {
        ...data,
        priority: data.priority || 'MEDIUM',
        slaDeadline
      }
    });

    // Log ticket creation
    await prisma.auditLog.create({
      data: {
        action: 'SUPPORT_TICKET_CREATED',
        entity: 'SupportTicket',
        entityId: ticket.id,
        metadata: { category: ticket.category, priority: ticket.priority }
      }
    });

    return ticket;
  }

  static async getTickets(userId?: string, assignedTo?: string, status?: any, category?: any) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (assignedTo) where.assignedTo = assignedTo;
    if (status) where.status = status;
    if (category) where.category = category;

    return prisma.supportTicket.findMany({
      where,
      include: { user: true, messages: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getTicket(ticketId: string) {
    return prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { user: true, messages: { include: { user: true } } }
    });
  }

  static async updateTicket(ticketId: string, data: any) {
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data
    });

    // Log ticket update
    await prisma.auditLog.create({
      data: {
        action: 'SUPPORT_TICKET_UPDATED',
        entity: 'SupportTicket',
        entityId: ticketId
      }
    });

    return ticket;
  }

  static async assignTicket(ticketId: string, assignedTo: string) {
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedTo,
        assignedAt: new Date(),
        status: 'IN_PROGRESS'
      }
    });

    // Log ticket assignment
    await prisma.auditLog.create({
      data: {
        action: 'SUPPORT_TICKET_ASSIGNED',
        entity: 'SupportTicket',
        entityId: ticketId,
        metadata: { assignedTo }
      }
    });

    return ticket;
  }

  static async resolveTicket(ticketId: string, resolution: string) {
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        resolution
      }
    });

    // Log ticket resolution
    await prisma.auditLog.create({
      data: {
        action: 'SUPPORT_TICKET_RESOLVED',
        entity: 'SupportTicket',
        entityId: ticketId
      }
    });

    return ticket;
  }

  // Ticket Message Methods
  static async addTicketMessage(data: {
    ticketId: string;
    userId: string;
    message: string;
    attachments?: string[];
    isInternal?: boolean;
    metadata?: any;
  }) {
    return prisma.ticketMessage.create({
      data
    });
  }

  // Live Chat Methods
  static async createChatSession(data: {
    userId?: string;
    visitorId?: string;
    metadata?: any;
  }) {
    return prisma.liveChatSession.create({
      data: {
        ...data,
        status: 'WAITING'
      }
    });
  }

  static async assignChatAgent(sessionId: string, agentId: string) {
    return prisma.liveChatSession.update({
      where: { id: sessionId },
      data: {
        agentId,
        status: 'ACTIVE'
      }
    });
  }

  static async addChatMessage(data: {
    sessionId: string;
    senderId: string;
    senderType: any;
    message: string;
    attachments?: string[];
    metadata?: any;
  }) {
    return prisma.chatMessage.create({
      data
    });
  }

  static async closeChatSession(sessionId: string) {
    return prisma.liveChatSession.update({
      where: { id: sessionId },
      data: {
        status: 'CLOSED',
        endedAt: new Date()
      }
    });
  }

  // Knowledge Base Methods
  static async createKBArticle(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    category: string;
    tags?: string[];
    published?: boolean;
    featured?: boolean;
    authorId: string;
    metadata?: any;
  }) {
    const article = await prisma.knowledgeBaseArticle.create({
      data
    });

    // Log article creation
    await prisma.auditLog.create({
      data: {
        action: 'KB_ARTICLE_CREATED',
        entity: 'KnowledgeBaseArticle',
        entityId: article.id,
        metadata: { title: article.title, category: article.category }
      }
    });

    return article;
  }

  static async getKBArticles(category?: string, publishedOnly: boolean = true) {
    const where: any = {};
    if (category) where.category = category;
    if (publishedOnly) where.published = true;

    return prisma.knowledgeBaseArticle.findMany({
      where,
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getKBArticle(slug: string) {
    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug },
      include: { author: true }
    });

    if (article) {
      // Increment view count
      await prisma.knowledgeBaseArticle.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } }
      });
    }

    return article;
  }

  static async markKBHelpful(articleId: string) {
    return prisma.knowledgeBaseArticle.update({
      where: { id: articleId },
      data: { helpfulCount: { increment: 1 } }
    });
  }

  // Community Forum Methods
  static async createForumPost(data: {
    userId: string;
    title: string;
    content: string;
    category: string;
    tags?: string[];
    status?: any;
    metadata?: any;
  }) {
    return prisma.forumPost.create({
      data
    });
  }

  static async getForumPosts(category?: string, status?: any) {
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    return prisma.forumPost.findMany({
      where,
      include: { user: true, comments: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getForumPost(postId: string) {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { user: true, comments: { include: { user: true } } }
    });

    if (post) {
      // Increment view count
      await prisma.forumPost.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } }
      });
    }

    return post;
  }

  static async addForumComment(data: {
    postId: string;
    userId: string;
    content: string;
    parentId?: string;
    metadata?: any;
  }) {
    return prisma.forumComment.create({
      data
    });
  }

  // Bug Report Methods
  static async createBugReport(data: {
    userId: string;
    title: string;
    description: string;
    severity?: any;
    productId?: string;
    environment?: string;
    steps?: string;
    metadata?: any;
  }) {
    const bugReport = await prisma.bugReport.create({
      data
    });

    // Log bug report creation
    await prisma.auditLog.create({
      data: {
        action: 'BUG_REPORT_CREATED',
        entity: 'BugReport',
        entityId: bugReport.id,
        metadata: { severity: bugReport.severity }
      }
    });

    return bugReport;
  }

  static async getBugReports(status?: any, severity?: any) {
    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    return prisma.bugReport.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateBugReport(bugReportId: string, data: any) {
    const bugReport = await prisma.bugReport.update({
      where: { id: bugReportId },
      data
    });

    // Log bug report update
    await prisma.auditLog.create({
      data: {
        action: 'BUG_REPORT_UPDATED',
        entity: 'BugReport',
        entityId: bugReportId
      }
    });

    return bugReport;
  }

  // Feature Request Methods
  static async createFeatureRequest(data: {
    userId: string;
    title: string;
    description: string;
    category: string;
    metadata?: any;
  }) {
    return prisma.featureRequest.create({
      data
    });
  }

  static async getFeatureRequests(status?: any, category?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    return prisma.featureRequest.findMany({
      where,
      include: { user: true },
      orderBy: { voteCount: 'desc' }
    });
  }

  static async voteFeatureRequest(requestId: string, userId: string) {
    const request = await prisma.featureRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) throw new Error('Feature request not found');

    const hasVoted = request.votedBy.includes(userId);
    if (hasVoted) {
      // Remove vote
      return prisma.featureRequest.update({
        where: { id: requestId },
        data: {
          voteCount: { decrement: 1 },
          votedBy: { set: request.votedBy.filter((id: string) => id !== userId) }
        }
      });
    } else {
      // Add vote
      return prisma.featureRequest.update({
        where: { id: requestId },
        data: {
          voteCount: { increment: 1 },
          votedBy: { push: userId }
        }
      });
    }
  }

  static async updateFeatureStatus(requestId: string, status: any, plannedFor?: string) {
    return prisma.featureRequest.update({
      where: { id: requestId },
      data: {
        status,
        plannedFor,
        releasedAt: status === 'RELEASED' ? new Date() : null
      }
    });
  }

  // Roadmap Methods
  static async createRoadmapItem(data: {
    title: string;
    description: string;
    category: string;
    priority?: number;
    order: number;
    plannedFor?: string;
    metadata?: any;
  }) {
    return prisma.roadmapItem.create({
      data
    });
  }

  static async getRoadmapItems(category?: string, status?: any) {
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    return prisma.roadmapItem.findMany({
      where,
      orderBy: { order: 'asc' }
    });
  }

  static async updateRoadmapItem(itemId: string, data: any) {
    return prisma.roadmapItem.update({
      where: { id: itemId },
      data
    });
  }

  // Customer Feedback Methods
  static async createFeedback(data: {
    userId: string;
    type: any;
    rating: number;
    subject: string;
    message: string;
    productId?: string;
    orderId?: string;
    metadata?: any;
  }) {
    return prisma.customerFeedback.create({
      data
    });
  }

  static async getFeedback(type?: any, productId?: string) {
    const where: any = {};
    if (type) where.type = type;
    if (productId) where.productId = productId;

    return prisma.customerFeedback.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // SLA Policy Methods
  static async createSLAPolicy(data: {
    name: string;
    description?: string;
    category: any;
    responseTime: number;
    resolutionTime: number;
    businessHoursOnly?: boolean;
    metadata?: any;
  }) {
    return prisma.sLAPolicy.create({
      data
    });
  }

  static async getSLAPolicies(category?: any) {
    const where = category ? { category } : {};
    return prisma.sLAPolicy.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateSLAPolicy(policyId: string, data: any) {
    return prisma.sLAPolicy.update({
      where: { id: policyId },
      data
    });
  }

  // Escalation Rule Methods
  static async createEscalationRule(data: {
    name: string;
    description?: string;
    category: any;
    priority: any;
    timeThreshold: number;
    escalateTo: string;
    notify?: boolean;
    metadata?: any;
  }) {
    return prisma.escalationRule.create({
      data
    });
  }

  static async getEscalationRules(category?: any, priority?: any) {
    const where: any = {};
    if (category) where.category = category;
    if (priority) where.priority = priority;

    return prisma.escalationRule.findMany({
      where,
      orderBy: { timeThreshold: 'asc' }
    });
  }

  static async checkEscalations() {
    // Check tickets that need escalation
    const now = new Date();
    const rules = await prisma.escalationRule.findMany({
      where: { enabled: true }
    });

    for (const rule of rules) {
      const thresholdDate = new Date(now.getTime() - rule.timeThreshold * 60000);
      
      const ticketsToEscalate = await prisma.supportTicket.findMany({
        where: {
          category: rule.category,
          priority: rule.priority,
          status: { in: ['OPEN', 'IN_PROGRESS'] },
          createdAt: { lt: thresholdDate },
          assignedTo: { not: rule.escalateTo }
        }
      });

      for (const ticket of ticketsToEscalate) {
        await prisma.supportTicket.update({
          where: { id: ticket.id },
          data: {
            assignedTo: rule.escalateTo,
            status: 'ESCALATED'
          }
        });

        // Log escalation
        await prisma.auditLog.create({
          data: {
            action: 'TICKET_ESCALATED',
            entity: 'SupportTicket',
            entityId: ticket.id,
            metadata: { ruleId: rule.id, escalateTo: rule.escalateTo }
          }
        });
      }
    }

    return { checked: true };
  }

  static async checkSLABreaches() {
    // Check SLA breaches
    const now = new Date();
    const breachedTickets = await prisma.supportTicket.findMany({
      where: {
        slaDeadline: { lt: now },
        slaBreached: false,
        status: { notIn: ['RESOLVED', 'CLOSED'] }
      }
    });

    for (const ticket of breachedTickets) {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: { slaBreached: true }
      });

      // Log SLA breach
      await prisma.auditLog.create({
        data: {
          action: 'SLA_BREACHED',
          entity: 'SupportTicket',
          entityId: ticket.id
        }
      });
    }

    return { breached: breachedTickets.length };
  }

  // Support Statistics
  static async getSupportStatistics() {
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      escalatedTickets,
      slaBreached,
      totalChats,
      activeChats,
      totalKB,
      publishedKB,
      totalPosts,
      totalBugReports,
      openBugReports,
      totalFeatureRequests,
      totalFeedback
    ] = await Promise.all([
      prisma.supportTicket.count(),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
      prisma.supportTicket.count({ where: { status: 'ESCALATED' } }),
      prisma.supportTicket.count({ where: { slaBreached: true } }),
      prisma.liveChatSession.count(),
      prisma.liveChatSession.count({ where: { status: 'ACTIVE' } }),
      prisma.knowledgeBaseArticle.count(),
      prisma.knowledgeBaseArticle.count({ where: { published: true } }),
      prisma.forumPost.count(),
      prisma.bugReport.count(),
      prisma.bugReport.count({ where: { status: 'OPEN' } }),
      prisma.featureRequest.count(),
      prisma.customerFeedback.count()
    ]);

    return {
      tickets: {
        total: totalTickets,
        open: openTickets,
        resolved: resolvedTickets,
        escalated: escalatedTickets,
        slaBreached
      },
      chat: {
        total: totalChats,
        active: activeChats
      },
      knowledgeBase: {
        total: totalKB,
        published: publishedKB
      },
      forum: {
        totalPosts
      },
      bugs: {
        total: totalBugReports,
        open: openBugReports
      },
      features: {
        total: totalFeatureRequests
      },
      feedback: {
        total: totalFeedback
      }
    };
  }
}
