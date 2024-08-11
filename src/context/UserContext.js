// import PropTypes from 'prop-types'
import React, {useCallback, useContext, useEffect, useState} from "react"
import { ACCESS_TOKEN } from "../constants/userConstants"
import Cookie from "js-cookie"
import PropTypes from "prop-types"
import ProgramConfigApi from "../api/ProgramConfigApi"

const UserContext = React.createContext()

export const UserProvider = ({ children }) => {
  const [sessionUser, setSessionUser] = useState()
  const [setting, setSetting] = useState()

  const loadSetting = useCallback(async () => {
    try {
      if (!setting) {
        const settingResult = await ProgramConfigApi.getAllSetting()
        if (settingResult) {
          setSetting(settingResult)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    loadSetting()
  }, [loadSetting])

  const updateSessionUser = (user) => {
    setSessionUser(user)
  }

  const getSessionUser = ( ) => {
    const token =  Cookie.get(ACCESS_TOKEN)
    if (!token) {
      return
    }
    return sessionUser
  }


  const updateSetting = (data) => {
    setSetting(data)
  }

  const getSetting = ( ) => {
    return setting
  }

  return (
    <UserContext.Provider value={
      {
        updateSessionUser,
        getSessionUser,
        updateSetting,
        getSetting
      }
    }>
      {children}
    </UserContext.Provider>
  )
}
UserProvider.propTypes = {
  children: PropTypes.node
}
// make sure use
export const useUserContext = () => {
  return useContext(UserContext)
}
