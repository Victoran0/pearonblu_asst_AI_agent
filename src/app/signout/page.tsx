"use client"
import axios from "axios"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
 
export default function SignOut() {
    const router = useRouter()

    useEffect(() => {
        const signout = async () => {
            try {
                const response = await axios.post('/api/signout')
                console.log("the response: ", response.data)
                router.push('/login')
                
            } catch (error) {
                console.error("error: ", error)
                toast.error('Sign out failed. Please check your credentials.');
            }
        }

        signout()

    }, [])

    return redirect("/login")

}