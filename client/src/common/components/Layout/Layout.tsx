import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { NavLinks } from '../Navlinks/NavLinks';
import { useAuth } from '@/features/auth/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth() || {};

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        {isAuthenticated && (
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Roboto, sans-serif' }}>
              Meight Logistics Manager
            </Typography>
            <NavLinks />
          </Toolbar>
        )}
      </AppBar>
      <Container sx={{ paddingY: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
