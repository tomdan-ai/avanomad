import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Smartphone } from 'lucide-react'

interface PhoneNumberDialogProps {
  isOpen: boolean
  onClose: (phoneNumber?: string) => void
  defaultValue?: string
  setInput?: (value: string) => void
}

export function PhoneNumberDialog ({
  isOpen,
  onClose,
  defaultValue = '07012345678',
  setInput
}: PhoneNumberDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState(defaultValue)
  const [error, setError] = useState('')

  // Handle the escape key to close the dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSubmit = () => {
    // Basic validation
    if (!phoneNumber || phoneNumber.length < 10 || isNaN(Number(phoneNumber))) {
      setError('Please enter a valid phone number')
      return
    }

    onClose(phoneNumber)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div
        className='bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-border/50'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center gap-3 mb-6'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary-blue/10'>
            <Smartphone className='h-5 w-5 text-primary-blue' />
          </div>
          <div>
            <h2 className='text-lg font-bold'>Phone Number</h2>
            <p className='text-sm text-muted-foreground'>
              Required for the USSD demo
            </p>
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium mb-2 text-muted-foreground'>
            Enter your phone number
          </label>
          <input
            type='tel'
            value={phoneNumber}
            onChange={e => {
              setInput?.('')
              setPhoneNumber(e.target.value)
              setError('')
            }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder='e.g. 07012345678'
            className='w-full h-12 px-4 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue transition-all text-base'
            autoFocus
          />
          {error && (
            <p className='text-red-500 text-sm mt-2 flex items-center gap-1'>
              <span>⚠</span> {error}
            </p>
          )}
        </div>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => onClose()}
            className='flex-1 h-11 rounded-xl'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className='flex-1 h-11 rounded-xl bg-gradient-to-r from-primary-red to-primary-blue text-white hover:opacity-90'
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
