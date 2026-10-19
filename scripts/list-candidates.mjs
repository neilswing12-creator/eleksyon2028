import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const candidates = await prisma.candidate.findMany({
    select: {
      id: true,
      name: true,
      position: true,
      slug: true,
      party: true,
      color: true,
    },
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
  });

  console.log(`Total Candidates: ${candidates.length}`);
  candidates.forEach((c) => {
    console.log(`[${c.position}] ${c.name} | ${c.party || 'IND'} | slug: ${c.slug}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
