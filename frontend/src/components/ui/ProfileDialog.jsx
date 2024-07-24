import React, { useEffect, useState } from 'react'
import DialogComponent from '../shared/DialogComponent'
import { Button, Card, CardBody, CardHeader, Dialog, Drawer, Input } from '@material-tailwind/react'
import UserAvatar from '../shared/UserAvatar'
import { useAuthContext } from '../../context/AuthContext'
import { updateUserProfile } from '../../lib/api'
import { toast } from 'react-hot-toast';

const ProfileDialog = ({ showDialog, setShowDialog }) => {
    const { user, checkAuthUser } = useAuthContext();
    const [errors, setErrors] = useState({})
    const [name, setName] = useState(user?.name || '')
    const [username, setUsername] = useState(user?.username || '')
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        updateUserProfile({
            ...user,
            name,
            username
        })
            .then(res => {
                toast.success('Successfully saved!');
                setShowEditProfile(false);
                checkAuthUser();
            })
            .catch(err => {
                setErrors(err.response.data.errors)
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setUsername(user.username)
        }
    }, [user])

    return (
        <>
            <Dialog
                dismiss={{
                    enabled: !isLoading
                }}
                size={'sm'}
                open={showDialog}
                handler={() => setShowDialog(s => !s)}
                className="bg-transparent shadow-none backdrop:none z-[666!important]"
            >
                <div className='rounded-lg relative bg-white overflow-clip transition-all'>
                    <div className="bg-gradient-primary lg:h-[70px] h-[80px]">
                    </div>
                    <div className="content p-5 transition-all">
                        <UserAvatar name={user?.name} imgUrl={user?.imgUrl} className='lg:mt-[-12%] mt-[-18%] border-white border-[3px]' size={80} />
                        <div className="mt-3 flex justify-between">
                            <div>
                                <p className='font-semibold text-lg'>{user?.name}</p>
                                <p className='font-medium text-sm'>@{user?.username}</p>
                            </div>
                            <div className=' place-content-end'>
                                <Button
                                    onClick={() => setShowEditProfile(s => !s)}
                                    size='sm'
                                    disabled={isLoading}
                                    className={`bg-${showEditProfile ? 'gray-700' : 'green-500'}`}
                                >
                                    {showEditProfile ? 'Cancel' : 'Edit Profile'}
                                </Button>
                            </div>
                        </div>
                        {showEditProfile && user && (
                            <div className="mt-4 mb-2 p-3 bg-gray-100 rounded-lg">
                                <form onSubmit={handleFormSubmit}>
                                    <p className='text-sm font-semibold mb-2'>Edit Profile</p>
                                    <div className="mb-3 mt-5">
                                        <Input
                                            error={errors.name !== undefined}
                                            className='bg-white'
                                            label='Name'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <Input
                                            error={errors.username !== undefined}
                                            className='bg-white'
                                            label='Username'
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                        />
                                        <p className="mt-1 text-red-600 text-sm font-normal">{errors.username?.msg}</p>
                                    </div>
                                    <button disabled={isLoading} className='btn-primary rounded-lg ' type='submit'>Save</button>
                                </form>
                            </div>
                        )}
                        <hr className='my-3' />
                        <h2 className='text-sm font-medium'>Interests</h2>
                        <div className="mt-3">
                            <ul className='flex flex-col'>
                                <li className='bg-gray-100 w-max py-1 px-3 font-medium text-gray-600 rounded-lg text-sm'>
                                    No interests.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProfileDialog