"use server"
import axios from 'axios'
import { auth } from '@/auth'
import { AllHistory } from '@/types'


export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})
    const {messages, name} = await req.json()
    const latestPrompt = messages[messages.length - 1].content
    
    // console.log("The full messages: ", messages, name)
    // console.log("The latest prompt: ", latestPrompt)

    try {
        const response = await axios.post(`${process.env.BASE_URL}/chat/`, {
            "body": latestPrompt, 
            "name": name
        }, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        }) 
        // console.log(response)
        const data = await response.data
        // console.log("The chat api response: ", data)
        
        return new Response(data, {status: 200})
        
    } catch (error) {
        console.error("The chat post request failed: ", error)
        return new Response(JSON.stringify(error), {status: 400})
    }
}

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})
    // console.log("the request: ", req)
    
    const {searchParams} = new URL(req.url)
    const name = searchParams?.get('name')

    // console.log("The customer name: ", name)

    if (name) {
        // console.log("name sent, get chat with respect to that name")
        try {
            const response = await axios.get(`${process.env.BASE_URL}/chat/${name}/`, {
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
    } else {
        // console.log("get all chats")
        try {
            const response = await axios.get(`${process.env.BASE_URL}/chat/`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            })
            const data: AllHistory[] = await response.data
            data.sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())

            // console.log("PRevious chats: ", data)
            return new Response(JSON.stringify(data), {status: 200})

        } catch (error) {
            console.error(error)
            return new Response(JSON.stringify(error), {status: 400})
        }
    }
}