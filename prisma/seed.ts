import { seedBlogPosts } from "@/lib/content/blogSeed";
import { seedCareers } from "@/lib/content/careersSeed";
import { seedStories } from "@/lib/content/storiesSeed";
import { seedPages } from "@/lib/content/pagesSeed";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPostModel, CareerModel, PageModel, SuccessStoryModel } from "@/lib/db/models";

async function main() {
  await connectToDatabase();

  for (const post of seedBlogPosts) {
    await BlogPostModel.findOneAndUpdate(
      { slug: post.slug },
      {
        $set: {
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
        $setOnInsert: {
          slug: post.slug,
          showAuthorDetails: true,
        },
      },
      { upsert: true, new: true }
    );
  }

  for (const role of seedCareers) {
    await CareerModel.findOneAndUpdate(
      { slug: role.slug },
      {
        $set: {
          title: role.title,
          department: role.department,
          type: role.type,
          location: role.location,
          description: role.description,
          active: role.active,
        },
        $setOnInsert: {
          slug: role.slug,
        },
      },
      { upsert: true, new: true }
    );
  }

  for (const story of seedStories) {
    await SuccessStoryModel.findOneAndUpdate(
      { slug: story.slug },
      {
        $set: {
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
        $setOnInsert: {
          slug: story.slug,
        },
      },
      { upsert: true, new: true }
    );
  }

  for (const page of seedPages) {
    await PageModel.findOneAndUpdate(
      { slug: page.slug },
      {
        $set: {
          title: page.title,
          content: page.content,
        },
        $setOnInsert: {
          slug: page.slug,
        },
      },
      { upsert: true, new: true }
    );
  }
}

main()
  .then(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
    process.exit(1);
  });
