import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { resolveAppLoginUrl, resolveRoute, startSite } from "../src/salebuddy/site-router.js";
import { renderBlogDocument } from "../src/salebuddy/blog-site.js";
import { blogArticles } from "../src/salebuddy/blog-content.js";
import { officialPages } from "../src/salebuddy/official-pages.js";

const sourceRoot = new URL("../", import.meta.url);
const readSource = (file) => readFile(new URL(file, sourceRoot), "utf8");

test("blog routes resolve clean and query fallback URLs", () => {
  assert.deepEqual(resolveRoute({ pathname: "/", search: "" }), { kind: "home" });
  assert.deepEqual(resolveRoute({ pathname: "/", search: "?entry=product" }), { kind: "home" });
  assert.deepEqual(resolveRoute({ pathname: "/b/", search: "" }), { kind: "app-login" });
  assert.deepEqual(resolveRoute({ pathname: "/b", search: "" }), { kind: "app-login" });
  assert.deepEqual(resolveRoute({ pathname: "/b/unknown", search: "" }), { kind: "official-page", slug: "not-found" });
  assert.deepEqual(resolveRoute({ pathname: "/blog/", search: "" }), { kind: "blog-index" });
  assert.deepEqual(resolveRoute({ pathname: "/blog/high-intent-customer-signals/", search: "" }), {
    kind: "blog-article",
    slug: "high-intent-customer-signals"
  });
  assert.deepEqual(resolveRoute({ pathname: "/", search: "?page=blog" }), { kind: "blog-index" });
  assert.deepEqual(resolveRoute({ pathname: "/", search: "?page=blog&article=after-price-question" }), {
    kind: "blog-article",
    slug: "after-price-question"
  });
  assert.deepEqual(resolveRoute({ pathname: "/blog/not-a-real-article/", search: "" }), {
    kind: "blog-article",
    slug: "not-a-real-article"
  });
  for (const page of officialPages.filter((item) => !["privacy", "terms"].includes(item.slug))) {
    assert.deepEqual(resolveRoute({ pathname: `/${page.slug}/`, search: "" }), {
      kind: "official-page",
      slug: page.slug
    });
  }
  assert.deepEqual(resolveRoute({ pathname: "/unknown/", search: "" }), {
    kind: "official-page",
    slug: "not-found"
  });
  assert.deepEqual(resolveRoute({ pathname: "/privacy/", search: "" }), { kind: "official-page", slug: "not-found" });
  assert.deepEqual(resolveRoute({ pathname: "/terms/", search: "" }), { kind: "official-page", slug: "not-found" });
});

test("login links hand off to the Agent application", () => {
  assert.deepEqual(resolveRoute({ pathname: "/", search: "?page=login" }), { kind: "app-login" });
  assert.equal(
    resolveAppLoginUrl({ protocol: "http:", hostname: "127.0.0.1" }),
    "http://127.0.0.1:8888/?page=login"
  );
  assert.equal(
    resolveAppLoginUrl({ protocol: "http:", hostname: "localhost" }),
    "http://localhost:8888/?page=login"
  );
  assert.equal(
    resolveAppLoginUrl({ protocol: "https:", hostname: "byering-official-homepage.vercel.app" }),
    "https://project-mercury-njus-projects.vercel.app/?page=login"
  );

  let assignedUrl = null;
  const result = startSite({
    documentRef: { body: {} },
    windowRef: {
      location: {
        pathname: "/",
        search: "?page=login",
        protocol: "http:",
        hostname: "127.0.0.1",
        assign(url) {
          assignedUrl = url;
        }
      }
    }
  });

  assert.equal(result, "http://127.0.0.1:8888/?page=login");
  assert.equal(assignedUrl, result);
});

test("inner-page product CTAs open a local version chooser without a home redirect", () => {
  for (const route of [
    { kind: "blog-index" },
    { kind: "blog-article", slug: blogArticles[0].slug },
    { kind: "official-page", slug: "cases" },
    { kind: "official-page", slug: "product" }
  ]) {
    const html = renderBlogDocument({ route });
    assert.match(html, /href="#product-entry" data-open-product-entry/);
    assert.match(html, /data-product-entry hidden/);
    assert.match(html, /role="dialog" aria-modal="true" aria-labelledby="product-entry-title"/);
    assert.match(html, /data-product-entry-link="pro-c" href="\/b\/"/);
    assert.match(html, /data-product-entry-link="shuban" href="https:\/\/ai.byering.com\/"/);
    assert.doesNotMatch(html, /\?entry=product/);
  }
  const productHtml = renderBlogDocument({ route: { kind: "official-page", slug: "product" } });
  assert.match(productHtml, /brand-contact-secondary" href="#product-entry" data-open-product-entry/);
});

test("static blog entries contain crawlable article content and metadata", async () => {
  const files = [
    "blog/index.html",
    "privacy/index.html",
    "terms/index.html",
    ...blogArticles.map((article) => `blog/${article.slug}/index.html`),
    "blog/not-found/index.html",
    ...officialPages.filter((page) => !["privacy", "terms"].includes(page.slug)).map((page) => `${page.slug}/index.html`),
    "404.html"
  ];

  for (const file of files) await access(new URL(file, sourceRoot));

  const index = await readSource("blog/index.html");
  assert.match(index, /data-blog-prerendered/);
  assert.match(index, /site-router\.js/);
  assert.match(index, /CollectionPage/);
  assert.match(index, /<meta property="og:title"/);
  assert.match(index, /<link rel="canonical"/);
  assert.match(index, /新闻中心/);
  assert.match(index, /aria-label="按分类筛选文章"/);
  assert.match(index, /data-blog-category=/);
  assert.equal((index.match(/class="blog-category-rail/g) || []).length, 1);

  for (const article of blogArticles) {
    const html = await readSource(`blog/${article.slug}/index.html`);
    assert.match(html, new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /data-blog-prerendered/);
    assert.match(html, /answer-block/);
    assert.match(html, /<details/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /<meta property="og:description"/);
    assert.match(html, /BlogPosting/);
    assert.match(html, /FAQPage/);
    assert.doesNotMatch(html, /(?:backend|electron|onboarding|agent-square)/i);
  }

  const blogNotFound = await readSource("blog/not-found/index.html");
  assert.match(blogNotFound, /noindex/);
  assert.match(blogNotFound, /文章没有找到/);

  for (const page of officialPages.filter((item) => !["privacy", "terms"].includes(item.slug))) {
    const html = await readSource(`${page.slug}/index.html`);
    assert.match(html, new RegExp(page.title));
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /百聆科技有限公司/);
  }

  const productPage = await readSource("product/index.html");
  assert.match(productPage, /从看见需求，到高效经营/);
  assert.match(productPage, /收费模式/);
  assert.match(productPage, /¥69\.99/);
  assert.match(productPage, /¥129\.99/);
  assert.match(productPage, /¥649/);
  assert.match(productPage, /¥39/);
  assert.match(productPage, /pricing-card/);
  for (const value of ["适合刚开始使用，按需处理线索", "适合日常持续使用，覆盖更多任务", "适合高频使用与密集任务", "每月线索上限", "3,000 积分", "8,000 积分", "40,000 积分"]) assert.match(productPage, new RegExp(value));
  assert.match(productPage, /试用与首月优惠资格以结算页为准/);
  assert.match(productPage, /基础版/);
  const articlePage = await readSource("blog/high-intent-customer-signals/index.html");
  assert.match(articlePage, /<details class="article-outline/);
  assert.match(articlePage, /aria-controls="mobile-navigation"/);
  assert.match(articlePage, /aria-current="page"/);
  const aboutOutlinePage = await readSource("about/index.html");
  for (const file of ["about/index.html", "product/index.html", "security/index.html", "cases/index.html", "pricing-rules/index.html"]) {
    const html = await readSource(file);
    assert.match(html, /blog-nav--inner-page/);
    assert.match(html, /class="company-header"/);
    assert.match(html, /<header class="company-header"[\s\S]*?<\/header>[\s\S]*?<div class="company-content"/);
    assert.doesNotMatch(html.match(/<nav class="nav-links"[\s\S]*?<\/nav>/)?.[0] || "", /账号与数据安全|href="\/security\//);
    assert.doesNotMatch(html.match(/<nav class="mobile-navigation"[\s\S]*?<\/nav>/)?.[0] || "", /账号与数据安全|href="\/security\//);
  }
  assert.match(aboutOutlinePage, /<nav class="company-section-nav"/);
  assert.doesNotMatch(aboutOutlinePage, /<details class="article-outline/);
  assert.match(aboutOutlinePage, /data-wechat-qr-modal/);
  assert.deepEqual(resolveRoute({ pathname: "/privacy/", search: "" }), { kind: "official-page", slug: "not-found" });
  assert.deepEqual(resolveRoute({ pathname: "/terms/", search: "" }), { kind: "official-page", slug: "not-found" });

  const casesPage = await readSource("cases/index.html");
  assert.match(casesPage, /历史客户成果/);
  for (const scenario of ["知识付费", "旅游", "汽车服务", "美妆"]) assert.match(casesPage, new RegExp(scenario));
  assert.match(casesPage, /旧官网历史案例/);
  assert.match(casesPage, /不代表当前 Agent 产品效果/);


  const platformsPage = await readSource("about/index.html");
  assert.match(await readSource("platforms/index.html"), /url=\/#platforms/);
  assert.match(platformsPage, /微信公众号/);
  assert.match(platformsPage, /视频号/);
  assert.match(platformsPage, /小红书主页/);
  assert.match(platformsPage, /知乎主页/);
  assert.match(platformsPage, /抖音主页/);
  assert.match(platformsPage, /data-wechat-qr-open/);
  assert.match(platformsPage, /data-wechat-qr-modal/);

  for (const file of ["about/index.html", "product/index.html", "security/index.html", "cases/index.html", "pricing-rules/index.html"]) {
    const html = await readSource(file);
    assert.doesNotMatch(html, /文案待(?:确认|补充|核实|审核|发布)|需由产品与法务|需核实实名授权|授权范围|任务范围|平台回执|交由人工|不构成正式/);
  }

  const aboutPage = await readSource("about/index.html");
  assert.match(aboutPage, /刘广兴/);
  assert.match(aboutPage, /薛亮/);
  assert.match(aboutPage, /沈道财/);
  assert.doesNotMatch(aboutPage, /摘自现行旧官网|旧官网列示|待统一口径|发布前需由本人/);
  assert.match(aboutPage, /assets\/founders\/ceo\.png/);
  assert.match(aboutPage, /bailing@byering\.com/);
  assert.match(aboutPage, /浙江省杭州市余杭区良睦路鼎创财富中心B2幢8F/);

  const genericNotFound = await readSource("404.html");
  assert.match(genericNotFound, /noindex/);
  assert.match(genericNotFound, /页面没有找到/);
  assert.doesNotMatch(genericNotFound, /href="\/(?:privacy|terms)\//);

  const sitemap = await readSource("sitemap.xml");
  assert.doesNotMatch(sitemap, /\/(?:privacy|terms|security)\//);
  for (const path of ["privacy/index.html", "terms/index.html"]) {
    const html = await readSource(path);
    assert.match(html, /name="robots" content="noindex,follow"/);
    assert.match(html, /页面暂未开放/);
    const otherPolicy = path.startsWith("privacy") ? "terms" : "privacy";
    assert.doesNotMatch(html, new RegExp(`href="/${otherPolicy}/"`));
  }
  assert.doesNotMatch(genericNotFound, /href="\/(?:privacy|terms)\//);
});

test("Vercel keeps known files and falls back unknown blog paths", async () => {
  const config = JSON.parse(await readSource("vercel.json"));
  assert.deepEqual(config.routes, [
    { handle: "filesystem" },
    { src: "/privacy/?$", dest: "/privacy/index.html" },
    { src: "/terms/?$", dest: "/terms/index.html" },
    { src: "/blog/(.*)", dest: "/blog/not-found/index.html" }
  ]);
  const noindexPaths = ["privacy/index.html", "terms/index.html"];
  for (const path of noindexPaths) assert.ok(config.routes.some((route) => route.dest === `/${path}`));
  const notFoundHtml = await readSource("not-found/index.html");
  assert.doesNotMatch(notFoundHtml, /href="\/(?:privacy|terms)\//);
  assert.match(notFoundHtml, /canonical" href="https:\/\/byering-official-homepage\.vercel\.app\/"/);
  const site404 = await readSource("404.html");
  assert.doesNotMatch(site404, /href="\/(?:privacy|terms)\//);
});
