import * as React from "react"
import { useContext, useRef, useState} from 'react'

// material-ui
import { Box, SpeedDial, Tooltip } from '@mui/material'
import {
    CloseOutlined,
    PlusOutlined
} from '@ant-design/icons'

// third-party
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from '@fullcalendar/daygrid'

import Drawer from '@mui/material/Drawer'
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid"
// project imports
import IconButton from 'components/@extended/IconButton'
import CalendarStyled from './CalendarStyled'
import AddAppointmentForm from './AddAppointmentForm'

// assets

import {ACTIONS, AppointmentContext} from "../../context/AppointmentContext"
import AppointmentApi from '../../api/AppointmentApi'
import UserApi from '../../api/UsersApi'

import util from '../../utils/util'
import {enqueueSnackbar, SnackbarProvider} from "notistack"

// ==============================|| CALENDAR - MAIN ||============================== //

const DailySchedule = () => {
    const { dispatch } = useContext(AppointmentContext)

    const [selectedEvent, setSelectedEvent] = useState()
    const [selectedRange, setSelectedRange] = useState(null)
    const [appointmentOpen, setAppointmentOpen] = useState(false)
    const [practitioners, setPractitioners] = useState([])
    const [appointments, setAppointments] = useState([])
    const calendarRef = useRef(null)
    const [caldendarDateRange, setCaldendarDateRange] = useState(null)

    const fetchAllAppointments = async (aptFilter) => {
        const aptSortingOption= {}
        const aptOffset = 0
        const aptLimit  = 100
        const aptResults = await AppointmentApi.search(aptFilter, aptSortingOption, aptOffset, aptLimit, 'schedule')
        if (aptResults) {
            setAppointments(aptResults)
        }
        const practitionerList = await UserApi.getShifts(aptFilter)
        setPractitioners(practitionerList)
    }

    const handleDatesSet = async (dateInfo) => {
        setCaldendarDateRange(dateInfo)
        const params = {
            scheduleDate: util.getDayValue(dateInfo.start)
        }
        await fetchAllAppointments(params)

        const calendarEl = calendarRef.current
        if (calendarEl) {
            const calendarApi = calendarEl.getApi()
            calendarApi.refetchEvents()
        }
    }

    const handleAppointmentSelect = (arg) => {
        if (arg?.event?.id) {
            const event = appointments.find((event) => event.id === arg.event.id)
            setSelectedEvent(event)
        }

        setAppointmentOpen(true)
    }

    const handleAppointmentUpdate = async ({ event }) => {
        const data = {
            startTime: event.start
        }
        const duration = util.getDiffMinute(event.start, event.end)
        if (event.end) {
            data.duration = duration
        }
        if (event['_def']['resourceIds'] && event['_def']['resourceIds'].length === 1) {
            data.userId = event['_def']['resourceIds'][0]
        }
        await AppointmentApi.update(event.id, data)
    }

    const handleRangeSelect = (arg) => {
        let params = {
            startTime: arg.start,
            practitioner: arg.resource
        }
        setSelectedRange(params)
        setAppointmentOpen(true)
    }
    const handleOpenAppointment = (open) => (event) => {
        dispatch({type: ACTIONS.RESET})
        if (!open) {
            setSelectedEvent(null)
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
            scheduleDate: util.getDayValue(caldendarDateRange.start)
        }
        await fetchAllAppointments(params)

        const calendarEl = calendarRef.current
        if (calendarEl) {
            const calendarApi = calendarEl.getApi()
            calendarApi.refetchEvents()
        }
        setSelectedEvent(null)
        setAppointmentOpen(false)
    }

    const handleNewAppointment = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return
        }
        const calendarEl = calendarRef.current
        const calendarApi = calendarEl.getApi()
        let params = {
            startTime: calendarApi.getDate()
        }
        setSelectedRange(params)
        setAppointmentOpen(open)
    }

    const renderEventContent = (eventInfo) => {
        console.log(eventInfo)
        return (
            <>
                {eventInfo.timeText}
                <br />
                <i>{eventInfo.event.title}</i> {eventInfo.event.extendedProps?.Product?.name}
            </>
        )
    }

    return (

        <>
        {(practitioners) &&
            <Box sx={{position: 'relative'}}>
                <CalendarStyled>
                    <FullCalendar
                        plugins={[dayGridPlugin, resourceTimeGridPlugin, interactionPlugin]}
                        allDaySlot={false}
                        ref={calendarRef}
                        initialView={'resourceTimeGridDay'}
                        nowIndicator={true}
                        editable
                        droppable
                        selectable
                        slotMinTime={'09:00'}
                        slotMaxTime={'22:00'}
                        slotDuration={'00:15:00'}
                        events={appointments}
                        resources={practitioners}
                        height={'auto'}
                        eventDisplay="block"
                        eventMinHeight="60"
                        eventResourceEditable={true}
                        datesSet={handleDatesSet}
                        select={handleRangeSelect}
                        eventDrop={handleAppointmentUpdate}
                        eventClick={handleAppointmentSelect}
                        eventChange={handleAppointmentUpdate}
                        eventResize={handleAppointmentUpdate}
                        eventContent={(event) => {
                            return renderEventContent(event)
                        }}
                        eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            meridiem: 'short'
                        }}
                        eventTextColor={'#262626'}
                        //eventClick={(eventInfo) => {}} // comment out this line will make onContextMenu work again
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
                                <CloseOutlined/>
                            </IconButton>
                        </Tooltip>
                        <AddAppointmentForm
                            event={selectedEvent}
                            range={selectedRange}
                            handleUpdateForm={handleUpdateForm}
                        />
                    </Box>
                </Drawer>
                <Tooltip title="Add New Appointment">
                    <SpeedDial
                        ariaLabel="add-event-fab"
                        sx={{
                            display: 'inline-flex',
                            position: 'sticky',
                            bottom: 24,
                            left: '100%',
                            transform: 'translate(-50%, -50% )',
                            mt: 10
                        }}
                        icon={<PlusOutlined style={{fontSize: '1.5rem'}}/>}
                        onClick={handleNewAppointment(true)}
                    />
                </Tooltip>
                <SnackbarProvider />
            </Box>
        }
        </>
    )
}

export default DailySchedule