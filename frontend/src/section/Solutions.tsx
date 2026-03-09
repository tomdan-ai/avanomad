import { Section, SectionHeading } from '@/components'
import { SOLUTION_POINTS } from '@/constant'
import { CheckCircle2 } from 'lucide-react'

const Solutions = () => {
  return (
    <Section id='solutions'>
      <div className='grid gap-10 md:gap-16 md:grid-cols-2 items-center w-full'>
        <div>
          <SectionHeading
            title='Our Solution'
            subtitle='USSD + Avalanche: Bringing crypto to feature phones'
          />

          <div className='space-y-5'>
            {SOLUTION_POINTS.map((point, index) => (
              <div
                key={index}
                className='flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-200'
                data-aos='fade-up'
                data-aos-delay={index * 80}
              >
                <div className='flex-shrink-0 mt-0.5'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-red to-primary-blue'>
                    <CheckCircle2 className='h-4 w-4 text-white' />
                  </div>
                </div>
                <div>
                  <h3 className='font-semibold text-base sm:text-lg'>
                    {point.title}
                  </h3>
                  <p className='mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed'>
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className='relative rounded-2xl overflow-hidden shadow-2xl order-first md:order-last'
          data-aos='fade-left'
          data-aos-duration='800'
        >
          <div className='absolute inset-0 bg-gradient-to-tr from-primary-red/20 to-primary-blue/20 z-10' />
          <img
            src='/hand-holding-phone-displaying-phonebook.jpg'
            alt='USSD interface on a feature phone'
            className='w-full h-auto object-cover aspect-[4/3]'
          />
        </div>
      </div>
    </Section>
  )
}

export default Solutions
