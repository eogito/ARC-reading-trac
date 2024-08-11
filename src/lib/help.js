export const displayMultiError = (response) => {
    if (response && response.message) {
        if (typeof response.message === 'string') {
            const str = response.message
            response.message = []
            response.message.push(str)
        }
    }
    return response
}