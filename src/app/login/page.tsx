"use client"
import React from 'react'
import  LoginBody from './login-body'
import { useSession } from 'next-auth/react'
import Chat from '../chat/page'

const LoginPage = () => {
    const {data: session} = useSession()

    if (!session?.user) return <LoginBody />

    return (<Chat/>)

}

export default LoginPage
