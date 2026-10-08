import prisma from "./prisma.js";

try {
  const releases = await prisma.release.findMany();

  console.log("DATABASE TEST SUCCESS");
  console.log("RELEASES:", releases);
} catch (error) {
  console.log("DATABASE TEST FAILED");
  console.dir(error, { depth: null });
} finally {
  await prisma.$disconnect();
}