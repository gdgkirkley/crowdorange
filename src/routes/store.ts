import express from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { lat, long } = req.query;

    if (!lat || !long) {
      throw new Error("Must provide search location");
    }

    const latitude = Number(lat);
    const longitude = Number(long);

    const stores = await prisma.store.findMany({
      take: 10,
      where: {
        AND: [
          { latitude: { gte: latitude - 1 } },
          { latitude: { lte: latitude + 1 } },
          { longitude: { gte: longitude - 1 } },
          { longitude: { lte: longitude + 1 } },
        ],
      },
    });

    return res.json({ stores });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      name,
      address,
      city,
      country,
      postalCode,
      latitude,
      longitude,
    } = req.body;

    if (
      !name ||
      !address ||
      !city ||
      !country ||
      !postalCode ||
      !latitude ||
      !longitude
    ) {
      throw new Error("Invalid submission");
    }

    const store = await prisma.store.create({
      data: {
        name,
        address,
        city,
        country,
        postalCode,
        latitude,
        longitude,
      },
    });

    return res.json({ store });
  })
);

export default router;
