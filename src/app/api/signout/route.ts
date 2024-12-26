import { signOut } from "@/auth";
import { AuthError } from "next-auth";


export async function POST() {

    try {
        await signOut({redirectTo: '/login', redirect: true});
        return new Response("Sign out successful", {status: 200})
    } catch (error: any) {
        throw error;
        // return new Response("Sign out failed", {status: 401})
    }


}