import { NAV_LINKS, SOCIAL_LINKS } from '@/constant'

const Footer = () => {
  return (
    <footer className='w-full border-t border-border bg-muted/20'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20'>
        {/* Main footer content */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 md:py-16'>
          {/* Brand column */}
          <div className='sm:col-span-2 lg:col-span-2'>
            <img
              src='/logo-black.png'
              alt='Avanomad'
              className='h-12 w-auto block dark:hidden mb-4'
            />
            <img
              src='/logo-white.png'
              alt='Avanomad'
              className='h-12 w-auto hidden dark:block mb-4'
            />
            <p className='text-sm text-muted-foreground max-w-sm leading-relaxed'>
              Bringing cryptocurrency access to everyone through USSD technology.
              No smartphone or internet required.
            </p>
            {/* Social links */}
            <div className='flex items-center gap-3 mt-6'>
              {SOCIAL_LINKS.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-blue/10 hover:text-primary-blue dark:hover:bg-primary-blue/20 transition-all duration-200'
                  aria-label={link.name}
                >
                  <link.icon className='h-4 w-4' />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4'>
              Quick Links
            </h4>
            <ul className='space-y-3'>
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors duration-200'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href='/ussd-interface'
                  className='text-sm text-muted-foreground hover:text-foreground transition-colors duration-200'
                >
                  Try Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4'>
              Resources
            </h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='https://github.com/tomdan-ai/avanomad'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-muted-foreground hover:text-foreground transition-colors duration-200'
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href='https://www.avax.network/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-muted-foreground hover:text-foreground transition-colors duration-200'
                >
                  Avalanche Network
                </a>
              </li>
              <li>
                <a
                  href='#problems'
                  className='text-sm text-muted-foreground hover:text-foreground transition-colors duration-200'
                >
                  The Problem
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} Avanomad. All rights reserved.
          </p>
          <p className='text-xs text-muted-foreground'>
            Built on Avalanche C-Chain
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
