"use client"
import { signOut } from "next-auth/react"
import { redirect } from "next/navigation"
 
export default function SignOut() {
  return redirect("/login")
}