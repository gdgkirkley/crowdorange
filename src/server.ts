import express from "express";
import logger from "loglevel";
import bodyParser from "body-parser";
import { authMiddleware, errorMiddleware } from "./middleware";
import {
  userRoutes,
  productRoutes,
  priceRoutes,
  listRoutes,
  listItemRoutes,
  storeRoutes,
} from "./routes";

export async function startServer({
  port = process.env.PORT,
} = {}): Promise<void> {
  const app = express();

  app.use(express.json());

  app.use(authMiddleware);

  app.get("/", (req, res) => {
    return res.json({ message: `Server is running` });
  });

  app.use("/user", userRoutes);
  app.use("/product", productRoutes);
  app.use("/price", priceRoutes);
  app.use("/list", listRoutes);
  app.use("/listitem", listItemRoutes);
  app.use("/store", storeRoutes);

  app.use(errorMiddleware);

  app.listen({ port: port }, () => {
    logger.info(`CrowdOrange server listening on port ${port}`);
  });
}
