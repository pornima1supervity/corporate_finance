'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import apiClient from '@/lib/api-client'
import { AccentButton, NavyButton } from '@/components/ui/accent-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Activity, CheckCircle2 } from 'lucide-react'

// Stats Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string
  value: string
  icon: React.ElementType
  trend?: string
  color: string
}) => (
  <Card className='border-0 bg-white shadow-sm transition-shadow hover:shadow-md'>
    <CardContent className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <p className='text-3xl font-bold text-gray-900'>{value}</p>
          {trend && (
            <p className='flex items-center text-sm text-gray-500'>
              <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-2xl ${color} p-4`}>
          <Icon className='h-8 w-8 text-white' />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function HomePage() {
  const { data: session, status } = useSession()
  const [apiResponse, setApiResponse] = useState<string>('')
  const [adminResponse, setAdminResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const callApi = async (
    endpoint: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setIsLoading(true)
    setter('Loading...')
    try {
      const data = await apiClient(endpoint)
      setter(JSON.stringify(data, null, 2))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setter(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#000b37]'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {status === 'authenticated' ? (
        <div className='space-y-8'>
          {/* Welcome Section */}
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>
              Welcome back, {session?.user?.name?.split(' ')[0]}!
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Here&apos;s what&apos;s happening with your system today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              title='Total Users'
              value='10K+'
              icon={Users}
              trend='+12% from last month'
              color='bg-[#000b37]'
            />
            <StatCard
              title='Active Sessions'
              value='500K+'
              icon={Activity}
              trend='+8% from last month'
              color='bg-[#85c20b]'
            />
            <StatCard
              title='Success Rate'
              value='98%'
              icon={CheckCircle2}
              trend='+2% from last month'
              color='bg-blue-500'
            />
            <StatCard
              title='Performance'
              value='50%'
              icon={TrendingUp}
              trend='Faster processing'
              color='bg-purple-500'
            />
          </div>

          {/* Main Content Grid */}
          <div className='grid gap-6 lg:grid-cols-2'>
            {/* API Tests Card */}
            <Card className='border-0 bg-white shadow-sm'>
              <CardHeader className='border-b border-gray-100'>
                <CardTitle className='text-xl font-semibold text-gray-900'>
                  API Endpoint Tests
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6 p-6'>
                <div className='space-y-3'>
                  <p className='text-sm font-medium text-gray-700'>
                    Call Protected Endpoint
                  </p>
                  <NavyButton
                    onClick={() => callApi('/api/test', setApiResponse)}
                    disabled={isLoading}
                    className='w-full'
                  >
                    {isLoading ? 'Calling...' : 'Test Protected API'}
                  </NavyButton>
                  {apiResponse && (
                    <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                      <pre className='overflow-x-auto text-xs text-gray-700'>
                        <code>{apiResponse}</code>
                      </pre>
                    </div>
                  )}
                </div>
                <div className='space-y-3'>
                  <p className='text-sm font-medium text-gray-700'>
                    Call Admin-Only Endpoint
                  </p>
                  <AccentButton
                    onClick={() =>
                      callApi('/api/admin/dashboard', setAdminResponse)
                    }
                    disabled={isLoading}
                    className='w-full'
                  >
                    {isLoading ? 'Calling...' : 'Test Admin API'}
                  </AccentButton>
                  {adminResponse && (
                    <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                      <pre className='overflow-x-auto text-xs text-gray-700'>
                        <code>{adminResponse}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session Information Card */}
            <Card className='border-0 bg-white shadow-sm'>
              <CardHeader className='border-b border-gray-100'>
                <CardTitle className='text-xl font-semibold text-gray-900'>
                  Session Information
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  <pre className='overflow-x-auto text-xs text-gray-700'>
                    <code>{JSON.stringify(session, null, 2)}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className='flex min-h-[600px] items-center justify-center'>
          <Card className='w-full max-w-md border-0 bg-white shadow-lg'>
            <CardHeader className='space-y-2 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#000b37]'>
                <span className='text-2xl font-bold text-white'>S</span>
              </div>
              <CardTitle className='text-2xl font-bold text-gray-900'>
                Welcome to Supervity
              </CardTitle>
              <p className='text-gray-600'>
                Please sign in to access your dashboard and continue.
              </p>
            </CardHeader>
            <CardContent className='space-y-4 px-6 pb-6'>
              <AccentButton
                onClick={() => signIn('keycloak')}
                className='w-full py-6 text-base font-semibold'
              >
                Sign In with Keycloak
              </AccentButton>
              <p className='text-center text-sm text-gray-500'>
                Secure authentication powered by Keycloak
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
