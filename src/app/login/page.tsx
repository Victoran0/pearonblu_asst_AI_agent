"use client"
import React, { useState, useEffect, useRef } from 'react';
import { signIn } from '@/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formData } from '@/types';


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState('false');
    const router = useRouter()
    const formRef = useRef<HTMLFormElement | null>(null)

    
    
    // useEffect(() => {
        
    // }, [router]);

    // const credentialsAction = async (formData: formData) => {
    //     await signIn("credentials", formData)
    //     .then(() => setLoading(false))
    // }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
            
        setLoading(true)
        setError('');

        if (formRef.current) {
            const loginData = new FormData(formRef?.current)
            console.log("the login data: ", loginData)
            
            try {
                const result: any = await signIn("credentials", loginData)
                if (result?.error) {
                    console.log("Login Failed", result.error)
                } else {
                    console.log("Login successful")
                    router.push('/chat')
                };
            } catch (error) {
                // error.response ? 
                // setError(Object.values(error.response.data)[0]) : 
                // setError(error.message)
                setError('Login failed. Please check your credentials.');
                // error.response ? error.response.data : error.message
                console.error('Login error: ', error);
            } finally {
                setLoading(false)
            }
        }


    };

    return (
        <>  
            <main>
                <div className="loginContainer">
                    <h1>Welcome to Pearon Blu Assistant</h1>
                    <p className="subtitle">Log in now to access your account</p>
                    
                    <form 
                        className="loginForm" 
                        onSubmit={handleLogin}
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
                        {error !== '' && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" className="loginButton" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                        
                        <div className="divider">
                        <span> | </span>
                        </div>
                    </form>
                    
                    <p className='terms'>
                        By continuing you agree to Pearon Blu's <a href="#">Terms & Conditions</a>
                    </p>
                    <p className="footer">© 2024 Pearon Blu. All rights reserved.</p>
                </div>
            </main>
        </>
    );
};

export default LoginPage;
