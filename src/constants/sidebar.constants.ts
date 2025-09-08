import { LayoutDashboard } from 'lucide-react';
import { ROUTES } from './routes.constants';

export const SIDEBAR_MENU_CATEGORIES = {
  HOME: 'Home',
  USERS_MANAGEMENT: 'Users Management',
};

export const COMMON_SIDEBAR_MENU_ITEMS = {
  HOME: [
    {
      name: 'Dashboard',
      url: ROUTES.ROOT,
      icon: LayoutDashboard,
    },
  ],
};
