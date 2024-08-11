import { lazy } from 'react'
import UnAuthGuard from "../guards/UnAuthGuard"

// project import
import Loadable from 'components/Loadable'
import MinimalLayout from 'layout/MinimalLayout'

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/Login')))

// ==============================|| AUTH ROUTING ||============================== //

const AnonymousRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <UnAuthGuard component={<AuthLogin />} />
    }
  ]
}

export default AnonymousRoutes
