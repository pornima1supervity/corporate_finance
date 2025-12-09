'use client'

import { useSession } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

// Dummy User Menu component for demonstration
const UserMenu = () => {
  const { data: session } = useSession()
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  if (!session?.user) return null

  return (
    <div className='flex items-center gap-4'>
      <div className='flex flex-col text-right'>
        <span className='text-sm font-semibold text-gray-900'>
          {session.user.name}
        </span>
        <span className='text-xs text-gray-500'>
          {session.user.email}
        </span>
      </div>
      <button
        onClick={() => {
          // Use custom logout endpoint to properly end Keycloak session
          window.location.href = `${basePath}/api/auth/logout`
        }}
        className='rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
        title='Sign Out'
      >
        <LogOut className='h-5 w-5' />
      </button>
    </div>
  )
}

export function Header() {
  return (
    <header className='sticky top-0 z-10 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80'>
      <div className='flex h-16 items-center justify-between px-6'>
        <div className='mr-4 hidden md:flex'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <span className='text-xl font-semibold text-[#000b37]'>
              AI Command Center
            </span>
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-end space-x-2'>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
