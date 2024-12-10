"use server"
import axios from 'axios'

const BASE_URL = "http://127.0.0.1:8000/api/chat/"

export async function POST(req: Request) {
    const {messages} = await req.json()
    const latestPrompt = messages[messages.length - 1]
    // console.log("The full messages: ", messages)
    // console.log("The latest prompt: ", latestPrompt)
    try {
        const response = await axios.post(BASE_URL, {"body": latestPrompt})
        console.log(response)
        return new Response(await response.data, {status: 200})
        
    } catch (error) {
        console.error("The chat post request failed: ", error)
        throw error
    }
}