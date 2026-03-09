import { Button } from '@/components/ui/button'
import { ArrowRight, Smartphone } from 'lucide-react'

const Hero = () => {
  return (
    <section
      id='hero'
      className='min-h-[100dvh] w-full flex items-center relative overflow-hidden'
    >
      {/* Decorative blurred shapes */}
      <div className='absolute top-1/4 -left-32 w-64 h-64 bg-primary-red/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-1/4 -right-32 w-64 h-64 bg-primary-blue/20 rounded-full blur-3xl pointer-events-none' />

      <div className='container mx-auto px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-20 md:py-28 text-center relative z-10'>
        {/* Badge */}
        <div
          className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue text-sm font-medium mb-8'
          data-aos='fade-down'
          data-aos-duration='600'
        >
          <Smartphone className='h-4 w-4' />
          <span>Works on any phone — no internet needed</span>
        </div>

        <h1
          className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[900] max-w-5xl mx-auto leading-[1.1] text-gray-900 dark:text-white'
          data-aos='fade-up'
          data-aos-duration='700'
        >
          Crypto Access for{' '}
          <span className='bg-gradient-to-r from-primary-red to-primary-blue bg-clip-text text-transparent'>
            Everyone
          </span>
        </h1>

        <p
          className='mt-6 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400 font-light leading-relaxed'
          data-aos='fade-up'
          data-aos-duration='700'
          data-aos-delay='100'
        >
          Dial a code. Swap fiat ↔ crypto. Powered by Avalanche.
        </p>

        <div
          className='mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-center'
          data-aos='fade-up'
          data-aos-duration='700'
          data-aos-delay='200'
        >
          <Button
            asChild
            size='lg'
            className='h-12 sm:h-14 px-8 text-base sm:text-lg rounded-xl bg-gradient-to-r from-primary-red to-primary-blue text-white hover:opacity-90 shadow-lg shadow-primary-blue/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-blue/30 hover:-translate-y-0.5'
          >
            <a href='/ussd-interface' className='flex items-center gap-2'>
              Try the Demo
              <ArrowRight className='h-5 w-5' />
            </a>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='h-12 sm:h-14 px-8 text-base sm:text-lg rounded-xl border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300'
          >
            <a href='#how-it-works'>Learn More</a>
          </Button>
        </div>

        {/* Trust indicators */}
        <div
          className='mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500 dark:text-gray-500'
          data-aos='fade-up'
          data-aos-delay='300'
        >
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-green-500' />
            <span>Avalanche Powered</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-green-500' />
            <span>Self-Custodial</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-green-500' />
            <span>No Internet Required</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
