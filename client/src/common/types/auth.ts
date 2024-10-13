import { User } from './user';

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}


export interface Credentials {
    userNickname: string;
    password: string;
}