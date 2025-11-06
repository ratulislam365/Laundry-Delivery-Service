import PackageRepository from '../repositories/package.repositories.js';
import AppError from '../utils/appError.js';

export default class PackageService {
  static async getAllPackages() {
    return await PackageRepository.findAll();
  }

  static async getPackageById(id) {
    const pkg = await PackageRepository.findById(id);
    if (!pkg) throw new AppError('Package not found', 404);
    return pkg;
  }

  static async createPackage(data) {
    return await PackageRepository.create(data);
  }

  static async updatePackage(id, data) {
    const pkg = await PackageRepository.update(id, data);
    if (!pkg) throw new AppError('Package not found', 404);
    return pkg;
  }

  static async deletePackage(id) {
    const pkg = await PackageRepository.delete(id);
    if (!pkg) throw new AppError('Package not found', 404);
    return { message: 'Package deleted successfully' };
  }
}
