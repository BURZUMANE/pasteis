import { useMutation } from '@tanstack/react-query';
import { ApiUtils } from '@/services/api';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Credentials, User } from '@/core/types';




const useLogin = () => {
    const { login } = useAuth();

    return useMutation<User, Error, Credentials>({
        mutationFn: (data: Credentials) => ApiUtils.post<User>('/users/login', data),
        onSuccess: (data: User) => {
            login(data);
        },
    });
};

export default useLogin;
