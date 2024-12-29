import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  {BrowserRouter} from 'react-router-dom'
import { UserProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <StrictMode>
    <UserProvider>
    <App />

    </UserProvider>
  
  </StrictMode>,
  </BrowserRouter>
  
)