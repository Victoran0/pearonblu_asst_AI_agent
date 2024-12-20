import { signOut } from "@/auth";
import { AuthError } from "next-auth";


export async function POST() {

    try {
        await signOut({redirectTo: '/login', redirect: true});
    } catch (error: any) {
        throw error;
        // return new Response("Sign out failed", {status: 401})
    }
    return new Response("Sign out successful", {status: 200})


}