import { Router } from 'express';
import mapRoutes from './map.routes.js';
import searchRoutes from './search.routes.js';
// import productRoutes from './productRoutes.mts';
// import swaggerRoutes from './swaggerRoutes.mts';
// import userRoutes from './userRoutes.mts';
// import orderRoutes from './orderRoutes.mts';

const router = Router();

// The home page route
router.get('/', (req, res) => {
  res.json({ title: 'Home Page' });
});

// load map routes
router.use('/map', mapRoutes);

// load search routes
router.use('/search', searchRoutes);

export default router;