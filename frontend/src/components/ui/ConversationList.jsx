import React, { useEffect } from 'react'
import { useConversationStore } from '../../app/store';
import ConversationPlaceholder from '../shared/ConversationPlaceholder';
import UserAvatar from '../shared/UserAvatar';
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ConversationList = () => {
    const { conversations, loading: loadingConversations, error, fetchAllConversations } = useConversationStore();
    const { user, checkAuthUser } = useAuthContext();

    const getFriend = (conversation) => {
        if (conversation) {
            console.log('convo: ', conversation)
            return conversation.users?.find((u) => u._id != user._id);
        }

        return null;
    }


    useEffect(() => {
        if (user) {
            fetchAllConversations()
        }
    }, [user]);

    return (
        <>
            <ul className='flex flex-col flex-grow gap-4 py-3 overflow-y-auto custom-scroll'>
                {
                    loadingConversations ? (
                        <>
                            <ConversationPlaceholder />
                            <ConversationPlaceholder />
                            <ConversationPlaceholder />
                        </>
                    ) : (
                        <>
                            {conversations && conversations.length > 0 ? (
                                conversations.map((conversation, index) => {
                                    let friend = getFriend(conversation);
                                    let lastChat = conversation.messages ? conversation.messages[0] : null
                                    console.log(conversation.messages)
                                    return (
                                        lastChat ? (
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
                                                        <p className='font-normal text-white'>{friend?.name}</p>
                                                        <div className="mt-0 text-sm text-gray-100">
                                                            {lastChat?.content}
                                                        </div>
                                                    </div>

                                                </Link>
                                            </li>
                                        ) : null
                                    )
                                })
                            ) : (
                                <p className='mt-3 text-gray-100 text-center'>No messages to show.</p>
                            )}
                        </>
                    )
                }
            </ul>
        </>
    )
}

export default ConversationList