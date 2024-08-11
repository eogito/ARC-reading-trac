import React from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material'

// third party
import * as Yup from 'yup'
import { Formik } from 'formik'
import Cookie from "js-cookie"

// project import
import AnimateButton from 'components/@extended/AnimateButton'

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { loginApi, getSessionMemberApi } from '../../../api/AuthApi'

import { useUserContext } from "../../../context/UserContext"
import { ACCESS_TOKEN } from "../../../constants/userConstants"
// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = React.useState(false)
  const { updateSessionUser} = useUserContext()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const refreshMemberSession = async () => {
    const member = await getSessionMemberApi()
    updateSessionUser(member)
  }

  return (
    <>
      <Formik
        initialValues={{
          username: 'sean',
          password: 'a',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(16).required('Email is required'),
          password: Yup.string().max(16).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const result = await loginApi(values)
          if (result && result.status === 201 ) {
            let expireTime = result.data['expireTime']
            expireTime = new Date(new Date().getTime() + expireTime * 60 * 1000)
            Cookie.set(ACCESS_TOKEN, result.data['access_token'], {expires: expireTime})
            refreshMemberSession()
            navigate('/dashboard')
          } else {
            setStatus({success: false})
            setErrors({username: result.data.message})
            setSubmitting(false)
          }
        }}
      >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-login">Username</InputLabel>
                  <OutlinedInput
                    id="username-login"
                    type="username"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Username"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                  {touched.username && errors.username && (
                    <FormHelperText error id="standard-weight-helper-text-username-login">
                      {errors.username}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  )
}

export default AuthLogin
