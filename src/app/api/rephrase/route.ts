"use server"
import axios from 'axios'
import { auth } from '@/auth'
import { AllHistory } from '@/types'


export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})
    const {messages} = await req.json()
    const latestPrompt = messages[messages.length - 1].content
    
    // console.log("The full messages: ", messages, name)
    // console.log("The latest prompt: ", latestPrompt)

    try {
        const response = await axios.post(`${process.env.BASE_URL}/rephrase/`, {
            "body": latestPrompt
        }, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        }) 
        // console.log(response)
        const data = await response.data
        // console.log("The rephrase api response: ", data)
        
        return new Response(data, {status: 200})
        
    } catch (error) {
        console.error("The rephrase post request failed: ", error)
        return new Response(JSON.stringify(error), {status: 400})
    }
}

export async function GET() {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})

    try {
        const response = await axios.get(`${process.env.BASE_URL}/rephrase/`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        })
        const data = await response.data
        // console.log("chats with respect to the specified name: ", data)
        return new Response(JSON.stringify(data), {status: 200})
        
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify(error), {status: 400})
    }
}