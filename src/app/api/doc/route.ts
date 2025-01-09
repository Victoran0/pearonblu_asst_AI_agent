"use server"
import axios from 'axios'
import { auth } from '@/auth'

export async function PUT(req: Request) {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})
    const {document} = await req.json()
    if (!document) return new Response("Document is required", {status: 400})

    try {
        await axios.put(`${process.env.BASE_URL}/doc/2/`, 
            {"document": document}, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            }
        )
        // const data = await response.data
        // console.log("the PUT response: ", data)
        return new Response("Document updated successfully", {status: 200})
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify(error), {status: 400})
    }

}

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user) return new Response("Unauthorized", {status: 401})

    try {
        const response = await axios.get(`${process.env.BASE_URL}/doc/2/`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            }
        )
        const data = await response.data
        // console.log("The GET response: ", data.document)
        return new Response(JSON.stringify(data.document), {status: 200})
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify(error), {status: 400})
    }
}