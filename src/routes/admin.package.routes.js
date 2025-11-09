import express from 'express';
import PackageController from '../controllers/package.controller.js';
import { verifyAccessToken } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.post(
  '/admin/packages',
  verifyAccessToken,
  isAdmin,
  PackageController.create
);
router.put(
  '/admin/packages/:id',
  verifyAccessToken,
  isAdmin,
  PackageController.update
);
router.delete(
  '/admin/packages/:id',
  verifyAccessToken,
  isAdmin,
  PackageController.delete
);

export default router;
