import { SupplierFindAllApi } from '../api/SupplierApi'
export default {
    async suppliers() {
        return await SupplierFindAllApi()
    },
    statusList() {
        return [
            {
                id: 1,
                name: 'Active'
            },
            {
                id: 2,
                name: 'Discontinue'
            }
        ]
    }
}