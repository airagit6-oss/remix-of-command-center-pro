# DATABASE IMPLEMENTATION PATTERNS ANALYSIS

**ANALYSIS DATE:** 2026-05-28
**REPOSITORY:** airagit6-oss/remix-of-command-center-pro

---

## EXECUTIVE SUMMARY

**EXISTING PATTERNS IDENTIFIED:**
- Entity structure pattern (CUID, timestamps, soft delete)
- Service layer pattern (Prisma direct, validation, error handling)
- Validation pattern (Zod schemas, type inference)
- Relation pattern (proper foreign keys, cascade behaviors)
- Index pattern (foreign keys, query fields, timestamps)
- Audit pattern (audit logging for important actions)
- WebSocket pattern (broadcasting for realtime updates)

**RULE:** Copy same implementation flow, change business purpose only.

---

## ENTITY STRUCTURE PATTERN

### Standard Entity Template
```prisma
model EntityName {
  id          String   @id @default(cuid())
  // business fields
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?  // soft delete where applicable

  // relations
  relatedEntity RelatedEntity @relation(fields: [relatedId], references: [id], onDelete: Cascade/SetNull)

  // indexes
  @@index([field])
  @@unique([field1, field2])
}
```

### Key Patterns:
- **ID:** Always `String @id @default(cuid())`
- **Timestamps:** `createdAt @default(now())`, `updatedAt @updatedAt`
- **Soft Delete:** `deletedAt DateTime?` where applicable
- **Relations:** Foreign key field + @relation decorator
- **Indexes:** @@index on foreign keys and frequently queried fields
- **Unique Constraints:** @@unique on natural keys

### Example from Existing Code:
```prisma
model User {
  id                    String      @id @default(cuid())
  email                 String      @unique
  name                  String
  passwordHash          String
  role                  UserRole    @default(USER)
  status                UserStatus  @default(ACTIVE)
  lastLoginAt           DateTime?
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  deletedAt             DateTime?
  resellerId            String?
  passwordResetToken    String?
  passwordResetExpiresAt DateTime?

  // relations
  sessions              Session[]
  authEvents            AuthEvent[]
  auditLogs             AuditLog[]

  // indexes
  @@index([role])
  @@index([status])
  @@index([createdAt])
  @@index([resellerId])
}
```

---

## RELATION PATTERN

### OneToMany (Parent has many children)
```prisma
model Parent {
  id       String   @id @default(cuid())
  children Child[]
}

model Child {
  id       String   @id @default(cuid())
  parentId String
  parent   Parent   @relation(fields: [parentId], references: [id], onDelete: Cascade)

  @@index([parentId])
}
```

### ManyToOne (Child belongs to parent)
```prisma
model Child {
  id       String   @id @default(cuid())
  parentId String
  parent   Parent   @relation(fields: [parentId], references: [id], onDelete: SetNull)

  @@index([parentId])
}

model Parent {
  id      String   @id @default(cuid())
  children Child[]
}
```

### OneToOne
```prisma
model User {
  id      String        @id @default(cuid())
  profile UserProfile?
}

model UserProfile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### Self-Referencing (Hierarchy)
```prisma
model Category {
  id          String     @id @default(cuid())
  parentId    String?
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  subcategories Category[] @relation("CategoryHierarchy")

  @@index([parentId])
}
```

### Delete Behavior Rules:
- **Cascade:** For owned entities (should be deleted when parent deleted)
- **SetNull:** For optional references (preserve child if parent deleted)
- **Restrict:** For critical relationships (prevent deletion if referenced)

---

## SERVICE LAYER PATTERN

### Standard Service Template
```typescript
import type { Request, Response } from 'express';
import { prisma } from '../core/database.js';
import { ApiError } from '../core/http.js';
import type { InputType } from '../validation/entitySchemas.js';

export async function createEntity(input: InputType, req: Request) {
  // Validation
  const existing = await prisma.entity.findUnique({ where: { uniqueField: input.uniqueField } });
  if (existing) throw new ApiError(409, 'Already exists', 'already_exists');

  // Create
  const entity = await prisma.entity.create({
    data: {
      // fields from input
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: req.user?.id,
      action: 'entity_created',
      entityType: 'entity',
      entityId: entity.id,
      metadata: { /* relevant data */ },
    },
  });

  return entity;
}

export async function getEntity(id: string, req: Request) {
  const entity = await prisma.entity.findUnique({
    where: { id },
    include: { /* relations */ },
  });
  if (!entity) throw new ApiError(404, 'Not found', 'not_found');
  return entity;
}

export async function updateEntity(id: string, input: Partial<InputType>, req: Request) {
  const entity = await prisma.entity.update({
    where: { id },
    data: input,
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user?.id,
      action: 'entity_updated',
      entityType: 'entity',
      entityId: entity.id,
      metadata: { /* changes */ },
    },
  });

  return entity;
}

export async function deleteEntity(id: string, req: Request) {
  await prisma.entity.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user?.id,
      action: 'entity_deleted',
      entityType: 'entity',
      entityId: id,
    },
  });

  return { deleted: true };
}

export async function listEntities(req: Request) {
  return prisma.entity.findMany({
    where: { /* filters */ },
    include: { /* relations */ },
    orderBy: { createdAt: 'desc' },
  });
}
```

### Key Patterns:
- **Direct Prisma usage:** No repository abstraction layer
- **Error handling:** ApiError with status code and error code
- **Audit logging:** For create/update/delete operations
- **Input validation:** Zod schemas imported from validation layer
- **WebSocket broadcasting:** For realtime updates where applicable

### Example from Existing Code (authService.ts):
```typescript
export async function register(input: RegisterInput, req: Request, res: Response) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ApiError(409, 'Email is already registered', 'email_exists');

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash: await hashPassword(input.password),
      role: 'USER',
    },
  });

  const tokens = await createSession(user, req);
  setRefreshCookie(res, tokens.refreshToken);
  await logAuthEvent({ userId: user.id, email: user.email, type: 'LOGIN_SUCCESS', req, metadata: { flow: 'register' } });
  return { user: sanitizeUser(user), accessToken: tokens.accessToken, sessionId: tokens.session.id };
}
```

---

## VALIDATION PATTERN

### Standard Validation Schema Template
```typescript
import { z } from 'zod';

export const createEntitySchema = z.object({
  field1: z.string().min(1).max(255),
  field2: z.number().int().positive(),
  field3: z.enum(['option1', 'option2', 'option3']),
  field4: z.boolean().default(false),
  field5: z.date().optional(),
  field6: z.object({
    nestedField: z.string(),
  }).optional(),
});

export const updateEntitySchema = createEntitySchema.partial();

export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;
```

### Key Patterns:
- **Zod for validation:** Type-safe runtime validation
- **Type inference:** `z.infer<typeof schema>` for TypeScript types
- **Field validation:** min, max, regex, enum, optional, default
- **Partial updates:** `.partial()` for update schemas
- **Transformations:** `.transform()` for data normalization

### Example from Existing Code (authSchemas.ts):
```typescript
export const registerSchema = z.object({
  email: z.string().email().transform(value => value.toLowerCase()),
  name: z.string().min(2).max(120),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
```

---

## INDEX PATTERN

### Standard Index Template
```prisma
model Entity {
  id        String   @id @default(cuid())
  field1    String
  field2    String?
  status    String
  createdAt DateTime @default(now())
  parentId  String?

  // Foreign key indexes
  @@index([parentId])

  // Query field indexes
  @@index([field1])
  @@index([status])

  // Timestamp indexes for time-based queries
  @@index([createdAt])

  // Composite indexes for common query patterns
  @@index([parentId, status])
  @@index([status, createdAt])

  // Unique constraints
  @@unique([field1, field2])
}
```

### Key Patterns:
- **Foreign keys:** Always indexed
- **Status fields:** Indexed for filtering
- **Timestamps:** Indexed for time-based queries
- **Composite indexes:** For common multi-field queries
- **Unique constraints:** On natural keys

---

## ENUM PATTERN

### Standard Enum Template
```prisma
enum EntityStatus {
  ACTIVE
  INACTIVE
  PENDING
  COMPLETED
  FAILED
}
```

### Key Patterns:
- **PascalCase:** Enum values in PascalCase
- **Descriptive names:** Clear status/state names
- **Consistent naming:** Similar enums follow same pattern

---

## JSON FIELD PATTERN

### Standard JSON Field Usage
```prisma
model Entity {
  id       String   @id @default(cuid())
  metadata Json?
  settings Json     @default("{}")
  config   Json     @default("{}")
}
```

### Key Patterns:
- **Optional JSON:** `Json?` for optional metadata
- **Default JSON:** `Json @default("{}")` for required config
- **Flexible schema:** JSON for dynamic/optional fields

---

## AUDIT LOG PATTERN

### Standard Audit Log Template
```typescript
await prisma.auditLog.create({
  data: {
    actorId: req.user?.id,
    action: 'action_name',
    entityType: 'entity_name',
    entityId: entity.id,
    metadata: {
      // relevant data
    },
  },
});
```

### Key Patterns:
- **Actor tracking:** Always log who performed the action
- **Action naming:** `entity_created`, `entity_updated`, `entity_deleted`
- **Entity tracking:** entityType + entityId
- **Metadata:** Include relevant context

---

## WEBSOCKET BROADCAST PATTERN

### Standard Broadcast Template
```typescript
import { broadcastToUser } from '../api/websocket/socket.js';

// Broadcast to specific user
broadcastToUser(userId, 'event:name', { data });

// Broadcast to role
broadcastToRole('ADMIN', 'event:name', { data });

// Broadcast to all
broadcastToAll('event:name', { data });
```

### Key Patterns:
- **User-specific:** `broadcastToUser(userId, event, data)`
- **Role-specific:** `broadcastToRole(role, event, data)`
- **Global:** `broadcastToAll(event, data)`
- **Event naming:** `entity:action` pattern

---

## ERROR HANDLING PATTERN

### Standard Error Template
```typescript
import { ApiError } from '../core/http.js';

// Not found
if (!entity) throw new ApiError(404, 'Entity not found', 'entity_not_found');

// Conflict
if (existing) throw new ApiError(409, 'Already exists', 'already_exists');

// Unauthorized
if (!req.user) throw new ApiError(401, 'Not authenticated', 'unauthenticated');

// Forbidden
if (!hasPermission) throw new ApiError(403, 'Permission denied', 'permission_denied');

// Bad request
if (!isValid) throw new ApiError(400, 'Invalid input', 'invalid_input');
```

### Key Patterns:
- **ApiError:** Consistent error class
- **Status codes:** 400, 401, 403, 404, 409
- **Error codes:** snake_case, descriptive
- **Messages:** User-friendly

---

## MIGRATION PATTERN (TO BE IMPLEMENTED)

### Standard Migration Template
```typescript
// prisma/migrations/XXXXXX_create_entity/migration.sql
-- Create enum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- Create table
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "field1" TEXT NOT NULL,
    "field2" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "Entity_field1_idx" ON "Entity"("field1");
CREATE INDEX "Entity_status_idx" ON "Entity"("status");
CREATE INDEX "Entity_createdAt_idx" ON "Entity"("createdAt");

-- Create foreign key
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_parentId_fkey" 
    FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

---

## SUMMARY: IMPLEMENTATION RULES

### When Creating New Entities:

1. **Copy existing entity structure:**
   - Use CUID for ID
   - Add createdAt/updatedAt
   - Add deletedAt if soft delete needed
   - Follow same field naming conventions

2. **Copy existing relation pattern:**
   - Use proper foreign keys
   - Use appropriate delete behavior
   - Add indexes on foreign keys
   - Name relations clearly

3. **Copy existing service pattern:**
   - Direct Prisma usage
   - ApiError for errors
   - Audit logging for changes
   - WebSocket broadcasting where needed

4. **Copy existing validation pattern:**
   - Zod schemas
   - Type inference
   - Field validation
   - Transformations

5. **Copy existing index pattern:**
   - Index foreign keys
   - Index query fields
   - Index timestamps
   - Add composite indexes where needed

### DO NOT:
- ❌ Invent new entity structure
- ❌ Change ID type
- ❌ Remove timestamps
- ❌ Change relation pattern
- ❌ Add repository abstraction
- ❌ Change error handling
- ❌ Skip audit logging
- ❌ Skip indexes

### DO:
- ✅ Copy existing patterns exactly
- ✅ Change only business fields
- ✅ Change only business logic
- ✅ Keep all structural patterns same
- ✅ Follow naming conventions
- ✅ Add proper indexes
- ✅ Add proper relations
- ✅ Add audit logging

---

**PATTERN ANALYSIS COMPLETE.**
**READY FOR ENTITY CONSTRUCTION.**
