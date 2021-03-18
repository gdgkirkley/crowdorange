import express from 'express'
import asyncHandler from 'express-async-handler'
import prisma from '../db'
import {isAuthenticated} from '../middleware'

const router = express.Router()

router.get(
  '/',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = req.user

    const lists = await prisma.list.findMany({
      where: {
        user: {
          id: user?.id,
        },
      },
    })

    return lists
  }),
)

router.post(
  '/',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = req.user
    const {name} = req.body

    const list = await prisma.list.create({
      data: {
        name,
        user: {connect: {id: user?.id}},
      },
    })

    return res.json(list)
  }),
)

export default router
