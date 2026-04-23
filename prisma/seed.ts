import { PrismaClient } from "@prisma/client";
import { seedBlogPosts } from "@/lib/content/blogSeed";
import { seedCareers } from "@/lib/content/careersSeed";

const prisma = new PrismaClient();

async function main() {
  for (const post of seedBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        readTime: post.readTime,
        published: post.published,
        publishedAt: post.publishedAt,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        readTime: post.readTime,
        published: post.published,
        publishedAt: post.publishedAt,
      },
    });
  }

  for (const role of seedCareers) {
    await prisma.career.upsert({
      where: { slug: role.slug },
      update: {
        title: role.title,
        department: role.department,
        type: role.type,
        location: role.location,
        description: role.description,
        active: role.active,
      },
      create: {
        slug: role.slug,
        title: role.title,
        department: role.department,
        type: role.type,
        location: role.location,
        description: role.description,
        active: role.active,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
