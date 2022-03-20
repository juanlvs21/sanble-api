import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StandService {
  static async getBest() {
    return await prisma.stand.findMany({
      take: 10,
      orderBy: {
        stars: "asc",
      },
    });
  }
}
