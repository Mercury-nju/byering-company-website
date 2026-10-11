import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { blogArticles } from "../src/salebuddy/blog-content.js";
import { officialPages } from "../src/salebuddy/official-pages.js";
import { renderBlogDocument } from "../src/salebuddy/blog-site.js";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptRoot, "..");

const pages = [
  { file: "blog/index.html", route: { kind: "blog-index" } },
  ...blogArticles.map((article) => ({
    file: `blog/${article.slug}/index.html`,
    route: { kind: "blog-article", slug: article.slug }
  })),
  ...officialPages.map((page) => ({
    file: `${page.slug}/index.html`,
    route: { kind: "official-page", slug: page.slug }
  })),
  { file: "404.html", route: { kind: "site-not-found" } },
  { file: "not-found/index.html", route: { kind: "site-not-found" } },
  { file: "blog/not-found/index.html", route: { kind: "blog-not-found" } },
  { file: "privacy/index.html", route: { kind: "policy-not-found", policyPath: "privacy" } },
  { file: "terms/index.html", route: { kind: "policy-not-found", policyPath: "terms" } }
];

for (const page of pages) {
  const target = join(projectRoot, page.file);
  await mkdir(dirname(target), { recursive: true });
  const html = renderBlogDocument({ route: page.route }).replace(/[ \t]+$/gm, "");
  await writeFile(target, html, "utf8");
}

console.log(`Generated ${pages.length} static content pages.`);
