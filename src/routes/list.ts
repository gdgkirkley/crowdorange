import { List, ListItem, Product } from "@prisma/client";
import express from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db";
import { isAuthenticated } from "../middleware";

const router = express.Router();

interface ListWithProduct extends List {
  listItems: ListItemWithProduct[];
}

export interface ListItemWithProduct extends ListItem {
  product?: Product;
}

router.get(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
      throw new Error("User is not signed in");
    }

    let list: ListWithProduct;

    const lists = await prisma.list.findMany({
      take: 1,
      where: {
        user: {
          id: user?.id,
        },
      },
      include: {
        listItems: true,
      },
    });

    // If the user has no lists, create one
    if (!lists.length) {
      list = await prisma.list.create({
        data: {
          name: "Grocery List",
          userId: user.id,
        },
        include: {
          listItems: true,
        },
      });
    } else {
      list = lists[0];
    }

    const productIds = list.listItems.map((val) => val.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (products.length) {
      list.listItems.forEach((item, index) => {
        const product = products.find(
          (product) => product.id === item.productId
        );
        list.listItems[index].product = product;
      });
    }

    console.log(list);

    return res.json({ list });
  })
);

router.post(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = req.user;
    const { name } = req.body;

    const list = await prisma.list.create({
      data: {
        name,
        user: { connect: { id: user?.id } },
      },
    });

    return res.json(list);
  })
);

export default router;
