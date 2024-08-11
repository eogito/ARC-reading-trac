import Axios from 'axios'
import {
  USER_LOGOUT,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL
} from '../constants/userConstants'
import axiosHttp from "./axiosHttp"
import ServerAPISetting from './ServerAPISetting'

const profileUpdateApi = ({ userId, name, email, password }) =>
  async (dispatch, getState) => {
    const {
      userSignin: { userInfo }
    } = getState()
    dispatch({ type: USER_UPDATE_REQUEST, payload: { userId, name, email, password } })
    try {
      const { data } = await Axios.put(
        '/users/' + userId,
        { name, email, password },
        {
          headers: {
            Authorization: 'Bearer ' + userInfo.token
          }
        }
      )
      dispatch({ type: USER_UPDATE_SUCCESS, payload: data })
      // Cookie.set('userInfo', JSON.stringify(data))
    } catch (error) {
      dispatch({ type: USER_UPDATE_FAIL, payload: error.message })
    }
  }

const loginApi = async (formData) => {
  try {
    const url = ServerAPISetting.apiUrl() + '/auth/login'
    const result = await Axios.post(url, formData)
    return result
  } catch (error) {
      return error.response
  }
}

const registerApi = (name, email, password) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } })
  try {

    const { data } = await Axios.post('/api/users/register', { name, email, password })
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
    // Cookie.set('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message })
  }
}

const getSessionMemberApi = async () => {
    try {
        const url = '/auth/profile'
        const result = await axiosHttp.get(url)
        if (result && result.data) {
            return result.data
        }
    } catch (error) {
        console.log(error)
        // dispatch({ type: USER_SIGNIN_FAIL, payload: error.message })
    }
}

const logoutApi = () => (dispatch) => {
  // Cookie.remove('userInfo')
  dispatch({ type: USER_LOGOUT })
}
export { loginApi, registerApi, logoutApi, profileUpdateApi, getSessionMemberApi }
