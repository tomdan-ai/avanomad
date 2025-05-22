"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export function Phone() {
  const [input, setInput] = useState("")
  const [displayText, setDisplayText] = useState("Enter USSD code")
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  // Handle button press
  const handleButtonPress = (value: string) => {
    if (isProcessing) return

    if (value === "call") {
      handleCall()
    } else if (value === "clear") {
      setInput((prev) => prev.slice(0, -1))
    } else {
      setInput((prev) => prev + value)
    }
  }

  // Handle call/send
  const handleCall = () => {
    if (input.length === 0) return

    setIsProcessing(true)
    setDisplayText(`Dialing ${input}...`)

    // Simulate USSD response
    setTimeout(() => {
      if (input === "*123#") {
        setDisplayText("Avanomad\n1. Check Balance\n2. Buy Crypto\n3. Sell Crypto\n4. Transaction History")
        setInput("")
      } else if (input.startsWith("*")) {
        setDisplayText("USSD code not recognized")
        setInput("")
      } else {
        setDisplayText(`Calling ${input}...`)
      }
      setIsProcessing(false)
    }, 1500)
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleButtonPress(e.key)
      } else if (e.key === "*") {
        handleButtonPress("*")
      } else if (e.key === "#") {
        handleButtonPress("#")
      } else if (e.key === "Enter") {
        handleCall()
      } else if (e.key === "Backspace") {
        handleButtonPress("clear")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [input, isProcessing])

  // Focus the phone when clicked
  const focusPhone = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className="relative w-[300px] h-[600px] bg-gray-300 rounded-[40px] shadow-xl p-6 flex flex-col"
      onClick={focusPhone}
      tabIndex={0}
      ref={inputRef}
    >
      {/* Phone top section with speaker */}
      <div className="w-16 h-1 bg-gray-500 rounded-full mx-auto mb-4"></div>

      {/* Screen */}
      <div className="bg-[#a4c0a0] border-4 border-gray-500 rounded-lg p-3 mb-6 h-[180px] flex flex-col">
        <div className="text-xs text-gray-700 mb-1 flex justify-between">
          <span>NOKIA</span>
          <span>Battery: ▓▓▓▒░</span>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-black font-mono text-sm whitespace-pre-line flex-1">{displayText}</div>
          <div className="text-black font-mono text-lg mt-2">{input}</div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button
          variant="outline"
          className="bg-gray-400 hover:bg-gray-500 h-12 rounded-md"
          onClick={() => handleButtonPress("clear")}
        >
          Clear
        </Button>
        <Button
          variant="outline"
          className="bg-gray-400 hover:bg-gray-500 h-12 rounded-md col-span-2"
          onClick={() => handleCall()}
        >
          Call
        </Button>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 h-14 text-xl font-bold rounded-full"
            onClick={() => handleButtonPress(num.toString())}
          >
            {num}
            {num === 1 && <div className="text-[8px] mt-1"></div>}
            {num === 2 && <div className="text-[8px] mt-1">ABC</div>}
            {num === 3 && <div className="text-[8px] mt-1">DEF</div>}
            {num === 4 && <div className="text-[8px] mt-1">GHI</div>}
            {num === 5 && <div className="text-[8px] mt-1">JKL</div>}
            {num === 6 && <div className="text-[8px] mt-1">MNO</div>}
            {num === 7 && <div className="text-[8px] mt-1">PQRS</div>}
            {num === 8 && <div className="text-[8px] mt-1">TUV</div>}
            {num === 9 && <div className="text-[8px] mt-1">WXYZ</div>}
          </Button>
        ))}
      </div>
    </div>
  )
}