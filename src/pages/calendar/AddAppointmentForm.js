import PropTypes from 'prop-types'

import React, {useCallback, useContext, useEffect, useState} from 'react'

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
  Autocomplete,
  Select,
  MenuItem, OutlinedInput
} from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// third-party
import _ from 'lodash'

// project imports

import AppointmentApi from 'api/AppointmentApi'

// assets
import { DeleteFilled } from '@ant-design/icons'
import ClientApi from '../../api/ClientApi'
import UsersApi from '../../api/UsersApi'
import appointmentHelp from '../../lib/appointmentHelp'
import {ACTIONS, AppointmentContext} from "../../context/AppointmentContext"
import {displayMultiError} from "../../lib/help"

import CategoryApi from "../../api/CategoryApi"
import ProductApi from "../../api/ProductApi"
import clientHelp from "../../lib/clientHelp"
import userHelp from "../../lib/userHelp"
import {PRODUCT_SEREVICEID, TREATMENT_SERVICEID} from "../../constants/userConstants"
import Alert from "@mui/material/Alert"

// constant


// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddAppointmentForm = (props) => {
  const event = props.event
  const range = props.range

  const { dispatch } = useContext(AppointmentContext)

  const isCreating = !event
  const [appointment, setAppointment] = useState(null)
  const [inputClientValue, setInputClientValue] = useState('')
  const [clientOptions, setClientOptions] = useState([])
  const [practitioner, setPractitioner] = useState([])
  const [staffOptions, setStaffOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])
  const [categories, setCategories] = useState([])
  const [showTreatment, setShowTreatment] = useState(null)
  const [selectedClientId, setSelectedClientId] = useState(null)

  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState(null)
  const [appointmentStartTime, setAppointmentStartTime] = useState(new Date())
  const initApt = {
    clientId: 1,
    serviceId: TREATMENT_SERVICEID,
    categoryId: null,
    productId: null,
    userId: null,
    status: 1,
    startTime: new Date(),
    duration: 60,
    note: null
  }

  useEffect(() => {
    // dispatch({type: ACTIONS.RESET})
    let defaultTime = new Date()
    if (range && range.practitioner) {
      setPractitioner(range.practitioner)
      initApt.userId = range.practitioner.id
      notifyAppointmentUpdate('userId', range.practitioner.id)
    }
    if (isCreating) {
      if (range && range.startTime) {
        defaultTime = range.startTime
      }
      setAppointment(initApt)
      setAppointmentStartTime(defaultTime)
      setShowTreatment(true)
      setClientOptions(clientHelp.defaultClientOption())
      setInputClientValue(clientHelp.defaultClientLabel())
    }
  }, [])

  const getInitData = useCallback(async () => {
    if (event && event.id) {
      const appointmentResult = await AppointmentApi.getById(event.id)
      console.log(appointmentResult)
      if (appointmentResult) {
        if (appointmentResult.startTime) {
          appointmentResult.startTime = new Date(appointmentResult.startTime)
          // notifyAppointmentUpdate('startTime', startTime)
          // setAppointmentStartTime(startTime)
        }
        setAppointment(appointmentResult)
        if (appointmentResult.serviceId === PRODUCT_SEREVICEID) {
          setShowTreatment(false)
        } else {
          setShowTreatment(true)
        }
        if (appointmentResult.User) {
          let tempPractitioner = appointmentResult.User
          tempPractitioner.title = userHelp.getFullName(appointmentResult.User)
          setPractitioner(tempPractitioner)
        }
        setAppointmentStartTime(new Date(appointmentResult.startTime))

        // if (event.categoryId) {
        //   productOptionsUpdate(appointmentResult.categoryId)
        // }
        await handleCategoryChange(appointmentResult.categoryId)
        // setClientOptions(clientHelp.defaultClientOption())
        // setInputClientValue(clientHelp.defaultClientLabel())
        // setClientOptions(clientHelp.defaultClientOption())
        setInputClientValue(userHelp.getFullName(appointmentResult.Client))
      }
    }
    // setServiceOptions(appointmentHelp.services())
    setStatusOptions(appointmentHelp.statusOptions())
    try {
      const categoryResult = await CategoryApi.getAllCategory(TREATMENT_SERVICEID)
      setCategories(categoryResult)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getInitData().catch(console.error)
  }, [getInitData])

  const fetchClientOptions = async (value) => {
    try {
      const clientOptionList = []
      const result = await ClientApi.search({keyword: value}, {}, 0, 10)
      if (result && result.data) {
        _.forEach(result.data, client => {
          client.contactName = clientHelp.getContactName(client)
          const option = {
            label: client.contactName,
            clientId: client.id.toString()
          }
          clientOptionList.push(option)
        })
      }
      setClientOptions(clientOptionList)
    } catch (error) {
      console.error('Error fetching autocomplete options:', error)
    }
  }
  const handleClientSearch = async (event, newValue) => {
    setInputClientValue(newValue)
    await fetchClientOptions(newValue)
  }

  const handleClientSelected = async (clientId) => {
    notifyAppointmentUpdate('clientId', clientId)
    setSelectedClientId(clientId)
    const clientData = await ClientApi.detail(clientId)
    const fullName = clientHelp.getFullName(clientData)
    notifyAppointmentUpdate('clientFullName', fullName)
    notifyAppointmentUpdate('clientId', clientId)
  }

  const productOptionsUpdate = async (categoryId) => {
    // setCategoryId(categoryId)
    const productResults = await ProductApi.findAllByCategoryId(categoryId)
    setProducts(productResults)
  }

  const handleCategoryChange = async (newCategoryId) => {
    const staffOptionList = []
    let filterOptions = {}
    if (newCategoryId) {
      filterOptions.categoryId = newCategoryId
    }
    try {
      await productOptionsUpdate(newCategoryId)
      const sortingOption = {}
      const staffResults = await UsersApi.search(filterOptions, sortingOption, 0, 100)

      if (staffResults) {
        _.forEach(staffResults, user => {
          user.fullName = userHelp.getFullName(user)
          const option = {
            label: user.fullName,
            userId: user.id.toString()
          }
          staffOptionList.push(option)
        })
      }
      setStaffOptions(staffOptionList)

    } catch (error) {
      console.log(error)
    }
  }

  const handleStartTimeChange = (newDate) => {
    notifyAppointmentUpdate('startTime', newDate)
    setAppointmentStartTime(newDate)
  }

  const notifyAppointmentUpdate = (key, value) => {
    switch (key) {
      case 'clientId':
        value = parseInt(value)
        break
      case 'serviceId':
        if (typeof value === 'string') {
          value = parseInt(value)
        }
        if (value === TREATMENT_SERVICEID) {
          setShowTreatment(true)
        } else if (value === PRODUCT_SEREVICEID) {
          setShowTreatment(false)
        }
        break
    }
    if (errors) {
      setErrors(null)
    }
    const data = {
      key: key,
      value: value
    }
    dispatch({ type: ACTIONS.APPOINTMENTUPDATE, data})
    const saveAppointement = { ...appointment, [key]: value }
    setAppointment(saveAppointement)
  }

  const handleDelete = async () => {
    if (event?.id) {
      await AppointmentApi.update(event.id, {
        deleted: 1
      })
      props.handleUpdateForm('delete')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

      // let newAppointment = appointment
      // newAppointment.startTime = util.getDateTimeStampValue(appointment.startTime)
      // if(range?.practitioner?.id) {
      //   newAppointment.userId = range.practitioner.id
      // }
      const saveAppointement = appointment
      if (selectedClientId) {
        saveAppointement.clientId = selectedClientId
      }
      saveAppointement.startTime = appointmentStartTime
      if (saveAppointement.serviceId === PRODUCT_SEREVICEID) {
        saveAppointement.duration = 15
      }
      if (saveAppointement && saveAppointement.id) {
        await AppointmentApi.update(saveAppointement.id, saveAppointement)
        props.handleUpdateForm('update')
      } else {
        let response= await AppointmentApi.create(saveAppointement)
        if (response && response.status === 200) {
          props.handleUpdateForm('create')
        } else {
          response = displayMultiError(response)
          console.log(response)
          setErrors({ submit: response.message })
        }
      }

  }

  return (
      <Box
          sx={{ 'width' : 450 }}
          role="presentation"
      >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {(appointment) &&
            <form autoComplete="off" onSubmit={handleSubmit}>
              <DialogTitle>
                {event ? 'Edit Appointment' : 'Add Appointment'}
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2.5 }}>
                <Grid container spacing={3}>
                  {(!appointment.id) &&
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              value={appointment.serviceId}
                              onChange={(event) => {
                                notifyAppointmentUpdate('serviceId', event.target.value)
                                // handleCategoryChange(event.target.value)
                              }}
                          >
                            <FormControlLabel value="1" control={<Radio />} label="Treatment" />
                            <FormControlLabel value="2" control={<Radio />} label="Non Treatment" />
                          </RadioGroup>
                        </Stack>
                      </Grid>
                  }

                  {(practitioner && showTreatment) &&
                      <>
                        <Grid item xs={12}>
                          <Grid container spacing={{ xs: 0.5, sm: 2 }} justifyContent="left" alignItems="left">
                            <Grid item xs={12} sm={3} lg={4}>
                              <InputLabel id="practitioner-label">Practitioner: </InputLabel>
                            </Grid>
                            <Grid item xs={12} sm={9} lg={8}>
                              {practitioner.title}
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                  }
                  {(staffOptions && products && showTreatment) &&
                      <>
                          <Grid item xs={12}>
                            <Stack spacing={1}>
                              <InputLabel id="categoryId-label">Select Service</InputLabel>
                              <Select id="categoryId"
                                      name="categoryId"
                                      value={categories.length > 0 ? appointment.categoryId: ''}
                                      onChange={(event) => {
                                         notifyAppointmentUpdate('categoryId', event.target.value)
                                         handleCategoryChange(event.target.value)
                                      }}
                              >
                                {categories.map((category) =>
                                    <MenuItem key={'category' + category.id} value={category.id}>{category.name}</MenuItem>
                                )}
                              </Select>
                            </Stack>
                          </Grid>
                          <Grid item xs={12}>
                            <Stack spacing={1}>
                              <InputLabel id="productId-label">Select Treatment</InputLabel>
                              <Select id="productId"
                                      name="productId"
                                      value={products.length > 0 ? appointment.productId : ''}
                                      onChange={(event) => {
                                        notifyAppointmentUpdate('productId', event.target.value)
                                      }}
                              >
                                {products.map((product) =>
                                    <MenuItem key={'product' + product.id} value={product.id}>{product.name}</MenuItem>
                                )}
                              </Select>
                            </Stack>
                          </Grid>

                          <Grid item xs={12}>
                            <Stack spacing={1}>
                              <InputLabel id="userId-label">Select Practitioner</InputLabel>
                              <Select id="userId"
                                      name="userId"
                                      value={staffOptions.length > 0 ? appointment.userId : ''}
                                      onChange={(event) => {
                                        notifyAppointmentUpdate('userId', event.target.value)
                                      }}
                              >
                                {staffOptions.map((staffOption) =>
                                    <MenuItem key={'staffOptions' + staffOption.userId} value={staffOption.userId}>{staffOption.label}</MenuItem>
                                )}
                              </Select>
                            </Stack>
                          </Grid>
                      </>
                  }

                  <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="cal-start-date">Appointment Time</InputLabel>
                      <DateTimePicker
                        value={appointmentStartTime}
                        format="yyyy-MM-dd hh:mm a"
                        onChange={(date) => {
                          handleStartTimeChange(date)
                        }}
                      />
                    </Stack>
                  </Grid>
                  {(showTreatment) &&
                      <>
                      <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="duration-apt">Duration</InputLabel>
                          <OutlinedInput
                              fullWidth
                              id="duration-apt"
                              type="text"
                              value={appointment.duration}
                              name="duration"
                              //  onBlur={handleBlur}
                              onChange={(event) => {
                                notifyAppointmentUpdate('duration', event.target.value)
                              }}
                              placeholder="Duration"
                              inputProps={{}}
                          />
                        </Stack>
                      </Grid>
                    </>
                  }
                  <Grid item xs={12}>
                    <Autocomplete
                        // freeSolo
                        filterOptions={(x) => x}
                        value={inputClientValue || null}
                        onChange={(event, value) => {
                          event.preventDefault()
                          event.stopPropagation()
                          if (value?.clientId) {
                            handleClientSelected(value?.clientId)
                          }
                        }}
                        inputValue={inputClientValue}
                        onInputChange={handleClientSearch}
                        options={clientOptions}
                        isOptionEqualToValue={(option) => option.clientId === appointment.clientId}
                        renderOption={(props, option) => (
                            <li {...props} key={option.clientId}>
                              {option.label}
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Client Search" variant="outlined" />}
                    />
                  </Grid>
                  {(showTreatment) &&
                      <>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel id="status-label">Select Status</InputLabel>
                            <Select id="status"
                                    name="status"
                                    value={statusOptions.length > 0 ? appointment.status : ''}
                                    onChange={(event) => {
                                      notifyAppointmentUpdate('status', event.target.value)
                                    }}
                            >
                              {statusOptions.map((statusOption) =>
                                  <MenuItem key={'statusOption' + statusOption.statusId} value={statusOption.statusId}>{statusOption.label}</MenuItem>
                              )}
                            </Select>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="cal-note">Note</InputLabel>
                            <OutlinedInput
                                fullWidth
                                id="note-apt"
                                multiline={true}
                                rows={4}
                                type="text"
                                value={appointment.note}
                                name="note"
                                //  onBlur={handleBlur}
                                onChange={(event) => {
                                  notifyAppointmentUpdate('note', event.target.value)
                                }}
                                placeholder="Note"
                                inputProps={{}}
                            />
                          </Stack>
                        </Grid>
                      </>
                  }
                </Grid>
                {errors?.submit && (
                    <Grid item xs={12}>
                      {errors.submit.map((errorMsg, index) => (
                          <Alert key={'errormsg' + index} severity="error">{errorMsg}</Alert>
                      ))}
                    </Grid>
                )}

              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 2.5 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    {!isCreating && (
                      <Tooltip title="Delete Event" placement="top">
                        <IconButton onClick={handleDelete} size="large" color="error">
                          <DeleteFilled />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                  <Grid item>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/*<Button color="error" onClick={() => {*/}
                      {/*  handleRest()*/}
                      {/*}}*/}
                      {/*>*/}
                      {/*  Reset*/}
                      {/*</Button>*/}
                      <Button type="submit" variant="contained">
                        Save
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogActions>
            </form>
            }
          </LocalizationProvider>
      </Box>
  )
}

AddAppointmentForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func
}

export default AddAppointmentForm
