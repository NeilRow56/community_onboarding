import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'
import { checkUser } from '@/lib/db/checkUser'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { Menu } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'

export default async function Header() {
  const user = await checkUser()
  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background/20 py-6 backdrop-blur-sm'>
      <nav className='container mx-auto flex items-center justify-between'>
        <Sheet>
          <SheetTrigger className='sm:hidden'>
            <Menu className='h-6 w-6' />
          </SheetTrigger>
          <SheetTitle></SheetTitle>
          <SheetContent side='left'>
            <ul className='flex flex-col gap-3 text-sm'>
              <li className='font-sans text-2xl'>
                <SheetClose asChild>
                  <Link href='/'>Community</Link>
                </SheetClose>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
        <div className='flex w-full justify-between'>
          <ul className='hidden items-center gap-14 text-sm font-medium sm:flex'>
            <li className='font-serif text-lg font-bold'>
              <Link href='/'>Community</Link>
            </li>
          </ul>

          <div className='flex items-center justify-between gap-6'>
            <ThemeToggle />

            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  )
}
