// assets
import AddIcon from '@mui/icons-material/Add'
import UpdateIcon from '@mui/icons-material/Update'
import FaceIcon from '@mui/icons-material/Face'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const member = {
  id: 'support',
  title: 'Main',
  type: 'group',
  children: [
    {
      id: 'add',
      title: 'Add',
      type: 'item',
      url: '/add',
      icon: AddIcon
    },
    {
      id: 'update',
      title: 'Progress',
      type: 'item',
      url: '/update',
      icon: UpdateIcon
    }, 
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      url: '/profile',
      icon: FaceIcon
    },
    {
      id: 'logout',
      title: 'LogOut',
      type: 'item',
      url: '/logout',
      icon: ExitToAppIcon
    }
  ]
}

export default member
