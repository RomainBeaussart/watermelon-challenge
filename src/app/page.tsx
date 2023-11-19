"use client";

import { useEffect } from "react"
import { main } from "./game"

export default function Home() {

  useEffect(main, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div id="board-game"></div>      
    </main>
  )
}
