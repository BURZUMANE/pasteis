import { AuthContextType, User, UserRole } from '@/core/types';
import { createContext, ReactNode, useContext, useState, useMemo } from 'react';

const defaultUser: User = {
    message: "",
    userNickname: "",
    role: UserRole.Guest,
    userId: 0,
    vehiclePlate: "xx-00-XX",
    token: ""
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : defaultUser;
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
            return defaultUser;
        }
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(defaultUser);
        localStorage.removeItem('user');
    };

    const updateUser = (updatedUser: Partial<User>) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, ...updatedUser } as User;
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const isAuthenticated = user.userId !== 0;

    const value = useMemo(() => ({ user, login, logout, updateUser, isAuthenticated }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
