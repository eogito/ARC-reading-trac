export default {
    apiUrl() {
        if (process.env.NODE_ENV === 'development') {
            return 'http://localhost:3000/api'
        } else {
            return '/api'
        }

    },
    test() {
        return 'http://localhost:3001/api'
    }

}