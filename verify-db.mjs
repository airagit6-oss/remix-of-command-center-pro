import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('=== DATABASE VERIFICATION ===\n');

  // Get all tables
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  
  console.log(`✅ Tables Created: ${tables.length}`);
  console.log('Tables:', tables.map(t => t.table_name).join(', '));

  // Get User table structure
  const userColumns = await prisma.$queryRaw`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'User' AND table_schema = 'public'
    ORDER BY ordinal_position
  `;
  
  console.log(`\n✅ User Table Columns: ${userColumns.length}`);
  userColumns.forEach(col => {
    console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
  });

  // Check for indexes
  const indexes = await prisma.$queryRaw`
    SELECT indexname, tablename
    FROM pg_indexes
    WHERE schemaname = 'public'
    LIMIT 10
  `;
  
  console.log(`\n✅ Sample Indexes: ${indexes.length}`);
  indexes.forEach(idx => {
    console.log(`  - ${idx.indexname} on ${idx.tablename}`);
  });

  // Check foreign key constraints
  const constraints = await prisma.$queryRaw`
    SELECT
      tc.table_name,
      tc.constraint_name,
      tc.constraint_type
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_schema = 'public'
      AND tc.constraint_type = 'FOREIGN KEY'
    LIMIT 10
  `;
  
  console.log(`\n✅ Sample Foreign Key Constraints: ${constraints.length}`);
  constraints.forEach(c => {
    console.log(`  - ${c.constraint_name} on ${c.table_name}`);
  });

  // Test creating a user
  console.log('\n=== TEST CRUD OPERATION ===');
  try {
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        passwordHash: 'test-hash',
      },
    });
    console.log(`✅ Created User: ${testUser.id} - ${testUser.email}`);

    // Read user
    const foundUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    console.log(`✅ Read User: ${foundUser.email}`);

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { name: 'Updated Test User' },
    });
    console.log(`✅ Updated User: ${updatedUser.name}`);

    // Delete user
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log(`✅ Deleted User: ${testUser.id}`);

  } catch (error) {
    console.error('❌ CRUD Test Failed:', error.message);
  }

  console.log('\n=== VERIFICATION COMPLETE ===');
  await prisma.$disconnect();
}

verifyDatabase().catch(console.error);
