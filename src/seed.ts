import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  console.log("Starting Seeding ...");
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
