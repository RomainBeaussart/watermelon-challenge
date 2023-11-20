"use client";

import { useEffect, useState } from "react"
import { main } from "../lib/game"

export default function Home() {

  const [score, setScore] = useState(0)

  useEffect(() => main(setScore), [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Score : { score }</div>
      <div id="board-game"></div>
    </main>
  )
}
