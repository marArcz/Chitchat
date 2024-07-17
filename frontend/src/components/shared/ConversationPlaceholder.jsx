import React from 'react'

const ConversationPlaceholder = () => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='p-2 bg-white bg-opacity-40 w-[50px] h-[50px] rounded-full border-0 animate-pulse'>
      </div>
      <div className='flex-grow flex flex-col gap-1'>
        <div className='p-3 bg-white bg-opacity-40 w-[100px] rounded-md border-0 animate-pulse'>
        </div>
        <div className='p-2 bg-white bg-opacity-40 w-full rounded-md border-0 animate-pulse'>
        </div>
      </div>
    </div>
  )
}

export default ConversationPlaceholder