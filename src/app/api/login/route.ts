import { signIn } from "@/auth";
import { AuthError } from "next-auth";


export async function POST(req: Request) {
    const {username, password} = await req.json()
    
    try {
        const response = await signIn('credentials', {
            redirect: true, // Allow redirection
            redirectTo: '/chat',
            username: username,
            password: password,
        });
        
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