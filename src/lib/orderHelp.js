export default {    
    getStatus() {
        return [
            {
                id: 1,
                desc: 'In Process'
            },
            {
                id: 2,
                desc: 'Done'
            }
        ]
    },
    getStatusStr(id) {
        let StatusStr = ''
        switch (id) {
            case 1:
                StatusStr = 'In Process'
                break
            case 2:
                StatusStr = 'Done'
                break            
        }
        return StatusStr
    }

}