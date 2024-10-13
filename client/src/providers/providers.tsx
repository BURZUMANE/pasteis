import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import theme from '@/styles/theme';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { RouterProvider } from '@tanstack/react-router';
import { createAppRouter } from '@/config/routing';
import { SocketProvider } from '@/common/context/Socket';

const queryClient = new QueryClient();

const AppRouter = () => {
  const { user, isAuthenticated } = useAuth();
  const router = createAppRouter({
    isAuthenticated: !!isAuthenticated,
    userRole: user?.role || ''
  });

  return (
    <SocketProvider user={user}>
      <RouterProvider router={router} />
    </SocketProvider>
  );
};

export const Providers = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
