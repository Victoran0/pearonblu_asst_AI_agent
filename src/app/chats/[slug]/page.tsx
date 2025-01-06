"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ChatBody from '@/app/chat/chat-body'
import { capitalizeUsername } from '@/app/capitalize'
import axios from 'axios'
import { Messages } from '@/types'


const CustomChat = () => {
  // const {data: session} = useSession({required: true})
  const params = useParams()
  const name = capitalizeUsername(params?.slug as string)

  const chatHistory = async (name: string) => {
    try {
      const response = await axios.get('/api/chat', {
      params: {
        name
      }
    })
    const data = await response.data
    console.log("The chat history response: ", data)
    const data_arr = data.split('</eot>')
    data_arr.pop([data_arr.length-1])
    console.log(data_arr)

    const parsed_data_arr = data_arr.map((item: string) => JSON.parse(item))
    console.log(parsed_data_arr)

    return parsed_data_arr as Messages[]
    } catch (error) {
      console.error("the chat history error: ", error)
      return []
    }
  }

  return (
    <>
      <ChatBody name={name} chat_history={chatHistory(name)} />
    </>
  )
}

export default CustomChat