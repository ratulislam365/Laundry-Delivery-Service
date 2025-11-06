import express from 'express';
import PackageController from '../controllers/package.controller.js';

const router = express.Router();

router.post('/packages', PackageController.create);
router.get('/packages', PackageController.getAll);
router.delete('/packages/:id', PackageController.delete);
router.get('/packages/:id', PackageController.getOne);
router.put('/packages/:id', PackageController.update);




export default router;
