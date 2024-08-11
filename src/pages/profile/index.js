import React from 'react'
import { useCallback, useState, useEffect } from 'react'
import { getSessionMemberApi } from '../../api/AuthApi'
// import { useUserContext } from "../../context/UserContext"


const Profile = () => {
    const [profile, setProfile] = useState()

    const getPofile = useCallback(async () => {
        try {
            const member = await getSessionMemberApi()
            if (member) {
                setProfile(member)
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        getPofile()
    }, [getPofile])

    return (
            <div>
                { (profile) &&
                <div className='dd'>{profile.id}</div>
                }
            </div>
    )
}

export default Profile
