export const getHomeRoute = (user) => {
  if (!user) return '/';
  return user.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/';
};

export const checkRoleRedirect = (currentPath, user) => {
  if (!user) return null;

  const isAdmin = user.role?.toUpperCase() === 'ADMIN';
  const isOnAdminRoute = currentPath.startsWith('/admin');

  if (isAdmin && currentPath === '/') return '/admin';
  if (!isAdmin && isOnAdminRoute) return '/';

  return null;
};
