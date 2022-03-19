import { PrismaClient, Prisma } from "@prisma/client";

import { TFair, EFairType } from "../src/types/TFair";
import { TStand } from "../src/types/TStand";

const prisma = new PrismaClient();

const usersData: Prisma.UserCreateInput[] = [
  {
    name: "Juan Villarroel",
    username: "juanlvs21",
    email: "juanlvs97@gmail.com",
    password: "1234",
  },
];

const fairsDataJuan: Omit<TFair, "id" | "photographs">[] = [
  {
    name: "Adoramos la Pasta",
    description:
      "Para nosotros la pasta es lo mejor que existe, y por eso hemos decidido hacer una feria en su honor para apreciarla y admirarla. Tenemos disponibles productos fabricados a base de pasta de todo tipo",
    emailContact: "pasta@prueba.com",
    phoneNumber: "02951234567",
    address: "El Poblado, Porlamar 6301, Nueva Esparta",
    dateTime: new Date("04-13-2022"),
    lat: "10.9655553",
    lng: "-63.8608029",
    stars: 4,
    type: EFairType.ENTREPRENEURSHIP,
  },
  {
    name: "Adoramos la Pasta",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat.",
    emailContact: "miferiadivertida@example.com",
    phoneNumber: "02951234567",
    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    dateTime: new Date("04-16-2022"),
    lat: "",
    lng: "",
    stars: 0,
    type: EFairType.GASTRONOMIC,
  },
];

const standsDataJuan: Omit<TStand, "id" | "products" | "promotions">[] = [
  {
    description:
      "Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
    name: "Todo frito",
    stars: 0,
    photoUrl: "",
  },
  {
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
    name: "Dulcecitos",
    stars: 0,
    photoUrl:
      "https://firebasestorage.googleapis.com/v0/b/sanble-app.appspot.com/o/stands%2Fcovers%2F3310e9c8-3e26-47c9-b956-e765c4019597.jpeg?alt=media",
  },
  {
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam, architecto error. Voluptatem voluptates dolorem inventore tempore animi numquam ipsa. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
    name: "Azuquita y Sal",
    stars: 3,
    photoUrl:
      "https://firebasestorage.googleapis.com/v0/b/sanble-app.appspot.com/o/stands%2Fpromotions%2Fa95e0829-e4d6-4211-9d94-dde397299fca.jpeg?alt=media",
  },
  {
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
    name: "Cervezas heladas",
    stars: 0,
    photoUrl: "",
  },
  {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. ",
    name: "Mundo de Chocolate",
    stars: 0,
    slogan: "Pide lo que quieras y te lo haremos en chocolate",
    photoUrl: "",
  },
  {
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit.Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    name: "Cafe cafecito",
    stars: 0,
    slogan: "Cafe cafecito el cafe mas rico",
    photoUrl: "",
  },
  {
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
    name: "Helados Frios",
    stars: 0,
    photoUrl: "",
  },
  {
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
    name: "Mojitos Black",
    stars: 5,
    photoUrl: "Los mejores mojitos que probaras",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: u,
    });

    console.log(`Created user ${user.email} with id: ${user.id}`);

    if (u.email === "juanlvs97@gmail.com") {
      for (const fJuan of fairsDataJuan) {
        const fairJuan = await prisma.fair.create({
          data: {
            ...fJuan,
            user: { connect: { id: user.id } },
          },
        });

        console.log(`Created fair ${fairJuan.name} with id: ${fairJuan.id}`);
      }
      for (const sJuan of standsDataJuan) {
        const standJuan = await prisma.stand.create({
          data: {
            ...sJuan,
            user: { connect: { id: user.id } },
          },
        });

        console.log(`Created fair ${standJuan.name} with id: ${standJuan.id}`);
      }
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
