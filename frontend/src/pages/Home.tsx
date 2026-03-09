import { Footer, NavBar } from '@/components'
import {
  Features,
  Hero,
  HowItWorks,
  Problems,
  Solutions,
  WhyAvalanche
} from '@/section'

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <NavBar />

      {/* Hero with gradient background */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary-red/10 via-white/90 to-primary-blue/10 dark:from-primary-red/5 dark:via-gray-950/95 dark:to-primary-blue/5 z-[-1]' />
        <Hero />
      </div>

      {/* Main content sections */}
      <main className='flex-1'>
        <Problems />
        <Solutions />
        <Features />
        <HowItWorks />
        <WhyAvalanche />
      </main>

      <Footer />
    </div>
  )
}

export default Home
