"use server"

export async function POST(req: Request) {
    return new Response("I did get that though", {status: 200})
}