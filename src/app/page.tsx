"use client"
import React, {useState, useEffect} from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import ModeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import AsstHeader from "@/components/asst-header";

export default function Home() {
  const {setTheme} = useTheme()

  useEffect(() => {
    setTheme("dark")
  }, [])
  
  return (
    <div className="grid w-full grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <AsstHeader />
      <Link href="/chat">
        <h1 className="text-8xl text-zinc-900 colorGradText">Continue to Chat</h1>
      </Link>

      <div className="fixed bottom-5 right-5">
        
      </div>
    </div>
  );
}

// ADD THE TOGGLE DARK MODE AND ADMIN LOGIN FUNCTIONALITY
// isStaff status to enter the /admin page
// admin panel to create and destroy login credentials
// only admin can create / delete a user for the application
// create a /admin where the admin can login and do their work
// request for a user's username and password on the home page before showing the chat page
// if they are logged in (use session cookies), redirect to the chat page, else redirect to login page
// add a newchat option to create a unique threadId, also we can save old chats by their threadId 
