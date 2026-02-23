const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const count = await prisma.project.count();
    const projects = await prisma.project.findMany({ include: { category: true } });
    console.log(`Total de projetos: ${count}`);
    projects.forEach(p => console.log(`- ${p.title} (${p.category.name})`));
}

check()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
