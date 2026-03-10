import { MenuIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constant'
import { useState, useEffect, useCallback } from 'react'
import DarkModeToggle from './DarkModeToggle'
import { useLocation } from 'react-router-dom'

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = 'auto'
  }, [location])

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
    document.body.style.overflow = menuOpen ? 'auto' : 'hidden'
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = 'auto'
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
        scrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] py-2'
          : 'bg-transparent py-3 md:py-4'
      )}
    >
      <div className='mx-auto flex items-center justify-between px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20'>
        {/* Logo */}
        <a href={isHome ? '#hero' : '/'} className='relative z-50 flex-shrink-0'>
          <img
            src='/logo-black.png'
            alt='Avanomad'
            className={cn(
              'w-auto transition-all duration-300 block dark:hidden',
              scrolled ? 'h-12 md:h-14' : 'h-14 md:h-16'
            )}
          />
          <img
            src='/logo-white.png'
            alt='Avanomad'
            className={cn(
              'w-auto transition-all duration-300 hidden dark:block',
              scrolled ? 'h-12 md:h-14' : 'h-14 md:h-16'
            )}
          />
        </a>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-1 lg:gap-2'>
          {NAV_LINKS.map(link => (
            <a
              key={link.name}
              href={link.url}
              className={cn(
                'px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-200',
                'hover:bg-black/5 dark:hover:bg-white/10',
                scrolled
                  ? 'text-gray-700 dark:text-gray-200'
                  : 'text-gray-800 dark:text-white'
              )}
            >
              {link.name}
            </a>
          ))}
          <div className='ml-2 pl-2 border-l border-gray-200 dark:border-gray-700'>
            <DarkModeToggle
              className={cn(
                scrolled
                  ? 'text-gray-700 dark:text-gray-200'
                  : 'text-gray-800 dark:text-white'
              )}
            />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className='flex md:hidden items-center gap-2'>
          <DarkModeToggle
            className={cn(
              scrolled
                ? 'text-gray-700 dark:text-gray-200'
                : 'text-gray-800 dark:text-white'
            )}
          />
          <button
            className={cn(
              'relative z-50 p-2 rounded-lg transition-colors duration-200 cursor-pointer',
              'hover:bg-black/5 dark:hover:bg-white/10',
              scrolled
                ? 'text-gray-800 dark:text-white'
                : 'text-gray-800 dark:text-white'
            )}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMenu}
      />

      {/* Mobile Menu Panel */}
      <nav
        className={cn(
          'fixed top-0 right-0 w-[280px] sm:w-[320px] h-screen z-40 md:hidden',
          'bg-white dark:bg-gray-950 shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='flex flex-col h-full pt-24 pb-8 px-6'>
          <div className='flex flex-col gap-1'>
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.name}
                href={link.url}
                onClick={closeMenu}
                className={cn(
                  'px-4 py-3.5 rounded-xl text-lg font-medium transition-all duration-200',
                  'text-gray-800 dark:text-gray-200',
                  'hover:bg-gray-100 dark:hover:bg-gray-800/60',
                  'active:scale-[0.98]'
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: menuOpen ? 'fade-up 0.4s ease-out forwards' : 'none',
                  opacity: menuOpen ? undefined : 0
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className='mt-auto pt-6 border-t border-gray-200 dark:border-gray-800'>
            <a
              href='/ussd-interface'
              onClick={closeMenu}
              className='block w-full text-center py-3 px-6 rounded-xl bg-gradient-to-r from-primary-red to-primary-blue text-white font-semibold hover:opacity-90 transition-opacity'
            >
              Try USSD Demo
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavBar
