import React, { useState } from 'react'
import { useCallback,  useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
// material-ui
import {Stack, Typography, Box, Button} from '@mui/material'
import {
  DebouncedInput
} from 'components/third-party/react-table' // HeaderSort
import BookApi from 'api/BookApi'
import { getSessionMemberApi } from 'api/AuthApi'
// project import
import MainCard from 'components/MainCard'
import ScrollX from 'components/ScrollX'

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const AddBook = () => {
  
  const navigate = useNavigate()
  const [book, setBook] = useState(1)
  const [list, setList] = useState([])
  const searchBook = useCallback(async (title) => {
    let newl=[]
    const curUser = await getSessionMemberApi()
    setList(newl)
    fetch("https://openlibrary.org/search.json?q=" + title)
    .then(response => response.json()) 
    .then(data => { 
        for (var i = 0; i < 10; i++) {
            let book = {
                userId: curUser.id,
                title: data.docs[i].title,
                author: data.docs[i].author_name[0],
                pages: data.docs[i].number_of_pages_median,
                coverUrl: data.docs[i].cover_i,
                publishYear: data.docs[i].first_publish_year
            }
            if (book.pages == undefined) {
              book.pages = 0
            }
            newl.push(book)
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error)
    })
  }, [])
  useEffect(() => {
    searchBook(book)
  }, [book])

  const handleSearch = (value) => {
    setBook(value)
  }
  const handleAddBook = (async(data) => {
    data.coverUrl=data.coverUrl.toString()

    let response = await BookApi.create(data)
    console.log(response)
    if (response && response.status === 200) {
        enqueueSnackbar('Book added!', {
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {horizontal: 'right', vertical: 'top'}
        })
        setTimeout(() => {
            navigate('/dashboard')
        }, 1000)
    } else {
      enqueueSnackbar('Error', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {horizontal: 'right', vertical: 'top'}
    })
    }
  })

  return (
    <>
      <MainCard>
        <Stack spacing={2.5} sx={{mb:2}}>                  
          <Stack direction="row" spacing={2} alignItems="center"> 
            <DebouncedInput
              fullWidth
              onFilterChange={(value) => 
                handleSearch(value)
              }
              placeholder={`Search for Book`}   
            />
          </Stack> 
          <Button
            onClick={() => {
              navigate('/custom')
            }}
            variant="contained" size="large">Add Custom Book</Button>
        </Stack>
        <ScrollX>
          <Stack spacing={4}>
            
            {list.map(book => (
              <Stack key={book.id} direction="row" alignItems="center" justifyContent="left">
                <Box
                  component="img"
                  src={"https://covers.openlibrary.org/b/id/"+book.coverUrl+"-M.jpg"}
                  alt="no cover"
                  sx={{pl: 10}}
                />
                <Stack spacing={1} sx={{pl:3}}>
                  <Typography sx={{pt:5}} variant="h1">
                    {book.title}
                  </Typography>
                  <Typography sx={{}} variant="h3">
                    {book.author}
                  </Typography>
                  <Typography sx={{}} variant="h3">
                    {book.pages} pages
                  </Typography>
                  <Stack alignItems="flex-end" justifyContent="flex-end">
                    <Button 
                    variant="contained"
                    onClick={() => {
                      handleAddBook(book)
                    }}
                    >Add Book</Button>
                  </Stack>
                </Stack>
              </Stack>
            ))} 
          </Stack>
        </ScrollX>
      </MainCard>     
      <SnackbarProvider/>
    </>
  )
}

export default AddBook
