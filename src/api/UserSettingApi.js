import axiosHttp from './axiosHttp'

export default {

    async getSettingsByModule(userId, module) {
        try {
            const url = '/userSetting?userId=' + userId + '&module=' +  module
            const results = await axiosHttp.get(url)
            if (results && results.data) {
                return results.data
            }
        } catch (error) {
            return []
        }
    }
}