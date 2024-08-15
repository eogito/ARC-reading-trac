import React, { useState } from 'react'

import { useCallback } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// material-ui
import {Stack, Grid, Paper, Typography, LinearProgress, Box, IconButton, Button} from '@mui/material'
import {red, blue} from '@mui/material/colors'

// project import
import MainCard from 'components/MainCard'
import ScrollX from 'components/ScrollX'
import { SnackbarProvider } from 'notistack'
import Breadcrumbs from "../../components/@extended/Breadcrumbs"
import WhatshotIcon from '@mui/icons-material/Whatshot'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import PostAddIcon from '@mui/icons-material/PostAdd'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getSessionMemberApi } from 'api/AuthApi'
import Avatar from 'components/@extended/Avatar'
import BookProgressApi from 'api/BookProgressApi'
import BookApi from 'api/BookApi'
import UserApi from 'api/UserApi'

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [user, setUser] = useState()
  const [data, setData] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  const getBooks = useCallback(async () => {
    const curUser = await getSessionMemberApi()
    let newl = []
    let neww = []
    let temp = curUser.id
    try {
        const result = await BookProgressApi.getAll()
        const result2 = await BookApi.getAll()
        const result3 = await UserApi.getById(temp)
        if (result && result2 && result3) {
          result3.level = Math.ceil(Math.pow(result3.xp,1.0/1.1)/30.0)
          setUser(result3)
            _.forEach(result2, book => {
                if (book.userId == temp) {
                    book.pagesRead = 0
                    neww.push(book)
                }
            })
            _.forEach(result, book => {
                if (book.userId == temp) {
                    let uwu = book.lastRead
                    book.lastRead = uwu.substring(0,10)
                    newl.push(book)
                    _.forEach(neww, booker => {
                      
                      if (book.Book != null && book.Book.id == booker.id) {
                        booker.pagesRead += book.pagesRead
                      }
                    })
                }
            })
            _.forEach(neww, booker => {
              booker.pageRead = Math.min(Math.round(booker.pagesRead/booker.pages * 100), 100)
            })
            setData(newl)
            setBooks(neww)
            setLoading(true)
        }
    } catch (error) {
        console.log(error)
    }
}, [])
  useEffect(() => {
    getBooks()
  }, [getBooks])
  
  return (
    <>
      <Breadcrumbs custom heading='Dashboard' />
        <MainCard>
            {(loading) &&
            <ScrollX>
                <Stack spacing={2.5}>
                  <Grid container spacing ={0} justifyContent="space-evenly" alignItems="center">
                    <Paper xs={15} elevation={3} sx={{ margin: 2, padding:2, width: 1}}>
                      <Stack direction="row">
                        <Avatar sx={{ width: 250, height: 250, margin: 3}} src = {user.Avatar.avatarUrl}></Avatar>
                        <Stack spacing={2.5}>
                          <Typography sx={{pt:5}} variant="h1">
                            Glen Lin
                          </Typography>
                          <Typography sx={{}} variant="h3">
                            Level {user.level+1} - {user.xp-Math.floor(Math.pow(30*(user.level-1),1.1))}/{(Math.floor(Math.pow(30*(user.level),1.1))-Math.floor(Math.pow(30*(user.level-1),1.1)))}
                          </Typography>
                          <LinearProgress sx={{width: '100%'}}variant="determinate" value={100*(user.xp-Math.floor(Math.pow(30*(user.level-1),1.1)))/(Math.floor(Math.pow(user.level*30,1.1))-Math.floor(Math.pow(30*(user.level-1),1.1)))} />
                          <Stack direction="row" sx={{}}>
                            <WhatshotIcon sx={{fontSize:100, color: red[500]}}/>
                            <Typography variant="h2" sx={{pl: 1, pt: 4.1}}>
                              Streak: {user.streak} days
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack spacing={7.8} justifyContent="center" sx={{pl: 2}}>
                          <Stack direction="row">
                            <CollectionsBookmarkIcon sx={{fontSize:100, color: blue[500]}}/>
                            <Typography variant="h2" sx={{pl: 1, pt: 4.1}}>
                              Books read: {user.booksRead}
                            </Typography>
                          </Stack>
                          <Stack direction="row" sx={{}}>
                            <PostAddIcon sx={{fontSize:100, color: blue[500]}}/>
                            <Typography variant="h2" sx={{pl: 1, pt: 4.1}}>
                              Pages read: {user.xp}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Paper>
                    
                    <Paper xs={15} elevation={3} sx={{ margin: 2, padding:2, width: 1}}>
                      {(loading) &&
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <IconButton 
                        onClick={() => {
                          setIndex(Math.max(index-1,0))
                        }}
                        aria-label="back">
                          <ArrowBackIcon/>
                        </IconButton>
                        <Box
                          component="img"
                          src={"https://covers.openlibrary.org/b/id/"+books[index].coverUrl+"-M.jpg"}
                          alt={books[index].coverUrl}
                          sx={{pl: 10}}
                        />
                        <Stack spacing={1} sx={{pl:3}}>
                          <Typography sx={{pt:5}} variant="h1">
                            {books[index].title}
                          </Typography>
                          <Typography sx={{}} variant="h3">
                            {books[index].author}
                          </Typography>
                          <LinearProgress sx={{width: 300}}variant="determinate" value={books[index].pageRead} />
                          <Typography sx={{}} variant="h6">
                            {books[index].pageRead}%
                          </Typography>
                        </Stack>
                        <Stack spacing={3} sx={{pl:5}} justifyContent="center">
                          <Button 
                            onClick={() => {
                              navigate('/add')
                            }}
                          variant="contained" size="large">New Book</Button>
                          <Button 
                          onClick={() => {
                            navigate('/update')
                          }}
                          variant="contained" size="large">Update Progress</Button>
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end">
                          <IconButton 
                          onClick={() => {
                            setIndex(Math.min(index+1,books.length-1))
                          }}
                          aria-label="back">
                            <ArrowForwardIcon/>
                          </IconButton>
                        </Stack>
                      </Stack>
                      }
                    </Paper>
                    <Paper xs={15} elevation={3} sx={{ margin: 2, padding:2, width: 1}}>
                      <Stack alignItems="center" justifyContent="center" spacing={2}>
                        <Typography variant="h1">
                          Progress Summary
                        </Typography>
                        {data.map(book => (
                          <Box key={book.id} sx={{width:1, border:'2px solid gray', background: '#d1d1d1', padding:2}}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-begin">
                              <Typography variant="h4">
                                {book.title}
                              </Typography>
                              <Typography variant="h4">
                                {book.lastRead}
                              </Typography>
                            </Stack>
                            <Stack justifyContent="ceneter" alignItems="flex-begin" sx={{pt:2}}>
                              <Typography variant="h4">
                                Pages Read: {book.pagesRead}
                              </Typography>
                              <Typography variant="h4">
                                Note: {book.note}
                              </Typography>
                            </Stack>
                          </Box>
                        ))} 
                              
                      </Stack>
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

export default DashboardDefault
