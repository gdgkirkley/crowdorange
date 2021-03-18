import {NextFunction, Request, Response} from 'express'
import {User} from '@prisma/client'

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user === undefined) {
    throw new Error('User is not authenticated')
  }
  next()
}

const isReadingOwnUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  const {id} = req.params
  if (user?.id.toString() !== id) {
    throw new Error('Not authorized')
  }
  next()
}

export {isAuthenticated, isReadingOwnUser}
