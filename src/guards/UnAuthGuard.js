import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from "../context/UserContext"

const UnAuthGuard = ({component}) => {
    const navigate = useNavigate()
    const { getSessionUser } = useUserContext()

    useEffect(() => {
        const sessionUser = getSessionUser()
        if (sessionUser) {
            navigate('/dashboard')
        }
    }, [component])

    return <React.Fragment>{component}</React.Fragment>
}

export default UnAuthGuard