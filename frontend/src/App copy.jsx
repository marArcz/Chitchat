import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [chatMessages, setChatMessages] = useState([])
  const chatSocket = useRef(null);
  const [chatInput, setChatInput] = useState('')
  const [userId, setUserId] = useState('')

  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const conversationId = 'shaa9sd8as9d8asd0asda';

  useEffect(() => {
    let userId = generateRandomString(4);
    setUserId(userId);
    // Connect to the chat WebSocket server
    chatSocket.current = new WebSocket(`ws://localhost:8000/chat?conversationId=${conversationId}&userId=${userId}`);
    chatSocket.current.onmessage = (event) => {
      setChatMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };

    return () => {
      chatSocket.current.close();
    }
  }, [])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      chatSocket.current.send(chatInput);
      setChatInput('');
    }
  }

  return (
    <>
      <div className="lg:w-2/3 mx-auto w-full">
        <div className="py-3 bg-gray-200">
          <div className="shadow-sm  h-[40vh] overflow-y-auto py-3 box-border px-3">
            {
              chatMessages && chatMessages.map((chat, index) => {
                return (
                  <div key={index} className='mb-4'>
                    <p className={`text-gray-900 w-max mb-1 text-[12px] ${chat.userId == userId && 'ms-auto'}`}>{chat.userId}</p>
                    <div className={`w-max max-w-[40%] shadow-sm bg-blue-400 text-white p-3 ${chat.userId == userId && 'ms-auto'}`}>
                      {chat.message}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="flex">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} type="text" className='flex-1 outline-none border-gray-400 border p-3 bg-white' placeholder='Enter your message here...' />
            <button className='bg-blue-500 text-white border-0 p-3'>Send</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default App
