import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Cookie from "js-cookie"
import { ACCESS_TOKEN } from "../../constants/userConstants"
/* eslint-disable react/prop-types */
const AuthLogout = ({component}) => {/* eslint-disable react/prop-types */
    const navigate = useNavigate()
    const cleanLogin = () => {
        Cookie.remove(ACCESS_TOKEN)
        window.location.href='/login'
    }

    useEffect(() => {
        cleanLogin()
    }, [navigate])

    return <React.Fragment>{component}</React.Fragment>
}

export default AuthLogout