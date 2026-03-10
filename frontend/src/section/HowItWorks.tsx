import { Section, SectionHeading } from '@/components'
import { HOW_IT_WORKS_STEPS } from '@/constant'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const HowItWorks = () => {
  return (
    <Section id='how-it-works'>
      <SectionHeading
        title='How It Works'
        centered
        subtitle='Get started in four simple steps'
      />
      <div className='grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full'>
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <StepCard
            key={step.title}
            number={index + 1}
            title={step.title}
            description={step.description}
            index={index}
            isLast={index === HOW_IT_WORKS_STEPS.length - 1}
          />
        ))}
      </div>
    </Section>
  )
}

export default HowItWorks

interface StepCardProps {
  number: number
  title: string
  description: string
  index: number
  isLast: boolean
}

const StepCard = ({ number, title, description, index }: StepCardProps) => {
  return (
    <Card
      className={cn(
        'h-full relative border border-border/60 bg-gradient-to-b from-primary-red/5 to-transparent',
        'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'
      )}
      data-aos='fade-up'
      data-aos-delay={index * 100}
    >
      <CardHeader className='pb-2'>
        <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-red to-primary-blue text-white font-bold text-lg shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300'>
          {number}
        </div>
        <CardTitle className='text-lg sm:text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-sm sm:text-base leading-relaxed'>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
