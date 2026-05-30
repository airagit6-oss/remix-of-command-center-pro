// ============================================================
// CUSTOM FIELDS ENGINE SERVICE
// Dynamic Product, Author, Customer, Reseller Fields
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomFieldsService {
  // Create custom field definition
  static async createFieldDefinition(data: {
    entityType: any;
    name: string;
    key: string;
    type: any;
    required?: boolean;
    unique?: boolean;
    options?: any;
    validation?: any;
    defaultValue?: any;
    enabled?: boolean;
    order?: number;
    metadata?: any;
  }) {
    const field = await prisma.customFieldDefinition.create({
      data: {
        entityType: data.entityType,
        name: data.name,
        key: data.key,
        type: data.type,
        required: data.required ?? false,
        unique: data.unique ?? false,
        options: data.options,
        validation: data.validation,
        defaultValue: data.defaultValue,
        enabled: data.enabled ?? true,
        order: data.order ?? 0,
        metadata: data.metadata
      }
    });

    // Log field creation
    await prisma.auditLog.create({
      data: {
        action: 'CUSTOM_FIELD_CREATED',
        entity: 'CustomFieldDefinition',
        entityId: field.id,
        metadata: { entityType: field.entityType, key: field.key }
      }
    });

    return field;
  }

  // Update custom field definition
  static async updateFieldDefinition(fieldId: string, data: any) {
    const field = await prisma.customFieldDefinition.update({
      where: { id: fieldId },
      data
    });

    // Log field update
    await prisma.auditLog.create({
      data: {
        action: 'CUSTOM_FIELD_UPDATED',
        entity: 'CustomFieldDefinition',
        entityId: fieldId,
        metadata: { key: field.key, changes: data }
      }
    });

    return field;
  }

  // Delete custom field definition
  static async deleteFieldDefinition(fieldId: string) {
    const field = await prisma.customFieldDefinition.delete({
      where: { id: fieldId }
    });

    // Log field deletion
    await prisma.auditLog.create({
      data: {
        action: 'CUSTOM_FIELD_DELETED',
        entity: 'CustomFieldDefinition',
        entityId: fieldId,
        metadata: { key: field.key }
      }
    });

    return field;
  }

  // Get field definitions by entity type
  static async getFieldDefinitions(entityType: any, enabledOnly: boolean = true) {
    const where: any = { entityType };
    if (enabledOnly) {
      where.enabled = true;
    }

    return prisma.customFieldDefinition.findMany({
      where,
      orderBy: { order: 'asc' }
    });
  }

  // Get field definition by ID
  static async getFieldDefinition(fieldId: string) {
    return prisma.customFieldDefinition.findUnique({
      where: { id: fieldId },
      include: { values: true }
    });
  }

  // Get field definition by key and entity type
  static async getFieldDefinitionByKey(entityType: any, key: string) {
    return prisma.customFieldDefinition.findUnique({
      where: {
        entityType_key: {
          entityType,
          key
        }
      }
    });
  }

  // Set custom field value
  static async setFieldValue(fieldId: string, entityId: string, value: any) {
    const field = await prisma.customFieldDefinition.findUnique({
      where: { id: fieldId }
    });

    if (!field) {
      throw new Error('Field definition not found');
    }

    // Validate value
    await this.validateFieldValue(field, value);

    // Check uniqueness if required
    if (field.unique) {
      const existing = await prisma.customFieldValue.findFirst({
        where: {
          fieldId,
          value
        }
      });

      if (existing && existing.entityId !== entityId) {
        throw new Error('Value must be unique for this field');
      }
    }

    const fieldValue = await prisma.customFieldValue.upsert({
      where: {
        fieldId_entityId: {
          fieldId,
          entityId
        }
      },
      update: { value },
      create: { fieldId, entityId, value }
    });

    // Log value update
    await prisma.auditLog.create({
      data: {
        action: 'CUSTOM_FIELD_VALUE_SET',
        entity: 'CustomFieldValue',
        entityId: fieldValue.id,
        metadata: { fieldKey: field.key, entityId }
      }
    });

    return fieldValue;
  }

  // Get custom field value
  static async getFieldValue(fieldId: string, entityId: string) {
    return prisma.customFieldValue.findUnique({
      where: {
        fieldId_entityId: {
          fieldId,
          entityId
        }
      },
      include: { field: true }
    });
  }

  // Get all custom field values for an entity
  static async getEntityFieldValues(entityId: string, entityType: any) {
    const fields = await this.getFieldDefinitions(entityType);
    const fieldIds = fields.map(f => f.id);

    const values = await prisma.customFieldValue.findMany({
      where: {
        fieldId: { in: fieldIds },
        entityId
      },
      include: { field: true }
    });

    return values;
  }

  // Delete custom field value
  static async deleteFieldValue(fieldId: string, entityId: string) {
    const fieldValue = await prisma.customFieldValue.delete({
      where: {
        fieldId_entityId: {
          fieldId,
          entityId
        }
      }
    });

    // Log value deletion
    await prisma.auditLog.create({
      data: {
        action: 'CUSTOM_FIELD_VALUE_DELETED',
        entity: 'CustomFieldValue',
        entityId: fieldValue.id
      }
    });

    return fieldValue;
  }

  // Validate field value
  private static async validateFieldValue(field: any, value: any) {
    if (field.required && (value === null || value === undefined || value === '')) {
      throw new Error('This field is required');
    }

    const validation = field.validation;
    if (!validation) return;

    // Type validation
    switch (field.type) {
      case 'NUMBER':
        if (value !== null && value !== undefined && typeof value !== 'number') {
          throw new Error('Value must be a number');
        }
        if (validation.min !== undefined && value < validation.min) {
          throw new Error(`Value must be at least ${validation.min}`);
        }
        if (validation.max !== undefined && value > validation.max) {
          throw new Error(`Value must be at most ${validation.max}`);
        }
        break;
      case 'EMAIL':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          throw new Error('Invalid email format');
        }
        break;
      case 'URL':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          throw new Error('Invalid URL format');
        }
        break;
      case 'TEXT':
      case 'TEXTAREA':
        if (validation.minLength && value.length < validation.minLength) {
          throw new Error(`Value must be at least ${validation.minLength} characters`);
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          throw new Error(`Value must be at most ${validation.maxLength} characters`);
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
          throw new Error('Value does not match the required pattern');
        }
        break;
      case 'SELECT':
        if (value && field.options && !field.options.includes(value)) {
          throw new Error('Invalid option selected');
        }
        break;
      case 'MULTI_SELECT':
        if (value && field.options) {
          const invalidOptions = value.filter((v: any) => !field.options.includes(v));
          if (invalidOptions.length > 0) {
            throw new Error('Invalid options selected');
          }
        }
        break;
    }
  }

  // Enable field definition
  static async enableFieldDefinition(fieldId: string) {
    return this.updateFieldDefinition(fieldId, { enabled: true });
  }

  // Disable field definition
  static async disableFieldDefinition(fieldId: string) {
    return this.updateFieldDefinition(fieldId, { enabled: false });
  }

  // Get field statistics
  static async getFieldStatistics(entityType?: any) {
    const where = entityType ? { entityType } : {};

    const [
      totalFields,
      enabledFields,
      totalValues
    ] = await Promise.all([
      prisma.customFieldDefinition.count({ where }),
      prisma.customFieldDefinition.count({ where: { ...where, enabled: true } }),
      prisma.customFieldValue.count({
        where: {
          field: where
        }
      })
    ]);

    return {
      entityType: entityType || 'ALL',
      totalFields,
      enabledFields,
      totalValues
    };
  }
}
