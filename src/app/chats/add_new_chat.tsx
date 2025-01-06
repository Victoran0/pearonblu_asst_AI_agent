"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



const FormSchema = z.object({
  username: z.string(),
})

const AddNewChat = () => {
  const router = useRouter()
  const [addNewChatClicked, setAddNewChatClicked] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "General",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data?.username === '') {
      setShowError(true)
      return
    }
    router.push(`/chats/${data.username}`)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className='text-xl font-bold text-gray-800 dark:text-white'>New Chat</h1>
          </div>
        </div>
      </div>
      <div className="h-4"></div>
        
      <div className='grid justify-items-center text-gray-800 dark:text-white'>
        {addNewChatClicked ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer's Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Name is General by default and the history will not be consistent.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showError && <p className='text-red-300 text-sm'>Name can not be empty</p>}
              <Button type="submit">Submit</Button>
              <Button 
                className='ml-5 
                text-red-300' 
                type="reset"
                onClick={() => setAddNewChatClicked(false)}
              >
                Cancel
              </Button>
            </form>
          </Form>
        ) : (
          <Button className='text-xl bgColorGrad' onClick={() => setAddNewChatClicked(true)}>
          Add new Chat
        </Button>
        )}
      </div>
      <div className="h-4"></div>
    </>

  )
}

export default AddNewChat
