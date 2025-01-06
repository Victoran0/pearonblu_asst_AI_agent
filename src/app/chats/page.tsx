"use client"
import React from 'react'
import PastChats from './past_chats'
import AddNewChat from './add_new_chat'
import { useSession } from 'next-auth/react'
import { Separator } from '@/components/ui/separator'

const Chats = () => {
  // const {data: session} = useSession({required: true})

  return (
    <>
    <AddNewChat />
    <Separator />
     <PastChats/>
    </>
  )
}

export default Chats
