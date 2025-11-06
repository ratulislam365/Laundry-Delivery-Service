import PackageService from '../services/package.services.js';
import catchAsync from '../utils/catchAsync.js';

export default class PackageController {
  static getAll = catchAsync(async (req, res) => {
    const packages = await PackageService.getAllPackages();
    res.status(200).json({ success: true, data: packages });
  });

  static getOne = catchAsync(async (req, res) => {
    const pkg = await PackageService.getPackageById(req.params.id);
    res.status(200).json({ success: true, data: pkg });
  });

  static create = catchAsync(async (req, res) => {
    const pkg = await PackageService.createPackage(req.body);
    res.status(201).json({ success: true, data: pkg });
  });

  static update = catchAsync(async (req, res) => {
    const pkg = await PackageService.updatePackage(req.params.id, req.body);
    res.status(200).json({ success: true, data: pkg });
  });

  static delete = catchAsync(async (req, res) => {
    const result = await PackageService.deletePackage(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  });
}
