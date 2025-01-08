"use client"
import React from "react";
import ChatBody from "./chat-body";
import { useSession } from "next-auth/react";

const Chat = () => {
    const {data: session, update} = useSession({required: true})

    return <ChatBody />
}

export default Chat