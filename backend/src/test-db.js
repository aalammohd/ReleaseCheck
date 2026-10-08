import prisma from "./prisma.js";

const count = await prisma.release.count();

console.log("Release count:", count);

await prisma.$disconnect();