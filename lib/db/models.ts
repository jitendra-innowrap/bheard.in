import { Schema, model, models, Types, type InferSchemaType, type SchemaOptions } from "mongoose";

const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false as const,
  toJSON: {
    virtuals: true,
    transform: (_doc: unknown, ret: Record<string, any>) => {
      if (ret._id instanceof Types.ObjectId) {
        ret.id = ret._id.toString();
      }
      delete ret._id;
      return ret;
    },
  },
};

const blogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: null },
    showAuthorDetails: { type: Boolean, default: true },
    author: { type: String, default: null },
    authorImage: { type: String, default: null },
    excerpt: { type: String, required: true },
    thumbnailUrl: { type: String, default: null },
    thumbnailAlt: { type: String, default: null },
    content: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: Number, required: true, min: 1 },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  {
    ...baseSchemaOptions,
    collection: "BlogPost",
  }
);
blogPostSchema.index({ publishedAt: -1, createdAt: -1 });

const careerSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  {
    ...baseSchemaOptions,
    collection: "Career",
  }
);
careerSchema.index({ createdAt: -1 });

const careerApplicationSchema = new Schema(
  {
    careerId: { type: Schema.Types.ObjectId, ref: "Career", default: null, index: true },
    careerSlug: { type: String, required: true, trim: true },
    careerTitle: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    yearsExperience: { type: String, required: true, trim: true },
    roleTitleApplied: { type: String, required: true, trim: true },
    currentCompany: { type: String, default: null },
    portfolioUrl: { type: String, default: null },
    linkedInUrl: { type: String, default: null },
    expectedSalary: { type: String, default: null },
    noticePeriod: { type: String, required: true, trim: true },
    coverLetter: { type: String, required: true },
    referralSource: { type: String, default: null },
    workAuthorization: { type: String, default: null },
    resumeFileName: { type: String, required: true },
    resumeStoredPath: { type: String, required: true },
    resumeMime: { type: String, required: true },
    resumeSize: { type: Number, required: true, min: 0 },
  },
  {
    ...baseSchemaOptions,
    collection: "CareerApplication",
    timestamps: { createdAt: true, updatedAt: false },
  }
);
careerApplicationSchema.index({ createdAt: -1 });

const successStorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    listImage: { type: String, default: null },
    heroImage: { type: String, default: null },
    caseData: { type: Schema.Types.Mixed, default: null },
    summary: { type: String, required: true },
    about: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    results: { type: String, required: true },
    contactCta: { type: String, required: true },
    published: { type: Boolean, default: true },
  },
  {
    ...baseSchemaOptions,
    collection: "SuccessStory",
  }
);

const mediaAssetSchema = new Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
  },
  {
    ...baseSchemaOptions,
    collection: "MediaAsset",
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  {
    ...baseSchemaOptions,
    collection: "Page",
  }
);

const contactLeadSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    company: { type: String, default: null },
    message: { type: String, required: true },
    sourcePage: { type: String, default: null },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  {
    ...baseSchemaOptions,
    collection: "ContactLead",
  }
);
contactLeadSchema.index({ createdAt: -1 });
contactLeadSchema.index({ email: 1 });

export const BlogPostModel = models.BlogPost ?? model("BlogPost", blogPostSchema);
export const CareerModel = models.Career ?? model("Career", careerSchema);
export const CareerApplicationModel =
  models.CareerApplication ?? model("CareerApplication", careerApplicationSchema);
export const SuccessStoryModel = models.SuccessStory ?? model("SuccessStory", successStorySchema);
export const MediaAssetModel = models.MediaAsset ?? model("MediaAsset", mediaAssetSchema);
export const PageModel = models.Page ?? model("Page", pageSchema);
export const ContactLeadModel = models.ContactLead ?? model("ContactLead", contactLeadSchema);

export type BlogPostDocument = InferSchemaType<typeof blogPostSchema> & { id: string };
export type CareerDocument = InferSchemaType<typeof careerSchema> & { id: string };
export type CareerApplicationDocument = InferSchemaType<typeof careerApplicationSchema> & { id: string };
export type SuccessStoryDocument = InferSchemaType<typeof successStorySchema> & { id: string };
export type PageDocument = InferSchemaType<typeof pageSchema> & { id: string };
export type ContactLeadDocument = InferSchemaType<typeof contactLeadSchema> & { id: string };

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  showAuthorDetails: boolean;
  author: string | null;
  authorImage: string | null;
  excerpt: string;
  thumbnailUrl: string | null;
  thumbnailAlt: string | null;
  content: string;
  category: string;
  readTime: number;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CareerRecord = {
  id: string;
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SuccessStoryRecord = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  listImage: string | null;
  heroImage: string | null;
  caseData: unknown;
  summary: string;
  about: string;
  challenge: string;
  solution: string;
  results: string;
  contactCta: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactLeadRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  sourcePage: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CareerRefRecord = {
  id?: string;
  slug?: string;
  title?: string;
} | null;

export type CareerApplicationRecord = {
  id: string;
  careerSlug: string;
  careerTitle: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  yearsExperience: string;
  roleTitleApplied: string;
  currentCompany: string | null;
  portfolioUrl: string | null;
  linkedInUrl: string | null;
  expectedSalary: string | null;
  noticePeriod: string;
  coverLetter: string;
  referralSource: string | null;
  workAuthorization: string | null;
  resumeFileName: string;
  resumeStoredPath: string;
  resumeMime: string;
  resumeSize: number;
  createdAt: Date;
  career: CareerRefRecord;
};
