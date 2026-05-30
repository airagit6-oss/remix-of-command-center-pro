// ============================================================
// CRM ENGINE SERVICE
// Lead, Customer, Author, Reseller CRM, Pipeline, Opportunity,
// Follow Up, Meeting Notes, Call Notes, Task Assignment,
// Customer Journey, Customer Health Score, Lost Customer Recovery, VIP Customer Tracking
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CRMEngineService {
  // CRM Contact Methods
  static async createContact(data: {
    type: any;
    contactId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    title?: string;
    industry?: string;
    source?: string;
    tags?: string[];
    metadata?: any;
  }) {
    const contact = await prisma.cRMContact.create({
      data
    });

    // Log contact creation
    await prisma.auditLog.create({
      data: {
        action: 'CRM_CONTACT_CREATED',
        entity: 'CRMContact',
        entityId: contact.id,
        metadata: { type: contact.type, email: contact.email }
      }
    });

    return contact;
  }

  static async getContacts(type?: any, tags?: string[]) {
    const where: any = {};
    if (type) where.type = type;
    if (tags && tags.length > 0) where.tags = { hasSome: tags };

    return prisma.cRMContact.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getContact(contactId: string) {
    return prisma.cRMContact.findUnique({
      where: { id: contactId },
      include: {
        opportunities: true,
        followUps: true,
        meetingNotes: true,
        callNotes: true,
        tasks: true,
        journeys: true,
        healthScores: true,
        vipStatus: true,
        recovery: true
      }
    });
  }

  static async updateContact(contactId: string, data: any) {
    const contact = await prisma.cRMContact.update({
      where: { id: contactId },
      data
    });

    // Log contact update
    await prisma.auditLog.create({
      data: {
        action: 'CRM_CONTACT_UPDATED',
        entity: 'CRMContact',
        entityId: contactId
      }
    });

    return contact;
  }

  // Pipeline Stage Methods
  static async createPipelineStage(data: {
    name: string;
    description?: string;
    order: number;
    color?: string;
    probability?: number;
    metadata?: any;
  }) {
    return prisma.pipelineStage.create({ data });
  }

  static async getPipelineStages() {
    return prisma.pipelineStage.findMany({
      orderBy: { order: 'asc' }
    });
  }

  // Opportunity Methods
  static async createOpportunity(data: {
    contactId: string;
    stageId: string;
    title: string;
    description?: string;
    value: number;
    currency?: string;
    expectedCloseDate?: Date;
    assignedTo?: string;
    metadata?: any;
  }) {
    const opportunity = await prisma.opportunity.create({
      data
    });

    // Log opportunity creation
    await prisma.auditLog.create({
      data: {
        action: 'OPPORTUNITY_CREATED',
        entity: 'Opportunity',
        entityId: opportunity.id,
        metadata: { title: opportunity.title, value: opportunity.value }
      }
    });

    return opportunity;
  }

  static async getOpportunities(contactId?: string, stageId?: string, status?: any) {
    const where: any = {};
    if (contactId) where.contactId = contactId;
    if (stageId) where.stageId = stageId;
    if (status) where.status = status;

    return prisma.opportunity.findMany({
      where,
      include: { contact: true, stage: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateOpportunity(opportunityId: string, data: any) {
    const opportunity = await prisma.opportunity.update({
      where: { id: opportunityId },
      data
    });

    // Log opportunity update
    await prisma.auditLog.create({
      data: {
        action: 'OPPORTUNITY_UPDATED',
        entity: 'Opportunity',
        entityId: opportunityId
      }
    });

    return opportunity;
  }

  // Follow Up Methods
  static async createFollowUp(data: {
    contactId: string;
    type: any;
    subject: string;
    description?: string;
    dueDate: Date;
    assignedTo?: string;
    metadata?: any;
  }) {
    const followUp = await prisma.followUp.create({
      data
    });

    // Log follow-up creation
    await prisma.auditLog.create({
      data: {
        action: 'FOLLOW_UP_CREATED',
        entity: 'FollowUp',
        entityId: followUp.id,
        metadata: { type: followUp.type, dueDate: followUp.dueDate }
      }
    });

    return followUp;
  }

  static async getFollowUps(contactId?: string, status?: any, assignedTo?: string) {
    const where: any = {};
    if (contactId) where.contactId = contactId;
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;

    return prisma.followUp.findMany({
      where,
      include: { contact: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  static async completeFollowUp(followUpId: string) {
    const followUp = await prisma.followUp.update({
      where: { id: followUpId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Log follow-up completion
    await prisma.auditLog.create({
      data: {
        action: 'FOLLOW_UP_COMPLETED',
        entity: 'FollowUp',
        entityId: followUpId
      }
    });

    return followUp;
  }

  // Meeting Note Methods
  static async createMeetingNote(data: {
    contactId: string;
    title: string;
    description?: string;
    meetingDate: Date;
    duration?: number;
    attendees: string[];
    location?: string;
    meetingType: any;
    outcome?: string;
    actionItems?: any;
    metadata?: any;
  }) {
    return prisma.meetingNote.create({ data });
  }

  static async getMeetingNotes(contactId?: string) {
    const where = contactId ? { contactId } : {};
    return prisma.meetingNote.findMany({
      where,
      include: { contact: true },
      orderBy: { meetingDate: 'desc' }
    });
  }

  // Call Note Methods
  static async createCallNote(data: {
    contactId: string;
    subject: string;
    description?: string;
    callDate: Date;
    duration?: number;
    direction: any;
    phoneNumber?: string;
    outcome?: string;
    metadata?: any;
  }) {
    return prisma.callNote.create({ data });
  }

  static async getCallNotes(contactId?: string) {
    const where = contactId ? { contactId } : {};
    return prisma.callNote.findMany({
      where,
      include: { contact: true },
      orderBy: { callDate: 'desc' }
    });
  }

  // Task Assignment Methods
  static async createTask(data: {
    contactId?: string;
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: any;
    assignedTo: string;
    assignedBy: string;
    metadata?: any;
  }) {
    const task = await prisma.taskAssignment.create({
      data
    });

    // Log task creation
    await prisma.auditLog.create({
      data: {
        action: 'TASK_CREATED',
        entity: 'TaskAssignment',
        entityId: task.id,
        metadata: { title: task.title, assignedTo: task.assignedTo }
      }
    });

    return task;
  }

  static async getTasks(assignedTo?: string, status?: any, contactId?: string) {
    const where: any = {};
    if (assignedTo) where.assignedTo = assignedTo;
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;

    return prisma.taskAssignment.findMany({
      where,
      include: { contact: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  static async completeTask(taskId: string) {
    const task = await prisma.taskAssignment.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Log task completion
    await prisma.auditLog.create({
      data: {
        action: 'TASK_COMPLETED',
        entity: 'TaskAssignment',
        entityId: taskId
      }
    });

    return task;
  }

  // Customer Journey Methods
  static async createCustomerJourney(data: {
    contactId: string;
    stage: any;
    description?: string;
    metadata?: any;
  }) {
    // Exit previous stage if exists
    await prisma.customerJourney.updateMany({
      where: { contactId: data.contactId, exitedAt: null },
      data: { exitedAt: new Date() }
    });

    return prisma.customerJourney.create({
      data
    });
  }

  static async getCustomerJourney(contactId: string) {
    return prisma.customerJourney.findMany({
      where: { contactId },
      orderBy: { enteredAt: 'desc' }
    });
  }

  // Customer Health Score Methods
  static async calculateHealthScore(contactId: string) {
    // Calculate health score based on various factors
    const factors: any = {
      engagement: 0,
      purchases: 0,
      activity: 0,
      satisfaction: 0
    };

    // Get contact's orders
    const orders = await prisma.order.findMany({
      where: { userId: contactId },
      take: 10
    });

    factors.purchases = Math.min(orders.length * 10, 40); // Max 40 points

    // Get contact's activity
    const activities = await prisma.activityLog.count({
      where: { userId: contactId }
    });

    factors.activity = Math.min(activities * 2, 30); // Max 30 points

    // Calculate score
    const score = factors.engagement + factors.purchases + factors.activity + factors.satisfaction;

    // Determine category
    let category: any = 'AVERAGE';
    if (score >= 80) category = 'EXCELLENT';
    else if (score >= 60) category = 'GOOD';
    else if (score >= 40) category = 'AVERAGE';
    else if (score >= 20) category = 'POOR';
    else category = 'CRITICAL';

    const healthScore = await prisma.customerHealthScore.create({
      data: {
        contactId,
        score,
        category,
        factors
      }
    });

    return healthScore;
  }

  static async getHealthScore(contactId: string) {
    return prisma.customerHealthScore.findFirst({
      where: { contactId },
      orderBy: { calculatedAt: 'desc' }
    });
  }

  // Lost Customer Recovery Methods
  static async createLostCustomerRecovery(data: {
    contactId: string;
    reason: string;
    description?: string;
    metadata?: any;
  }) {
    const recovery = await prisma.lostCustomerRecovery.create({
      data
    });

    // Log recovery creation
    await prisma.auditLog.create({
      data: {
        action: 'LOST_CUSTOMER_RECOVERY_CREATED',
        entity: 'LostCustomerRecovery',
        entityId: recovery.id,
        metadata: { reason: recovery.reason }
      }
    });

    return recovery;
  }

  static async attemptRecovery(recoveryId: string) {
    const recovery = await prisma.lostCustomerRecovery.update({
      where: { id: recoveryId },
      data: {
        recoveryAttempts: { increment: 1 },
        lastAttemptAt: new Date(),
        status: 'IN_PROGRESS'
      }
    });

    // Log recovery attempt
    await prisma.auditLog.create({
      data: {
        action: 'RECOVERY_ATTEMPTED',
        entity: 'LostCustomerRecovery',
        entityId: recoveryId
      }
    });

    return recovery;
  }

  static async markRecovered(recoveryId: string) {
    const recovery = await prisma.lostCustomerRecovery.update({
      where: { id: recoveryId },
      data: {
        status: 'RECOVERED',
        recoveredAt: new Date()
      }
    });

    // Log recovery success
    await prisma.auditLog.create({
      data: {
        action: 'CUSTOMER_RECOVERED',
        entity: 'LostCustomerRecovery',
        entityId: recoveryId
      }
    });

    return recovery;
  }

  // VIP Customer Methods
  static async createVIPCustomer(data: {
    contactId: string;
    tier: any;
    benefits?: any;
    startDate?: Date;
    endDate?: Date;
    metadata?: any;
  }) {
    const vip = await prisma.vIPCustomer.create({
      data
    });

    // Log VIP creation
    await prisma.auditLog.create({
      data: {
        action: 'VIP_CUSTOMER_CREATED',
        entity: 'VIPCustomer',
        entityId: vip.id,
        metadata: { tier: vip.tier }
      }
    });

    return vip;
  }

  static async getVIPCustomers(tier?: any) {
    const where = tier ? { tier } : {};
    return prisma.vIPCustomer.findMany({
      where,
      include: { contact: true },
      orderBy: { startDate: 'desc' }
    });
  }

  // CRM Statistics
  static async getCRMStatistics() {
    const [
      totalContacts,
      leads,
      customers,
      authors,
      resellers,
      openOpportunities,
      wonOpportunities,
      pendingTasks,
      overdueFollowUps
    ] = await Promise.all([
      prisma.cRMContact.count(),
      prisma.cRMContact.count({ where: { type: 'LEAD' } }),
      prisma.cRMContact.count({ where: { type: 'CUSTOMER' } }),
      prisma.cRMContact.count({ where: { type: 'AUTHOR' } }),
      prisma.cRMContact.count({ where: { type: 'RESELLER' } }),
      prisma.opportunity.count({ where: { status: 'OPEN' } }),
      prisma.opportunity.count({ where: { status: 'WON' } }),
      prisma.taskAssignment.count({ where: { status: 'PENDING' } }),
      prisma.followUp.count({
        where: {
          status: 'PENDING',
          dueDate: { lt: new Date() }
        }
      })
    ]);

    return {
      totalContacts,
      leads,
      customers,
      authors,
      resellers,
      openOpportunities,
      wonOpportunities,
      pendingTasks,
      overdueFollowUps
    };
  }
}
