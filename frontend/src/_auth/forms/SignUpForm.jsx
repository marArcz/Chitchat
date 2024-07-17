import React, { useState } from 'react'
import InputControl from '../../components/shared/InputControl'
import { Link, useNavigate } from 'react-router-dom'
import { createAccount, signIn } from '../../lib/api'
import { useAuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const SignUpForm = () => {
    const { isAuthenticated, checkAuthUser } = useAuthContext()
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState('')
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
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
        createAccount(data)
            .then(async (res) => {
                console.log(res)
                checkAuthUser()
                    .then(() => {
                        navigate('/')
                        toast.success('Successfully created account!')
                    })
            })
            .catch(err => {
                console.log(err)
                toast.error('Something went wrong please try again!')
                setErrors(err.response.data.errors)
            })
    }

    return (
        <>
            <h2 className='text-2xl font-semibold'>Create an account!</h2>
            <p className='mt-1'>Register and start your conversations!</p>
            <div className="mt-4">
                {message && (
                    <p className='mb-3 bg-red-100 text-sm px-4 font-semibold py-3 text-red-700'>{message}</p>
                )}
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <InputControl
                            label='Name'
                            id='name'
                            type='text'
                            value={data.name}
                            onChange={e => handleChange('name', e.target.value)}
                            error={errors.name}
                        />
                    </div>
                    <div className="mb-3">
                        <InputControl
                            label='Email'
                            id='email'
                            type='email'
                            value={data.email}
                            onChange={e => handleChange('email', e.target.value)}
                            error={errors.email}
                        />
                    </div>
                    <div className="mb-3">
                        <InputControl
                            label='Password'
                            id='password'
                            type='password'
                            value={data.password}
                            onChange={e => handleChange('password', e.target.value)}
                            error={errors.password}
                        />
                    </div>
                    <div className="mb-3">
                        <InputControl
                            label='Confirm Password'
                            type='password'
                            id='confirm-password'
                            value={data.passwordConfirmation}
                            onChange={e => handleChange('passwordConfirmation', e.target.value)}
                            error={errors.passwordConfirmation}
                        />
                    </div>

                    <button className='mt-2 btn-primary text-white'>
                        Create account
                    </button>
                </form>
                <p className='mt-4 text-sm text-center'>Already have an account? <Link to="/sign-in" className=' text-green-500 font-semibold'>Sign in!</Link></p>
            </div>
        </>
    )
}

export default SignUpForm