import bcrypt from 'bcrypt';
import { UserRepository } from './UserRepository';

const userRepository = new UserRepository();

export async function getAllUsers() {
  return await userRepository.getAllUsers();
}

export async function createUser(userData: { userNickname: string; name: string; password: string }) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await userRepository.createUser({ ...userData, password: hashedPassword });
}

export async function authenticateUser(userNickname: string, password: string): Promise<any | null> {
  const user = await userRepository.findUserByNickname(userNickname);
  if (!user) return null;

  const isAuthenticatedUser = await bcrypt.compare(password, user.password);
  if (isAuthenticatedUser) {
    const vehiclePlate = user.assignments.length > 0 ? user.assignments[0].vehicle?.vehiclePlate : null;
    return {
      message: 'Login successful',
      userNickname: user.userNickname,
      role: user.role,
      userId: user.id,
      vehiclePlate,
      token: 'xxxx-yyyy-xxxx-yyyyy'
    };
  }
  return null;
}
