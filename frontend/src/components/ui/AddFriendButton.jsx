import React, { useEffect, useState } from 'react'
import toast, { LoaderIcon } from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';

const AddFriendButton = ({ handleNotifyUpdate, friendRequest = null, updateRequest, handleAddFriend, handleDelete, isLoading }) => {
    const {user} = useAuthContext();

    return (
        <>
            {
                isLoading ? (
                    <div className=''>
                        <LoaderIcon />
                    </div>
                ) : (
                    friendRequest ? (
                        friendRequest.status === 'pending' ? (
                            friendRequest.recipient._id === user._id ? (
                                <div className='flex gap-2'>
                                    <button onClick={() => updateRequest('accepted')} className='btn-primary' type='button'>Accept</button>
                                    <button onClick={() => updateRequest('declined')} className='btn-red-400' type='button'>Decline</button>
                                </div>
                            ) : (
                                <button onClick={() => handleDelete()} className='btn-primary' type='button'>Cancel Request</button>
                            )
                        ) : (
                            <button onClick={() => handleDelete()} className='btn-primary' type='button'>Friends</button>
                        )
                    ) : (
                        <button onClick={handleAddFriend} className='btn-primary' type='button'>Add friend</button>
                    )
                )
            }
        </>
    )
}

export default AddFriendButton