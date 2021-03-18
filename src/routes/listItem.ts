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
    const {listId} = req.query

    if (!listId) {
      throw new Error('Must include listId parameter')
    }

    const listItems = await prisma.listItem.findMany({
      where: {
        AND: [
          {
            list: {id: Number(listId)},
          },
          {
            list: {user: {id: user?.id}},
          },
        ],
      },
    })

    return res.json(listItems)
  }),
)

router.post(
  '/',
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const {productId, listId, notes} = req.body

    const listItem = await prisma.listItem.create({
      data: {
        list: {connect: {id: listId}},
        productId,
        notes,
      },
    })

    return res.json(listItem)
  }),
)

export default router
