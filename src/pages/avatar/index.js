import React, { useState } from 'react'

import { useCallback } from 'react'
import { useEffect } from 'react'
import { useParams} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// material-ui
import {InputLabel, Stack, Grid, Paper, Typography, LinearProgress, Box, IconButton, Button} from '@mui/material'
import {red, blue} from '@mui/material/colors'

// project import
import MainCard from 'components/MainCard'
import ScrollX from 'components/ScrollX'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import Breadcrumbs from "../../components/@extended/Breadcrumbs"
import LockIcon from '@mui/icons-material/Lock';
import { getSessionMemberApi } from 'api/AuthApi'
import {
  DebouncedInput
} from 'components/third-party/react-table' // HeaderSort
import Avatar from 'components/@extended/Avatar'
import BookProgressApi from 'api/BookProgressApi'
import BookApi from 'api/BookApi'
import UserApi from 'api/UserApi'
import AvatarApi from 'api/AvatarApi'
import { Password } from '../../../node_modules/@mui/icons-material/index'

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const AvatarSelection = () => {
  let newl =[]
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [level, setLevel] = useState(1)
  const [user, setUser] = useState()
  const [data, setData] = useState([])
  const [books, setBooks] = useState([])
  const [checked, setChecked] = React.useState(false)
  const [loading, setLoading] = useState(false)

  const handleCheck = (event) => {
    setChecked(event.target.checked);
    console.log(checked)
  }
  const getBooks = useCallback(async () => {
    const curUser = await getSessionMemberApi()
    let newl = []
    let neww = []
    curUser.level = Math.ceil(Math.pow(curUser.xp,1.0/1.1)/30.0)
    setUser(curUser);
    console.log(curUser)
    let temp = curUser.id
    //setUserId(temp)
    //console.log(userId)
    try {
        const result = await AvatarApi.getAll()
        if (result) {
            setData(result)
            setLoading(true)
        }
    } catch (error) {
        console.log(error)
    }
}, [])
  useEffect(() => {
    getBooks()
  }, [getBooks])

  const handleClick = (async(data) => {
    if (data.levelReq <= user.level) {
      console.log(user)
      const user2 = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        xp: parseInt(user.xp),
        streak: parseInt(user.streak),
        booksRead: parseInt(user.booksRead),
        lastRead: user.lastRead,
        avatarId: data.id,
        parentId: parseInt(user.parentId)
      }
      console.log(user2)
      let response = await UserApi.update(user.id, user2)
      console.log(response)
      if (response && response.status == 200) {
        console.log("success")
          enqueueSnackbar('Avatar Changed!', {
              variant: 'success',
              autoHideDuration: 3000,
              anchorOrigin: {horizontal: 'right', vertical: 'top'}
          })
          setTimeout(() => {
              navigate('/dashboard')
          }, 1000)
      } else {
        console.log("womp")
      }
    }
  })
  
  return (
    <>
      <Breadcrumbs custom heading='Avatar' />
        <MainCard>
            {(loading) &&
            <ScrollX>
                <Stack spacing={2.5}>
                  <Grid container spacing ={0} justifyContent="space-evenly" alignItems="center">
                    <Paper xs={9} elevation={3} sx={{ margin: 2, padding:2, width: 1}} >
                      <Grid container sx={{flexGrow: 1}}>
                        {data.map(avatar => (
                            <Stack spacing={{xs: 1, sm: 2, width: 300}} justifyContent="space-evenly" alignItems="center"  flexWrap="wrap" useFlexGap>
                              
                              <Avatar sx={{ width: 200, height: 200, margin: 3, mb:2, mt:4}} src = {avatar.avatarUrl}></Avatar>
                              <Stack spacing={2.5}  flexWrap="wrap" useFlexGap>
                                <Button
                                variant="contained"
                                onClick={() => {
                                  handleClick(avatar)
                                }}
                                >
                                  {( avatar.levelReq > user.level &&
                                    <LockIcon/>
                                  )}
                                  {avatar.avatarName}, Level {avatar.levelReq} Required
                                </Button>
                              </Stack>
                            </Stack>
                        ))}
                      </Grid>
                    </Paper>
                    
                  </Grid>
                </Stack>
            </ScrollX>
          }
        </MainCard>     
        <SnackbarProvider/>
    </>
  )
}

export default AvatarSelection
