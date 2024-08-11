import axiosHttp from './axiosHttp'
export default {
    
    async getAll() {
        try {
            const url = '/avatar/'
            console.log(url)

            const result = await axiosHttp.get(url)
            console.log(result.data)
            if (result && result.data) {
                return result.data
            }
        } catch (error) {
            console.log(error.response.data)
            // dispatch({ type: avatar_SIGNIN_FAIL, payload: error.message })
        }
    },
    async getById(id) {
        try {
            const url = '/avatar/' + id
            console.log(url)

            const result = await axiosHttp.get(url)
            console.log(result.data)
            if (result && result.data) {
                return result.data
            }
        } catch (error) {
            console.log(error.response.data)
            // dispatch({ type: avatar_SIGNIN_FAIL, payload: error.message })
        }
    },
    async update(id, order) {
        console.log('ProductUpdateApi............')
        try {
            const url = '/avatar/' + id
            console.log(url)
            console.log(order)
            const result = await axiosHttp.put(url, order)
            console.log(result)
            return result.data
        } catch (error) {
            console.log(error)
            console.log(error.response.data)
            return error.response.data
            // dispatch({ type: avatar_SIGNIN_FAIL, payload: error.message })
        }
    },
    
    async delete(id) {
        try {
            const url = '/avatar/' + id
            console.log(url)
            const result = await axiosHttp.delete(url)
            console.log(result)
            return result
        } catch (error) {
            console.log(error)
            console.log(error.response.data)
            return error.response.data
            // dispatch({ type: avatar_SIGNIN_FAIL, payload: error.message })
        }
    },

    async create(order) {
        console.log(order)
        try {
            const url = '/avatar'
            console.log(url)
            console.log(order)
            const result = await axiosHttp.post(url, order)
            return result
        } catch (error) {
            console.log(error)
            console.log(error.response.data)
            return error.response.data
            // dispatch({ type: avatar_SIGNIN_FAIL, payload: error.message })
        }
    }
}