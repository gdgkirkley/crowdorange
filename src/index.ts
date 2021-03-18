import logger from 'loglevel'
import {startServer} from './server'
import prisma from './db'

const isProd = process.env.NODE_ENV === 'production'
logger.setLevel(isProd ? 'warn' : 'info')

startServer()
  .catch(err => logger.error(err))
  .finally(async () => prisma.$disconnect())
