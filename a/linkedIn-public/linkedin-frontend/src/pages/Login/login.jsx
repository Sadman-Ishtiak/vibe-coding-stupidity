import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import GoogleLoginComp from '../../components/GoogleLogin/googleLoginComp'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'


const Login = (props) => {
    const navigate = useNavigate();
    const [loginField, setLoginField] = useState({ email: "", password: "" })

    const onChangeInput = (event, key) => {
        setLoginField({ ...loginField, [key]: event.target.value })
    }

    const handleLogin = async () => {
        if (loginField.email.trim().length === 0 || loginField.password.trim().length === 0) {
            return toast.error("Please fill all credentials")
        }
        await axios.post('http://localhost:4000/api/auth/login',loginField,{withCredentials:true}).then((res) => {
             localStorage.setItem('isLogin', true);
             props.changeLoginValue(true);
             navigate('/feeds');
        }).catch(err => {
            console.log(err)
            toast.error(err?.response?.data?.error)
        })
    }

    const handleDevLogin = async () => {
        if (import.meta.env.VITE_ENABLE_DEV_LOGIN !== 'true') return;
        try {
            const payload = { email: 'dev@example.com', f_name: 'Dev Tester' };
            const res = await axios.post('http://localhost:4000/api/auth/dev-login', payload, { withCredentials: true });
            if (res?.data?.user) {
                localStorage.setItem('isLogin', true);
                props.changeLoginValue(true);
                navigate('/feeds');
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.error || 'Dev login failed');
        }
    }
    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <div className='w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10'>
                <div className="text-3xl">Sign In</div>
                <div className='my-5'>
                    <GoogleLoginComp changeLoginValue={props.changeLoginValue}/>
                </div>

                <div className="flex items-center gap-2">
                    <div className="border-b-1 border-gray-400 w-[45%]" /> <div>or</div><div className="border-b-1 border-gray-400 w-[45%] my-6" />
                </div>

                <div className='flex flex-col gap-4'>
                    <input type="text" onChange={(e)=>onChangeInput(e,'email')} value={loginField.email} placeholder="Email" className="w-full text-xl border-2 rounded-lg px-5 py-3 border-gray-400" />
                    <input type="password" onChange={(e)=>onChangeInput(e,'password')} value={loginField.password} placeholder="Password" className="w-full text-xl border-2 rounded-lg px-5 py-3 border-gray-400" />



                    <div onClick={handleLogin} className="w-full hover:bg-blue-900 bg-blue-800 text-white py-3 px-4 rounded-xl text-center text-xl cursor-pointer my-2">
                        Login
                    </div>
                    {import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true' && (
                        <div onClick={handleDevLogin} className="w/full hover:bg-gray-900 bg-gray-800 text-white py-3 px-4 rounded-xl text-center text-xl cursor-pointer">
                            Dev Login (no OAuth)
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 mb-14">New to LinkedIn? <Link to='/signUp' className="text-blue-800">Join Now</Link></div>
            <ToastContainer />
        </div>
    )
}

export default Login