import axios from "axios"
import Cookie from 'js-cookie'

import ServerAPISetting from "./ServerAPISetting"
import { ACCESS_TOKEN } from "../constants/userConstants"

const axiosHttp = axios.create({
    baseURL: ServerAPISetting.apiUrl()
})

axiosHttp.interceptors.request.use(
    (config) => {
        const token =  Cookie.get(ACCESS_TOKEN)
        return {
            ...config,
            headers: {
                ...(token !== null && { Authorization: `Bearer ${token}` }),
                ...config.headers
            }
        }
    },
    (error) => {
        console.log(error)
        return Promise.reject(error)
    }
)

axiosHttp.interceptors.response.use(
    (response) => {
        //const url = response.config.url;

        //setLocalStorageToken(token);
        return response
    },
    (error) => {
        if (error.response.status === 401) {
            if (error.response.data && error.response.data.message === 'Unauthorized') {
                Cookie.remove(ACCESS_TOKEN)
                window.location = '/login'
            }

        }
        return Promise.reject(error)
    }
)

export default axiosHttp