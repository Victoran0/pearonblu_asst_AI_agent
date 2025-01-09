"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EditDoc from './EditDoc'
import { formattedResponse } from '../utils'
import DOMPurify from 'dompurify'
import { useSession } from 'next-auth/react'

const Doc = () => {
    const {data: session} = useSession({required: true})
    const [doc, setDoc] = useState("");
    const [addDocBtnClicked, setAddDocBtnClicked] = useState(false);
    const [modifyDocBtnClicked, setModifyDocBtnClicked] = useState(false);

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const response = await axios.get('/api/doc')
                console.log("Got the doc: ", response.data)
                setDoc(response.data)
            } catch (error) {
                console.error("could not the doc: ", error)
            }
        }

        fetchDoc()

    }, [addDocBtnClicked, modifyDocBtnClicked])

    return (
        <div className="max-w-7xl max-h-fit min-h-[100vh] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0">
                <h1 className='text-xl font-bold text-gray-800 dark:text-white'>Pricing and Services Document</h1>
                </div>
            </div>
            <div className="h-4"></div>
        
            <div className='grid justify-items-center text-gray-800 dark:text-white'>
                {doc === "" ? 
                    (addDocBtnClicked ? (
                        <EditDoc  
                            doc={doc}
                            setDoc={setDoc}
                            btnClicked={setAddDocBtnClicked}
                        /> 
                    ) : (
                        <Button className='text-xl bgColorGrad' onClick={() => setAddDocBtnClicked(true)}>
                            Add Document
                        </Button>
                    ))

                : ( modifyDocBtnClicked ? (
                            <EditDoc  
                                doc={doc}
                                setDoc={setDoc}
                                btnClicked={setModifyDocBtnClicked}
                            /> 
                        ) : (
                            <div className='grid w-full items-center'>
                                <div 
                                    className='bbBox2 text-sm p-6 h-[70vh] overflow-scroll'
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(formattedResponse(doc) ?? "",
                                        {USE_PROFILES: {html: true}})
                                    }}
                                />
                                <div className="h-4"></div>
                                <Button className='text-xl bgColorGrad' onClick={() => setModifyDocBtnClicked(true)}>
                                    Modify
                                </Button>
                            </div>
                        )
                )}
                
            </div>
        </div>
    )
}

export default Doc

{/* <div>
    <div>{doc}</div>
    <div className="h-4"></div>
    <Button className='text-xl bgColorGrad' onClick={() => setModifyDocBtnClicked(true)}>
    Modify
    </Button>
</div> */}