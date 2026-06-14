import { PrismaClient } from '@prisma/client';
import { featured, catalogue } from './seed';

// Non-destructive recovery: re-create any seed product that no longer exists
// (by name), leaving every existing product and all orders untouched. Use this
// to bring back products that were HARD-deleted before soft-delete existed
// (they won't appear in the admin "Deleted products" list because the row is
// gone). Run against the target DB, e.g.:
//   railway run npx ts-node prisma/restore-missing.ts
// or: DATABASE_URL="<prod-url>" npx ts-node prisma/restore-missing.ts
const prisma = new PrismaClient();

async function ensure(list: any[], isFeatured: boolean) {
  let created = 0;
  for (const p of list) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (exists) continue;
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        image: p.images[0],
        images: p.images,
        features: p.features,
        stock: 5,
        featured: isFeatured,
        badge: isFeatured ? null : (p.badge ?? null),
      },
    });
    created++;
    console.log(`  + created ${isFeatured ? '[featured] ' : ''}${p.name}`);
  }
  return created;
}

async function main() {
  console.log('Restoring any missing seed products (existing ones are skipped)…');
  const a = await ensure(featured, true);
  const b = await ensure(catalogue, false);
  console.log(`Done. Created ${a + b} missing product(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
