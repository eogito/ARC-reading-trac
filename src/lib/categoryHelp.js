import _ from "lodash"

export default {
    getCategoryOptions(categoryResult) {
        const categoryOptionList = []
        if (categoryResult) {
            _.forEach(categoryResult,  category => {
                const option = {
                    label: category.name,
                    id: category.id.toString()
                }
                categoryOptionList.push(option)
            })
        }
        return categoryOptionList
    },
    getCategoryById(categoryId, categories) {
        if (typeof categoryId === 'string') {
            categoryId = parseInt(categoryId)
        }
        return categories.find(category => categoryId === category.id)
    }
}