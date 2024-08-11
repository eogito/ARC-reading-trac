import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookie from "js-cookie"
import { useUserContext } from "../context/UserContext"
import { getSessionMemberApi } from "../api/AuthApi"
import { ACCESS_TOKEN } from "../constants/userConstants"
/* eslint-disable react/prop-types */
const AuthGuard = ({component}) => {/* eslint-disable react/prop-types */
    const navigate = useNavigate()
    const { getSessionUser } = useUserContext()
    const { updateSessionUser} = useUserContext()

    const cleanLogin = () => {
        Cookie.remove(ACCESS_TOKEN)
        window.location.href='/login'
    }

    useEffect(() => {
        const refreshMemberSession = async () => {
            const member = await getSessionMemberApi()
            if (member) {
                updateSessionUser(member)
            } else {
                cleanLogin()
            }
        }
        const token =  Cookie.get(ACCESS_TOKEN)
        if (token) {
            // check if refresh page clause usercontext lost
            const sessionUser = getSessionUser()
            if (sessionUser) {
                // check session is expired
            } else {
                refreshMemberSession()
            }
        } else {
            cleanLogin()
        }
    }, [getSessionUser, navigate, updateSessionUser])

    return <React.Fragment>{component}</React.Fragment>
}

export default AuthGuard