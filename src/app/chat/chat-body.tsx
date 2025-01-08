"use client"
import React, {useState, useEffect, useRef} from "react";
import {AnimatePresence, motion} from 'framer-motion'
import { cn } from '@/lib/utils'
import { Send, SparkleIcon } from 'lucide-react'
import { toast } from 'sonner'
import {useChat} from 'ai/react'
import DOMPurify from 'dompurify'
import AsstHeader from "@/components/asst-header";
import { useTheme } from "next-themes";
import { Messages } from "@/types";


type Props = {
    name?: String
    chat_history?: Messages[]
}

const ChatBody = ({name = 'General', chat_history = []}: Props) => {
    const [body, setBody] = useState<string>("")
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [responseLoaded, setResponseLoaded] = useState<boolean>(false)
    const {theme} = useTheme()
    const loadingRef = useRef<HTMLDivElement | null>(null)  


  const {input, handleInputChange, handleSubmit, messages} = useChat({
        api: '/api/chat', // path to our server route
        body: { // the body of the request
          body, name
        },
        onError: (error: any) => {
            toast.error("internal server error")
            console.log("useChat error: ", error)
            setResponseLoaded(true)
            if (loadingRef.current) {
                loadingRef.current.remove()
            }
        },
        onFinish: () => {
            console.log("finished")
            setResponseLoaded(true)
            if (loadingRef.current) {
                loadingRef.current.remove()
            }
        },
        initialMessages: chat_history,
        streamProtocol: 'text'
    });

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages])

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        handleSubmit(event)
        if (responseLoaded) setResponseLoaded(false)
        console.log("submitted")
    }

    const formattedResponse = (text: string): string => {
        // because html does not automatically intrepet \n as line or paragraph spacing we use this function
        const formattedText = text.split('\n\n').map((paragraph) => // split the text by \n\n to get paragraphs
            paragraph.split("\n") // split each paragraphs by \n to get each line
            .map(line => line.trim()) // remove whitespaces on either end of the lines
            .join('<br />') // join the splitted line of each paragraphs by html line breaks
        )
        .map(paragraph => `<p>${paragraph}</p>`) // transform each splitted paragraph into html paragraphs
        .join("") // join then to form html paragraphed and line breaks texts
        return formattedText 
    }


  return (
    <div className="grid items-center justify-items-center min-h-screen p-2 pb-2 gap-2 sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <AsstHeader/>
      <div className={cn('max-[700px]:text-sm text-center px-2 py-1 w-[250px] text-xl', theme === 'light' ? 'text-gray-600' : "text-gray-200 bbBox2" )}>
            {name === "General" ? "General Chat": `${name}'s Chat`}
      </div>
      <div className="h-4"></div>

      <motion.div className='max-[700px]:p-2 grid w-full max-h-fit mb-16 pl-[55px] items-end py-2 pb-4 rounded-lg bg-gray-200 shadow-inner dark:bg-gray-900'>

        {messages.length > 0 && (
        <div className="h-[40vh] overflow-y-scroll w-full flex flex-col gap-2" id='message-container' ref={containerRef}>
            <AnimatePresence mode='sync'>
                {messages.map((message, index) => {
                    const uniqueId = `fallback-${index}`
                    return (
                        <React.Fragment key={uniqueId}>
                        <motion.div 
                            key={`${uniqueId}-head`}
                            layout='position' // only its position will animate
                            className={cn('z-10 mt-2 mr-4 max-w-[700px] break-words rounded-2xl bg-pink-200', 
                            {'self-end text-gray-900 dark:bg-[#702872] dark:text-gray-100': message.role === 'user', 
                            'self-start bg-blue-500 dark:bg-gray-900 text-white': message.role === 'assistant'
                            })}
                            layoutId={`container-[${messages.length-1}]`}
                            transition={{
                                type: 'easeOut',
                                duration: 0.2
                            }}
                        >   
                            {message.role === 'user' ? (
                                <div className='max-[700px]:text-sm px-3 py-2 text-[18px] leading-[20px]'>
                                    {message.content}
                                </div>
                            ) : (
                                <div 
                                    className='max-[700px]:text-sm px-3 py-2 text-[18px] leading-[20px]'
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(formattedResponse(message.content) ?? "",
                                        {USE_PROFILES: {html: true}})
                                    }}
                                />
                            )}
                        </motion.div>
                        {message.role === 'user' ? (
                        <motion.div 
                            ref={loadingRef}
                            key={`${uniqueId}-loading`}
                            className="z-10 mt-2 mr-4 max-w-[700px] break-words rounded-2xl dark:bg-gray-800 self-start bg-blue-500 text-white"
                            layoutId={`container-[${parseInt(message.id) === 0 ? -1.20 : parseInt(message.id) ** -3.22}]`}
                            transition={{
                                type: 'easeOut',
                                duration: 0.2
                            }}
                        >
                            {(!responseLoaded && messages[messages.length-1].role === 'user') && (
                                <div className="col-3">
                                    <div className="snippet" data-title="dot-pulse">
                                    <div className="stage">
                                        <div className="dot-pulse"></div>
                                    </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                        ): ""}
                        </React.Fragment>
                    )
                })}
            </AnimatePresence>
        </div>
        )}

        {messages.length > 0 && <div className='h-4'/>}
        
        <div>
            {messages.length === 0 && <div className='max-[700px]:h-[400px] mb-4 h-[40vh] flex items-center flex-col gap-10'>
                <div className="pt-10 flex items-center gap-4">
                    <SparkleIcon className='size-12 text-gray-600' />
                    <div className="flex items-start flex-col gap-2">
                        <p className="max-[700px]:text-sm text-gray-950 bgColorGrad text-2xl dark:text-gray-100">Let Pearon Blu assistant reply emails professionally</p>
                        <p className="max-[700px]:text-sm text-gray-500 text-2xl px-2 dark:text-gray-400 stretchText mt-2">Get response for customers' emails</p>
                    </div>
                </div>

                <div className="h-2"></div>
                <div className="pl-3 flex items-center gap-2 flex-wrap">
                    <span 
                    className={cn('max-[700px]:text-sm cursor-pointer bbBox2 px-2 py-1 text-xl', theme === 'light' ? 'text-gray-600' : "text-gray-200" )}
                    onClick={() => {
                        handleInputChange({target: {value: "I really enjoyed my stay at your hotel!, Thanks."}})
                    }}
                    >
                        I really enjoyed my stay at your hotel!, Thanks.
                    </span>
                    <span 
                    className={cn('max-[700px]:text-sm cursor-pointer bbBox2 px-2 py-1 text-xl', theme === 'light' ? 'text-gray-600' : "text-gray-200" )}
                    onClick={() => {
                        handleInputChange({target: {value: "Is there any executive room available?"}})
                    }}
                    >
                        Is there any executive room available?
                    </span>
                    <span 
                    className={cn('max-[700px]:text-sm cursor-pointer bbBox2 px-2 py-1 text-xl', theme === 'light' ? 'text-gray-600' : "text-gray-200" )}
                    onClick={() => {
                        handleInputChange({target: {value: "What time do i get my breakfast?"}})
                    }}
                    >
                        What time do i get my breakfast?
                    </span>
                    <span 
                    className={cn('max-[700px]:text-sm cursor-pointer bbBox2 px-2 py-1 text-xl', theme === 'light' ? 'text-gray-600' : "text-gray-200" )}
                    onClick={() => {
                        handleInputChange({target: {value: "I hated my stay at your hotel! you guys suck!!!"}})
                    }}
                    >
                        I hated my stay at your hotel! you guys suck!!!
                    </span>
                </div>
            </div>}
            <form className='flex max-[700px]:ml-5' onSubmit={handleFormSubmit} >
                <input 
                    type="text" className='max-[700px]:text-sm max-[700px]:placeholder:text-[13px] max-[700px]:h-8 max-[700px]:pl-3 max-[700px]:pr-[30px] py-1 w-full relative h-16 placeholder:text-[20px] flex-grow rounded-full border border-gray-200 bg-white pl-6 pr-24 text-[20px] outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1
                    dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:ring-blue-500/20 dark:focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-700'
                    placeholder="Customer's email"
                    value={input}
                    onChange={handleInputChange}
                />
                <motion.div 
                    key={messages.length}
                    layout='position'
                    layoutId={`container-[${messages.length}]`}
                    transition={{
                        type: 'eastOut',
                        duration: 0.2
                    }}
                    initial={{opacity: 0.6, zIndex:-1}}
                    animate={{opacity: 0.6, zIndex:-1}}
                    exit={{opacity:1, zIndex:1}}
                    className='pointer-events-none absolute z-10 flex h-9 w-[250px] items-center overflow-hidden break-words rounded-full bg-gray-200 [word-break:break-word] dark:bg-gray-800'
                >
                    <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
                        {input}
                    </div>
                </motion.div>
                
                <button title='send' type="submit" className='max-[700px]:size-7 max-[700px]:right-[35.5px] max-[700px]:top-[2px] relative right-[68px] top-1 ml-2 flex size-14 items-center justify-center rounded-full bg-gray-200 dark:border-y-gray-800 dark:bg-gray-600'>
                    <Send className='max-[700px]:size-2 size-6 text-gray-500 dark:text-gray-300' />
                </button>
            </form>
        </div>
        </motion.div>
    </div>
  )
}

export default ChatBody;