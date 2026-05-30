// ============================================================
// CUSTOM FIELDS ROUTES
// API endpoints for custom field management
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CustomFieldsService } from '../services/custom.fields.service';

// POST /custom-fields/definitions
export async function createFieldDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = req.body as any;
    const field = await CustomFieldsService.createFieldDefinition(data);
    return reply.send(field);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create field definition' });
  }
}

// GET /custom-fields/definitions
export async function getFieldDefinitions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const enabledOnly = (req.query as any).enabledOnly !== 'false';
    
    if (!entityType) {
      return reply.status(400).send({ error: 'entityType is required' });
    }

    const fields = await CustomFieldsService.getFieldDefinitions(entityType, enabledOnly);
    return reply.send(fields);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch field definitions' });
  }
}

// GET /custom-fields/definitions/:fieldId
export async function getFieldDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId } = req.params as any;
    const field = await CustomFieldsService.getFieldDefinition(fieldId);
    return reply.send(field);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch field definition' });
  }
}

// PATCH /custom-fields/definitions/:fieldId
export async function updateFieldDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId } = req.params as any;
    const data = req.body as any;
    const field = await CustomFieldsService.updateFieldDefinition(fieldId, data);
    return reply.send(field);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update field definition' });
  }
}

// DELETE /custom-fields/definitions/:fieldId
export async function deleteFieldDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId } = req.params as any;
    const field = await CustomFieldsService.deleteFieldDefinition(fieldId);
    return reply.send(field);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to delete field definition' });
  }
}

// POST /custom-fields/definitions/:fieldId/enable
export async function enableFieldDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId } = req.params as any;
    const field = await CustomFieldsService.enableFieldDefinition(fieldId);
    return reply.send(field);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to enable field definition' });
  }
}

// POST /custom-fields/definitions/:fieldId/disable
export async function disableFieldDefinition(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId } = req.params as any;
    const field = await CustomFieldsService.disableFieldDefinition(fieldId);
    return reply.send(field);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to disable field definition' });
  }
}

// POST /custom-fields/values
export async function setFieldValue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId, entityId, value } = req.body as any;
    
    if (!fieldId || !entityId) {
      return reply.status(400).send({ error: 'fieldId and entityId are required' });
    }

    const fieldValue = await CustomFieldsService.setFieldValue(fieldId, entityId, value);
    return reply.send(fieldValue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to set field value' });
  }
}

// GET /custom-fields/values/:fieldId/:entityId
export async function getFieldValue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId, entityId } = req.params as any;
    const fieldValue = await CustomFieldsService.getFieldValue(fieldId, entityId);
    return reply.send(fieldValue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch field value' });
  }
}

// GET /custom-fields/entity/:entityId
export async function getEntityFieldValues(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { entityId } = req.params as any;
    const entityType = (req.query as any).entityType;
    
    if (!entityType) {
      return reply.status(400).send({ error: 'entityType is required' });
    }

    const values = await CustomFieldsService.getEntityFieldValues(entityId, entityType);
    return reply.send(values);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to fetch entity field values' });
  }
}

// DELETE /custom-fields/values/:fieldId/:entityId
export async function deleteFieldValue(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { fieldId, entityId } = req.params as any;
    const fieldValue = await CustomFieldsService.deleteFieldValue(fieldId, entityId);
    return reply.send(fieldValue);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to delete field value' });
  }
}

// GET /custom-fields/statistics
export async function getFieldStatistics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const entityType = (req.query as any).entityType;
    const stats = await CustomFieldsService.getFieldStatistics(entityType);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch field statistics' });
  }
}

export function customFieldsRoutes(fastify: FastifyInstance) {
  fastify.post('/custom-fields/definitions', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createFieldDefinition);
  fastify.get('/custom-fields/definitions', { preHandler: [fastify.authenticate] }, getFieldDefinitions);
  fastify.get('/custom-fields/definitions/:fieldId', { preHandler: [fastify.authenticate] }, getFieldDefinition);
  fastify.patch('/custom-fields/definitions/:fieldId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, updateFieldDefinition);
  fastify.delete('/custom-fields/definitions/:fieldId', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, deleteFieldDefinition);
  
  fastify.post('/custom-fields/definitions/:fieldId/enable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, enableFieldDefinition);
  fastify.post('/custom-fields/definitions/:fieldId/disable', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, disableFieldDefinition);
  
  fastify.post('/custom-fields/values', { preHandler: [fastify.authenticate] }, setFieldValue);
  fastify.get('/custom-fields/values/:fieldId/:entityId', { preHandler: [fastify.authenticate] }, getFieldValue);
  fastify.get('/custom-fields/entity/:entityId', { preHandler: [fastify.authenticate] }, getEntityFieldValues);
  fastify.delete('/custom-fields/values/:fieldId/:entityId', { preHandler: [fastify.authenticate] }, deleteFieldValue);
  
  fastify.get('/custom-fields/statistics', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getFieldStatistics);
}
