import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import axios from 'axios'
import { ThemeProvider } from '@material-tailwind/react'
import { customTheme } from './lib/appTheme.js'

axios.defaults.baseURL = import.meta.env.VITE_API_URL;


const router = createBrowserRouter([
  {
    path: '/*',
    element: (
      <ThemeProvider value={customTheme}>
        <App />
      </ThemeProvider>
    )
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
  ,
)
