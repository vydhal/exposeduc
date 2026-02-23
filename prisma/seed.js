const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Criar Usuário Admin
    const admin = await prisma.adminUser.upsert({
        where: { email: 'admin@exposeduc.gov.br' },
        update: {},
        create: {
            email: 'admin@exposeduc.gov.br',
            password: 'admin123', // Em prod, usar hash
            name: 'Admin Secretaria',
        },
    });

    // Criar Categorias
    const categoriesData = ['Tecnologia', 'Gestão', 'Inclusão', 'Infraestrutura'];
    const categories = [];
    for (const name of categoriesData) {
        const cat = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        categories.push(cat);
    }

    // Criar Projetos de Exemplo
    const projects = [
        {
            title: "Escolas Conectadas",
            slug: "escolas-conectadas",
            summary: "Implementação de rede de alta velocidade e laboratórios móveis em todas as escolas.",
            content: "O projeto Escolas Conectadas visa democratizar o acesso à informação, garantindo que cada aluno da rede estadual tenha acesso a ferramentas digitais de ponta.",
            coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000",
            gallery: "[]",
            status: "PUBLISHED",
            categoryId: categories[0].id,
            featured: true,
            order: 1,
        },
        {
            title: "Educação em Tempo Integral",
            slug: "educacao-integral",
            summary: "Expansão da jornada escolar com atividades extracurriculares inovadoras.",
            content: "A educação integral vai além da sala de aula, integrando cultura, esporte e ciência no cotidiano dos jovens.",
            coverImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000",
            gallery: "[]",
            status: "PUBLISHED",
            categoryId: categories[1].id,
            featured: true,
            order: 2,
        },
        {
            title: "Inclusão Digital 360",
            slug: "inclusao-digital",
            summary: "Programas de capacitação tecnológica para professores e alunos em comunidades remotas.",
            content: "Capacitar é o verbo principal deste projeto, transformando vidas através do domínio de novas tecnologias.",
            coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000",
            gallery: "[]",
            status: "PUBLISHED",
            categoryId: categories[2].id,
            featured: false,
            order: 3,
        }
    ];

    for (const p of projects) {
        await prisma.project.upsert({
            where: { slug: p.slug },
            update: p,
            create: p,
        });
    }

    console.log('Seed concluído com projetos!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
