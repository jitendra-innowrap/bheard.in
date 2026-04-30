import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = "http://localhost:3000";
const ASSET_DIR = path.resolve("qa-assets");

function readEnvValue(key) {
  const raw = process.env[key];
  return raw ? raw.replace(/^["']|["']$/g, "") : "";
}

function getCookieFromResponse(res) {
  const setCookie = res.headers.get("set-cookie") || "";
  return setCookie.split(";")[0] || "";
}

async function apiJson(url, init = {}) {
  const res = await fetch(url, init);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  return { status: res.status, ok: res.ok, data };
}

async function loginAdmin() {
  const email = readEnvValue("ADMIN_EMAIL");
  const password = readEnvValue("ADMIN_PASSWORD");
  if (!email || !password) throw new Error("Missing ADMIN_EMAIL / ADMIN_PASSWORD");
  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Admin login failed with status ${res.status}`);
  const cookie = getCookieFromResponse(res);
  if (!cookie) throw new Error("Admin session cookie not returned");
  return cookie;
}

async function uploadImage(cookie, localFile, folder) {
  const filePath = path.join(ASSET_DIR, localFile);
  const content = await fs.readFile(filePath);
  const form = new FormData();
  form.append("image", new Blob([content], { type: "image/jpeg" }), localFile);
  form.append("folder", folder);
  const res = await fetch(`${BASE_URL}/api/admin/upload-image`, {
    method: "POST",
    headers: { cookie },
    body: form,
  });
  const body = await res.json();
  if (!res.ok || !body?.url) {
    throw new Error(`Upload failed for ${localFile}: ${JSON.stringify(body)}`);
  }
  return body.url;
}

async function createBlog(cookie, thumbnailUrl) {
  const slug = `qa-blog-${Date.now()}`;
  const payload = {
    slug,
    title: "QA Verified: Mumbai Growth Creative System",
    subtitle: "Integration smoke-tested with ImageKit-backed media delivery.",
    author: "BHeard QA",
    excerpt:
      "This QA article validates dynamic admin CMS creation, media upload linkage, and frontend rendering flow for blog listing and detail pages.",
    thumbnailUrl,
    thumbnailAlt: "Creative strategy dashboard and brand planning wall",
    content: `# QA Integration Validation\n\nThis post is created during integration QA to validate:\n\n- dynamic admin blog creation\n- ImageKit upload and URL persistence\n- frontend listing and detail image rendering\n\n## Why this matters\n\nIf this post appears on listing and detail pages with the correct image, title metadata, and content, the CMS media pipeline is working as expected.\n\n## Result checkpoint\n\nThe same thumbnail URL should render in both the blog listing card and detail hero image block.`,
    category: "Brand Strategy",
    readTime: 5,
    published: true,
    publishedAt: new Date().toISOString(),
  };
  const create = await apiJson(`${BASE_URL}/api/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify(payload),
  });
  if (!create.ok) throw new Error(`Blog create failed: ${JSON.stringify(create.data)}`);
  return { slug, thumbnailUrl };
}

async function createStory(cookie, listUrl, heroUrl, executionUrl) {
  const slug = `qa-success-story-${Date.now()}`;
  const caseData = {
    listTitle: "QA Growth Story",
    listTagline: "End-to-end dynamic media validation",
    listDescription: "Success story generated during integration QA with ImageKit assets.",
    listMeta: "QA · Integration · Dynamic CMS",
    listImage: listUrl,
    listImageAlt: "Team reviewing campaign boards",
    heroTitle: "QA Growth Story",
    heroSubtitle: "Story media verified from upload to frontend rendering.",
    heroMeta: "QA · Integration",
    heroImage: heroUrl,
    heroImageAlt: "Large campaign launch visual",
    overview: { heading: "The brief", body: "Validate complete success story media flow from admin to frontend." },
    challenge: { heading: "The challenge", intro: "Ensure dynamic images render in both listing and detail surfaces." },
    strategy: { heading: "Approach", intro: "Create, upload, publish, and verify across API + frontend pages." },
    execution: [
      {
        heading: "Execution image test",
        body: "Execution block image is uploaded via admin ImageKit workflow.",
        image: executionUrl,
        imageAlt: "Execution workflow visual",
        align: "left",
      },
    ],
    results: {
      heading: "Result",
      stats: [{ value: "PASS", label: "Image upload and rendering flow" }],
      closing: "Dynamic story media persisted and rendered from backend data.",
    },
    closingStatement: "QA story confirms the media pipeline behavior.",
    cta: { title: "QA CTA", subtext: "This is a QA-generated story record." },
  };

  const payload = {
    slug,
    title: "QA Success Story Integration",
    industry: "QA Validation",
    listImage: listUrl,
    heroImage: heroUrl,
    caseData: JSON.stringify(caseData),
    summary:
      "Integration QA record to verify dynamic success story media upload and rendering between admin CMS and frontend pages.",
    about: "This QA story validates the data flow from admin upload to public rendering for both listing card and detail hero components.",
    challenge:
      "The system must prove that media URLs uploaded through the admin flow are persisted and then rendered in all story surfaces without manual URL edits.",
    solution:
      "We uploaded media assets through the admin upload endpoint, created a story with structured caseData, and verified listing/detail render behavior.",
    results:
      "The new story is published with ImageKit-backed URLs and appears through backend APIs and frontend routes with expected image values.",
    contactCta: "Let us run your next growth sprint",
    published: true,
  };

  const create = await apiJson(`${BASE_URL}/api/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify(payload),
  });
  if (!create.ok) throw new Error(`Story create failed: ${JSON.stringify(create.data)}`);
  return { slug, listUrl, heroUrl, executionUrl };
}

function makeDummyPdf(text) {
  return `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 72 720 Td (${text}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000207 00000 n \ntrailer\n<< /Root 1 0 R /Size 5 >>\nstartxref\n303\n%%EOF\n`;
}

async function createResumeFiles(count) {
  const files = [];
  for (let i = 1; i <= count; i += 1) {
    const fileName = `resume-${i}.pdf`;
    const filePath = path.join(ASSET_DIR, fileName);
    await fs.writeFile(filePath, makeDummyPdf(`QA Candidate ${i}`), "utf8");
    files.push(fileName);
  }
  return files;
}

async function submitApplications(careerSlug, resumeFiles) {
  const ids = [];
  for (let i = 0; i < resumeFiles.length; i += 1) {
    const fileName = resumeFiles[i];
    const content = await fs.readFile(path.join(ASSET_DIR, fileName));
    const form = new FormData();
    form.append("fullName", `QA Candidate ${i + 1}`);
    form.append("email", `qa.candidate${i + 1}@example.com`);
    form.append("phone", `9000000${100 + i}`);
    form.append("city", "Mumbai");
    form.append("yearsExperience", `${2 + (i % 5)} years`);
    form.append("noticePeriod", "30 days");
    form.append("coverLetter", "I am submitting this QA application to validate end-to-end candidate form and resume handling workflow.");
    form.append("currentCompany", "");
    form.append("portfolioUrl", "");
    form.append("linkedInUrl", `https://www.linkedin.com/in/qa-candidate-${i + 1}`);
    form.append("expectedSalary", "");
    form.append("referralSource", "");
    form.append("workAuthorization", "");
    form.append("resume", new Blob([content], { type: "application/pdf" }), fileName);

    const res = await fetch(`${BASE_URL}/api/careers/${careerSlug}/applications`, {
      method: "POST",
      body: form,
    });
    const body = await res.json();
    if (!res.ok) throw new Error(`Application ${i + 1} failed: ${JSON.stringify(body)}`);
    ids.push(body.id);
  }
  return ids;
}

async function verifyFrontend(url, expectedText) {
  const res = await fetch(url);
  const text = await res.text();
  return { status: res.status, hasExpected: text.includes(expectedText) };
}

async function run() {
  const report = {
    created: {},
    verified: {},
  };

  const cookie = await loginAdmin();
  const blogImage = await uploadImage(cookie, "blog-thumb.jpg", "/bheard/blog");
  const storyListImage = await uploadImage(cookie, "story-list.jpg", "/bheard/success-stories/list");
  const storyHeroImage = await uploadImage(cookie, "story-hero.jpg", "/bheard/success-stories/hero");
  const storyExecImage = await uploadImage(cookie, "story-exec.jpg", "/bheard/success-stories/execution");

  const blog = await createBlog(cookie, blogImage);
  const story = await createStory(cookie, storyListImage, storyHeroImage, storyExecImage);

  const careers = await apiJson(`${BASE_URL}/api/careers`);
  if (!careers.ok || !careers.data?.data?.length) throw new Error("No active careers available for application test");
  const careerSlug = careers.data.data[0].slug;
  const careerId = careers.data.data[0].id;

  const resumes = await createResumeFiles(8);
  const applicationIds = await submitApplications(careerSlug, resumes);

  const adminApps = await apiJson(`${BASE_URL}/api/admin/career-applications?careerId=${careerId}`, {
    headers: { cookie },
  });
  if (!adminApps.ok) throw new Error(`Admin application list failed: ${JSON.stringify(adminApps.data)}`);

  const resumeChecks = [];
  for (const id of applicationIds) {
    const detail = await apiJson(`${BASE_URL}/api/admin/career-applications/${id}`, {
      headers: { cookie },
    });
    const resume = await fetch(`${BASE_URL}/api/admin/career-applications/${id}/resume`, {
      headers: { cookie },
    });
    resumeChecks.push({
      id,
      detailStatus: detail.status,
      resumeStatus: resume.status,
      resumeContentType: resume.headers.get("content-type") || "",
    });
  }

  const storyApi = await apiJson(`${BASE_URL}/api/stories`);
  const blogApi = await apiJson(`${BASE_URL}/api/blog`);
  const storyListFront = await verifyFrontend(`${BASE_URL}/success-stories`, story.slug);
  const storyDetailFront = await verifyFrontend(`${BASE_URL}/success-stories/${story.slug}`, story.heroUrl);
  const blogListFront = await verifyFrontend(`${BASE_URL}/blog`, blog.slug);
  const blogDetailFront = await verifyFrontend(`${BASE_URL}/blog/${blog.slug}`, blog.thumbnailUrl);

  report.created = {
    blogSlug: blog.slug,
    storySlug: story.slug,
    careerSlugUsed: careerSlug,
    applicationIds,
    uploadedImages: {
      blogImage,
      storyListImage,
      storyHeroImage,
      storyExecImage,
    },
  };
  report.verified = {
    storyApiStatus: storyApi.status,
    blogApiStatus: blogApi.status,
    storyListingFrontend: storyListFront,
    storyDetailFrontend: storyDetailFront,
    blogListingFrontend: blogListFront,
    blogDetailFrontend: blogDetailFront,
    adminApplicationsCount: adminApps.data?.data?.length ?? 0,
    resumeChecks,
  };

  const outPath = path.join(ASSET_DIR, "integration-report.json");
  await fs.writeFile(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

