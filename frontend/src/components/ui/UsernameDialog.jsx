import React, { useEffect, useState } from 'react'
import DialogComponent from '../shared/DialogComponent'
import { useAuthContext } from '../../context/AuthContext';
import { Input } from '@material-tailwind/react';
import { updateUserProfile } from '../../lib/api';

const UsernameDialog = () => {
    const { user } = useAuthContext();
    const [username, setUsername] = useState(user?.username || '')
    const [showDialog, setShowDialog] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (user && !user?.username) {
            setShowDialog(true)
        }

    }, [user])

    const handleFormSubmit = (e) => {
        e.preventDefault();
        updateUserProfile({
            ...user,
            username
        })
            .then((res) => {
                setShowDialog(false);
            })
            .finally(() => {
                setIsUpdating(false)
            })
    }
    return (
        <DialogComponent
            open={showDialog}
            handleOpen={() => setShowDialog(s => !s)}
            size='sm'
        >
            <form onSubmit={handleFormSubmit}>
                <h1 className='text-gray-900 text-lg font-medium'>
                    <span className='text-green-300'>Configure</span> <span className='text-blue-300'>Profile</span>
                </h1>
                <div className="mb-3 mt-8">
                    <Input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        variant="standard"
                        label="Username"
                        placeholder="Username" />
                </div>
                <button disabled={isUpdating} type='submit' className='btn-primary mt-3'>Save</button>
            </form>
        </DialogComponent>
    )
}

export default UsernameDialog