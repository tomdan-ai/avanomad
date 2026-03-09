import { Section } from '@/components'
import { FEATURES } from '@/constant'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/Section'

const Features = () => {
  return (
    <Section id='features' fullWidth className='bg-gradient-to-b from-primary-red/5 to-transparent'>
      <SectionHeading
        title='Features'
        subtitle='Everything you need for accessible crypto transactions'
        centered
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full'>
        {FEATURES.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon as LucideIcon}
            index={index}
          />
        ))}
      </div>
    </Section>
  )
}

export default Features

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  index: number
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  index
}: FeatureCardProps) => {
  return (
    <Card
      className={cn(
        'h-full border border-border/60 bg-card/80 backdrop-blur-sm',
        'hover:shadow-lg hover:shadow-primary-blue/5 hover:-translate-y-1',
        'transition-all duration-300 ease-out group'
      )}
      data-aos='fade-up'
      data-aos-delay={index * 80}
    >
      <CardHeader>
        <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-red to-primary-blue shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300'>
          <Icon className='h-6 w-6 text-white' />
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
