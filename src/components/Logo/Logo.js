// material-ui
import { useUserContext } from "../../context/UserContext"

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  let logo = ''
  const { getSetting } = useUserContext()
  const setting = getSetting()
  if (setting) {
    logo = '/image/' + setting.siteLogo
  }
  return (
      <img src={logo} alt={setting?.siteName} width="100"/>
  )
}

export default Logo
