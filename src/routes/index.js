import { useRoutes } from 'react-router-dom'

// project import
import AnonymousRoutes from './AnonymousRoutes'
import MainRoutes from './MainRoutes'
import GeneralRoutes from './GeneralRoutes'

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([GeneralRoutes, MainRoutes, AnonymousRoutes])
}
