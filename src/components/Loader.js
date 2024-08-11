import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}))

// ==============================|| Loader ||============================== //

const Loader = (props) => (
    <>
      {(props.loading) &&
        <LoaderWrapper>
          <CircularProgress color="primary"/>
        </LoaderWrapper>
      }
    </>
)
Loader.propTypes = {
  loading: PropTypes.bool
}
export default Loader
