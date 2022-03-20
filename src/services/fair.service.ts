import { PrismaClient } from "@prisma/client";

import { getFairCover } from "../utils/getFairCover";

const prisma = new PrismaClient();

export class FairService {
  static async getUpcoming() {
    const fairs = await prisma.fair.findMany({
      take: 10,
      where: {
        dateTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        dateTime: "asc",
      },
      include: {
        photographs: true,
      },
    });

    return fairs.map(({ photographs, ...fair }) => ({
      ...fair,
      photoUrl: getFairCover(photographs),
    }));
  }
}
