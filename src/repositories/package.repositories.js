import Package from '../models/package.model.js';

export default class PackageRepository {
  static async findAll() {
    return await Package.find();
  }

  static async findById(id) {
    return await Package.findById(id);
  }

  static async create(data) {
    return await Package.create(data);
  }

  static async update(id, data) {
    return await Package.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id) {
    return await Package.findByIdAndDelete(id);
  }
}
