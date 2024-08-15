import React, {useCallback, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

// third party
import { Formik } from 'formik'
// material-ui
import {
    Button, 
    FormHelperText,
    Grid,
    InputLabel, 
    OutlinedInput,
    Stack
} from '@mui/material'
import MainCard from 'components/MainCard'
import ScrollX from 'components/ScrollX'
import { getSessionMemberApi } from 'api/AuthApi'
// assets
import {displayMultiError} from "../../lib/help"
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import Breadcrumbs from "../../components/@extended/Breadcrumbs"
import BookApi from 'api/BookApi'

const CustomBook = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()

    const getInitData = useCallback(async () => {
        
        const curUser = await getSessionMemberApi()
        setUser(curUser.id)
        setLoading(true)
    })

    useEffect(() => {
        getInitData()
    }, [loading])

    return (
        <>
            <Breadcrumbs custom heading='Create Custom Book' />
            <MainCard>
                <ScrollX>
                    <Stack>
                    {(loading) &&
                    <Formik
                        initialValues={{
                            userId: user,
                            title: "",
                            author: "",
                            pages: 0,
                            coverUrl: "",
                            publishYear: 0
                        }}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            const data = {
                                ...values
                            }
                            data.pages = parseInt(data.pages)
                            data.publishYear = parseInt(data.publishYear)
                            let response = await BookApi.create(data)
                            if (response && response.status === 200) {
                                enqueueSnackbar('Book Create success!', {
                                    variant: 'success',
                                    autoHideDuration: 3000,
                                    anchorOrigin: {horizontal: 'right', vertical: 'top'}
                                })
                                setTimeout(() => {
                                    navigate('/dashboard')
                                }, 1000)
                            } else {
                                response = displayMultiError(response)
                                setStatus({success: false})
                                setErrors({ submit: response.message })
                                setSubmitting(false)
                            }
                        }}
                    >
                        {({
                              errors,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              touched,
                              values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="title">Title</InputLabel>
                                            <OutlinedInput
                                                id="title"
                                                type="text"
                                                value={values.title}
                                                name="title"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Title"
                                                fullWidth
                                                error={Boolean(touched.title && errors.title)}
                                            />
                                            {touched.title && errors.title && (
                                                <FormHelperText error id="standard-weight-helper-text-title-edit">
                                                    {errors.title}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="author">Author</InputLabel>
                                            <OutlinedInput
                                                id="author"
                                                type="text"
                                                value={values.author}
                                                name="author"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Author"
                                                fullWidth
                                                error={Boolean(touched.author && errors.author)}
                                            />
                                            {touched.author && errors.author && (
                                                <FormHelperText error
                                                                id="standard-weight-helper-text-author-edit">
                                                    {errors.author}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="pages">Pages</InputLabel>
                                            <OutlinedInput
                                                id="pages"
                                                type="text"
                                                value={values.pages}
                                                name="pages"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Number of Pages"
                                                fullWidth
                                                error={Boolean(touched.pages && errors.pages)}
                                            />
                                            {touched.pages && errors.pages && (
                                                <FormHelperText error
                                                                id="standard-weight-helper-text-pages-edit">
                                                    {errors.pages}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="publishYear">Publish Year</InputLabel>
                                            <OutlinedInput
                                                id="publishYear"
                                                type="text"
                                                value={values.publishYear}
                                                name="publishYear"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Publish Year"
                                                fullWidth
                                                error={Boolean(touched.publishYear && errors.publishYear)}
                                            />
                                            {touched.publishYear && errors.publishYear && (
                                                <FormHelperText error id="standard-weight-helper-text-publishYear-edit">
                                                    {errors.publishYear}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="coverUrl">Cover Url</InputLabel>
                                            <OutlinedInput
                                                id="coverUrl"
                                                type="text"
                                                value={values.coverUrl}
                                                name="coverUrl"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter Cover Url"
                                                fullWidth
                                                error={Boolean(touched.coverUrl && errors.coverUrl)}
                                            />
                                            {touched.coverUrl && errors.coverUrl && (
                                                <FormHelperText error
                                                                id="standard-weight-helper-text-coverUrl-edit">
                                                    {errors.coverUrl}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>
                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            {errors.submit.map((errorMsg, index) => (
                                                <FormHelperText key={"errorMsg_" + index}
                                                                error>{errorMsg}</FormHelperText>
                                            ))}
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={4} justifyContent="left"
                                                   alignItems="center">
                                                <Button variant="contained" type="submit" size="medium"
                                                        sx={{textTransform: 'none'}}>
                                                    Submit
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                    }
                    </Stack>
                </ScrollX>
            </MainCard>
            <SnackbarProvider/>
        </>
    )
}

export default CustomBook
