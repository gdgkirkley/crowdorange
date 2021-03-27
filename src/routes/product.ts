import express from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { term, limit, offset } = req.query;

    let products;
    let total;

    if (term) {
      products = await prisma.product.findMany({
        where: {
          name: {
            contains: String(term),
            mode: "insensitive",
          },
        },
        take: limit ? Number(limit) : 10,
        skip: offset ? Number(offset) : 0,
        include: {
          prices: {
            orderBy: [{ timestamp: "desc" }],
          },
        },
      });

      total = await prisma.product.aggregate({
        where: {
          name: {
            contains: String(term),
            mode: "insensitive",
          },
        },
        count: {
          id: true,
        },
      });
    } else {
      products = await prisma.product.findMany({
        take: limit ? Number(limit) : 10,
        skip: offset ? Number(offset) : 0,
        include: {
          prices: {
            orderBy: [{ timestamp: "desc" }],
          },
        },
      });

      total = await prisma.product.aggregate({
        count: {
          id: true,
        },
      });
    }

    res.json({ total: total.count.id, products });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
    });

    return res.json({ product });
  })
);

export default router;
