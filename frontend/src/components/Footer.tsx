const Footer = () => {
  return (
    <footer className='w-full bg-muted/30 py-8'>
      <img
        src='/logo-black.png'
        alt='Avanomad Logo'
        className='mx-auto mb-4 h-20 w-auto'
      />

      <p className='text-center text-sm text-muted-foreground'>
        &copy; {new Date().getFullYear()} Avanomad. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
