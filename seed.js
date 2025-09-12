import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const ownerPass = await bcrypt.hash('Owner@123', 10);
  const userPass = await bcrypt.hash('User@1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator Account',
      email: 'admin@example.com',
      address: 'HQ, Admin Street',
      passwordHash: adminPass,
      role: 'ADMIN'
    }
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Primary Store Owner Name',
      email: 'owner@example.com',
      address: 'Owner Address',
      passwordHash: ownerPass,
      role: 'OWNER'
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Normal Platform User Name',
      email: 'user@example.com',
      address: 'User Address',
      passwordHash: userPass,
      role: 'USER'
    }
  });

  const store1 = await prisma.store.create({ data: { name: 'Fresh Mart', address: '123 Market Road', ownerId: owner.id } });
  const store2 = await prisma.store.create({ data: { name: 'Tech Hub', address: '42 Silicon Ave' } });

  await prisma.rating.create({ data: { userId: user.id, storeId: store1.id, value: 4 } });
  await prisma.rating.create({ data: { userId: user.id, storeId: store2.id, value: 5 } });

  console.log('Seeded.');
}

main().finally(async () => {
  await prisma.$disconnect();
});
