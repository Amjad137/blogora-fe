'use client';

import AdminDashboard from '@/components/dashboards/admin/admin-dashboard';
import { USER_ROLE } from '@/constants/user.constants';
import { useAuthStore } from '@/stores/auth.store';

const Home = () => {
  const { userRole } = useAuthStore();

  if (userRole === USER_ROLE.ADMIN) {
    return <AdminDashboard />;
  }

  return <div className='p-4'>Welcome to the Dashboard</div>;
};

export default Home;
