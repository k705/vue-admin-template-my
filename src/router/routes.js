/* Layout */
import Layout from '@/layout'


export const staticRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },






]
export const asyncRoutes = [{
  path: '/product',
  component: Layout,
  redirect: '/product/trademark',
  name: 'Product',
  meta: { title: '商品管理', icon: 'el-icon-s-shop' },
  children: [
    {
      path: 'trademark',
      name: 'Trademark',
      component: () => import('@/views/product/trademark'),
      meta: { title: '品牌管理' }
    },
    {
      path: 'attr',
      name: 'Attr',
      component: () => import('@/views/product/attr'),
      meta: { title: '平台属性管理' }
    }]
},
{
  path: '/acl',
  component: Layout,
  redirect: '/acl/user',
  name: 'Acl',
  meta: { title: '权限管理', icon: 'el-icon-s-shop' },
  children: [
    {
      path: '/user',
      name: 'User',
      component: () => import('@/views/acl/user'),
      meta: { title: '用户管理' }
    },
    {
      path: '/role',
      name: 'Role',
      component: () => import('@/views/acl/role'),
      meta: { title: '角色管理' }
    },
    {
      path: '/role/auth',
      name: 'Role',
      component: () => import('@/views/acl/role/roleAuth.vue'),
      meta: { title: '角色管理' },
      hidden: true,
      activeMenu: "/role",
    },
    {
      path: '/permission',
      name: 'Permission',
      component: () => import('@/views/acl/permission'),
      meta: { title: '菜单管理' }
    },
  ]
}
]

export const anyRoutes = [{ path: '*', redirect: '/404', hidden: true }]
