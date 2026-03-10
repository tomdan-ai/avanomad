'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { processUSSD, clearUSSDSession } from '@/services/ussdService'
import { PhoneNumberDialog } from '@/components/'
import { BarChart, BatteryMediumIcon, Clock, Mail, RotateCcw } from 'lucide-react'

const KEYPAD_LABELS: Record<string, string> = {
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ'
}

export function Phone () {
  const [input, setInput] = useState('')
  const [displayText, setDisplayText] = useState('Enter USSD code')
  const [isProcessing, setIsProcessing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [ussdText, setUssdText] = useState('')
  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  // Check for saved phone number on first load
  useEffect(() => {
    const savedPhone = localStorage.getItem('ussd_phone_number')
    if (savedPhone) {
      setPhoneNumber(savedPhone)
    } else {
      setShowPhoneDialog(true)
    }
  }, [])

  // Handle dialog close and phone number submission
  const handlePhoneDialogClose = (phone?: string) => {
    if (phone) {
      setPhoneNumber(phone)
      localStorage.setItem('ussd_phone_number', phone)
    }
    setShowPhoneDialog(false)
  }

  // Handle button press
  const handleButtonPress = (value: string) => {
    if (isProcessing) return

    if (value === 'call') {
      handleCall()
    } else if (value === 'clear') {
      if (input.length === 0) {
        // Reset session on clear when input is empty
        clearUSSDSession()
        setUssdText('')
        setDisplayText('Enter USSD code')
      } else {
        setInput(prev => prev.slice(0, -1))
      }
    } else {
      setInput(prev => prev + value)
    }
  }

  // Handle call/send
  const handleCall = async () => {
    if (input.length === 0 || !phoneNumber) return

    setIsProcessing(true)
    setDisplayText(`Dialing ${input}...`)

    try {
      // Determine if this is initial code or a response
      let textToSend = input
      if (input.startsWith('*') && input.endsWith('#')) {
        // This is a new USSD code - reset the session text
        setUssdText('')
        textToSend = ''
      } else if (ussdText) {
        // This is a response to an existing session
        textToSend = ussdText ? `${ussdText}*${input}` : input
      }

      // Update the cumulative USSD text
      if (ussdText && input) {
        setUssdText(prev => `${prev}*${input}`)
      } else if (input.startsWith('*') && input.endsWith('#')) {
        // Start of new session with a USSD code
        setUssdText('')
      } else {
        setUssdText(input)
      }

      // Process the USSD request
      const response = await processUSSD(phoneNumber, textToSend)

      // Display the response
      setDisplayText(response.replace(/^(CON|END)\s/, ''))

      // Clear input only if the session continues
      if (response.startsWith('CON')) {
        setInput('')
      } else {
        // Session ended, reset everything
        setInput('')
        setUssdText('')
      }
    } catch (error) {
      console.error('Error processing USSD request:', error)
      setDisplayText('Connection error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleButtonPress(e.key)
      } else if (e.key === '*') {
        handleButtonPress('*')
      } else if (e.key === '#') {
        handleButtonPress('#')
      } else if (e.key === 'Enter') {
        handleCall()
      } else if (e.key === 'Backspace') {
        handleButtonPress('clear')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [input, isProcessing])

  // Focus the phone when clicked
  const focusPhone = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Render screen content
  const renderScreen = () => {
    if (isProcessing) {
      return (
        <div className='text-center'>
          <div className='inline-block h-4 w-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin mb-1' />
          <div className='text-xs'>Processing...</div>
        </div>
      )
    }

    return <div className='whitespace-pre-wrap'>{displayText}</div>
  }

  return (
    <>
      <div
        className='relative w-[280px] sm:w-[300px] bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-[36px] shadow-2xl shadow-black/20 dark:shadow-black/40 p-5 sm:p-6 flex flex-col border border-gray-400 dark:border-gray-600'
        onClick={focusPhone}
        tabIndex={0}
        ref={inputRef}
      >
        {/* Phone top speaker */}
        <div className='w-14 h-1.5 bg-gray-500/60 rounded-full mx-auto mb-3' />

        {/* Screen */}
        <div className='bg-[#a4c0a0] border-[3px] border-gray-500 dark:border-gray-600 rounded-lg p-3 h-[170px] sm:h-[180px] flex flex-col shadow-inner'>
          {/* Status bar */}
          <div className='text-[10px] text-gray-700 mb-1.5 flex justify-between items-center'>
            <div className='flex gap-1 items-center'>
              <span className='relative'>
                <BarChart className='h-3.5 w-3.5 ml-[1px]' />
                <p className='absolute -top-0.5 left-0.5 text-[7px] font-bold'>1</p>
              </span>
              <span className='relative'>
                <BarChart className='h-3.5 w-3.5 ml-[1px]' />
                <p className='absolute -top-0.5 left-0.5 text-[7px] font-bold'>2</p>
              </span>
            </div>
            <div className='flex gap-1.5 items-center'>
              <Mail className='h-3.5 w-3.5' />
              <Clock className='h-3.5 w-3.5' />
              <BatteryMediumIcon className='h-4 w-4' />
            </div>
          </div>

          {/* Screen content */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            <div className='text-black font-mono text-xs sm:text-sm whitespace-pre-line flex-1 overflow-y-auto'>
              {renderScreen()}
            </div>
            <div className='text-black font-mono text-base sm:text-lg mt-1 border-t border-gray-600/20 pt-1 min-h-[24px]'>
              {input}
              <span className='animate-pulse'>|</span>
            </div>
          </div>
        </div>

        {/* Brand */}
        <p className='text-center text-sm font-bold tracking-[0.2em] text-gray-600 dark:text-gray-400 my-2.5'>
          NOKIA
        </p>

        {/* Action buttons */}
        <div className='grid grid-cols-3 gap-2 mb-3'>
          <Button
            variant='outline'
            className='bg-gray-400/80 dark:bg-gray-600/80 hover:bg-gray-500 h-10 sm:h-11 rounded-lg text-xs font-medium border-0 shadow-sm active:scale-95 transition-transform'
            onClick={() => handleButtonPress('clear')}
          >
            Clear
          </Button>
          <Button
            variant='outline'
            className='bg-green-600/90 hover:bg-green-700 text-white h-10 sm:h-11 rounded-lg col-span-2 text-xs font-medium border-0 shadow-sm active:scale-95 transition-transform'
            onClick={() => handleCall()}
          >
            📞 Dial
          </Button>
        </div>

        {/* Keypad */}
        <div className='grid grid-cols-3 gap-2 sm:gap-2.5'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(num => (
            <Button
              key={num}
              variant='outline'
              className='bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 h-12 sm:h-13 text-lg font-bold rounded-full border-0 shadow-sm flex flex-col items-center justify-center gap-0 active:scale-90 transition-transform duration-100'
              onClick={() => handleButtonPress(num.toString())}
            >
              <span>{num}</span>
              {KEYPAD_LABELS[num.toString()] && (
                <span className='text-[7px] sm:text-[8px] font-normal tracking-wider text-gray-500 dark:text-gray-400 -mt-1'>
                  {KEYPAD_LABELS[num.toString()]}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Connection status */}
        <div className='text-[10px] sm:text-xs text-center mt-2.5'>
          {phoneNumber ? (
            <span className='text-green-600 dark:text-green-400 font-medium'>
              ● Connected: {phoneNumber.substring(0, 4)}***
              {phoneNumber.substring(phoneNumber.length - 2)}
            </span>
          ) : (
            <span className='text-red-500 font-medium'>● Not connected</span>
          )}
        </div>

        {/* Reset button */}
        <Button
          variant='ghost'
          className='text-xs mt-2 h-8 gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
          onClick={() => {
            clearUSSDSession()
            setUssdText('')
            setDisplayText('Enter USSD code')
            setInput('')
          }}
        >
          <RotateCcw className='h-3 w-3' />
          Reset Session
        </Button>
      </div>

      {/* Phone Number Dialog */}
      <PhoneNumberDialog
        isOpen={showPhoneDialog}
        onClose={handlePhoneDialogClose}
        defaultValue={phoneNumber || '07012345678'}
        setInput={setInput}
      />
    </>
  )
}
