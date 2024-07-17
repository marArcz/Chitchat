import React from 'react'
import { Outlet } from 'react-router-dom'
import LogoText from '../components/shared/LogoText'

const AuthLayout = () => {
    return (
        <main className=' bg-gray-100 flex justify-center items-center h-screen w-full'>
            <section className='xl:w-[30%] lg:w-[60%] w-[80%] bg-white border border- rounded border-gray-100 shadow-sm'>
                <div className="p-6 text-gray-700">
                    <LogoText />
                    <div className="mt-3">
                        <Outlet />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default AuthLayout