import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './_auth/AuthLayout'
import SignInForm from './_auth/forms/SignInForm'
import UserAuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import RootLayout from './_root/RootLayout'
import Home from './_root/pages/Home'
import SignUpForm from './_auth/forms/SignUpForm'

function App() {

  return (
    <>
        <UserAuthProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path='/sign-in' element={<SignInForm />} />
              <Route path='/sign-up' element={<SignUpForm />} />
            </Route>
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path=':conversationId/chat' element={<Home />} />
            </Route>
          </Routes>
        </UserAuthProvider>
      <Toaster />
    </>
  )
}

export default App
