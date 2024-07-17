import React, { useState } from 'react'
import InputControl from '../../components/shared/InputControl'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../../lib/api'
import { useAuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const SignInForm = () => {
    const {isAuthenticated, checkAuthUser} = useAuthContext()
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (key, value) => {
        setData(d => ({
            ...d,
            [key]: value
        }))
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({})
        signIn(data.email,data.password)
            .then(async (res) => {
                console.log(res)
                checkAuthUser()
                .then(() => {
                    toast.success('Successfully logged in!')
                    navigate('/')
                })
            })
            .catch(err => {
                console.log(err)
                toast.error('Something went wrong please try again!')
            })
    }

    return (
        <>
            <h2 className='text-2xl font-semibold'>Welcome!</h2>
            <p className='mt-1'>Sign in and start your conversations!</p>
            <div className="mt-4">
                {message && (
                    <p className='mb-3 bg-red-100 text-sm px-4 font-semibold py-3 text-red-700'>{message}</p>
                )}
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <InputControl
                            label='Email'
                            type='email'
                            value={data.email}
                            onChange={e => handleChange('email', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <InputControl
                            label='Password'
                            type='password'
                            value={data.password}
                            onChange={e => handleChange('password', e.target.value)}
                        />
                    </div>

                    <button className='btn-primary'>
                        Sign In
                    </button>
                </form>
                <p className='mt-4 text-sm text-center'>Don't have an account yet? <Link to="/sign-up" className=' text-green-500 font-semibold'>Sign up!</Link></p>
            </div>
        </>
    )
}

export default SignInForm