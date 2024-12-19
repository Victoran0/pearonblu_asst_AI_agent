import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ChatBody from "./chat-body";

const Chat = async () => {
    const session = await auth()
    // if (!session?.user) return <SignIn />
    // return <ChatBody />
    return (
        <SessionProvider basePath="/api/auth" session={session}>
            <ChatBody />
        </SessionProvider>
    )
}

export default Chat