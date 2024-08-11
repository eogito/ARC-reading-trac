export default {
    getContactName(client) {
        if (client) {
            if (typeof client.id === 'string') {
                client.id = parseInt(client.id)
            }
            if (client.id === 1) {
                return 'Walk-In'
            } else {
                let contactName = ''
                if (client.nickName) {
                    contactName = client.nickName
                } else {
                    contactName = client.firstName
                }
                return contactName + ' ' + client.lastName
            }
        }
    },
    getFullName(client) {
        if (client) {
            if (typeof client.id === 'string') {
                client.id = parseInt(client.id)
            }
            if (client.id === 1) {
                return 'Walk-In'
            } else {
                return client.firstName + ' ' + client.lastName
            }
        }
    },
    defaultClientOption() {
        return [
            {
                clientId:1,
                label: 'Walk-In'
            }
        ]
    },
    defaultClientLabel() {
        return 'Walk-In'
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
            },
            {
                id: 3,
                name: 'Child'
            }
        ]
    },
    getGenderStr(gender) {
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
            case 3:
                genderStr = 'Child'
                break
        }
        return genderStr
    }
}