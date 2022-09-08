// import bcrypt from "bcrypt";

// import { TFair, EFairType } from "./types/TFair";
// import { TPhotograph } from "./types/TPhotograph";
// import { TStand } from "./types/TStand";

// const prisma = new PrismaClient();

// const usersData: Prisma.UserCreateInput[] = [
//   {
//     name: "Juan Villarroel",
//     username: "juanlvs21",
//     email: "juanlvs97@gmail.com",
//     password: "12345678",
//   },
// ];

// const fairsDataJuan: Omit<TFair, "id" | "photographs" | "createdAt">[] = [
//   {
//     name: "Alcoholicos anonimos",
//     description:
//       "Ven a degustar bebidas variadas, prueba cervezas de otras partes del mundo, incluso bebidas artesanales",
//     emailContact: "alcoholicos@prueba.com",
//     phoneContact: "04244563467",
//     address: "Lorem ipsum, lorem",
//     dateTime: new Date("01-10-2022"),
//     stars: 2,
//     type: EFairType.ENTREPRENEURSHIP,
//   },
//   {
//     name: "Adoramos la Pasta",
//     description:
//       "Para nosotros la pasta es lo mejor que existe, y por eso hemos decidido hacer una feria en su honor para apreciarla y admirarla. Tenemos disponibles productos fabricados a base de pasta de todo tipo",
//     emailContact: "pasta@prueba.com",
//     phoneContact: "02951234567",
//     address: "El Poblado, Porlamar 6301, Nueva Esparta",
//     dateTime: new Date("04-13-2022"),
//     lat: "10.9655553",
//     lng: "-63.8608029",
//     stars: 4,
//     type: EFairType.ENTREPRENEURSHIP,
//   },
//   {
//     name: "Mi feria divertida",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat.",
//     emailContact: "miferiadivertida@example.com",
//     phoneContact: "02951234567",
//     address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
//     dateTime: new Date("04-16-2022"),
//     stars: 0,
//     type: EFairType.GASTRONOMIC,
//   },
// ];

// const photographsFairPos2Juan: Omit<TPhotograph, "id" | "createdAt">[] = [
//   {
//     photoUrl:
//       "https://ik.imagekit.io/sanble/41e6fc11-f202-4bc4-915b-37fc33ee6455_D5kGBvJhVp.jpg",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.",
//     isCover: true,
//   },
// ];

// const standsDataJuan: Omit<
//   TStand,
//   "id" | "products" | "promotions" | "createdAt"
// >[] = [
//   {
//     description:
//       "Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
//     name: "Todo frito",
//     stars: 0,
//   },
//   {
//     description:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
//     name: "Dulcecitos",
//     stars: 0,
//     photoUrl:
//       "https://ik.imagekit.io/sanble/3310e9c8-3e26-47c9-b956-e765c4019597_c_NmxeT7XR.jpeg",
//   },
//   {
//     description:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam, architecto error. Voluptatem voluptates dolorem inventore tempore animi numquam ipsa. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
//     name: "Azuquita y Sal",
//     stars: 3,
//   },
//   {
//     description:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
//     name: "Cervezas heladas",
//     stars: 0,
//   },
//   {
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. ",
//     name: "Mundo de Chocolate",
//     stars: 0,
//     slogan: "Pide lo que quieras y te lo haremos en chocolate",
//     photoUrl:
//       "https://ik.imagekit.io/sanble/torta_de_chocolate_casera_45252_orig_VbWejt91lm.jpg",
//   },
//   {
//     description:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit.Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
//     name: "Cafe cafecito",
//     stars: 0,
//     slogan: "Cafe cafecito el cafe mas rico",
//   },
//   {
//     description:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
//     name: "Helados Frios",
//     stars: 0,
//   },
//   {
//     description:
//       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi reiciendis tempore quia enim voluptatum similique qui assumenda inventore blanditiis!",
//     name: "Mojitos Black",
//     stars: 5,
//     slogan: "Los mejores mojitos que probaras",
//   },
// ];

// async function main() {
//   console.log(`Start seeding ...`);
//   for (const userData of usersData) {
//     const salt = await bcrypt.genSalt(10);
//     userData.password = await bcrypt.hash(userData.password, salt);
//     const user = await prisma.user.create({
//       data: userData,
//     });

//     console.log(`Created user ${user.email} with id: ${user.id}`);

//     if (user.email === "juanlvs97@gmail.com") {
//       for (let i = 0; i < fairsDataJuan.length; i++) {
//         const fair = fairsDataJuan[i];
//         const fairJuan = await prisma.fair.create({
//           data: {
//             ...fair,
//             user: { connect: { id: user.id } },
//           },
//         });

//         if (i === 2) {
//           for (const photoFairPos2 of photographsFairPos2Juan) {
//             const photoFair = await prisma.photograph.create({
//               data: {
//                 ...photoFairPos2,
//                 fair: { connect: { id: fairJuan.id } },
//               },
//             });

//             console.log(
//               `Created photograph ${photoFair.photoUrl} in the fair "${fair.name}" with id: ${photoFair.id}`
//             );
//           }
//         }

//         console.log(`Created fair ${fairJuan.name} with id: ${fairJuan.id}`);
//       }

//       for (const sJuan of standsDataJuan) {
//         const standJuan = await prisma.stand.create({
//           data: {
//             ...sJuan,
//             user: { connect: { id: user.id } },
//           },
//         });

//         console.log(`Created fair ${standJuan.name} with id: ${standJuan.id}`);
//       }
//     }
//   }

//   console.log(`Seeding finished.`);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
