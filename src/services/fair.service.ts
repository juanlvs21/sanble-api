import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FairService {
  static async getUpcoming() {
    return await prisma.fair.findMany({
      take: 10,
      where: {
        dateTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        dateTime: "asc",
      },
    });
  }
}
