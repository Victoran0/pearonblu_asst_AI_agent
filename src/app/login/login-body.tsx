"use client"
import React, {useState, useRef, FormEvent}  from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { formData } from '@/types';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

const LoginBody = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const formRef = useRef<HTMLFormElement | null>(null)
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState<boolean>(false);


    const credentialsAction = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setIsVerified(false)
        setError('');

        try {
            const response = await axios.post('/api/login', {username, password})
            console.log("the response: ", response.data)
            router.push('/chat')
        } catch (error) {
            console.error("error: ", error)
            setError('Login failed. Please check your credentials.');
        }finally {
            setLoading(false)
            setIsVerified(true)
        }
        
    }

    async function handleCaptchaSubmission(token: string | null) {
        try {
        if (token) {
            await axios.post("/api/recaptcha", {
                token 
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }
            });
            setIsVerified(true);
        }
        } catch (e) {
            setIsVerified(false);
        }
    }

    const handleCaptchaChange = (token: string | null) => {
        handleCaptchaSubmission(token);
    };

    function handleCaptchaExpired() {
        setIsVerified(false);
    }

    return (
        <>  
            <main>
                <div className="loginContainer">
                    <h1>Welcome to Pearon Blu Assistant</h1>
                    <p className="subtitle">Log in now to access your account</p>

                    <form 
                        className="loginForm" 
                        // action={credentialsAction}
                        onSubmit={credentialsAction}
                        ref={formRef}
                    >
                        <label htmlFor="email">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Username" 
                            required 
                            className="inputField" 
                        />
                        
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="inputField"
                        />
                        {error !== '' && <p className='text-red-400'>{error}</p>}
                        <div className='flex flex-col items-center w-full my-2'>
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
                            ref={recaptchaRef}
                            onChange={handleCaptchaChange}
                            size='normal'
                            style={{transform: 'scale(1.17)'}}
                            onExpired={handleCaptchaExpired}
                        />
                        </div>
                        <button 
                            type="submit" 
                            className="loginButton disabled:bg-gray-300" 
                            disabled={!isVerified}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                        
                        <div className="divider">
                        <span> | </span>
                        </div>
                    </form>
                    
                    <p className='terms'>
                        By continuing you agree to Pearon Blu's <a href="#">Terms & Conditions</a>
                    </p>
                    <p className="footer">© {new Date().getFullYear()} Pearon Blu. All rights reserved.</p>
                </div>
                <div className="h-10"></div>
            </main>
        </>
    );

};

export default LoginBody;
