import React, {useState, useEffect} from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import ModeToggle from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center">
        <h1>Pearon Blu Assistant</h1>
        <div className="w-10"></div>
        <ModeToggle />
      </div>
      <div className="grid w-full gap-2">
        <Button>
          <Link href="/chat">Continue to Chat</Link>
        </Button>
      </div>

      <div className="fixed bottom-5 right-5">
        
      </div>
    </div>
  );
}

// ADD THE TOGGLE DARK MODE AND ADMIN LOGIN FUNCTIONALITY
// two authentication class, admin and user
// admin panel to create and destroy login credentials
// only admin can create / delete a user for the application
// create a /admin where the admin can login and do their work
// request for a user's username and password on the home page before showing the chat page
// if they are logged in (use session cookies), redirect to the chat page, else redirect to login page
