// frontend/src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'

const isAuthDebug = process.env.SUPERVITY_AUTH_DEBUG === 'true'

function log(message: string, data?: object) {
  if (isAuthDebug) {
    console.log(
      `[AUTH_DEBUG | Middleware] ${new Date().toISOString()}: ${message}`,
      data || ''
    )
  }
}

export default withAuth(
  function middleware(req: NextRequest) {
    log(`Running for path: ${req.nextUrl.pathname}`)
    // No specific logic needed here. The `authorized` callback below handles everything.
    // `withAuth` will automatically handle the redirect based on the callback's result.
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthorized = !!token
        log(
          `Authorization check for path: ${req.nextUrl.pathname}. User is authorized: ${isAuthorized}`
        )
        if (!isAuthorized) {
          log(`Redirecting to sign-in page.`)
        }
        return isAuthorized
      },
    },
    pages: {
      signIn: '/api/auth/signin',
    },
  }
)

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
