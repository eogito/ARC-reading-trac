import React, { useState } from 'react'
import { useCallback,  useEffect } from 'react'
import { useParams} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

import { Formik } from 'formik'
// material-ui
import {InputLabel, Stack, Grid, Paper, Typography, LinearProgress, Box, IconButton, Button, OutlinedInput, FormControl, Select, Checkbox} from '@mui/material'
import {red, blue} from '@mui/material/colors'
import SearchIcon from '@mui/icons-material/Search';

import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, getPaginationRowModel } from '@tanstack/react-table'
import Breadcrumbs from "../../components/@extended/Breadcrumbs"
import { TablePagination, HeaderSort } from 'components/third-party/react-table' // HeaderSort
import {
  DebouncedInput
} from 'components/third-party/react-table' // HeaderSort

import moment from 'moment'
import BookProgressApi from 'api/BookProgressApi'
import BookApi from 'api/BookApi'
import UserApi from 'api/UserApi'
import { getSessionMemberApi } from 'api/AuthApi'

// project import
import MainCard from 'components/MainCard'
import ScrollX from 'components/ScrollX'
import { MenuItem } from '../../../node_modules/@mui/material/index'
import { check } from 'prettier'

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const ProgressBook = () => {
  
  const navigate = useNavigate()
  const [userId, setUserId] = useState(1)
  const [book, setBook] = React.useState("Select book")
  const [edited, setEdited] = useState("0")
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [text, setText] = useState("")
  const [checked, setChecked] = React.useState(false);

  const handleCheck = (event) => {
    setChecked(event.target.checked);
    console.log(checked)
  }
  const getBooks = useCallback(async () => {
    const curUser = await getSessionMemberApi()
    let newl = []
    console.log(curUser.id)
    let temp = curUser.id
    setUserId(temp)
    console.log(userId)
    try {
        const result = await BookApi.getAll()
        const result2 = await UserApi.getById(userId)
        if (result) {
            _.forEach(result, book => {
                if (book.userId == userId) {
                    newl.push(book)
                    console.log(book)
                }
            })
            setData(newl)
            setUser(result2)
            console.log(data)
        }
    } catch (error) {
        console.log(error)
    }
}, [])
  useEffect(() => {
    getBooks()
  }, [getBooks])

  const handleChange = (event) => {
    setBook(event.target.value)
    setEdited("yes")
    console.log(book)
  }
  function DisplayBook(props) {
    if (edited != "yes") {
        console.log("uwu")
        return 
    }
    return (
        <Stack spacing ={4} alignItems="center">
            <Stack direction="row" alignItems="center" justifyContent="center">
                    <Box
                        component="img"
                        src={"https://covers.openlibrary.org/b/id/"+props.book.coverUrl+"-M.jpg"}
                        alt={props.book.coverUrl}
                        sx={{pl: 10}}
                    />
                <Stack spacing={1} sx={{pl:3, mr:3}}>
                    <Typography sx={{pt:5}} variant="h1">
                        {props.book.title}
                    </Typography>
                    <Typography sx={{}} variant="h3">
                        {props.book.author}
                    </Typography>
                    <Typography sx={{}} variant="h3">
                        {props.book.pages} pages
                    </Typography>
                </Stack>
                <Stack>
                    <Formik
                        initialValues={{
                            bookId: props.book.id,
                            title: props.book.title,
                            author: props.book.author,
                            userId: userId,
                            pagesRead: 0,
                            lastRead: moment().format('YYYY-MM-DD'),
                            note: ""
                        }}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            const data = {
                                ...values
                            }
                            console.log(user)
                            data.pagesRead = parseInt(data.pagesRead)
                            if (checked) {
                                let temp = await BookApi.delete(props.book.id)
                            }
                            const data2 = {
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                xp: user.xp+data.pagesRead,
                                avatarId: user.avatarId,
                                parentId: user.parentId
                            }
                            console.log(data2)
                            let response = await BookProgressApi.create(data)
                            let response2 = await UserApi.update(userId, data2)
                            if (response && response2 && response.status === 200) {
                                enqueueSnackbar('Book Progress Added!', {
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
                        
                                <Grid container spacing={3} direction="column" sx={{ width: 300 }}>
                                    <Grid item xs={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="pagesRead">Pages Read</InputLabel>
                                            <OutlinedInput
                                                id="pagesRead"
                                                type="text"
                                                value={values.pagesRead}
                                                name="pagesRead"
                                                onBlur={handleBlur}
                                                onChange={handleChange}                                                
                                            />     
                                            {touched.pagesRead && errors.pagesRead && (
                                                <FormHelperText error id="standard-weight-helper-text-pagesRead-edit">
                                                    {errors.pagesRead}
                                                </FormHelperText>
                                            ) }                                              
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="note">Note</InputLabel>
                                            <OutlinedInput
                                                id="note"
                                                type="text"
                                                value={values.note}
                                                name="note"
                                                onChange={handleChange}
                                                placeholder="Enter note"
                                                fullWidth
                                                error={Boolean(touched.note && errors.note)}
                                            />
                                            {touched.note && errors.note && (
                                                <FormHelperText error id="standard-weight-helper-text-note">
                                                    {errors.note}
                                                </FormHelperText>
                                            ) }
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                    <InputLabel htmlFor="check">Finished Book</InputLabel>
                                            <Checkbox
                                            checked={checked}
                                            onChange={handleCheck}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                    </Grid>
                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            {errors.submit.map((errorMsg, index) => (
                                                <Alert key={'errormsg' + index} severity="error">{errorMsg}</Alert>
                                            ))}
                                        </Grid>
                                    )}
                                    
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={4} justifyContent="left" alignItems="center">
                                            <Button variant="contained" type="submit" size="medium" sx={{ textTransform: 'none' }}>
                                                Submit
                                            </Button>                                
                                        </Stack>
                                    </Grid>
                                </Grid>
                            
                            </form>
                        )}
                    </Formik>
                </Stack>
            </Stack>
        </Stack>
    )
  }

  return (
    <>
      <MainCard>
        <Stack spacing={2.5} sx={{mb:2}}>                  
          <Stack direction="row" spacing={2} alignItems="center"> 
          <FormControl fullWidth>
            <InputLabel>Select Book</InputLabel>
            <Select
                id="select-book"
                value={book.title}
                label="Age"
                onChange={handleChange}
            >
            {data.map(book => (
                <MenuItem value={book}>{book.title}</MenuItem>
            ))} 
            </Select>
            </FormControl>
          </Stack> 
        </Stack>
        <ScrollX>
          <Stack spacing={4}>
            <DisplayBook
                book = {book}
            />
          </Stack>
        </ScrollX>
      </MainCard>     
      <SnackbarProvider/>
    </>
  )
}

export default ProgressBook
