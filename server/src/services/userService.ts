import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { DriverVehicleAssignment, Vehicle } from '../models';

export async function getAllUsers() {
  return await User.findAll({ raw: true });
}

export async function createUser(userData: { userNickname: string; name: string; password: string }) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({ ...userData, password: hashedPassword });
}

interface AuthenticatedUser extends User {
  assignments: Array<{
    vehicle: {
      vehiclePlate: string;
    };
  }>;
}

export async function authenticateUser(userNickname: string, password: string): Promise<any | null> {
  const user = await User.findOne({
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
  }) as AuthenticatedUser; 

  if (!user) return null;

  const isAuthenticatedUser = await bcrypt.compare(password, user.password);
  if (isAuthenticatedUser) {
  
    const vehiclePlate = user.assignments.length > 0 ? user.assignments[0].vehicle?.vehiclePlate : null;

    return {
      message: "Login successful",
      userNickname: user.userNickname,
      role: user.role,
      userId: user.id,
      vehiclePlate,  
      token: "xxxx-yyyy-xxxx-yyyyy" 
    };
  }

  return null;
}