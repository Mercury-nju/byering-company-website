import { renderFactVisual, renderPlanComparison } from "./data-visuals.js?v=theme-20261012";
import { blogArticles, getArticleBySlug } from "./blog-content.js?v=theme-20261012";
import { getOfficialPage, officialPages } from "./official-pages.js?v=theme-20261012";

const BLOG_ROOT_ID = "byering-blog-root";
const SITE_ORIGIN = "https://byering-official-homepage.vercel.app";
const SHARE_IMAGE = `${SITE_ORIGIN}/assets/bailing-hero-mountains.png`;

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function jsonForScript(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function articlePath(slug) {
  return `/blog/${slug}/`;
}

function metadataForRoute(route) {
  const article = route.kind === "blog-article" ? getArticleBySlug(route.slug) : null;
  const officialPage = route.kind === "official-page" ? getOfficialPage(route.slug) : null;
  const notFound = route.kind === "blog-not-found" || (route.kind === "blog-article" && !article);
  if (article) {
    return {
      title: `${article.title}｜百聆新闻中心`,
      description: article.description,
      canonical: `${SITE_ORIGIN}${articlePath(article.slug)}`,
      type: "article",
      image: SHARE_IMAGE,
      noindex: false
    };
  }
  if (notFound) {
    return {
      title: "文章没有找到｜百聆新闻中心",
      description: "这篇文章暂时不存在，回到 百聆新闻中心继续阅读获客知识。",
      canonical: `${SITE_ORIGIN}/blog/`,
      type: "website",
      image: SHARE_IMAGE,
      noindex: true
    };
  }
  if (officialPage) {
    return {
      title: `${officialPage.title}｜百聆科技有限公司`,
      description: officialPage.description,
      canonical: `${SITE_ORIGIN}/${officialPage.slug}/`,
      type: "website",
      image: SHARE_IMAGE,
      noindex: false
    };
  }
  if (route.kind === "policy-not-found") {
    const title = route.policyPath === "privacy" ? "隐私政策" : "服务条款";
    return {
      title: `${title}页面暂未开放｜百聆`,
      description: `${title}页面暂未开放，请返回百聆官网浏览可用内容。`,
      canonical: `${SITE_ORIGIN}/`,
      type: "website",
      image: SHARE_IMAGE,
      noindex: true
    };
  }
  if (route.kind === "official-page" || route.kind === "site-not-found") {
    return {
      title: "页面没有找到｜百聆",
      description: "该信息页暂时不存在，返回百聆官网查看产品与公司信息。",
      canonical: `${SITE_ORIGIN}/`,
      type: "website",
      image: SHARE_IMAGE,
      noindex: true
    };
  }
  if (route.kind === "blog-index") {
    return {
      title: "百聆新闻中心｜获客资料",
      description: "查阅百聆获客资料，了解客户需求识别、线索筛选与跟进方法。",
      canonical: `${SITE_ORIGIN}/blog/`,
      type: "website",
      image: SHARE_IMAGE,
      noindex: false
    };
  }
  return {
    title: "百聆新闻中心｜获客资料",
    description: "查阅百聆获客资料，了解客户需求识别、线索筛选与跟进方法。",
    canonical: `${SITE_ORIGIN}/blog/`,
    type: "website",
    image: SHARE_IMAGE,
    noindex: false
  };
}

function renderMetaTags(route) {
  const meta = metadataForRoute(route);
  return `
    <title>${escapeHTML(meta.title)}</title>
    <meta name="description" content="${escapeHTML(meta.description)}">
    ${meta.noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow">'}
    <link rel="canonical" href="${meta.canonical}">
    <meta property="og:type" content="${meta.type}">
    <meta property="og:title" content="${escapeHTML(meta.title)}">
    <meta property="og:description" content="${escapeHTML(meta.description)}">
    <meta property="og:url" content="${meta.canonical}">
    <meta property="og:image" content="${meta.image}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHTML(meta.title)}">
    <meta name="twitter:description" content="${escapeHTML(meta.description)}">
    <meta name="twitter:image" content="${meta.image}">
  `;
}

function articleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "百聆科技有限公司" },
    keywords: article.keywords.join(", "),
    mainEntityOfPage: `${SITE_ORIGIN}${articlePath(article.slug)}`,
    image: [SHARE_IMAGE]
  };
}

function faqSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}

function indexSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "百聆新闻中心",
    description: metadataForRoute({ kind: "blog-index" }).description,
    url: `${SITE_ORIGIN}/blog/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_ORIGIN}${articlePath(article.slug)}`,
        name: article.title
      }))
    }
  };
}

function renderStructuredData(route) {
  const article = route.kind === "blog-article" ? getArticleBySlug(route.slug) : null;
  const page = route.kind === "official-page" ? getOfficialPage(route.slug) : null;
  const pageSchema = page ? {
    "@context": "https://schema.org",
    "@type": page.slug === "about" ? "AboutPage" : "WebPage",
    name: page.title,
    description: page.description,
    url: `${SITE_ORIGIN}/${page.slug}/`,
    about: { "@type": "Organization", name: "百聆", legalName: "百聆科技有限公司" }
  } : null;
  const schemas = article ? [articleSchema(article), faqSchema(article)] : pageSchema ? [pageSchema] : [indexSchema()];
  return schemas.map((schema) => `<script type="application/ld+json">${jsonForScript(schema)}</script>`).join("");
}

function renderNav(currentPage = "") {
  const links = [
    ["product", "产品与服务", "/product/"],
    ["cases", "行业实践", "/cases/"],
    ["results", "客户成果", "/#results"],
    ["blog", "新闻中心", "/blog/"],
    ["about", "关于百聆", "/about/"]
  ];
  const items = links.map(([slug, label, href]) => `<a href="${href}"${currentPage === slug ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const innerPageClass = ["about", "product", "cases", "security", "pricing-rules", "blog"].includes(currentPage) ? " blog-nav--inner-page" : "";
  return `
    <header class="marketing-nav blog-nav${innerPageClass}" data-blog-nav-shell>
      <a class="brand-lockup" href="/" aria-label="百聆首页">
        <img src="/assets/bailing-logo-mark.png" alt="">
        <span>百聆</span>
      </a>
      <nav class="nav-links" aria-label="主要导航">
        ${items}
      </nav>
      <button class="nav-menu-toggle" type="button" data-nav-menu-toggle aria-label="打开导航" aria-controls="mobile-navigation" aria-expanded="false"><span aria-hidden="true"></span></button>
      <a class="nav-cta" href="#product-entry" data-open-product-entry>产品入口</a>
      <nav class="mobile-navigation" id="mobile-navigation" aria-label="移动端导航" aria-hidden="true" inert hidden>
        ${links.map(([slug, label, href]) => `<a href="${href}"${currentPage === slug ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
    </header>
  `;
}

function renderArticleCard(article, featured = false) {
  return `
    <a class="blog-card${featured ? " blog-card--featured" : ""} reveal" href="${articlePath(article.slug)}">
      <div class="blog-card__top"><span>${escapeHTML(article.category)}</span><span>${escapeHTML(article.readTime)}</span></div>
      <h3>${escapeHTML(article.title)}</h3>
      <p>${escapeHTML(article.description)}</p>
      <div class="blog-card__bottom"><span aria-hidden="true">↗</span></div>
    </a>
  `;
}

function renderBlogIndex() {
  const [featured, ...rest] = blogArticles;
  return `
    <div class="blog-page blog-page--index">
      ${renderNav("blog")}
      <header class="news-header"><span class="section-index">BAILING / NEWS</span><h1>新闻中心</h1></header>
      <main id="blog-library" class="blog-main">
        <div class="blog-intro reveal"><h2>获客资料</h2><p>客户需求识别、线索筛选与跟进方法。</p></div>
        <div class="blog-featured">${renderArticleCard(featured, true)}</div>
        <div class="blog-category-rail reveal" role="group" aria-label="按分类筛选文章">
          ${["全部", ...new Set(blogArticles.map((article) => article.category))].map((category, index) => `<button type="button" data-blog-category="${escapeHTML(category)}" aria-pressed="${index === 0}">${escapeHTML(category)}</button>`).join("")}
        </div>
        <p class="blog-filter-status" data-blog-filter-status aria-live="polite"></p>
        <div class="blog-grid" data-blog-grid>${rest.map((article, index) => renderArticleCard(article, false).replace(" reveal\"", ` reveal reveal--delay-${(index % 3) + 1}\"`).replace("class=\"blog-card", `data-category=\"${escapeHTML(article.category)}\" class=\"blog-card`)).join("")}</div>
      </main>
      ${renderBlogFooter()}
    </div>
  `;
}

function renderSection(section, index) {
  const list = section.list?.length
    ? `<${section.ordered ? "ol" : "ul"}>${section.list.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</${section.ordered ? "ol" : "ul"}>`
    : "";
  return `<section class="article-section" id="section-${index}"><h2>${escapeHTML(section.heading)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}${list}</section>`;
}

function renderArticle(article) {
  return `
    <div class="blog-page blog-page--article">
          ${renderNav("blog")}
      <main class="article-main">
        <div class="article-breadcrumb"><a href="/blog/">新闻中心</a><span>/</span><span>${escapeHTML(article.category)}</span></div>
        <article class="article-reading">
          <header class="article-header reveal">
            <div class="article-meta"><span>${escapeHTML(article.category)}</span><span>${escapeHTML(article.readTime)}</span></div>
          <h1>${escapeHTML(article.title)}</h1>
            <p class="article-dek">${escapeHTML(article.description)}</p>
          </header>
          <div class="answer-block reveal reveal--delay-1"><span>直接回答</span><p>${escapeHTML(article.answer)}</p></div>
          <details class="article-outline reveal reveal--delay-2"><summary>本文要点 <span aria-hidden="true">＋</span></summary><ol>${article.outline.map((item, index) => `<li><a href="#section-${index + 1}">${escapeHTML(item)}</a></li>`).join("")}</ol></details>
          <div class="article-body">${article.sections.map((section, index) => renderSection(section, index + 1)).join("")}</div>
          <section class="article-faq"><div class="article-faq__heading"><span>继续阅读</span><h2>常见问题</h2></div><div class="article-faq__list">${article.faq.map((item) => `<details><summary>${escapeHTML(item.question)}<span>+</span></summary><p>${escapeHTML(item.answer)}</p></details>`).join("")}</div></section>
        </article>
        ${renderRelated(article)}
      </main>
      <section class="blog-closing"><span>BYERING / LET’S TALK</span><h2>让技术，<br><em>走进你的业务。</em></h2><p>聊聊你的行业、客户与经营目标，找到适合的合作方式。</p><div class="brand-contact-actions"><a class="primary-button" href="mailto:bailing@byering.com">联系百聆 <span aria-hidden="true">↗</span></a><a class="brand-contact-secondary" href="/product/">了解产品与服务 <span aria-hidden="true">→</span></a></div></section>
      ${renderBlogFooter()}
    </div>
  `;
}

function renderRelated(article) {
  const related = blogArticles.filter((item) => item.slug !== article.slug).slice(0, 2);
  return `<section class="related-articles"><div><span>继续阅读</span><h2>把方法带回工作里。</h2></div><div class="related-articles__grid">${related.map((item) => renderArticleCard(item)).join("")}</div></section>`;
}

function renderNotFound() {
  return `
    <div class="blog-page blog-page--not-found">
      ${renderNav("blog")}
      <main class="not-found-main"><span class="section-index">BYERING / 404</span><h1>页面没有找到。</h1><p>这条页面地址暂时不存在，返回官网继续了解产品与公司信息。</p><a class="primary-button" href="/">回到官网 <span>↗</span></a></main>
      ${renderBlogFooter()}
    </div>
  `;
}

function renderPolicyNotFound(policyPath) {
  const title = policyPath === "privacy" ? "隐私政策" : "服务条款";
  return `
    <div class="blog-page blog-page--not-found">
      ${renderNav()}
      <main class="not-found-main"><span class="section-index">BYERING / POLICY</span><h1>${title}页面暂未开放。</h1><p>该页面内容正在整理，暂时无法提供。请返回官网继续浏览。</p><a class="primary-button" href="/">返回官网 <span>↗</span></a></main>
      ${renderBlogFooter()}
    </div>
  `;
}

function renderBlogNotFound() {
  return `
    <div class="blog-page blog-page--not-found">
      ${renderNav("blog")}
      <main class="not-found-main"><span class="section-index">BYERING / 404</span><h1>文章没有找到。</h1><p>这篇内容暂时不在这里，回到新闻中心继续阅读。</p><a class="primary-button" href="/blog/">回到新闻中心 <span>↗</span></a></main>
      ${renderBlogFooter()}
    </div>
  `;
}

function renderFacts(facts, pageSlug, sectionHeading, planDetails = []) {
  if (pageSlug === "product" && sectionHeading === "收费模式") {
    const plans = facts.filter(([label]) => ["基础版", "标准版", "高级版"].includes(label));
    const extras = facts.filter(([label]) => !["基础版", "标准版", "高级版"].includes(label));
    const planCards = plans.map(([label, value]) => {
      const [monthly, annual, firstMonth] = value.split("；");
      const detail = planDetails.find((item) => item.name === label);
      return `<article class="pricing-card"><h3>${escapeHTML(label)}</h3>${detail ? `<p class="pricing-card__description">${escapeHTML(detail.description)}</p>` : ""}<strong>${escapeHTML(monthly.replace("/月", ""))}<small>/月</small></strong><dl><div><dt>年付</dt><dd>${escapeHTML(annual.replace("/年", ""))}<small>/年</small></dd></div><div><dt>首月</dt><dd>${escapeHTML(firstMonth.replace("首月 ", ""))}</dd></div>${detail ? `<div><dt>每月积分</dt><dd>${escapeHTML(detail.monthlyCredits)}</dd></div><div><dt>每月线索上限</dt><dd>${escapeHTML(detail.monthlyLeadLimit)}</dd></div>` : ""}</dl></article>`;
    }).join("");
    const extraFacts = extras.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("");
    return `<div class="pricing-grid">${planCards}</div>${renderPlanComparison(planDetails)}<dl class="official-facts official-facts--pricing-extras">${extraFacts}</dl>`;
  }
  const visual = renderFactVisual(facts, pageSlug, sectionHeading);
  if (visual) return visual;
  const items = facts.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("");
  return `<dl class="official-facts">${items}</dl>`;
}

function renderCapabilities(capabilities) {
  return `<div class="capability-list">${capabilities.map((capability, index) => `
    <article class="capability-row">
      <div class="capability-copy"><span class="capability-number">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHTML(capability.title)}</h3><p>${escapeHTML(capability.description)}</p></div>
      ${capability.example ? `<div class="capability-example"><div class="capability-example__bar"><span>${escapeHTML(capability.example.label)}</span><small>使用示意</small></div><ol>${capability.example.lines.map((line) => `<li><span aria-hidden="true"></span>${escapeHTML(line)}</li>`).join("")}</ol></div>` : ""}
    </article>`).join("")}</div>`;
}

function renderGallery(gallery) {
  const items = Array.isArray(gallery) ? gallery : [gallery];
  return `<div class="official-gallery">${items.map((item) => `<figure><a href="${escapeHTML(item.image)}" target="_blank" rel="noopener noreferrer" aria-label="查看${escapeHTML(item.title)}大图"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy"></a><figcaption><strong>${escapeHTML(item.title)}</strong>${item.caption ? `<span>${escapeHTML(item.caption)}</span>` : ""}</figcaption></figure>`).join("")}</div>`;
}

function renderCompanySummary(page) {
  const summaries = {
    about: { label: "公司概览", facts: [["2021", "百聆科技成立"], ["AI 营销", "持续深耕客户经营"], ["Agent", "行业能力的新载体"]] },
    product: { label: "两种服务方式", facts: [["个人版", "自助开启日常获客"], ["企业版", "按业务配置与交付"], ["同一份积累", "服务不同经营方式"]] },
    cases: { label: "行业实践", facts: [["汽车", "车企与经销商"], ["二手车", "客户沟通与线索经营"], ["Agent", "能力延续与场景应用"]] },
    security: { label: "使用前了解", facts: [["账号", "自主连接与管理"], ["数据", "用于提供相关服务"], ["沟通", "重要事项由你决定"]] },
    "pricing-rules": { label: "费用说明", facts: [["套餐", "账号、云电脑与额度"], ["AI 积分", "按使用量计量"], ["补充包", "按需增加积分"]] }
  };
  const summary = summaries[page.slug];
  if (!summary) return "";
  return `<aside class="company-summary" aria-label="${escapeHTML(summary.label)}"><span class="company-summary-label">${escapeHTML(summary.label)}</span>${summary.facts.map(([value, label]) => `<div><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`).join("")}</aside>`;
}

function renderOfficialPage(page) {
  const sections = page.sections.map((section, index) => `
    <section class="article-section official-section company-section${section.founders ? " company-section--founders" : ""}${section.gallery ? " company-section--gallery" : ""}${page.slug === "cases" && index < 2 ? " company-section--case" : ""}" id="section-${index + 1}" tabindex="-1">
      <div class="company-section-title"><span>${String(index + 1).padStart(2, "0")}</span><h2>${escapeHTML(section.heading)}</h2></div>
      <div class="company-section-content">
      ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
      ${section.services ? `<div class="company-services">${section.services.map((service) => `<article><span>${escapeHTML(service.audience)}</span><h3>${escapeHTML(service.name)}</h3><p>${escapeHTML(service.description)}</p><ul>${service.features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join("")}</ul><a href="${escapeHTML(service.href.includes("?entry=product") ? "#product-entry" : service.href)}"${service.href.includes("?entry=product") ? " data-open-product-entry" : ""}>${escapeHTML(service.label)} <span aria-hidden="true">↗</span></a></article>`).join("")}</div>` : ""}
      ${section.capabilities ? renderCapabilities(section.capabilities) : ""}
      ${section.gallery ? renderGallery(section.gallery) : ""}
      ${section.facts ? renderFacts(section.facts, page.slug, section.heading, section.planDetails) : ""}
      ${section.links ? `<div class="official-links">${section.links.map((link) => `<a href="${escapeHTML(link.href.includes("?entry=product") ? "#product-entry" : link.href)}"${link.href.includes("?entry=product") ? " data-open-product-entry" : ""}>${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div>` : ""}
      ${section.founders ? `<div class="founder-grid">${section.founders.map((founder) => `<article class="founder-profile"><img src="${escapeHTML(founder.image)}" alt="${escapeHTML(founder.name)}，${escapeHTML(founder.role)}"><div><span>${escapeHTML(founder.role)}</span><h3>${escapeHTML(founder.name)}</h3><ul>${founder.background.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div></article>`).join("")}</div>` : ""}
      ${section.socialLinks ? `<div class="official-social-links">${section.socialLinks.map((link) => link.action === "wechat-qr" ? `<button type="button" class="official-social-link" data-wechat-qr-open>${escapeHTML(link.label)} <span aria-hidden="true">↗</span></button>` : `<a class="official-social-link" href="${escapeHTML(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div>` : ""}
      ${section.notice ? `<p class="official-notice">${escapeHTML(section.notice)}</p>` : ""}
      </div>
    </section>
  `).join("");
  return `
    <div class="blog-page blog-page--official company-page company-page--${escapeHTML(page.slug)}">
      <a class="company-skip-link" href="#company-content">跳至主要内容</a>
      ${renderNav(page.slug)}
      <main class="company-main">
        <header class="company-header">
          <div class="article-breadcrumb"><a href="/">首页</a><span aria-hidden="true">/</span><span>${escapeHTML(page.title)}</span></div>
          <div class="company-heading-grid"><div><span class="section-index">${escapeHTML(page.eyebrow)}</span><h1>${escapeHTML(page.heading)}</h1><p>${escapeHTML(page.intro)}</p><div class="company-header-actions">${page.slug === "product" ? `<a class="primary-button" href="#product-entry" data-open-product-entry>进入产品 <span aria-hidden="true">↗</span></a><a class="company-text-link" href="mailto:bailing@byering.com">咨询企业服务 <span aria-hidden="true">↗</span></a>` : `<a class="company-text-link" href="#section-1">${page.slug === "about" ? "了解公司与团队" : page.slug === "cases" ? "查看历史案例" : "查看详细说明"} <span aria-hidden="true">↓</span></a>`}</div></div>${renderCompanySummary(page)}</div>
        </header>
        <nav class="company-section-nav" aria-label="${escapeHTML(page.title)}页面导航">${page.sections.map((section, index) => `<a href="#section-${index + 1}">${escapeHTML(section.navLabel || section.heading)}</a>`).join("")}</nav>
        <div class="company-content" id="company-content" tabindex="-1">
          ${page.notice ? `<p class="official-page-notice">${escapeHTML(page.notice)}</p>` : ""}
          ${page.slug === "cases" ? sections.replace('<section class="article-section', '<div class="company-group-label">历史客户成果</div><section class="article-section').replace('<section class="article-section official-section company-section" id="section-3"', '<div class="company-group-label company-group-label--scenarios">能力延续与应用示意</div><section class="article-section official-section company-section" id="section-3"') : sections}
        </div>
      </main>
      <section class="blog-closing official-closing"><span>BYERING / LET’S TALK</span><h2>让技术，<br><em>走进你的业务。</em></h2><p>聊聊你的行业、客户与经营目标，找到适合的合作方式。</p><div class="brand-contact-actions"><a class="primary-button" href="mailto:bailing@byering.com">联系百聆 <span aria-hidden="true">↗</span></a>${page.slug === "product" ? `<a class="brand-contact-secondary" href="#product-entry" data-open-product-entry>进入产品 <span aria-hidden="true">→</span></a>` : `<a class="brand-contact-secondary" href="/product/">了解产品与服务 <span aria-hidden="true">→</span></a>`}</div></section>
      ${renderBlogFooter()}
      <div class="wechat-qr-modal" data-wechat-qr-modal hidden><button class="wechat-qr-backdrop" type="button" data-wechat-qr-close aria-label="关闭公众号二维码"></button><section class="wechat-qr-dialog" role="dialog" aria-modal="true" aria-labelledby="wechat-qr-title"><button class="wechat-qr-close" type="button" data-wechat-qr-close aria-label="关闭">×</button><span class="section-index">BYERING / WECHAT</span><h2 id="wechat-qr-title">关注官方公众号</h2><img src="/assets/wechat-official-qr.png" alt="百聆官方微信公众号二维码"><p>微信号：AIBailingkeji</p></section></div>
    </div>
  `;
}

function renderProductEntry() {
  return `<div class="product-entry-modal" id="product-entry" data-product-entry hidden>
    <div class="product-entry-modal__backdrop" data-product-entry-close></div>
    <section class="product-entry-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-entry-title">
      <button class="product-entry-modal__close" type="button" data-product-entry-close aria-label="关闭产品入口">×</button>
      <span class="section-index">BYERING</span><h2 id="product-entry-title">选择适合你的版本</h2>
      <p class="product-entry-modal__intro">自助经营日常获客，或为企业配置协作流程。</p>
      <div class="product-entry-grid">
        <a class="product-entry-card product-entry-card--pro" data-product-entry-link="pro-c" href="/b/">
          <div class="product-entry-card__brand"><img class="product-entry-card__logo" src="/assets/bailing-logo-mark.png" alt=""><div><span class="product-entry-card__eyebrow">个人／小团队</span><strong>百聆个人版</strong></div></div>
          <span class="product-entry-card__copy">个人与小团队的智能获客管家。</span><b>进入 百聆个人版 <span>↗</span></b>
        </a>
        <a class="product-entry-card product-entry-card--enterprise" data-product-entry-link="shuban" href="https://ai.byering.com/">
          <div class="product-entry-card__brand"><img class="product-entry-card__logo" src="/assets/bailing-logo-mark.png" alt=""><div><span class="product-entry-card__eyebrow">企业</span><strong>百聆企业版</strong></div></div>
          <span class="product-entry-card__copy">企业客户线索、沟通和团队协作。</span><b>进入百聆企业版 <span>↗</span></b>
        </a>
      </div>
    </section>
  </div>`;
}

function renderBlogFooter() {
  return `<footer class="marketing-footer blog-footer"><a class="brand-lockup" href="/"><img src="/assets/bailing-logo-mark.png" alt=""><span>百聆</span></a><span>百聆科技有限公司</span><div>${officialPages.filter((page) => !["not-found", "security", "pricing-rules"].includes(page.slug)).map((page) => `<a href="/${page.slug}/">${escapeHTML(page.slug === "security" ? "账号与数据安全" : page.title)}</a>`).join("")}<a href="/blog/">新闻中心</a><a href="#product-entry" data-open-product-entry>产品入口</a><span>© 2026 百聆</span></div></footer>${renderProductEntry()}`;
}

function routeContent(route) {
  if (route.kind === "blog-index") return renderBlogIndex();
  if (route.kind === "blog-article" && getArticleBySlug(route.slug)) return renderArticle(getArticleBySlug(route.slug));
  if (route.kind === "site-not-found") return renderNotFound();
  if (route.kind === "policy-not-found") return renderPolicyNotFound(route.policyPath);
  if (route.kind === "official-page" && getOfficialPage(route.slug)) return renderOfficialPage(getOfficialPage(route.slug));
  if (route.kind === "blog-not-found") return renderBlogNotFound();
  return renderNotFound();
}

function applyMetadata(documentRef, route) {
  const meta = metadataForRoute(route);
  documentRef.title = meta.title;
  documentRef.documentElement.lang = "zh-CN";
  const ensureMeta = (selector, attributes) => {
    let element = documentRef.head.querySelector(selector);
    if (!element) {
      element = documentRef.createElement("meta");
      documentRef.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  };
  ensureMeta('meta[name="description"]', { name: "description", content: meta.description });
  ensureMeta('meta[name="robots"]', { name: "robots", content: meta.noindex ? "noindex,follow" : "index,follow" });
  ensureMeta('meta[property="og:type"]', { property: "og:type", content: meta.type });
  ensureMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
  ensureMeta('meta[property="og:description"]', { property: "og:description", content: meta.description });
  ensureMeta('meta[property="og:url"]', { property: "og:url", content: meta.canonical });
  ensureMeta('meta[property="og:image"]', { property: "og:image", content: meta.image });
  let canonical = documentRef.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = documentRef.createElement("link");
    canonical.rel = "canonical";
    documentRef.head.appendChild(canonical);
  }
  canonical.href = meta.canonical;
  let schema = documentRef.head.querySelector('script[data-blog-schema]');
  if (!schema) {
    schema = documentRef.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.blogSchema = "true";
    documentRef.head.appendChild(schema);
  }
  const article = route.kind === "blog-article" ? getArticleBySlug(route.slug) : null;
  const page = route.kind === "official-page" ? getOfficialPage(route.slug) : null;
  const pageSchema = page ? {
    "@context": "https://schema.org",
    "@type": page.slug === "about" ? "AboutPage" : "WebPage",
    name: page.title,
    description: page.description,
    url: `${SITE_ORIGIN}/${page.slug}/`,
    about: { "@type": "Organization", name: "百聆", legalName: "百聆科技有限公司" }
  } : null;
  schema.textContent = jsonForScript(article ? articleSchema(article) : pageSchema || indexSchema());
}

function enhanceBlogPage(root, documentRef, windowRef) {
  const nav = root.querySelector("[data-blog-nav-shell]");
  const menuToggle = root.querySelector("[data-nav-menu-toggle]");
  const mobileNavigation = root.querySelector("#mobile-navigation");
  const navScrim = root.querySelector("[data-nav-scrim]");
  const closeMenu = () => {
    if (!mobileNavigation || mobileNavigation.hidden) return;
    mobileNavigation.hidden = true;
    mobileNavigation.setAttribute("aria-hidden", "true");
    mobileNavigation.inert = true;
    if (navScrim) navScrim.hidden = true;
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "打开导航");
  };
  menuToggle?.addEventListener("click", () => {
    const opening = mobileNavigation.hidden;
    mobileNavigation.hidden = !opening;
    mobileNavigation.setAttribute("aria-hidden", String(!opening));
    mobileNavigation.inert = !opening;
    if (navScrim) navScrim.hidden = !opening;
    menuToggle.setAttribute("aria-expanded", String(opening));
    menuToggle.setAttribute("aria-label", opening ? "关闭导航" : "打开导航");
    if (opening) mobileNavigation.querySelector('a[aria-current="page"]')?.focus?.();
  });
  mobileNavigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  navScrim?.addEventListener("click", closeMenu);
  const updateNav = () => nav?.classList.toggle("is-scrolled", (windowRef?.scrollY || 0) > 48);
  windowRef?.addEventListener?.("scroll", updateNav, { passive: true });
  updateNav();
  const moveToSection = (hash, updateHistory = false) => {
    const target = documentRef.getElementById(hash.slice(1));
    if (!target) return;
    if (updateHistory) windowRef.history?.pushState?.(null, "", hash);
    target.scrollIntoView({ behavior: "instant", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    root.querySelectorAll(".company-section-nav a").forEach((link) => {
      if (link.getAttribute("href") === hash) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  root.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (link.hasAttribute("data-open-product-entry")) return;
      if (!documentRef.getElementById(hash.slice(1))) return;
      event.preventDefault();
      moveToSection(hash, true);
    });
  });
  windowRef?.addEventListener?.("hashchange", () => moveToSection(windowRef.location.hash));
  windowRef?.requestAnimationFrame?.(() => moveToSection(windowRef.location.hash));
  windowRef?.matchMedia?.("(min-width: 1001px)").addEventListener?.("change", (event) => {
    if (event.matches) closeMenu();
  });
  documentRef.addEventListener?.("click", (event) => {
    if (!nav?.contains(event.target)) closeMenu();
  });
  const productEntry = root.querySelector("[data-product-entry]");
  const productBackground = [nav, root.querySelector("main"), root.querySelector("footer"), root.querySelector(".blog-closing")].filter(Boolean);
  let productTrigger = null;
  let previousInert = [];
  const closeProductEntry = () => {
    if (!productEntry || productEntry.hidden) return;
    productEntry.hidden = true;
    documentRef.body.classList.remove("product-entry-open");
    productBackground.forEach((region, index) => { region.inert = previousInert[index]; });
    productTrigger?.focus?.();
    productTrigger = null;
  };
  root.querySelectorAll("[data-open-product-entry]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (!productEntry) return;
      closeMenu();
      productTrigger = link.closest?.("#mobile-navigation") ? menuToggle : link;
      previousInert = productBackground.map((region) => region.inert);
      productEntry.hidden = false;
      documentRef.body.classList.add("product-entry-open");
      productBackground.forEach((region) => { region.inert = true; });
      productEntry.querySelector(".product-entry-modal__close")?.focus?.();
    });
  });
  root.querySelectorAll("[data-product-entry-close]").forEach((button) => button.addEventListener("click", closeProductEntry));
  documentRef.addEventListener?.("keydown", (event) => {
    if (!productEntry || productEntry.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeProductEntry();
    }
    if (event.key !== "Tab") return;
    const focusable = [...productEntry.querySelectorAll('button, a[href]')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && documentRef.activeElement === first) {
      event.preventDefault();
      last?.focus?.();
    } else if (!event.shiftKey && documentRef.activeElement === last) {
      event.preventDefault();
      first?.focus?.();
    }
  });
  const wechatModal = root.querySelector("[data-wechat-qr-modal]");
  let wechatTrigger = null;
  const closeWechatModal = () => {
    if (!wechatModal) return;
    wechatModal.hidden = true;
    documentRef.body.classList.remove("wechat-qr-open");
    wechatTrigger?.focus?.();
    wechatTrigger = null;
  };
  root.querySelectorAll("[data-wechat-qr-open]").forEach((button) => button.addEventListener("click", () => {
    if (!wechatModal) return;
    wechatTrigger = button;
    wechatModal.hidden = false;
    documentRef.body.classList.add("wechat-qr-open");
    wechatModal.querySelector("[data-wechat-qr-close]")?.focus?.();
  }));
  root.querySelectorAll("[data-wechat-qr-close]").forEach((button) => button.addEventListener("click", closeWechatModal));
  documentRef.addEventListener?.("keydown", (event) => {
    if (event.key === "Escape") {
      if (wechatModal && !wechatModal.hidden) closeWechatModal();
      else if (mobileNavigation && !mobileNavigation.hidden) {
        closeMenu();
        menuToggle?.focus?.();
      }
    }
    if (event.key !== "Tab" || !wechatModal || wechatModal.hidden) return;
    const focusable = [...wechatModal.querySelectorAll('button, a[href]')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && documentRef.activeElement === first) {
      event.preventDefault();
      last?.focus?.();
    } else if (!event.shiftKey && documentRef.activeElement === last) {
      event.preventDefault();
      first?.focus?.();
    }
  });
  root.querySelectorAll("[data-blog-category]").forEach((button) => button.addEventListener("click", () => {
    const category = button.dataset.blogCategory;
    const cards = [...(root.querySelectorAll("[data-blog-grid] [data-category]") || [])];
    const visibleCount = cards.filter((card) => {
      const visible = category === "全部" || card.dataset.category === category;
      card.hidden = !visible;
      return visible;
    }).length;
    root.querySelectorAll("[data-blog-category]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    const status = root.querySelector("[data-blog-filter-status]");
    if (status) status.textContent = category === "全部" ? `共 ${visibleCount} 篇文章` : `${category} · ${visibleCount} 篇文章`;
  }));
  const observer = windowRef?.IntersectionObserver ? new windowRef.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8%" }) : null;
  root.querySelectorAll(".reveal").forEach((element) => {
    if (observer) observer.observe(element);
    else element.classList.add("is-visible");
  });
  documentRef.body.classList.add("byering-blog-active");
  documentRef.documentElement.dataset.byeringBlog = "1";
}

export function renderBlogRoute({ route, documentRef = globalThis.document, windowRef = globalThis.window } = {}) {
  if (!documentRef?.body || !route) return null;
  let root = documentRef.getElementById(BLOG_ROOT_ID);
  if (!root) {
    root = documentRef.createElement("div");
  root.id = BLOG_ROOT_ID;
    root.className = "byering-blog-page";
    root.innerHTML = routeContent(route);
    documentRef.body.appendChild(root);
  }
  applyMetadata(documentRef, route);
  documentRef.documentElement.classList.add("js-reveal");
  enhanceBlogPage(root, documentRef, windowRef);
  return root;
}

export function renderBlogDocument({ route }) {
  const meta = metadataForRoute(route);
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#258eea">
    <link rel="icon" href="/assets/bailing-logo-mark.png">
    <link rel="stylesheet" href="/src/salebuddy/marketing-site.css?v=theme-20261012">
    <link rel="stylesheet" href="/src/salebuddy/blog-site.css?v=theme-20261012">
    ${renderMetaTags(route)}
    ${renderStructuredData(route)}
  </head>
  <body>
  <div id="${BLOG_ROOT_ID}" class="byering-blog-page" data-blog-prerendered="true">${routeContent(route)}</div>
    <script type="module">import { startSite } from "/src/salebuddy/site-router.js?v=theme-20261012"; startSite();</script>
  </body>
</html>`;
}

export { BLOG_ROOT_ID, SITE_ORIGIN, escapeHTML, metadataForRoute };
