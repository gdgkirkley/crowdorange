import express from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db";
import { isAuthenticated } from "../middleware";
import { ListItemWithProduct } from "./list";

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = req.user;
    const { listId } = req.query;

    if (!listId) {
      throw new Error("Must include listId parameter");
    }

    const listItems = await prisma.listItem.findMany({
      where: {
        AND: [
          {
            list: { id: Number(listId) },
          },
          {
            list: { user: { id: user?.id } },
          },
        ],
      },
    });

    return res.json(listItems);
  })
);

router.post(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { productId, listId, notes } = req.body;

    const listItem = (await prisma.listItem.create({
      data: {
        list: { connect: { id: listId } },
        productId,
        notes,
      },
    })) as ListItemWithProduct;

    const product = await prisma.product.findFirst({
      where: {
        id: listItem.productId,
      },
    });

    if (product) {
      listItem.product = product;
    }

    return res.json({ listItem });
  })
);

router.delete(
  "/:id",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.listItem.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({ message: "List item deleted" });
  })
);

export default router;
