import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type BlogDetail = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishedAt: Date | string | null;
};

function formatDate(value: Date | string | null) {
  if (!value) return "Draft";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogDetailView({
  post,
  related,
}: {
  post: BlogDetail;
  related: BlogDetail[];
}) {
  return (
    <section className="bg-surface py-section-y-sm md:py-section-y">
      <div className="mx-auto max-w-[760px] px-gutter-sm md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{post.category}</p>
        <h1 className="mt-4 font-headline text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-tight tracking-tight text-on-background">
          {post.title}
        </h1>
        <p className="mt-5 font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant">
          {formatDate(post.publishedAt)} · {post.readTime} min read
        </p>
        <p className="mt-6 font-body text-lg leading-relaxed text-on-surface-variant">{post.excerpt}</p>
      </div>

      <article className="prose prose-neutral mx-auto mt-10 max-w-[760px] px-gutter-sm md:px-gutter">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>

      <div className="mx-auto mt-16 max-w-[960px] px-gutter-sm md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Related posts</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {related.map((item) => (
            <article key={item.slug} className="border border-outline-variant/60 bg-surface-container-low p-5">
              <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{item.category}</p>
              <h2 className="mt-3 font-headline text-xl font-black uppercase leading-tight text-on-background">
                {item.title}
              </h2>
              <Link
                href={`/blog/${item.slug}`}
                className="mt-4 inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-background"
              >
                Read article <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
