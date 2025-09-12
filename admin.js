import express from 'express';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

router.use(requireAuth, requireRole('ADMIN'));

const createUserSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string().min(8).max(16),
  role: z.enum(['ADMIN', 'USER', 'OWNER'])
});

router.get('/stats', async (req, res, next) => {
  try {
    const [users, stores, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);
    res.json({ users, stores, ratings });
  } catch (e) { next(e); }
});

router.post('/users', async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const bcrypt = (await import('bcryptjs')).default;
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({ data: { ...data, passwordHash } });
    res.json({ id: user.id });
  } catch (e) { next(e); }
});

router.get('/users', async (req, res, next) => {
  try {
    const { q = '', role } = req.query;
    const filters = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ]
    };
    if (role) filters['role'] = role;
    const users = await prisma.user.findMany({ where: filters, orderBy: { id: 'desc' } });
    res.json(users);
  } catch (e) { next(e); }
});

const storeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('').transform(() => undefined)),
  address: z.string().max(400),
  ownerId: z.number().int().optional()
});

router.post('/stores', async (req, res, next) => {
  try {
    const data = storeSchema.parse(req.body);
    const store = await prisma.store.create({ data });
    res.json(store);
  } catch (e) { next(e); }
});

router.get('/stores', async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        ratings: true,
        owner: true
      },
      orderBy: { id: 'desc' }
    });
    const withAvg = stores.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      ownerId: s.ownerId,
      ownerName: s.owner?.name ?? null,
      rating: s.ratings.length ? (s.ratings.reduce((a, r) => a + r.value, 0) / s.ratings.length) : null
    }));
    res.json(withAvg);
  } catch (e) { next(e); }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        stores: { include: { ratings: true } }
      }
    });
    if (!user) return res.status(404).json({ error: 'Not found' });

    let ownerRating = null;
    if (user.role === 'OWNER' && user.stores.length) {
      const ratings = user.stores.flatMap(s => s.ratings);
      ownerRating = ratings.length ? ratings.reduce((a, r) => a + r.value, 0) / ratings.length : null;
    }

    res.json({ ...user, ownerRating });
  } catch (e) { next(e); }
});

export default router;
