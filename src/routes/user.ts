import express from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db";
import { isReadingOwnUser, isAuthenticated, getUserToken } from "../middleware";
import { getSaltAndHash, isPasswordValid } from "../utils/auth";

const router = express.Router();

interface UserInfo {
  id: number;
  username: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Invalid request: must include email");
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("There is no user for this email or username");
    }

    const isValid = isPasswordValid(password, user.salt, user.password);

    if (!isValid) {
      throw new Error("Wrong password");
    }

    const token = await getUserToken(user);

    const publicUser: UserInfo = {
      id: user.id,
      email: user.email,
      username: user.username,
      latitude: Number(user.latitude),
      longitude: Number(user.longitude),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({ token, user: publicUser });
  })
);

router.get(
  "/:id",
  isAuthenticated,
  isReadingOwnUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(user);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new Error(
        "Invalid request: must include username, password and email"
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error(
        "Invalid request: there is already a user with this email. Try logging in?"
      );
    }

    const hash = getSaltAndHash(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash.hash,
        salt: hash.salt,
      },
    });

    const token = await getUserToken(user);

    const publicUser: UserInfo = {
      id: user.id,
      email: user.email,
      username: user.username,
      latitude: Number(user.latitude),
      longitude: Number(user.longitude),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({ token, user: publicUser });
  })
);

router.post(
  "/:id/reset",
  isAuthenticated,
  isReadingOwnUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Invalid request");
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new Error("No user found");
    }

    const isValid = isPasswordValid(oldPassword, user.salt, user.password);

    if (!isValid) {
      throw new Error("Wrong password");
    }

    const hash = getSaltAndHash(newPassword);

    await prisma.user.update({
      data: {
        password: hash.hash,
        salt: hash.salt,
      },
      where: {
        id: Number(id),
      },
    });

    return res.json({ message: "Password updated successfully!" });
  })
);

router.put(
  "/:id",
  isAuthenticated,
  isReadingOwnUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = prisma.user.update({
      data: {
        ...req.body,
      },
      where: {
        id: parseInt(id),
      },
    });
    res.json(user);
  })
);

router.delete(
  "/:id",
  isAuthenticated,
  isReadingOwnUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json("User deleted");
  })
);

export default router;
