import axios from "axios";


export async function POST(req:Request) {
    const loginData = await req.json()
    console.log('the login data: ', loginData)
    return new Response("The login endpoint is hit", {status: 200})
}
