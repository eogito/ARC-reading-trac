import _ from 'lodash'
export default {

    usersTypes() {
        return [
            {
                id: 1,
                typeKey: 'Practitioner',
                name: 'Practitioner'
            },
            {
                id: 2,
                typeKey: 'RECEIPTS',
                name: 'Receipts'
            },
            {
                id: 3,
                typeKey: 'MANAGER',
                name: 'Manager'
            },
            {
                id: 4,
                typeKey: 'ADMIN',
                name: 'Admin'
            }
        ]
    },
    getUserTypeName(searchTypeId) {
        if (searchTypeId) {
            const types = this.usersTypes()
            const typeData = types.find(({id}) => id === searchTypeId)
            if (typeData) {
                return typeData.name
            }
        }
    },

    getUserTypeIdByName(searchTypeName) {
        if (searchTypeName) {
            const types = this.usersTypes()
            const typeData = types.find(({name}) => name === searchTypeName)
            if (typeData) {
                return typeData.id
            }
        }
    },
    getUserTypeAllowList(typeId) {
        const types = this.usersTypes()
        const allowTypes = []
        _.forEach(types, (typeObj)=> {
            if (typeId === 2) {
                if (typeObj.id === 1) {
                    allowTypes.push(typeObj)
                }
            }
            if (typeId === 3) {
                const allowsIds = [1, 2]
                if (allowsIds.includes(typeObj.id)) {
                    allowTypes.push(typeObj)
                }
            }
            if (typeId === 4) {
                const allowsIds = [1, 2, 3]
                if (allowsIds.includes(typeObj.id)) {
                    allowTypes.push(typeObj)
                }
            }
            if (typeId === 5) {
                const allowsIds = [1, 2, 3, 4]
                if (allowsIds.includes(typeObj.id)) {
                    allowTypes.push(typeObj)
                }
            }
        })
        return allowTypes
    },
    getGenderOptions() {
        return [
            {
                id: 1,
                name: 'Male'
            },
            {
                id: 2,
                name: 'Female'
            }
        ]
    },
    getUserGenderStr(gender) {
        let genderStr = ''
        switch (gender) {
            case 0:
                genderStr = ''
                break
            case 1:
                genderStr = 'Male'
                break
            case 2:
                genderStr = 'Female'
                break
        }
        return genderStr
    },
    getFullName(user) {
        if (user) {
            let fullName = ''
            if (user.username) {
                fullName = user.username
            } else {
                fullName = user.firstName
            }
            return fullName + ' ' + user.lastName
        }
    },
    statuses() {
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