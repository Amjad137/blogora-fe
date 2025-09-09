export const ROUTES = {
  ROOT: '/',

  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  FEEDS: '/feeds',
  DASHBOARD: '/dashboard',

  USERS_ROOT: '/users', //Access: Admin
};

export const ADMIN_ROUTES = {
  ROOT: ROUTES.ROOT,
  USERS_ROOT: ROUTES.USERS_ROOT,
};
