import React from 'react'
import ModeToggle from './theme-toggle'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const AsstHeader = () => {
    const {theme} = useTheme()

    return (
        <div className={cn("flex w-fit items-center colorGradText", theme === "light"?"bdBox":"")}>
            <h1 className="max-[700px]:text-[19.76px] pl-5 lg:text-2xl text-2xl py-2 cursor-pointer" >Pearon Blu Assistant</h1>
            <div className="w-8"></div>
            <div className="pr-2">
                <ModeToggle />
            </div>
        </div>
    )
}

export default AsstHeader