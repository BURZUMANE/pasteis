import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import useLogin from '@/features/auth/hooks/useLogin';

interface Credentials {
  userNickname: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({ userNickname: '', password: '' });
  const loginMutation = useLogin();

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ mt: 2 }}
          name="userNickname"
          label="User ID"
          fullWidth
          value={credentials.userNickname}
          onChange={handleChange}
        />
        <TextField
          sx={{ mt: 2 }}
          name="password"
          label="Password"
          type="password"
          fullWidth
          value={credentials.password}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
