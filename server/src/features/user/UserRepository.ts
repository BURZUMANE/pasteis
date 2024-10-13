import { User } from './models/User';
import { DriverVehicleAssignment, Vehicle } from '../models';

export class UserRepository {
  async getAllUsers() {
    return await User.findAll({ raw: true });
  }

  async createUser(userData: { userNickname: string; name: string; password: string }) {
    return await User.create(userData);
  }

  async findUserByNickname(userNickname: string): Promise<any | null> {
    return await User.findOne({
      where: { userNickname },
      include: [{
        model: DriverVehicleAssignment,
        as: 'assignments',
        include: [{
          model: Vehicle,
          as: 'vehicle',
          attributes: ['vehiclePlate']
        }]
      }]
    });
  }
}
