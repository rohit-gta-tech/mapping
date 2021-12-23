import React, { useState, useRef, Fragment } from 'react'
import './Register.css'
import { Room, Cancel } from '@material-ui/icons'
import { Backdrop } from '@material-ui/core'
import axios from 'axios'

const Register = ({ setShowRegister }) => {

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        try {
            await axios.post('/users/register', newUser)
            setError(false)
            setSuccess(true)
        } catch(error) {
            setError(true)
        }
    }

    return (
        <Fragment>
            <Backdrop open={true} style={{ zIndex: "10" }}/>
            <div className='registerContainer'>
                <div className="logo">
                    <Room />
                    Mapping
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='John Smith'  ref={nameRef}/>
                    <input type="email" placeholder='john.smith@email.com' ref={emailRef}/>
                    <input type="password" placeholder='password' ref={passwordRef}/>
                    <button className='registerBtn'>Register</button>
                    {success && <span className='success'>Registration successful. You can login now!</span>}
                    {error && <span className='failure'>Something went Wrong!</span>}
                </form>
                <Cancel className='registerCancel' onClick={() => setShowRegister(false)}/>
            </div>
        </Fragment>
        
    )
}

export default Register
