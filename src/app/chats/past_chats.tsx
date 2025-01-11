"use client"
import { AllHistory } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const PastChats = () => {
  const router = useRouter()
  const [history, setHistory] = useState<AllHistory[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      const response = await axios.get('/api/chat')
      const data: AllHistory[] = await response.data
      console.log("The history response: ", data)
      setHistory(data)
    }

    getHistory()
  }, [])

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className='text-lg font-bold colorGradText'>Previous Chats</h1>
          </div>
        </div>
      </div>
      <div className="h-4"></div>
        
      <div className='grid justify-items-center text-center text-gray-800 dark:text-white'>
        {history.length === 0 ? (
          <p>No history</p>
        ) : (
          <ul className='cursor-pointer'>
          {history.map((item, id) => (
            <li 
              key={id}
              className='mb-2 colorGradText hover-bbBox2' 
              onClick={() => router.push(`/chats/${item.customer_name}?new=false`)}
            >
              {item.customer_name}
            </li>
          ))}
          </ul>
        )}
      </div>
      <div className="h-4"></div>
    </>
  )
}

export default PastChats