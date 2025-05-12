import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <main
      className={'relative md:min-h-screen flex flex-col overflow-hidden pt-24'}
    >
      {/* Background image with overlay */}
      <div className='absolute inset-0 z-0'>
        {/* <img
    src='/placeholder.svg?height=1920&width=1080'
    alt='Background'

    className='object-cover opacity-40'

  /> */}
      </div>

      {/* Decorative elements */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-600/20 blur-3xl' />
        <div className='absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl' />
      </div>

      <div
        className='relative z-10 flex-1 flex items-center'
        data-aos='zoom-in-up'
      >
        <div className='container mx-auto px-4 py-12 md:py-24 text-center'>
          {' '}
          <h1
            className={
              'text-4xl md:text-5xl lg:text-6xl font-[900] max-w-4xl mx-auto leading-tight //text-gray-900 text-white'
            }
          >
            Crypto Access for Everyone — Even Without Internet
          </h1>
          <p
            className={
              'mt-6 text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 font-light'
            }
          >
            Dial a code. Swap fiat ↔ crypto. Powered by Avalanche.
          </p>
          <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center'>
            {/* <Button
        asChild
        size='lg'
        className={'bg-primary text-white hover:bg-primary/90'
        }
      >
        <a href='#waitlist'>
          Join the Waitlist
          <ArrowRight className='ml-2 h-4 w-4' />
        </a>
      </Button> */}
            <Button
              asChild
              variant='outline'
              size='lg'
              className={
                'bg-black text-white border-black/20 hover:bg-black/20 font-bold text-base rounded-none px-4 md:px-7 py-4 md:h-11'
              }
            >
              <a href='#how-it-works'>How It Works</a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Hero
