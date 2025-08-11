import type { IronSessionOptions } from 'iron-session'
import type { User } from '@prisma/client'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'next-movie-review-app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

// This is where we specify the session data that we want to be available in `req.session`
declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}
