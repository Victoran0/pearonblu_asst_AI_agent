// "use client"
import React  from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formData } from '@/types';
import { auth } from '@/auth';
import { SignIn } from '@/components/ui/auth-component';


const LoginPage = async () => {
    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    // const [error, setError] = useState('');
    // const [loading, setLoading] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState('false');
    // const router = useRouter()
    // const formRef = useRef<HTMLFormElement | null>(null)

    const session = await auth()
    if (!session?.user) return (
        <>  
            <main>
                <div className="loginContainer">
                    <h1>Welcome to Pearon Blu Assistant</h1>
                    <p className="subtitle">Log in now to access your account</p>

                    <SignIn />
                    
                    <p className='terms'>
                        By continuing you agree to Pearon Blu's <a href="#">Terms & Conditions</a>
                    </p>
                    <p className="footer">© 2024 Pearon Blu. All rights reserved.</p>
                </div>
            </main>
        </>
    );

    return (<div>You are signed in {session.username}</div>)

    
    
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


};

export default LoginPage;


 
// export default function SignIn() {
//   const credentialsAction = (formData: any) => {
//     signIn("credentials", formData)
//   }
 
//   return (
//     <form action={credentialsAction}>
//       <label htmlFor="credentials-email">
//         Email
//         <input type="username" id="credentials-username" name="username" />
//       </label>
//       <label htmlFor="credentials-password">
//         Password
//         <input type="password" id="credentials-password" name="password" />
//       </label>
//       <input type="submit" value="Sign In" />
//     </form>
//   )
// }