import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'

import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {

    const { url, token, setToken } = useContext(StoreContext)

    const [currState, setCurrState] = useState('SignUp')
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()

        let newUrl = url;

        // normal user login/signup
        if (currState === "Login") newUrl += "/api/user/login"
        if (currState === "SignUp") newUrl += "/api/user/register"

        // admin login route
        if (currState === "AdminLogin") newUrl += "/api/admin/login"

        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message)
            if (currState === "AdminLogin") {
                toast.success(response.data.message);

                setTimeout(() => {
                    window.location.href = "https://foodapp-admin-panel.vercel.app";
                }, 1500);
                return;
            }
            setShowLogin(false)
        } else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className='login-popup-container'>
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img src={assets.cross_icon} onClick={() => setShowLogin(false)} alt="" />
                </div>

                <div className="login-popup-inputs">

                    {/* Name field only for signup */}
                    {currState === 'SignUp' && (
                        <input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Your Name' required />
                    )}

                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Your Password' required />
                </div>

                <button type='submit'>
                    {currState === 'SignUp' ? 'Create Account' :
                        currState === 'Login' ? 'Login' : 'Admin Login'}
                </button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>

                {/* SWITCH LINKS */}
                {currState === 'Login' && (
                    <p className='links'>Create a new account? <span onClick={() => setCurrState('SignUp')}>Click here</span></p>
                )}

                {currState === 'SignUp' && (
                    <p className='links'>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                )}

                {/* ADMIN LOGIN LINK */}
                {currState !== "AdminLogin" && (
                    <p className='links'>Admin login? <span onClick={() => setCurrState('AdminLogin')}>Click here</span></p>
                )}

                {/* Normal login link inside admin */}
                {currState === "AdminLogin" && (
                    <p className='links'>Back to User Login? <span onClick={() => setCurrState('Login')}>Click here</span></p>
                )}

            </form>
        </div>
    )
}

export default LoginPopup
