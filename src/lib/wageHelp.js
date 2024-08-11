export default {

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
    },

    getAmount(wage) {
        if (wage?.amount ) {
            return wage.amount
        } else {
            const hourlyRate  = wage.hourlyRate && parseFloat(wage.hourlyRate)
            const sessionRate  = wage.sessionRate && parseFloat(wage.sessionRate)
            const commissionRate  = wage.commissionRate && parseFloat(wage.commissionRate)
            const misc  = wage.misc && parseFloat(wage.misc)
            const tips  = wage.tips && parseFloat(wage.tips)
            return hourlyRate + sessionRate + commissionRate + misc + tips
        }
    }
}