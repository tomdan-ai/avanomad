import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  id: string
  fullWidth?: boolean
}
export const Section = ({
  children,
  className,
  id,
  fullWidth
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'flex flex-col items-center justify-center',
        'py-16 sm:py-20 md:py-24 px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20',
        fullWidth ? 'w-full' : 'max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </section>
  )
}

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14 space-y-3',
        centered && 'text-center',
        className
      )}
      data-aos='fade-up'
      data-aos-duration='600'
    >
      <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
        {title}
      </h2>
      {subtitle && (
        <p className='text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed'>
          {subtitle}
        </p>
      )}
    </div>
  )
}
