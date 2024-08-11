import _ from 'lodash'

export default {
    services() {
        return [
            {
                id: 1,
                name: 'Treatment'
            },
            {
                id: 2,
                name: 'Product'
            }
        ]
    },
    serviceOptions() {
        const serviceData = this.services()
        const options = []
        _.forEach(serviceData, (data)=> {
            const option = {
                serviceId: data.id.toString(),
                label: data.name
            }
            options.push(option)
        })
        return options
    },
    statuses() {
        return [
            {
                id: 1,
                name: 'Booked'
            },
            {
                id: 2,
                name: 'Pending'
            },
            {
                id: 3,
                name: 'Check out'
            },
            {
                id: 4,
                name: 'Check in'
            },
            {
                id: 5,
                name: 'Cancelled'
            }
        ]
    },
    getStatusStr(statusId) {
      return this.statuses().find(status => status.id === statusId)
    },
    getDefaultStatus() {
      return 1
    },
    statusOptions() {
        const statusData = this.statuses()
        const options = []
        _.forEach(statusData, (data)=> {
            const option = {
                statusId: data.id.toString(),
                label: data.name
            }
            options.push(option)
        })
        return options
    },
    getCaldendarBackgroundColor(theme) {
        return [
            {
                value: theme.palette.primary.main,
                color: 'primary.main'
            },
            {
                value: theme.palette.error.main,
                color: 'error.main'
            },
            {
                value: theme.palette.success.main,
                color: 'success.main'
            },
            {
                value: theme.palette.secondary.main,
                color: 'secondary.main'
            },
            {
                value: theme.palette.warning.main,
                color: 'warning.main'
            },
            {
                value: theme.palette.primary.lighter,
                color: 'primary.lighter'
            },
            {
                value: theme.palette.error.lighter,
                color: 'error.lighter'
            },
            {
                value: theme.palette.success.lighter,
                color: 'success.lighter'
            },
            {
                value: theme.palette.secondary.lighter,
                color: 'secondary.lighter'
            },
            {
                value: theme.palette.warning.lighter,
                color: 'warning.lighter'
            }
        ]
    },
    getTextColor(theme) {
        return [
            {
                value: '#fff',
                color: 'white'
            },
            {
                value: theme.palette.error.lighter,
                color: 'error.lighter'
            },
            {
                value: theme.palette.success.lighter,
                color: 'success.lighter'
            },
            {
                value: theme.palette.secondary.lighter,
                color: 'secondary.lighter'
            },
            {
                value: theme.palette.warning.lighter,
                color: 'warning.lighter'
            },
            {
                value: theme.palette.primary.lighter,
                color: 'primary.lighter'
            },
            {
                value: theme.palette.primary.main,
                color: 'primary.main'
            },
            {
                value: theme.palette.error.main,
                color: 'error.main'
            },
            {
                value: theme.palette.success.main,
                color: 'success.main'
            },
            {
                value: theme.palette.secondary.main,
                color: 'secondary.main'
            },
            {
                value: theme.palette.warning.main,
                color: 'warning.main'
            }
        ]
    },
    getClientFullName(client) {
        if (client) {
            if (typeof client.id === 'string') {
                client.id = parseInt(client.id)
            }
            if (client.id === 1) {
                return 'Walk-In'
            } else {
                let fullName = ''
                if (client.nickName) {
                    fullName = client.nickName
                } else {
                    fullName = client.firstName
                }
                return fullName + ' ' + client.lastName
            }
        }
    }
}