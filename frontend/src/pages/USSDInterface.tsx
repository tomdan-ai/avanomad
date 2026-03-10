'use client'
import { Phone } from '@/components/Phone'
import { NavBar, Footer } from '@/components'
import { Info } from 'lucide-react'

export default function USSDInterface () {
  return (
    <div className='min-h-screen flex flex-col'>
      <NavBar />

      <main className='flex-1 flex items-center justify-center bg-gradient-to-b from-muted/30 to-transparent'>
        <div className='w-full max-w-4xl mx-auto px-5 sm:px-6 py-28 sm:py-32'>
          {/* Header */}
          <div className='text-center mb-10 md:mb-14'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
              Try the USSD Demo
            </h1>
            <p className='text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed'>
              Experience how Avanomad works on feature phones. Dial{' '}
              <code className='px-2 py-0.5 rounded-md bg-muted text-sm font-mono font-semibold'>
                *123#
              </code>{' '}
              to get started.
            </p>
          </div>

          {/* Phone */}
          <div className='flex items-center justify-center'>
            <Phone />
          </div>

          {/* Info Note */}
          <div className='mt-10 p-5 sm:p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl max-w-lg mx-auto'>
            <div className='flex items-start gap-3'>
              <Info className='h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5' />
              <div>
                <p className='font-semibold text-amber-800 dark:text-amber-300 mb-2'>
                  Simulation Mode
                </p>
                <p className='text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed'>
                  This is a demo of the USSD functionality. In production,
                  actual USSD gateways will provide this service to users
                  without smartphones or internet access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
