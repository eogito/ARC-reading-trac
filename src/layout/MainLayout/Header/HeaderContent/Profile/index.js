import PropTypes from 'prop-types'
// material-ui
import {
  Box,
  Stack,
  Typography
} from '@mui/material'

import { useUserContext } from "../../../../../context/UserContext"


function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}


// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const { getSessionUser } = useUserContext()


  const sessionUser = getSessionUser()
  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Typography variant="subtitle1">{sessionUser ? sessionUser.firstName + ' ' + sessionUser.firstName : ''} </Typography>
        </Stack>


    </Box>
  )
}

export default Profile
