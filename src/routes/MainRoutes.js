import { lazy } from 'react'

// project import
import Loadable from 'components/Loadable'
import MainLayout from 'layout/MainLayout'
import AuthGuard from "../guards/AuthGuards"

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')))
const AddBook = Loadable(lazy(() => import('pages/add')))
const ProgressBook = Loadable(lazy(() => import('pages/progress')))
const CustomBook = Loadable(lazy(() => import('pages/custom')))
const AvatarSelection = Loadable(lazy(() => import('pages/avatar')))

// render - sample page

const AuthLogout = Loadable(lazy(() => import('pages/auth/Logout')))
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      element: <AuthGuard component={<DashboardDefault />} />
    },
    {
      path: 'add',
      element: <AuthGuard component={<AddBook />} />
    },
    {
      path: 'update',
      element: <AuthGuard component={<ProgressBook />} />
    },
    {
      path: 'custom',
      element: <AuthGuard component={<CustomBook />} />
    },
    {
      path: 'profile',
      element: <AuthGuard component={<AvatarSelection />} />
    },
    {
      path: 'logout',
      element: <AuthGuard component={<AuthLogout />} />
    }
  ]
}

export default MainRoutes
