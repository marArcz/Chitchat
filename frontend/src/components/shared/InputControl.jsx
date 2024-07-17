import React from 'react'

const InputControl = ({type='text',label='',error, id='', placeholder='', className='',...props }) => {
  return (
    <>
        <label className='form-label font-medium' htmlFor={id}>{label}</label>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={`${className} form-input`}
            {...props}
        />

        {error && <p className='text-sm bg-red-100 font-medium text-red-700 py-1 px-3 rounded mb-2 mt-1'>{error.msg}</p>}
    </>
  )
}

export default InputControl