"use client"
import React from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ChatBody from "./chat-body";
import { useSession } from "next-auth/react";
import LoginPage from "../login/page";

const Chat = () => {

    return <ChatBody />
}

export default Chat