import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginPopup = ({ setShowLogin }) => {

    const navigate = useNavigate();
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

        if (currState === "Login") newUrl += "/api/user/login"
        if (currState === "SignUp") newUrl += "/api/user/register"
        if (currState === "AdminLogin") newUrl += "/api/admin/login"

        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token);
            toast.success(response.data.message)

            if (currState === "AdminLogin") {
                setTimeout(() => {
                    window.location.href = "https://foodapp-admin-panel.vercel.app";
                }, 500);
                return;
            }

            // Normal user redirect
            setTimeout(() => {
                navigate("/");   // 🔥 Now working!
            }, 500);

            setShowLogin(false)
        }
    }

    return (
        <> ... </>
    )
}

export default LoginPopup
