import { MenuIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constant'
import { useState, useEffect } from 'react'

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () =>
      setScrolled(window.pageYOffset > 200)
    )

    return () => {
      window.removeEventListener('scroll', () =>
        setScrolled(window.pageYOffset > 200)
      )
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    // to revent scrolling when menu is open
    if (!menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }
  return (
    <header
      className={` ${
        scrolled ? 'bg-white/80 shadow-sm backdrop-blur-lg' : '!bg-transparent'
      } z-50 fixed mx-auto px-4 md:py-3 w-full flex items-center justify-between top-0 transition-all duration-300 md:px-10 lg:px-20 text-white`}
    >
      <img
        src={scrolled ? '/logo-black.png' : '/logo-white.png'}
        alt='Avanomad Logo'
        className='h-20 w-auto '
      />
      <nav className='hidden md:flex items-center gap-6'>
        {NAV_LINKS.map(link => (
          <a
            key={link.name}
            href={link.url}
            className={cn(
              'font-medium transition-colors hover:text-black text-xl uppercase',
              scrolled ? 'text-gray-700' : 'text-white'
            )}
          >
            {link.name}
          </a>
        ))}
        {/* <Button
          asChild
          variant='outline'
          className={cn(
            'transition-colors',
            'bg-black/10 text-black border-black/20 hover:bg-black/20'
          )}
        >
          <a href='#waitlist'>Join Waitlist</a>
        </Button> */}
      </nav>
      <button
        className={cn(
          'md:hidden cursor-pointer p-0',
          scrolled ? 'text-black' : 'text-white'
        )}
        onClick={toggleMenu}
      >
        <MenuIcon size={27} />
        <span className='sr-only'>Open menu</span>
      </button>{' '}
      <nav
        className={`fixed md:hidden top-0 left-0 w-full h-screen bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-5'>
          <div className='flex justify-between items-center mb-10'>
            <img
              src='/logo-black.png'
              alt='Avanomad Logo'
              className='h-10 w-auto'
            />
            <button
              className='cursor-pointer p-2 hover:bg-gray-100 rounded-full'
              onClick={toggleMenu}
              aria-label='Close menu'
            >
              <X size={24} className='text-black' />
            </button>
          </div>

          <div className='flex flex-col gap-6 mt-8'>
            {NAV_LINKS.map(link => (
              <a
                key={link.name}
                href={link.url}
                onClick={toggleMenu}
                className={cn(
                  'font-medium transition-colors text-gray-800 hover:text-black text-xl py-2 border-b border-gray-100'
                )}
              >
                {link.name}
              </a>
            ))}
            {/* <Button asChild className='mt-6'>
              <a href='#waitlist' onClick={toggleMenu}>
                Join Waitlist
              </a>
            </Button> */}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavBar
