import { signIn } from "@/auth";
import { AuthError } from "next-auth";


export async function POST(req: Request) {
    const {username, password} = await req.json()
    
    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    // console.log("the username: ", username, "the password: ", password)

    try {
        const response = await signIn('credentials', formData, { redirectTo: "/chat" });
        console.log("the sign in response: ", response)
    } catch (error: any) {
        if (error instanceof AuthError) {
        switch (error.type) {
            case 'CredentialsSignin':
            return new Response('Invalid credentials.', {status: 401});
            default:
            return new Response('Something went wrong.', {status: 401});
        }
        }
        throw error;
    }
    return new Response("Login successful", {status: 200})


}