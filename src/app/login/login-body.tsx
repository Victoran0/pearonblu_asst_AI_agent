"use client"
import React, {useState, useRef, FormEvent}  from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formData } from '@/types';
import axios from 'axios';


const LoginBody = ({provider}: {provider?: string}) => {
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

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
            
//         setLoading(true)
//         setError('');

//         if (formRef.current) {
//             const form_data: any = new FormData(formRef.current)

//             for (const [key, value] of form_data) {
//                 console.log(`The key is ${key} and the value is ${value}`)
//             }

//             try {
//                 const result: any = signIn("credentials", form_data)
//                 console.log("the sign in result: ", result)
//                 if (result?.error) {
//                     console.log("Login Failed", result.error)
//                 } else {
//                     console.log("Login successful")
//                     router.push('/chat')
//                 };
//             } catch (error) {
//                 // error.response ? 
//                 // setError(Object.values(error.response.data)[0]) : 
//                 // setError(error.message)
//                 setError('Login failed. Please check your credentials.');
//                 // error.response ? error.response.data : error.message
//                 console.error('Login error: ', error);
//             } finally {
//                 setLoading(false)
//             }
//         }
//     };

    const credentialsAction = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setError('');

        try {
            const response = await axios.post('/api/login', {username, password})
            console.log("the response: ", response.data)
            
        } catch (error) {
            console.error("error: ", error)
            setError('Login failed. Please check your credentials.');
        }finally {
            setLoading(false)
        }
        
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
                <div className="h-10"></div>
            </main>
        </>
    );

};

export default LoginBody;

// "use client"
// import axios from "axios"
// import { signIn } from "next-auth/react"

// export function LoginBody() {
//   const credentialsAction = async (formData: any) => {
//     // signIn("credentials", formData)
//     // console.log(formData)
//     // for (const [key, value] of formData) {
//     //     console.log(`The key is ${key} and the value is ${value}`)
//     // }
//     const signin = await axios.post('/api/login', {username: "nowayyy", password: "whynowwww"})
    
//     console.log("the signin response: ", signin)
//   }
 
//   return (
//     <form action={credentialsAction}>
//       <label htmlFor="credentials-username">
//         Email
//         <input type="text" id="credentials-username" name="username" />
//       </label>
//       <label htmlFor="credentials-password">
//         Password
//         <input type="password" id="credentials-password" name="password" />
//       </label>
//       <input type="submit" value="Sign In" />
//     </form>
//   )
// }

