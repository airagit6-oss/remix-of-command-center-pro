import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /invoices
export async function getInvoices(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;

    const invoices = await prisma.invoice.findMany({
      where: {
        order: { userId }
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: { product: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(invoices);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch invoices' });
  }
}

// GET /invoices/:id
export async function getInvoice(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const userId = (req as any).user.id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        order: { userId }
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: { product: true }
            },
            user: true
          }
        }
      }
    });

    if (!invoice) {
      return reply.status(404).send({ error: 'Invoice not found' });
    }

    return reply.send(invoice);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch invoice' });
  }
}

// GET /invoices/:id/download
export async function downloadInvoice(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const userId = (req as any).user.id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        order: { userId }
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: { product: true }
            },
            user: true
          }
        }
      }
    });

    if (!invoice) {
      return reply.status(404).send({ error: 'Invoice not found' });
    }

    // Generate PDF content (simplified - in production use a proper PDF library)
    const pdfContent = `
INVOICE #${invoice.invoiceNumber}
================================
Date: ${invoice.createdAt.toLocaleDateString()}
Due Date: ${invoice.dueDate ? invoice.dueDate.toLocaleDateString() : 'N/A'}
Status: ${invoice.status}

BILL TO:
--------
${invoice.billedTo as any}
${invoice.order.user.email}

BILL FROM:
----------
${invoice.billedFrom as any}

ITEMS:
-----
${invoice.order.orderItems.map((item: any) => `
${item.product.name}
Qty: ${item.quantity} × $${Number(item.price).toFixed(2)} = $${Number(item.total).toFixed(2)}
`).join('')}

SUBTOTAL: $${Number(invoice.subtotal).toFixed(2)}
TAX: $${Number(invoice.tax).toFixed(2)}
DISCOUNT: $${Number(invoice.discount).toFixed(2)}
TOTAL: $${Number(invoice.total).toFixed(2)}
    `.trim();

    reply.header('Content-Type', 'text/plain');
    reply.header('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.txt"`);
    return reply.send(pdfContent);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to download invoice' });
  }
}

export function invoiceRoutes(fastify: FastifyInstance) {
  fastify.get('/invoices', { preHandler: [fastify.authenticate] }, getInvoices);
  fastify.get('/invoices/:id', { preHandler: [fastify.authenticate] }, getInvoice);
  fastify.get('/invoices/:id/download', { preHandler: [fastify.authenticate] }, downloadInvoice);
}
