import express from 'express'
import asyncHandler from 'express-async-handler'
import prisma from '../db'

const router = express.Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {limit, offset} = req.query

    const products = await prisma.product.findMany({
      take: limit ? Number(limit) : 10,
      skip: offset ? Number(offset) : 0,
    })

    res.json({total: products.length, products})
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const {id} = req.params

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
    })

    return res.json({product})
  }),
)

export default router
