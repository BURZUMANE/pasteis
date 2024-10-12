import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Credentials, User } from '@/core/types';
import { ApiUtils } from '@/services/api';

const LoginPage = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ userNickname: '', password: '' });
  const loginMutation = useMutation({
    mutationFn: (data: Credentials) => ApiUtils.post<User>('/users/login', data),
    onSuccess: login,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="userNickname" label="User ID" fullWidth onChange={handleChange} />
        <TextField name="password" label="Password" type="password" fullWidth onChange={handleChange} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
