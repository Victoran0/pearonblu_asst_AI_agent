import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import React from 'react'

const Help = () => {
  const {data: session} = useSession({required: true})

  return (
    <div className="max-w-7xl max-h-fit min-h-[100vh] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-10"></div>
      <Separator />
      <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
          <h1 className='text-lg font-bold w-[100vw] colorGradText'>Pearon Blu Assistant Navigation and Functionalities</h1>
          </div>
      </div>
      <Separator /> 
      <div className='py-4 px-2'>
        <h1 className='text-lg font-bold mb-1'>Chat Page</h1>
        <p>The <b><i>chat</i></b> page</p> 
      </div>
      <Separator /> 
      <div className='py-4 px-2'>
        <h1 className='text-lg font-bold mb-1'>Chats Page</h1>
        <p>The <b><i>chats</i></b> page</p> 
      </div>
      <Separator /> 
      <div className='py-4 px-2'>
        <h1 className='text-lg font-bold mb-1'>Rephrase Page</h1>
        <p>The <b><i>rephrase</i></b> page</p> 
      </div>
      <Separator /> 
      <div className='py-4 px-2'>
        <h1 className='text-lg font-bold mb-1'>Doc Page</h1>
        <p>The <b><i>doc</i></b> page</p> 
      </div>
      <Separator /> 
    </div>
  )
}

export default Help