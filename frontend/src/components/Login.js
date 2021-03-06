import React, { useState, useRef, Fragment } from 'react'
import './Login.css'
import { Room, Cancel } from '@material-ui/icons'
import { Backdrop } from '@material-ui/core'
import axios from 'axios'

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {

    const [error, setError] = useState(false)
    const nameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        }

        try {
            const res = await axios.post('/users/login', user)
            myStorage.setItem('user', res.data.username )
            setCurrentUser(res.data.username)
            setShowLogin(false)
            setError(false)
        } catch(error) {
            setError(true)
        }
    }

    return (
        <Fragment>
            <Backdrop open={true} style={{ zIndex: "10" }}/>
            <div className='loginContainer'>
                <div className="logo">
                    <Room />
                    Mapping
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='John Smith'  ref={nameRef}/>
                    <input type="password" placeholder='password' ref={passwordRef}/>
                    <button className='loginBtn'>Login</button>
                    {error && <span className='failure'>Something went Wrong!</span>}
                </form>
                <Cancel className='loginCancel' onClick={() => setShowLogin(false)}/>
            </div>
        </Fragment>
    )
}

export default Login

