import React, {useState, useEffect} from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1>Pearon Blu Assistant</h1>
      </div>
      <div className="grid w-full gap-2">
        <Button>
          <Link href="/chat">Continue to Chat</Link>
        </Button>
      </div>
    </div>
  );
}
