import * as React from "react"
import { useContext, useEffect, useRef, useState} from 'react'

// material-ui
import { useMediaQuery, Box, SpeedDial, Tooltip } from '@mui/material'
import {
    CloseOutlined
} from '@ant-design/icons'
// third-party
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import timelinePlugin from '@fullcalendar/timeline'
import Drawer from '@mui/material/Drawer'
import IconButton from 'components/@extended/IconButton'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

// project imports
import CalendarStyled from './CalendarStyled'
import Toolbar from './Toolbar'
import AddAppointmentForm from './AddAppointmentForm'

// assets
import { PlusOutlined } from '@ant-design/icons'
import {ACTIONS, AppointmentContext} from "../../context/AppointmentContext"
import AppointmentApi from "../../api/AppointmentApi"
import util from "../../utils/util"
import {TREATMENT_SERVICEID} from "../../constants/userConstants"

// ==============================|| CALENDAR - MAIN ||============================== //

const AppointmentSchedule = () => {
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'))
    const { dispatch } = useContext(AppointmentContext)

    const [selectedEvent, setSelectedEvent] = useState()
    const [calendarView, setCalendarView] = useState()
    const [date, setDate] = useState(new Date())
    const [selectedRange, setSelectedRange] = useState(null)
    const [caldendarDateRange, setCaldendarDateRange] = useState(null)

    const [appointmentOpen, setAppointmentOpen] = useState(false)
    const [appointments, setAppointments] = useState([])
    const calendarRef = useRef(null)
    // const { appointments } = useGetAppointments()

    useEffect(() => {
        const calendarEl = calendarRef.current
        if (calendarEl) {
            const calendarApi = calendarEl.getApi()
            const newView = matchDownSM ? 'listWeek' : 'dayGridMonth'
            calendarApi.changeView(newView)
            setCalendarView(newView)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownSM])

    // calendar toolbar events
    const handleDateToday = () => {
        const calendarEl = calendarRef.current

        if (calendarEl) {
            const calendarApi = calendarEl.getApi()

            calendarApi.today()
            setDate(calendarApi.getDate())
        }
    }

    const handleViewChange = (newView) => {
        const calendarEl = calendarRef.current

        if (calendarEl) {
            const calendarApi = calendarEl.getApi()
            calendarApi.changeView(newView)
            setCalendarView(newView)
        }
    }

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current

        if (calendarEl) {
            const calendarApi = calendarEl.getApi()

            calendarApi.prev()
            setDate(calendarApi.getDate())
        }
    }

    const handleDateNext = () => {
        const calendarEl = calendarRef.current

        if (calendarEl) {
            const calendarApi = calendarEl.getApi()
            calendarApi.next()
            setDate(calendarApi.getDate())
        }
    }

    const fetchAllAppointments = async (filter = {}) => {
        const  sortingOption= {}
        const offset = 0
        const limit  = 100
        const aptResults = await AppointmentApi.search(filter, sortingOption, offset, limit)
        if (aptResults) {
            setAppointments(aptResults)
        }
    }

    const handleDatesSet = async (dateInfo) => {
        setCaldendarDateRange(dateInfo)
        const params = {
            startDate: util.getDayValue(dateInfo.start),
            endDate: util.getDayValue(dateInfo.end)
        }

        await fetchAllAppointments(params)
        const calendarEl = calendarRef.current
        if (calendarEl) {
            const calendarApi = calendarEl.getApi()
            calendarApi.refetchEvents()
        }
    }

    // calendar events
    const handleRangeSelect = (arg) => {
        setSelectedEvent(null)
        setSelectedRange({ startTime: arg.start})
        setAppointmentOpen(true)
    }

    const handleAppointmentSelect = (arg) => {
        arg.jsEvent.preventDefault()
        if (arg?.event?.id) {
            const event = appointments.find((event) => event.id === arg.event.id)
            setSelectedEvent(event)
        } else {
            setSelectedEvent(null)
        }

        setAppointmentOpen(true)
    }

    const handleAppointmentUpdate = async ({ event }) => {
        await AppointmentApi.update(event.id, {
            startTime: event.start
        })
    }

    const handleOpenAppointment =  (open) => async (event) => {
        dispatch({type: ACTIONS.RESET})
        if (!open) {
            setSelectedEvent(null)
            setSelectedRange(null)
        }
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return
        }
        setAppointmentOpen(open)
    }

    const handleUpdateForm = async (action) => {
        if (action === 'create') {
            enqueueSnackbar('Appointment create success!', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {horizontal: 'right', vertical: 'top'}
            })

        } else if (action === 'update') {
            enqueueSnackbar('Appointment update success!', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {horizontal: 'right', vertical: 'top'}
            })
        } else if (action === 'delete') {
            enqueueSnackbar('Appointment delete success!', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {horizontal: 'right', vertical: 'top'}
            })
        }
        const params = {
            startDate: util.getDayValue(caldendarDateRange.start),
            endDate: util.getDayValue(caldendarDateRange.end)
        }
        await fetchAllAppointments(params)

        const calendarEl = calendarRef.current
        const calendarApi = calendarEl.getApi()

        await calendarApi.refetchEvents()
        setAppointmentOpen(false)

    }
    const handleNewAppointment = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return
        }
        setAppointmentOpen(open)
    }

    const renderEventContent = (eventInfo) => {
        console.log(eventInfo.event)
        return (
            <>
                {eventInfo.timeText}
                { (eventInfo.event?.extendedProps?.durationTime && eventInfo.event?.extendedProps?.serviceId === TREATMENT_SERVICEID) &&
                    ' ' + eventInfo.event.extendedProps.durationTime + ' Min.'
                }
                <br />
                <i>{eventInfo.event.title}</i> {eventInfo.event.extendedProps?.Product?.name}
            </>
        )
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <CalendarStyled>
                <Toolbar
                    date={date}
                    view={calendarView}
                    onClickNext={handleDateNext}
                    onClickPrev={handleDatePrev}
                    onClickToday={handleDateToday}
                    onChangeView={handleViewChange}
                />

                <FullCalendar
                    schedulerLicenseKey={'CC-Attribution-NonCommercial-NoDerivatives'}
                    weekends
                    editable
                    droppable
                    selectable
                    events={appointments}
                    ref={calendarRef}
                    rerenderDelay={10}
                    initialDate={date}
                    initialView={calendarView}
                    dayMaxEventRows={10}
                    eventDisplay="block"
                    headerToolbar={false}
                    allDayMaintainDuration
                    eventResizableFromStart
                    datesSet={handleDatesSet}
                    select={handleRangeSelect}
                    eventDrop={handleAppointmentUpdate}
                    eventClick={handleAppointmentSelect}
                    height={'auto'}
                    eventContent={(event) => {
                        return renderEventContent(event)
                    }}
                    eventTimeFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short'
                    }}
                    eventTextColor={'#262626'}
                    plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                />
            </CalendarStyled>
            <Drawer
                anchor={'right'}
                open={appointmentOpen}
                onClose={handleOpenAppointment(false)}
            >
                <Box sx={{ overflow: 'auto',  mt : 1 }}>
                    <Tooltip title="Cancel">
                        <IconButton color="error" name="cancel" onClick={handleOpenAppointment(false)}>
                            <CloseOutlined />
                        </IconButton>
                    </Tooltip>
                    {(open) &&
                    <AddAppointmentForm
                        event={selectedEvent}
                        range={selectedRange}
                        handleUpdateForm={handleUpdateForm}
                    />
                    }
                </Box>
            </Drawer>

            <Tooltip title="Add New Appointment">
                <SpeedDial
                    ariaLabel="add-event-fab"
                    sx={{ display: 'inline-flex', position: 'sticky', bottom: 24, left: '100%', transform: 'translate(-50%, -50% )', mt: 10 }}
                    icon={<PlusOutlined style={{ fontSize: '1.5rem' }} />}
                    onClick={handleNewAppointment(true)}
                />
            </Tooltip>
            <SnackbarProvider />
        </Box>
    )
}

export default AppointmentSchedule
