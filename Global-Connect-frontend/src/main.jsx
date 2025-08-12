import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.production.VITE_API_URL}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>


  </StrictMode>,
)
