// ============================================================
// FORM BUILDER SERVICE
// KYC, Lead, Support, Custom Forms
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FormBuilderService {
  // Create form definition
  static async createFormDefinition(data: {
    type: any;
    name: string;
    description?: string;
    schema: any;
    config?: any;
    enabled?: boolean;
    published?: boolean;
    metadata?: any;
  }) {
    const form = await prisma.formDefinition.create({
      data: {
        type: data.type,
        name: data.name,
        description: data.description,
        schema: data.schema,
        config: data.config,
        enabled: data.enabled ?? true,
        published: data.published ?? false,
        metadata: data.metadata
      }
    });

    // Log form creation
    await prisma.auditLog.create({
      data: {
        action: 'FORM_CREATED',
        entity: 'FormDefinition',
        entityId: form.id,
        metadata: { type: form.type, name: form.name }
      }
    });

    return form;
  }

  // Update form definition
  static async updateFormDefinition(formId: string, data: any) {
    const form = await prisma.formDefinition.update({
      where: { id: formId },
      data: {
        ...data,
        version: { increment: 1 }
      }
    });

    // Log form update
    await prisma.auditLog.create({
      data: {
        action: 'FORM_UPDATED',
        entity: 'FormDefinition',
        entityId: formId,
        metadata: { name: form.name, version: form.version }
      }
    });

    return form;
  }

  // Delete form definition
  static async deleteFormDefinition(formId: string) {
    const form = await prisma.formDefinition.delete({
      where: { id: formId }
    });

    // Log form deletion
    await prisma.auditLog.create({
      data: {
        action: 'FORM_DELETED',
        entity: 'FormDefinition',
        entityId: formId,
        metadata: { name: form.name }
      }
    });

    return form;
  }

  // Get form definitions by type
  static async getFormDefinitions(type?: any, publishedOnly: boolean = false) {
    const where: any = {};
    if (type) where.type = type;
    if (publishedOnly) where.published = true;

    return prisma.formDefinition.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get form definition by ID
  static async getFormDefinition(formId: string) {
    return prisma.formDefinition.findUnique({
      where: { id: formId },
      include: { submissions: true }
    });
  }

  // Publish form
  static async publishForm(formId: string) {
    return this.updateFormDefinition(formId, { published: true });
  }

  // Unpublish form
  static async unpublishForm(formId: string) {
    return this.updateFormDefinition(formId, { published: false });
  }

  // Enable form
  static async enableForm(formId: string) {
    return this.updateFormDefinition(formId, { enabled: true });
  }

  // Disable form
  static async disableForm(formId: string) {
    return this.updateFormDefinition(formId, { enabled: false });
  }

  // Submit form
  static async submitForm(formId: string, userId: string | null, data: any) {
    const form = await prisma.formDefinition.findUnique({
      where: { id: formId }
    });

    if (!form) {
      throw new Error('Form not found');
    }

    if (!form.enabled || !form.published) {
      throw new Error('Form is not available for submission');
    }

    // Validate form data against schema
    await this.validateFormData(form.schema, data);

    const submission = await prisma.formSubmission.create({
      data: {
        formId,
        userId,
        data,
        status: 'PENDING'
      }
    });

    // Log form submission
    await prisma.auditLog.create({
      data: {
        action: 'FORM_SUBMITTED',
        entity: 'FormSubmission',
        entityId: submission.id,
        metadata: { formId, userId }
      }
    });

    // Trigger form submission event
    const { EventBusService } = await import('./event.bus.service');
    await EventBusService.publishEvent('FORM_SUBMITTED', submission.id, 'FormSubmission', {
      formId,
      userId,
      data
    });

    return submission;
  }

  // Validate form data against schema
  private static async validateFormData(schema: any, data: any) {
    if (!schema || !schema.fields) {
      return;
    }

    for (const field of schema.fields) {
      const value = data[field.key];

      // Required validation
      if (field.required && (value === null || value === undefined || value === '')) {
        throw new Error(`${field.label} is required`);
      }

      // Type validation
      if (value !== null && value !== undefined) {
        switch (field.type) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              throw new Error(`${field.label} must be a valid email`);
            }
            break;
          case 'number':
            if (typeof value !== 'number') {
              throw new Error(`${field.label} must be a number`);
            }
            break;
          case 'tel':
            if (!/^\+?[\d\s-()]+$/.test(value)) {
              throw new Error(`${field.label} must be a valid phone number`);
            }
            break;
        }
      }

      // Custom validation
      if (field.validation) {
        if (field.validation.minLength && value.length < field.validation.minLength) {
          throw new Error(`${field.label} must be at least ${field.validation.minLength} characters`);
        }
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          throw new Error(`${field.label} must be at most ${field.validation.maxLength} characters`);
        }
        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          throw new Error(`${field.label} format is invalid`);
        }
      }
    }
  }

  // Get form submissions
  static async getFormSubmissions(formId?: string, status?: any, limit: number = 50) {
    const where: any = {};
    if (formId) where.formId = formId;
    if (status) where.status = status;

    return prisma.formSubmission.findMany({
      where,
      include: { form: true, user: true },
      orderBy: { submittedAt: 'desc' },
      take: limit
    });
  }

  // Get form submission by ID
  static async getFormSubmission(submissionId: string) {
    return prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: { form: true, user: true }
    });
  }

  // Review form submission
  static async reviewSubmission(submissionId: string, reviewerId: string, status: any, notes?: string) {
    const submission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        status,
        notes,
        reviewedAt: new Date(),
        reviewedBy: reviewerId
      }
    });

    // Log review
    await prisma.auditLog.create({
      data: {
        action: 'FORM_REVIEWED',
        entity: 'FormSubmission',
        entityId: submissionId,
        metadata: { status, reviewerId }
      }
    });

    return submission;
  }

  // Approve submission
  static async approveSubmission(submissionId: string, reviewerId: string, notes?: string) {
    return this.reviewSubmission(submissionId, reviewerId, 'APPROVED', notes);
  }

  // Reject submission
  static async rejectSubmission(submissionId: string, reviewerId: string, notes?: string) {
    return this.reviewSubmission(submissionId, reviewerId, 'REJECTED', notes);
  }

  // Get form statistics
  static async getFormStatistics(formId?: string) {
    const where = formId ? { formId } : {};

    const [
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
      underReviewSubmissions
    ] = await Promise.all([
      prisma.formSubmission.count({ where }),
      prisma.formSubmission.count({ where: { ...where, status: 'PENDING' } }),
      prisma.formSubmission.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.formSubmission.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.formSubmission.count({ where: { ...where, status: 'UNDER_REVIEW' } })
    ]);

    return {
      formId: formId || 'ALL',
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
      underReviewSubmissions
    };
  }
}
