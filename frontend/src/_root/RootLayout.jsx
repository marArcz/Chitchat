import React, { useEffect, useState } from 'react'
import SideMenu from '../components/ui/SideMenu'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useConversationStore } from '../app/store'
import DialogComponent from '../components/shared/DialogComponent'
import InputControl from '../components/shared/InputControl'
import { Input } from '@material-tailwind/react'
import { useAuthContext } from '../context/AuthContext'
import { updateUserProfile } from '../lib/api'
import UsernameDialog from '../components/ui/UsernameDialog'
import LogoText from '../components/shared/LogoText'

const RootLayout = () => {
  const [showMenu, setShowMenu] = useState(false)
 

  return (
    <main className='bg-gray-100 flex justify-center items-center h-screen w-full'>
      <SideMenu handleOnClose={() => setShowMenu(false)} show={showMenu} />
      <div className='flex-1 flex flex-col lg:container h-screen'>
        <div className="lg:hidden items-center flex header bg-white lg:container px-4 py-3 w-full">
          <button onClick={() => setShowMenu(s => !s)} type='button' className='border-0 outline-none bg-white rounded p-1'>
            <img src="/images/menu-burger.png" width={30} alt="" />
          </button>
          <div className=" flex-1 text-center">
              <LogoText/>
          </div>
        </div>
        <div className="flex-1 h-[90vh]">
          <Outlet />
        </div>
      </div>
      <Toaster />
      <UsernameDialog/>
    </main>
  )
}

export default RootLayout