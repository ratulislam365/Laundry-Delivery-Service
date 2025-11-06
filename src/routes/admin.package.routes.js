import express from 'express';
import PackageController from '../controllers/package.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/admin/packages', protect, restrictTo('admin'), PackageController.create);
router.put('/admin/packages/:id', protect, restrictTo('admin'), PackageController.update);
router.delete('/admin/packages/:id', protect, restrictTo('admin'), PackageController.delete);

export default router;
