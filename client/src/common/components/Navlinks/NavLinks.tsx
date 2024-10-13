import { Routes } from '@/config/routing';
import { NavBox, NavLink } from './NavLinks.styles';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/common/types';

export const NavLinks = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <NavBox>
      {user && user.role === UserRole.Manager && (
        <>
          <NavLink to={Routes.Orders}>Orders</NavLink>
          <NavLink to={Routes.Vehicles}>Vehicles</NavLink>
        </>
      )}
      <NavLink onClick={handleLogout} aria-label="Logout">
        Logout
      </NavLink>
    </NavBox>
  );
};
