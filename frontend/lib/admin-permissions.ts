import type { UserRole } from '@/types'

export const adminRoles: UserRole[] = ['staff', 'admin', 'owner']

export const adminRouteAccess: Array<{ path: string; roles: UserRole[] }> = [
  { path: '/admin/bookings', roles: ['staff', 'admin', 'owner'] },
  { path: '/admin/payments', roles: ['staff', 'admin', 'owner'] },
  { path: '/admin/ticket-validation', roles: ['staff', 'admin', 'owner'] },
  { path: '/admin/movies', roles: ['admin', 'owner'] },
  { path: '/admin/cinemas', roles: ['admin', 'owner'] },
  { path: '/admin/showtimes', roles: ['admin', 'owner'] },
  { path: '/admin/customers', roles: ['admin', 'owner'] },
  { path: '/admin/notifications', roles: ['admin', 'owner'] },
  { path: '/admin/analytics', roles: ['admin', 'owner'] },
  { path: '/admin/settings', roles: ['admin', 'owner'] },
  { path: '/admin/profile', roles: ['staff', 'admin', 'owner'] },
  { path: '/admin', roles: ['staff', 'admin', 'owner'] },
]

export const canAccessAdmin = (role: string | undefined, pathname = '/admin') => {
  if (!role || !adminRoles.includes(role as UserRole)) return false
  const match = adminRouteAccess.find((route) => (
    route.path === '/admin'
      ? pathname === '/admin'
      : pathname === route.path || pathname.startsWith(`${route.path}/`)
  ))
  return match ? match.roles.includes(role as UserRole) : false
}

export const canManageAdminUsers = (role: string | undefined) => role === 'owner'
