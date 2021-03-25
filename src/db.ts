import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// npx prisma db push --preview-feature
