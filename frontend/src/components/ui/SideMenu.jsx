import React, { useEffect, useState } from 'react'
import UserAvatar from '../shared/UserAvatar'
import { useAuthContext } from '../../context/AuthContext'
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { useConversationStore } from '../../app/store';
import ConversationPlaceholder from '../shared/ConversationPlaceholder';
import ProfileDialog from './ProfileDialog';
import ConversationList from './ConversationList';
import FriendList from './FriendList';

const SideMenu = ({ show = false, handleOnClose }) => {
    const [showDialog, setShowDialog] = useState(false)
    const [activeTab, setActiveTab] = useState(0);
    const { user, checkAuthUser } = useAuthContext();
    const [cookies, removeCookie] = useCookies([]);
    const navigate = useNavigate();


    const handleOnLogout = async () => {
        removeCookie(import.meta.env.VITE_TOKEN_NAME);
        await checkAuthUser();
        navigate('/sign-in')
    }


    return (
        <>
            {show && <div onClick={handleOnClose} className=" transition-all overlay z-10 fixed w-full h-screen left-0 top-0 bg-gray-700 bg-opacity-50 lg:hidden">
            </div>}
            <nav className={`sidemenu z-20 h-screen flex flex-col p-4 ${show && 'open'}`}>
                <img src="/images/logo-sm.png" className='mt-4 mx-auto' width={170} alt="" />
                <div className="nav-tab w-full p-2 bg-gray-600 rounded-lg mt-7 bg-opacity-20 flex items-center gap-3">
                    <button onClick={() => setActiveTab(0)} className={`${activeTab == 0 ? 'bg-white' : 'text-white'} rounded-lg p-2 flex-1 text-center`}>
                        <p className='font-semibold text-sm'>Chats</p>
                    </button>
                    <button onClick={() => setActiveTab(1)} className={`${activeTab == 1 ? 'bg-white' : 'text-white'} rounded-lg p-2 flex-1 text-center`}>
                        <p className=' font-semibold text-sm'>Friends</p>
                    </button>
                </div>
                <div className={`messages-tab flex-1 ${activeTab !== 0 && 'hidden'}`}>
                    <Link to="/" className='py-3 px-4 mt-3 bg-gray-300 text-white bg-opacity-30 rounded-md w-full block font-medium'>New chat</Link>
                    <div className="flex items-center gap-3 mt-4 mb-1">
                        <hr className='flex-grow' />
                        <p className=' w-max text-white font-medium'>Direct Messages</p>
                        <hr className='flex-grow' />
                    </div>
                    <ConversationList />
                </div>
                <div className={`friends-tab flex-1 ${activeTab !== 1 && 'hidden'}`}>
                    <div className="flex items-center gap-3 mt-4">
                        <hr className='flex-grow' />
                        <p className=' w-max text-white font-medium'>Friends</p>
                        <hr className='flex-grow' />
                    </div>
                    <FriendList />
                </div>
                <div className='w-full mt-3 self-end place-self-end justify-self-end'>
                    <div className="bg-white px-2 py-1 rounded-lg flex items-center gap-3">
                        <div onClick={() => setShowDialog(true)} className='flex gap-2 py-2 px-2 items-center profile-button bg-white hover:bg-gray-200 rounded-lg cursor-pointer'>
                            <div>
                                <UserAvatar size={32} rounded name={user?.name} />
                            </div>
                            <div className=' h-max'>
                                <p className='font-medium text-sm'>{user?.name}</p>
                                <p className='text-[10px]'>@{user?.username}</p>
                            </div>
                        </div>
                        <button type='button' onClick={handleOnLogout} className='ms-auto'>
                            <img src="/images/sign-out.png" width={24} height={24} alt="" className='me-2' />
                        </button>
                    </div>
                </div>
            </nav>
            <ProfileDialog setShowDialog={setShowDialog} showDialog={showDialog} />
        </>
    )
}

export default SideMenu