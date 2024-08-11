import React, { useReducer, createContext, useMemo } from "react"
export const AppointmentContext = createContext()
export const ACTIONS = {
    ADDPRODUCT: "add_product",
    REMOVEPRODUCT: "remove_product",
    APPOINTMENTUPDATE: 'appointment_update',
    RESET: 'reset'
}
const initialAppointment = {
    clientId: null,
    userId: null,
    serviceId: null,
    categoryId: null,
    products: [],
    startTime: null,
    duration: null,
    status: null,
    start: null,
    end: null,
    note: null
}
const reducer = (appointment, action) => {
    switch (action.type) {
        case ACTIONS.ADDPRODUCT:
            if (appointment && appointment.products) {
                appointment.products = [...appointment.products, action.product]
            }
            break
        case ACTIONS.REMOVEPRODUCT:
            if (appointment && appointment.products && appointment.products.length > 0) {
                appointment.products = appointment.products.filter((product) => product.productId !== action.productId)
            }
            break
        case ACTIONS.APPOINTMENTUPDATE:
            appointment[action.data.key] = action.data.value
            // switch (action.data.key) {
            //     case 'serviceId':
            //         appointment.serviceId = action.data.value
            //         break
            // }
            break
        case ACTIONS.RESET:
            // must be value of {}
            appointment = {}
            break
        default:
            return appointment
    }
    return appointment
}
export const AppointmentProvider = ({ children }) => {
    const [appointment, dispatch] = useReducer(reducer, initialAppointment)
// (**)
    const contextValue = useMemo(() => {
        return { appointment, dispatch }
    }, [appointment, dispatch])
    return (
        <AppointmentContext.Provider value={contextValue}>
            {children}
        </AppointmentContext.Provider>
    )
}