import App from '@/App';
import LoginPage from '@/features/auth/pages/LoginPage';
import DriverPage from '@/features/Driver/pages/DriversPage';
import VehiclesPage from '@/features/vehicles/pages/VehiclesPage';
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect
} from '@tanstack/react-router';
import OrdersPage from './features/orders/pages/OrdersPage';
import { UserRole } from '@/core/types';

export const Routes = {
  Driver: '/driver',
  Orders: '/orders',
  Vehicles: '/vehicles',
  Auth: '/auth',
};

interface AuthContext {
  isAuthenticated: boolean;
  userRole: string;
}

const requireAuthAndRole = (context: AuthContext, requiredRole: string, redirectTo: string) => {
  if (!context.isAuthenticated) {
    throw redirect({ to: redirectTo, replace: true });
  }
  if (context.userRole !== requiredRole) {
    throw redirect({ to: redirectTo, replace: true });
  }
};

export const createAppRouter = (context: AuthContext) => {
  const rootRoute = createRootRoute({
    component: App,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => {
      if (context.isAuthenticated) {
        throw redirect({
          to: context.userRole === UserRole.Driver ? Routes.Driver : Routes.Orders,
          replace: true,
        });
      }
      throw redirect({ to: Routes.Auth, replace: true });
    },
  });

  const routes = [
    createRoute({
      getParentRoute: () => rootRoute,
      path: Routes.Driver,
      component: DriverPage,
      beforeLoad: () => requireAuthAndRole(context, UserRole.Driver, Routes.Auth),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: Routes.Orders,
      component: OrdersPage,
      beforeLoad: () => requireAuthAndRole(context, UserRole.Manager, Routes.Auth),
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: Routes.Vehicles,
      component: VehiclesPage,
      beforeLoad: () => requireAuthAndRole(context, UserRole.Manager, Routes.Auth),
    }),
  ];

  const authPage = createRoute({
    getParentRoute: () => rootRoute,
    path: Routes.Auth,
    component: LoginPage,
    beforeLoad: () => {
      if (context.isAuthenticated) {
        throw redirect({ to: context.userRole === UserRole.Driver ? Routes.Driver : Routes.Orders, replace: true });
      }
    },
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([
      indexRoute,
      ...routes,
      authPage,
    ]),
    context,
  });

  return router;
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
