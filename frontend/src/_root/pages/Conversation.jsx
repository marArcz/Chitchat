import { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext';
import UserAvatar from '../../components/shared/UserAvatar';
import toast from 'react-hot-toast'
import { formatChatTimestamp } from '../../lib/utils';
import User from '../../../../backend/models/User';


function Conversation() {
   const [chatMessages, setChatMessages] = useState([])
   const chatSocket = useRef(null);
   const [chatInput, setChatInput] = useState('')
   const chatBoxRef = useRef(null);
   const { user, isAuthenticated } = useAuthContext();
   const [isMatchingUp, setIsMatchingUp] = useState(false)
   const [conversationId, setConversationId] = useState(null)
   const [currentChannel, setCurrentChannel] = useState(null)
   const [isConnected, setIsConnected] = useState(false)
   const [matchedUser, setMatchedUser] = useState(null)
   const [failedMatching, setFailedMatching] = useState(false)
   const [matchedUserLeft, setMatchedUserLeft] = useState(false)
   const [showMenu, setShowMenu] = useState(false)


   useEffect(() => {
      if (chatBoxRef.current) {
         chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
   }, [chatMessages, matchedUserLeft]);

   useEffect(() => {
      if (user) {
         // Connect to the chat WebSocket server
         chatSocket.current = new WebSocket(`ws://localhost:8000/chat?userId=${user._id}`);
         chatSocket.current.onopen = () => {
            setIsConnected(true)
         }
         chatSocket.current.onclose = () => {
            setIsConnected(false)
         }
         // handle message from server
         chatSocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'match') {
               setIsMatchingUp(false);
               if (data.success) {
                  toast.success('successfully matched!')
                  console.log('succes match: ', data);
                  setMatchedUser(data.matchedUser);
                  setCurrentChannel(data.channelId);
               } else {
                  setFailedMatching(true);
               }

            } else if (data.type === 'private_message') {
               console.log(data)
               setChatMessages((prevMessages) => [...prevMessages, data.chat]);
            }
            else if (data.type === 'disconnected') {
               setMatchedUserLeft(true)
            }
            else {
               console.log("error: ", data)
               toast.error(data.message)
            }
         };
      }

      return () => {
         if (chatSocket.current) {
            chatSocket.current.close();
         }
      }
   }, [user])


   const sendPrivateMessage = (e) => {
      e.preventDefault();

      if (chatInput && chatSocket.current.readyState === WebSocket.OPEN && currentChannel) {
         chatSocket.current.send(JSON.stringify({
            type: 'private_message',
            message: chatInput.trim(),
            channelId: currentChannel,
            userId: user._id
         }));
         setChatInput('');
         toast.success('Sent!')
      } else {
         toast.error('socket is closed')
      }
   }

   const handleStartMatchUp = () => {
      if (user && chatSocket.current && chatSocket.current.readyState === WebSocket.OPEN) {
         chatSocket.current.send(JSON.stringify({
            type: 'match',
            userId: user._id,
            preferences: {
               pronoun: 'both'
            }
         }));
         setChatMessages([])
         setIsMatchingUp(true)
         setMatchedUserLeft(false)
         setMatchedUser(null)
      }
   }

   const restartAndMatchup = () => {
      handleStartMatchUp();
   }

   return (
      <>
         <div className="h-full w-full flex flex-col">

            {
               currentChannel && matchedUser ? (
                  <>
                     <div className='w-full py-3 px-4 flex justify-between items-center'>
                        <div className="flex items-center gap-3">
                           <p className="text-lg font-semibold"><span className='text-blue-500'>@</span>{matchedUser.username}</p>
                        </div>
                        <div>
                           <button className='btn-primary' type='button'>Add friend</button>
                        </div>
                     </div>
                     <div ref={chatBoxRef} className=" bg-gray-200 scroll-smooth shadow-sm overflow-y-auto custom-scroll overflow-x-hidden p-5 flex-grow">
                        <div className="flex flex-col justify-end min-h-full">
                           <p className='mb-3 text-sm text-gray-700'>You are now chatting with <span className='text-sky-500 font-medium'>{matchedUser.username}</span>. Say hi!</p>
                           {
                              chatMessages && chatMessages.map((chat, index) => {
                                 return (
                                    <div key={index} className='mb-4 flex gap-3 chat-message'>
                                       <UserAvatar className='self-start m-0' size={42} name={chat.sender?.name} />
                                       <div>
                                          <div className="flex">
                                             <p className='text-gray-700 w-max'>{chat.sender?.username}</p>
                                             <p className="text-sm ms-3 text-gray-400">
                                                {formatChatTimestamp(chat.createdAt)}
                                             </p>
                                          </div>
                                          <p className='font-medium'>
                                             {chat.content}
                                          </p>
                                       </div>
                                    </div>
                                 )
                              })
                           }
                           {matchedUserLeft && (
                              <>
                                 <p className='mb-3 text-sm text-gray-900'>{matchedUser.username} has left the chat :(.</p>
                                 <p className="mt-3 text-sm">That's too bad, do you want to <span onClick={restartAndMatchup} className='text-green-500 font-medium cursor-pointer'>match up again</span>?</p>
                              </>
                           )}
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="flex-1 container p-10 flex flex-col justify-end">
                     <div>
                        <h1 className='text-4xl text-green-500 mt-5 font-medium'>Hello, <span className=' text-sky-500'>{user?.name}!</span></h1>
                        <h2 className='mt-4 text-xl font-medium text-gray-600'>Find someone to chat with!</h2>

                        {/* show message when failed to match up with other user*/}
                        {failedMatching && !isMatchingUp && <p className='font-medium text-gray-600'>Oh no we can't find someone to match with you!</p>}

                        <button disabled={!user || isMatchingUp} onClick={handleStartMatchUp} type='button' className={`mt-5 px-5 btn-primary w-max font-medium ${isMatchingUp && 'animate-pulse'}`}>
                           {
                              isMatchingUp ? 'Matching up...' : 'Start'
                           }
                        </button>
                     </div>
                  </div>
               )
            }
            <div className="p-4">
               <p className={`mb-2 text-${isConnected ? 'green-500' : 'red-500'} font-semibold`}>You're {isConnected ? 'connected!' : 'disconnected!'}</p>
               {
                  user ? (
                     <form onSubmit={sendPrivateMessage}>
                        <div className="flex gap-2">
                           <input disabled={!currentChannel || matchedUserLeft} required value={chatInput} onChange={e => setChatInput(e.target.value)} type="text" className='flex-1 outline-none border-gray-400 rounded-lg border p-3 bg-white' placeholder='Enter your message here...' />
                           <button type='submit' disabled={!currentChannel || matchedUserLeft} className='bg-blue-500 text-white border-0 p-3 rounded-lg'>Send</button>
                        </div>
                     </form>
                  ) : (
                     <p className="text-center">Please wait...</p>
                  )
               }
            </div>
         </div>
      </>
   )
}

export default Conversation
