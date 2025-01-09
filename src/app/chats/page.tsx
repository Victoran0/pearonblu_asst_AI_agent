"use client"
import React from 'react'
import PastChats from './past_chats'
import AddNewChat from './add_new_chat'
import { useSession } from 'next-auth/react'
import { Separator } from '@/components/ui/separator'

const Chats = () => {
  const {data: session} = useSession({required: true})

  return (
    <>
      <div className="h-10"></div>
      <Separator />
      <AddNewChat />
      <Separator />
      <PastChats />
      <Separator />
      <div className="h-[280px]"></div>
    </>
  )
}

export default Chats
