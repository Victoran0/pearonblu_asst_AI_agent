"use client"
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ChatBody from '@/app/chat/chat-body'
import { capitalizeUsername } from '@/app/utils'
import axios from 'axios'
import { Messages } from '@/types'


const CustomChat = () => {
  const {data: session} = useSession({required: true})
  const params = useParams()
  const [name, setName] = useState(capitalizeUsername(params?.slug as string))
  const searchParams = useSearchParams()
  const isNew = searchParams.get('new') === 'true';
  // console.log("The URL search params: ", isNew)
  // console.log("The URL params: ", params)
  const [chatHistory, setChatHistory] = useState<Messages[]>([]);
  
  useEffect(() => {

    if (name.includes('%20')) {
      setName(name => name.replace('%20', ' '))
    }

    if (isNew) return;

    const fetchChatHistory = async (name: string) => {
      try {
        const response = await axios.get('/api/chat', {
        params: { name }
      })
      const data = await response.data
      console.log("The chat history response: ", data)
      const data_arr = data['email_thread'].split('</eot>')
      data_arr.pop() // Remove the last empty item
      console.log("The data array: ", data_arr)

      const parsed_data_arr = data_arr.map((item: string) => {
        item = item.replace(/[\n\r]/g, "\\n"); //Escapes any newline (\n) or carriage return (\r) characters, making them valid JSON.
        return JSON.parse(item)
      });

      console.log("The parsed data array: ", parsed_data_arr)

      setChatHistory(parsed_data_arr as Messages[])

      } catch (error) {
        console.error("the chat history error: ", error)
      }
    }

    fetchChatHistory(name)
  }, [isNew, name])

  return (
    <>
      <ChatBody name={name} chat_history={chatHistory} />
    </>
  )
}

export default CustomChat