"use server"
import axios from 'axios'
import { auth } from '@/auth'


export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})
    const {messages} = await req.json()
    const latestPrompt = messages[messages.length - 1].content
    
    console.log("The full messages: ", messages)
    console.log("The latest prompt: ", latestPrompt)

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
        console.log("The chat api response: ", data)
        
        return new Response(data, {status: 200})
        
    } catch (error) {
        console.error("The chat post request failed: ", error)
        throw error
    }
}

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})
    // console.log("the request: ", req)
    
    const {searchParams} = new URL(req.url)
    const name = searchParams?.get('name')

    console.log("The customer name: ", name)

    if (name) {
        console.log("name sent")
        try {
            const response = await axios.get(`${process.env.BASE_URL}/chat/${name}/`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            })
            const data = await response.data
            console.log("chats with respect to the specified name: ", data)
            return new Response(data, {status: 200})
            
        } catch (error) {
            console.log(error)
            throw error
        }
    } else {
        console.log("NO name sent")
        try {
            const response = await axios.get(`${process.env.BASE_URL}/chat/`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            })
            const data = await response.data
            console.log("PRevious chats: ", data)
            return new Response(data, {status: 200})

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    // return new Response("Get request is done!", {status: 200})
}