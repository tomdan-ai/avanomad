import { Section, SectionHeading } from '@/components'
import { Card, CardContent } from '@/components/ui/card'
import { AVALANCHE_BENEFITS } from '@/constant'

const WhyAvalanche = () => {
  return (
    <Section id='why-avalanche' className='bg-gradient-to-b from-primary-blue/8 to-transparent' fullWidth>
      <SectionHeading
        title='Why Avalanche?'
        centered
        subtitle='Powered by one of the fastest, most reliable blockchain networks'
      />

      <div className='grid gap-5 md:gap-6 sm:grid-cols-2 w-full'>
        {AVALANCHE_BENEFITS.map((benefit, index) => (
          <Card
            key={index}
            className='border border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'
            data-aos='fade-up'
            data-aos-delay={index * 80}
          >
            <CardContent className='p-6 sm:p-8'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary-blue/10 dark:bg-primary-blue/20 mb-5 group-hover:scale-105 transition-transform duration-300'>
                <benefit.icon className='h-6 w-6 text-primary-blue' />
              </div>
              <h3 className='font-semibold text-base sm:text-lg'>
                {benefit.title}
              </h3>
              <p className='mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed'>
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}

export default WhyAvalanche
