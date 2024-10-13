import { UserRole } from './roles';

export interface User {
    message: string;
    userNickname: string;
    role: UserRole;
    userId: number;
    vehiclePlate: string;
    token: string;
}
