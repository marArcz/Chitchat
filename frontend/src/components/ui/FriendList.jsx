import React, { useEffect } from 'react'
import { useFriendStore } from '../../app/store';
import ConversationPlaceholder from '../shared/ConversationPlaceholder';
import UserAvatar from '../shared/UserAvatar';
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const FriendList = () => {
    const { friends, loading, error, fetchAllFriends } = useFriendStore();
    const { user, checkAuthUser } = useAuthContext();

    useEffect(() => {
        if (user) {
            fetchAllFriends()
        }
    }, [user]);

    return (
        <>
            <ul className='flex flex-col flex-grow gap-1 py-3 overflow-y-auto custom-scroll'>
                {
                    loading ? (
                        <>
                            <ConversationPlaceholder />
                            <ConversationPlaceholder />
                            <ConversationPlaceholder />
                        </>
                    ) : (
                        <>
                            {friends && friends.length > 0 ? (
                                friends.map((friend, index) => {
                                    return (
                                        <li key={index} >
                                            <Link
                                                className='flex gap-4 items-center cursor-pointer p-2 hover:bg-gray-100 rounded-lg hover:bg-opacity-15 transition-all'
                                            >
                                                <UserAvatar
                                                    size={47}
                                                    imgUrl={friend?.imgUrl}
                                                    name={friend?.name}
                                                    bg='fff'
                                                    color='000'
                                                />
                                                <div>
                                                    <p className='font-medium text-white'>{friend?.name}</p>
                                                    <p className="text-[12px] text-white">@{friend?.username}</p>
                                                </div>

                                            </Link>
                                        </li>
                                    )
                                })
                            ) : (
                                <p className='mt-3 text-gray-100 text-center'>You haven't added friends yet.</p>
                            )}
                        </>
                    )
                }
            </ul>
        </>
    )
}

export default FriendList