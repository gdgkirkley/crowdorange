import jwt from 'jsonwebtoken'
import expressJWT from 'express-jwt'

const SIXTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 60

const secret = process.env.APP_SECRET

interface getUserTokenProps {
  id: number
  username: string
}

async function getUserToken({
  id,
  username,
}: getUserTokenProps): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000)

  return jwt.sign(
    {
      id,
      username,
      iat: issuedAt,
      exp: issuedAt + SIXTY_DAYS_IN_SECONDS,
    },
    secret,
  )
}

const authMiddleware = expressJWT({
  secret,
  algorithms: ['HS256'],
  credentialsRequired: false,
  getToken: function fromCookie(req) {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token
    }
    return null
  },
})

export {getUserToken, authMiddleware}
