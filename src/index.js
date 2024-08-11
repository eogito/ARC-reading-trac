import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// scroll bar
import 'simplebar/src/simplebar.css'

// third-party
import { Provider as ReduxProvider } from 'react-redux'

// apex-chart
import 'assets/third-party/apex-chart.css'

// project import
import App from './App'
import { store } from 'store'
import reportWebVitals from './reportWebVitals'
import { UserProvider } from "./context/UserContext"
import { AppointmentProvider} from "./context/AppointmentContext"
// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(
    <ReduxProvider store={store}>
        <UserProvider>
          <BrowserRouter basename="/">
              <AppointmentProvider>
                <App />
              </AppointmentProvider>
          </BrowserRouter>
        </UserProvider>
    </ReduxProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
