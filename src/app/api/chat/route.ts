"use server"
import axios from 'axios'
import { auth } from '@/auth'


export async function POST(req: Request) {
    const {messages} = await req.json()
    const latestPrompt = messages[messages.length - 1]
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})
    
    console.log("The full messages: ", messages)
    // console.log("The latest prompt: ", latestPrompt)

    try {
        const response = await axios.post(`${process.env.BASE_URL}/chat/`, {
            "body": latestPrompt, 
        }, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        }) 
        // console.log(response)
        const data = await response.data
        return new Response(data, {status: 200})
        
    } catch (error) {
        console.error("The chat post request failed: ", error)
        throw error
    }
}