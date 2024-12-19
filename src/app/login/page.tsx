import { auth } from '@/auth'
import React from 'react'
import  LoginBody from './login-body'

const LoginPage = async () => {
    const session = await auth()

    if (!session?.user) return <LoginBody />

    return (<div>You are signed in as {session.username}</div>)

}

export default LoginPage
