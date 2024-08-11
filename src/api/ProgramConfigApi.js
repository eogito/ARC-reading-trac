import axiosHttp from "./axiosHttp"

export default {
    async getAllSetting() {
        try {
            let url = '/programConfig'
            const result = await axiosHttp.get(url)
            if (result && result.data) {
                return result.data
            }
        } catch (error) {
            return {}
        }
    }
}