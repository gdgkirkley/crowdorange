import express from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db";
import { isAuthenticated } from "../middleware";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { productId } = req.query;

    if (!productId) {
      throw new Error("Must include product id query");
    }

    const prices = await prisma.price.findMany({
      where: {
        productId: Number(productId),
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 10,
      include: {
        store: true,
      },
    });

    return res.json({ prices });
  })
);

router.post(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { bought, price, weight, weightUnit, productId, storeId } = req.body;
    const user = req.user;

    if (!price || !productId || !storeId) {
      throw new Error("Invalid submission");
    }

    const newPrice = await prisma.price.create({
      data: {
        bought,
        price,
        weight,
        weightUnit,
        submittedUserName: user?.username ? user.username : "",
        productId: Number(productId),
        storeId: Number(storeId),
      },
    });

    await prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        lastPriceUpdate: new Date(),
      },
    });

    return res.json({ price: newPrice });
  })
);

router.delete(
  "/:id",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.price.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "Price deleted" });
  })
);

export default router;
