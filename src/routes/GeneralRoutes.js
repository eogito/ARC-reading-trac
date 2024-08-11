
import { lazy } from 'react'

// project import
import Loadable from 'components/Loadable'
import MainLayout from 'layout/MainLayout'

// render - login
const Error404 = Loadable(lazy(() => import('pages/general/Error404')))

// ==============================|| AUTH ROUTING ||============================== //

const GeneralRoutes = {
    path: '*',
    element: <MainLayout />,
    children: [
        {
            path: '*',
            element: <Error404 />
        }
    ]
}

export default GeneralRoutes
