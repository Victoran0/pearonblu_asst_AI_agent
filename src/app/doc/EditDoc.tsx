"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    doc: string
    setDoc: (val: string) => void
    btnClicked: (val: boolean) => void
}

const EditDoc = ({doc, setDoc, btnClicked}: Props) => {
    const router = useRouter()

    const handleSubmit = async () => {
        try {
            const response = await axios.put('/api/doc', {document: doc})
            console.log('edited successfully: ', response.data)
            btnClicked(false)
        } catch (error) {
            console.error("there was an error while trying to edit the document: ", error)
        }
    }


    return (
        <div className="grid w-full gap-3">
                                <Textarea 
                                    className='bbBox2 p-6 h-[70vh]' 
                                    placeholder="Type your document here."
                                    value={doc}
                                    onChange={(e) => {setDoc(e.target.value); console.log("input changed: ", e.target.value)}}
                                />
                                <Button 
                                    className='hover:bg-gray-700'
                                    onClick={handleSubmit}
                                >
                                    Save
                                </Button>
                                <Button 
                                    onClick={() => btnClicked(false)} className='text-red-300 bg-gray-600'
                                >
                                    Cancel
                                </Button>
                            </div>
    )
}

export default EditDoc