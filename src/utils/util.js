import * as moment from "moment-timezone"

export default {
    getDateTimeStampValue: function (dt) {
        if (typeof dt === 'object') {
            dt = dt.toString()
        }
        return moment(dt).tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss')
    },
    getDayValue: function (dt) {
        if (typeof dt === 'object') {
            dt = dt.toString()
        }
        return moment(dt).tz('America/Toronto').format('YYYY-MM-DD')
    },
    getDiffMinute(startTime, endTime) {
        const startMoment = moment(startTime).tz('America/Toronto')
        const endMoment = moment(endTime).tz('America/Toronto')
        return  endMoment.diff(startMoment, 'minutes')
    }
}