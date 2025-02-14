import { PrismaClient } from "@prisma/client";
// TO Make this edge-compatible
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
const prismaClientSingleton = () => {
  // TO Make this edge-compatible

  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
