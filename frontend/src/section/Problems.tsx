import { Section, SectionHeading } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { PROBLEM_STATS } from '@/constant'

const Problems = () => {
  return (
    <Section id='problems' className='bg-muted/30' fullWidth>
      <SectionHeading
        title='The Problem'
        subtitle='Billions remain excluded from the digital economy'
        centered
      />

      <div className='grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full'>
        {PROBLEM_STATS.map((stat, index) => (
          <Card
            key={index}
            className='overflow-hidden border border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
            data-aos='fade-up'
            data-aos-delay={index * 100}
          >
            <CardContent className='p-6 sm:p-8'>
              <div className='flex flex-col items-center text-center'>
                <div className='text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary-red to-primary-blue bg-clip-text text-transparent'>
                  {stat.value}
                </div>
                <p className='mt-3 font-medium text-foreground'>
                  {stat.label}
                </p>
                <p className='mt-3 text-sm text-muted-foreground leading-relaxed'>
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div
        className='mt-10 md:mt-14 bg-gradient-to-r from-primary-red/8 to-primary-blue/8 rounded-2xl p-6 sm:p-8 md:p-10 border border-primary-blue/10 w-full'
        data-aos='fade-up'
        data-aos-delay='200'
      >
        <p className='text-base sm:text-lg leading-relaxed text-foreground/80'>
          Most crypto solutions require smartphones, internet access, and
          technical knowledge. But in many African countries, feature phones
          without internet are still the norm, and millions remain unbanked or
          underbanked.
        </p>
        <p className='mt-4 text-base sm:text-lg leading-relaxed text-foreground/80'>
          This creates a significant barrier to financial inclusion and crypto
          adoption, leaving a vast population unable to access the benefits of
          digital assets and decentralized finance.
        </p>
      </div>
    </Section>
  )
}

export default Problems
