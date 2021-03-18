import crypto from 'crypto'
import logger from 'loglevel'

const iterations = process.env.NODE_ENV === 'production' ? 1000 : 1

export function getSaltAndHash(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, 512, 'sha512')
    .toString('hex')
  return {salt, hash}
}

export function isPasswordValid(password: string, salt: string, hash: string) {
  return (
    hash ===
    crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512').toString('hex')
  )
}
