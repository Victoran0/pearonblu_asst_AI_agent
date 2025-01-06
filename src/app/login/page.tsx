"use client"
import React from 'react'
import  LoginBody from './login-body'
import { useSession } from 'next-auth/react'
import Chat from '../chat/page'
import { redirect } from 'next/navigation'
import type { NextPage } from "next";

const LoginPage: NextPage = () => {
    const {data: session} = useSession()
    // console.log("the session: ", session)

    if (!session?.username) return <LoginBody />

    return redirect("/chat")

}

export default LoginPage
