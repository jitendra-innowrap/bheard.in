import { PrismaClient } from "@prisma/client";
import { seedBlogPosts } from "@/lib/content/blogSeed";
import { seedCareers } from "@/lib/content/careersSeed";
import { seedStories } from "@/lib/content/storiesSeed";
import { seedPages } from "@/lib/content/pagesSeed";

const prisma = new PrismaClient();

async function main() {
  for (const post of seedBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        subtitle: (post as any).subtitle ?? null,
        author: (post as any).author ?? "BHeard Editorial",
        excerpt: post.excerpt,
        thumbnailUrl: (post as any).thumbnailUrl ?? null,
        thumbnailAlt: (post as any).thumbnailAlt ?? null,
        content: post.content,
        category: post.category,
        readTime: post.readTime,
        published: post.published,
        publishedAt: post.publishedAt,
      },
      create: {
        slug: post.slug,
        title: post.title,
        subtitle: (post as any).subtitle ?? null,
        author: (post as any).author ?? "BHeard Editorial",
        excerpt: post.excerpt,
        thumbnailUrl: (post as any).thumbnailUrl ?? null,
        thumbnailAlt: (post as any).thumbnailAlt ?? null,
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

  for (const story of seedStories) {
    await prisma.successStory.upsert({
      where: { slug: story.slug },
      update: {
        title: story.title,
        industry: story.industry,
        listImage: (story as any).listImage ?? null,
        heroImage: (story as any).heroImage ?? null,
        caseData: (story as any).caseData ?? null,
        summary: story.summary,
        about: story.about,
        challenge: story.challenge,
        solution: story.solution,
        results: story.results,
        contactCta: story.contactCta,
        published: story.published,
      },
      create: {
        slug: story.slug,
        title: story.title,
        industry: story.industry,
        listImage: (story as any).listImage ?? null,
        heroImage: (story as any).heroImage ?? null,
        caseData: (story as any).caseData ?? null,
        summary: story.summary,
        about: story.about,
        challenge: story.challenge,
        solution: story.solution,
        results: story.results,
        contactCta: story.contactCta,
        published: story.published,
      },
    });
  }

  for (const page of seedPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
      },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
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
