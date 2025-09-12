import express from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: { ratings: true }
    });
    const data = stores.map(s => ({
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: s.ratings.length ? (s.ratings.reduce((a, r) => a + r.value, 0) / s.ratings.length) : null
    }));
    res.json(data);
  } catch (e) { next(e); }
});

const ratingSchema = z.object({
  storeId: z.number().int(),
  value: z.number().int().min(1).max(5)
});

router.post('/rate', requireAuth, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { storeId, value } = ratingSchema.parse(req.body);
    
    const existing = await prisma.rating.findUnique({ where: { userId_storeId: { userId, storeId } } });
    let rating;
    if (existing) {
      rating = await prisma.rating.update({ where: { id: existing.id }, data: { value } });
    } else {
      rating = await prisma.rating.create({ data: { storeId, userId, value } });
    }
    res.json(rating);
  } catch (e) { next(e); }
});

// DASHBOARD FO OWNER
router.get('/owner/ratings', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'OWNER') return res.status(403).json({ error: 'Forbidden' });
    const stores = await prisma.store.findMany({
      where: { ownerId: req.user.id },
      include: { ratings: { include: { user: true } } }
    });
    const result = stores.map(s => ({
      storeId: s.id,
      storeName: s.name,
      averageRating: s.ratings.length ? (s.ratings.reduce((a, r) => a + r.value, 0) / s.ratings.length) : null,
      ratings: s.ratings.map(r => ({ userId: r.userId, userName: r.user.name, value: r.value }))
    }));
    res.json(result);
  } catch (e) { next(e); }
});

export default router;
