import React from 'react'
import ModeToggle from './theme-toggle'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const AsstHeader = () => {
    const {theme} = useTheme()

    return (
        <div className={cn("flex w-fit items-center colorGradText", theme === "light"?"bdBox":"")}>
            <Link href="/chat">
                <h1 className="pl-5 text-2xl py-2" >Pearon Blu Assistant</h1>
            </Link>
            <div className="w-8"></div>
            <div className="pr-2">
                <ModeToggle />
            </div>
        </div>
    )
}

export default AsstHeader