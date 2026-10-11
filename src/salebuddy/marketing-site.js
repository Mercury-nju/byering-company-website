const SITE_ROOT_ID = "byering-marketing-root";
const PRODUCTION_PRO_C_URL = "https://project-mercury-njus-projects.vercel.app/?page=login";
const SHUBAN_URL = "https://ai.byering.com/";

function resolveProCUrl(locationRef = globalThis.location) {
  const hostname = String(locationRef?.hostname || "").toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const protocol = locationRef?.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${hostname}:8888/?page=login`;
  }
  return PRODUCTION_PRO_C_URL;
}

const industryExperience = [
  { title: "汽车与二手车", label: "AUTOMOTIVE", description: "从客户咨询到销售跟进，沉淀车企、经销商与车商的营销服务经验。", detail: "潜客挖掘 · 咨询承接 · 线索分发" },
  { title: "家居与房产", label: "LIVING", description: "理解选购与到店需求，让线上互动衔接门店服务和后续经营。", detail: "需求识别 · 到店邀约 · 门店协作" },
  { title: "法律服务", label: "LEGAL SERVICES", description: "围绕案件咨询理解客户诉求，协助筛选、承接与分配咨询机会。", detail: "案源发现 · 咨询承接 · 客户筛选" }
];

function renderGrowthComparison() {
  const comparisons = [
    { label: "年度线索", current: "177", width: "70.8%" },
    { label: "店均日线索", current: "237.5", width: "95%" }
  ];
  return `<figure class="brand-growth-chart" aria-label="增长指数对比：基期为 100，年度线索达到 177，店均日线索达到 237.5">
    <figcaption><span>增长指数对比</span><small>基期 = 100</small></figcaption>
    <div class="brand-chart-legend" aria-hidden="true"><span>基期</span><span>增长后</span></div>
    ${comparisons.map((item) => `<div class="brand-growth-chart__group"><span>${item.label}</span><div class="brand-growth-chart__bars" aria-hidden="true"><div class="brand-growth-chart__bar brand-growth-chart__bar--base" style="--bar-width: 40%"><span>100</span></div><div class="brand-growth-chart__bar" style="--bar-width: ${item.width}"><span>${item.current}</span></div></div></div>`).join("")}
  </figure>`;
}

function renderRetentionChart() {
  return `<figure class="brand-retention-chart" aria-label="蚂蚁好车历史案例私信留资率 79.44%">
    <div class="brand-retention-chart__ring" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48"/><circle class="brand-retention-chart__value" cx="60" cy="60" r="48" pathLength="100" stroke-dasharray="79.44 100"/></svg><span>79.44<small>%</small></span></div>
    <figcaption><strong>私信留资率</strong><p>让咨询衔接后续跟进</p><span class="brand-chart-legend"><span>已留资</span><span>其余私信</span></span></figcaption>
  </figure>`;
}

function renderScaleIcon(type) {
  const paths = {
    brand: '<path d="M6 25V9h20v16M10 9V5h12v4M10 14h3m6 0h3m-12 5h3m6 0h3M14 25v-5h4v5M3 27h26"/>',
    store: '<path d="M4 13h24l-3-7H7l-3 7ZM6 14v13h20V14M10 27V17h7v10M21 18h2m-2 5h2M4 13c0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0 0 4 6 4 6 0"/>',
    car: '<path d="m5 17 3-8h16l3 8M4 17h24v9H4v-9Zm4 9v3m16-3v3M8 21h3m10 0h3M10 9l2-3h8l2 3"/>'
  };
  return `<svg class="brand-scale-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type]}</svg>`;
}

function renderSite() {
  return `
    <div class="marketing-shell brand-site">
      <a class="skip-link" href="#main-content">跳至主内容</a>
      <header class="marketing-nav" data-nav>
        <a class="brand-lockup" href="#top" aria-label="百聆首页">
          <img src="/assets/bailing-logo-mark.png" alt="">
          <span>百聆</span>
        </a>
        <nav class="nav-links" aria-label="主要导航">
          <a href="/product/">产品与服务</a>
          <a href="/cases/">行业实践</a>
          <a href="/#results">客户成果</a>
          <a href="/blog/">新闻中心</a>
          <a href="/about/">关于百聆</a>
        </nav>
        <button class="nav-menu-toggle" type="button" data-nav-menu-toggle aria-label="打开导航" aria-controls="mobile-navigation" aria-expanded="false"><span aria-hidden="true"></span></button>
        <a class="nav-cta" href="#product-entry" data-open-product-entry>产品入口</a>
        <nav class="mobile-navigation" id="mobile-navigation" aria-label="移动端导航" aria-hidden="true" inert hidden>
          <a href="/product/">产品与服务</a><a href="/cases/">行业实践</a><a href="/#results">客户成果</a><a href="/blog/">新闻中心</a><a href="/about/">关于百聆</a>
        </nav>
      </header>

      <main id="main-content" tabindex="-1">
        <section class="marketing-hero brand-hero" id="top">
          <div class="hero-scene" aria-hidden="true"></div><div class="hero-wash" aria-hidden="true"></div>
          <div class="brand-hero-layout">
            <div class="hero-content">
              <div class="hero-kicker">百聆科技 / BYERING</div>
              <h1>让人工智能，<br>走进生意的每一步。</h1>
              <p class="hero-copy">从发现客户到理解需求，从接住咨询到持续经营。<br class="desktop-break">百聆把行业经验与 AI 技术，变成可以落地的业务能力。</p>
              <div class="hero-actions"><a class="primary-button" href="/about/">了解百聆 <span aria-hidden="true">↗</span></a><a class="text-button" href="#results">查看客户成果 <span aria-hidden="true">↓</span></a></div>
            </div>
            <div class="brand-hero-note"><span>持续积累，持续进化</span><p>行业经验<br>AI 营销能力<br><em>Agent 产品</em></p><a href="#evolution">了解我们的业务演进 <span aria-hidden="true">↗</span></a></div>
          </div>
          <div class="brand-hero-bottom"><span>自 2021 年起，专注 AI 营销与客户经营</span><a href="#company">向下探索 <span aria-hidden="true">↓</span></a></div>
        </section>

        <section class="section brand-intro" id="company">
          <div class="section-heading"><span class="section-index">01 / 百聆是谁</span><h2>技术在变，<br>为客户创造价值的方向不变。</h2></div>
          <div class="brand-intro-copy"><p>百聆科技是一家专注于新媒体营销与客户经营的人工智能公司。自 2021 年成立以来，我们在汽车、二手车、家居房产、法律服务等业务中，持续积累行业经验与 AI 应用能力。</p><p>今天，这些积累正进一步融入 Agent 产品，让客户发现、沟通和跟进成为可以持续执行的业务流程。</p><a class="brand-link" href="/about/">公司、团队与技术积累 <span aria-hidden="true">↗</span></a></div>
        </section>

        <section class="section brand-capabilities" id="acquisition">
          <div class="brand-section-top"><div class="section-heading"><span class="section-index">02 / 核心能力</span><h2>懂客户，<br>也懂业务如何向前。</h2></div><p>把分散的互动、对话和客户信息，连接成有后续的业务机会。</p></div>
          <div class="brand-capability-list">
            <article><span>01</span><h3>发现需求</h3><p>从内容与互动中识别潜在需求，帮助业务找到值得沟通的客户。</p><small>客户发现 / 意向识别</small></article>
            <article><span>02</span><h3>理解与沟通</h3><p>结合业务资料和对话上下文理解客户，让每次咨询得到合适的回应。</p><small>AI 对话 / 业务知识</small></article>
            <article><span>03</span><h3>持续经营</h3><p>沉淀客户信息与沟通进展，衔接后续跟进和团队协作。</p><small>客户跟进 / 协同经营</small></article>
          </div>
        </section>

        <section class="brand-results-wrap" id="results">
          <div class="section brand-results">
            <div class="brand-section-top"><div class="section-heading"><span class="section-index">03 / 历史客户成果</span><h2>积累，来自一次次<br>真实业务的实践。</h2></div><a class="brand-link" href="/cases/">查看行业实践 <span aria-hidden="true">↗</span></a></div>
            <div class="brand-results-grid">
              <article class="brand-result"><span class="brand-case-label">汽车行业 / 某合资汽车品牌</span><h3>让经销商的获客流程<br>更有效率。</h3><p>通过私有化部署与个性化定制，连接 AI 获客、数据监控和新媒体运营。</p><div class="brand-result-metrics"><div><strong>77<span>%</span></strong><span>年度线索增长</span></div><div><strong>137.5<span>%</span></strong><span>店均日线索增长</span></div></div>${renderGrowthComparison()}</article>
              <article class="brand-result"><span class="brand-case-label">二手车行业 / 蚂蚁好车</span><h3>把内容咨询，<br>接成可跟进的线索。</h3><p>2024 年 4 月，旗下多个账号与百聆合作，将咨询承接与线索转化融入日常经营。</p><div class="brand-result-metrics"><div><strong>14,500+</strong><span>月均线索（条）</span></div><div><strong>79.44<span>%</span></strong><span>私信留资率</span></div></div>${renderRetentionChart()}</article>
            </div>
            <p class="brand-source-note">数据来自百聆旧官网披露的历史客户案例，沿用原案例口径；不代表当前 Agent 产品的使用效果或承诺。</p>
            <div class="brand-history-scale"><div>${renderScaleIcon("brand")}<strong>135</strong><span>汽车品牌</span></div><div>${renderScaleIcon("store")}<strong>5,296</strong><span>汽车经销商门店</span></div><div>${renderScaleIcon("car")}<strong>1,049</strong><span>二手车商</span></div><p>历史合作规模<br><small>截至 2024 年 1 月，旧官网披露</small></p></div>
          </div>
        </section>

        <section class="section brand-industries" id="scenarios">
          <div class="brand-section-top"><div class="section-heading"><span class="section-index">04 / 行业实践</span><h2>在具体行业里，<br>把 AI 做深。</h2></div><p>不同业务有不同的沟通方式。我们从行业场景出发，把技术与日常经营连接起来。</p></div>
          <div class="brand-industry-grid">${industryExperience.map((industry) => `<a class="brand-industry" href="/cases/"><span>${industry.label}</span><h3>${industry.title}</h3><p>${industry.description}</p><div>${industry.detail}<b aria-hidden="true">↗</b></div></a>`).join("")}</div>
        </section>

        <section class="brand-evolution-wrap" id="evolution"><div class="section brand-evolution">
          <div class="section-heading"><span class="section-index">05 / 从业务积累到 AGENT</span><h2>经验沉淀为能力，<br>能力走进新的产品。</h2><p>客户发现、AI 对话、线索管理与团队协作，延续着百聆一直在解决的问题。Agent 让这些能力围绕业务目标，持续协同工作。</p></div>
          <ol class="brand-evolution-steps" aria-label="百聆业务演进"><li><i class="brand-evolution-node" aria-hidden="true">01</i><div><span>业务实践</span><p>理解行业场景与客户需求</p><small>汽车 · 家居 · 法律服务</small></div></li><li><i class="brand-evolution-node" aria-hidden="true">02</i><div><span>能力沉淀</span><p>积累对话、营销与经营能力</p><small>需求识别 → 沟通 → 跟进</small></div></li><li><i class="brand-evolution-node" aria-hidden="true">03</i><div><span>Agent 产品</span><p>把能力融入可持续执行的流程</p><small>个人版 / 企业版</small></div></li></ol>
        </div></section>

        <section class="section product-lines-section" id="products">
          <div class="brand-section-top"><div class="section-heading"><span class="section-index">06 / 产品与服务</span><h2>同一份积累，<br>服务不同的经营方式。</h2></div><a class="brand-link" href="/product/">了解产品与服务 <span aria-hidden="true">↗</span></a></div>
          <div class="product-lines-grid">
            <article class="product-line-card product-line-card--pro"><div class="product-line-card__top"><div class="product-line-card__brand"><img src="/assets/bailing-logo-mark.png" alt=""><span>个人与小团队</span></div><h3>百聆个人版</h3></div><p>把客户发现、日常沟通与持续跟进交给 Agent，自助经营线上客户。</p><ul class="product-choice-facts"><li>标准化产品，自助开启</li><li>持续发现需求与跟进客户</li><li>云电脑运行，随时查看进展</li></ul><a class="product-line-card__action" href="#product-entry" data-open-product-entry>进入个人版 <span aria-hidden="true">↗</span></a></article>
            <article class="product-line-card product-line-card--enterprise"><div class="product-line-card__top"><div class="product-line-card__brand"><img src="/assets/bailing-logo-mark.png" alt=""><span>企业</span></div><h3>百聆企业版</h3></div><p>结合业务场景与团队协作方式，配置获客和客户经营流程。</p><ul class="product-choice-facts"><li>按业务需求配置与交付</li><li>连接客户经营与团队协作</li><li>咨询 1 对 1 专属客服</li></ul><a class="product-line-card__action" href="mailto:bailing@byering.com">咨询企业服务 <span aria-hidden="true">↗</span></a></article>
          </div>
          <details class="brand-platform-detail" id="platforms"><summary>查看产品接入范围与使用说明 <span aria-hidden="true">＋</span></summary><p>个人版目前支持抖音，企业版接入范围请咨询专属客服。账号连接和重要沟通由你决定；涉及价格承诺、客户投诉等事项由你处理。</p><a class="brand-link" href="/product/">产品详情与收费规则 <span aria-hidden="true">↗</span></a></details>
        </section>

        <section class="section brand-trust" id="account-security"><div class="section-heading"><span class="section-index">07 / 公司与技术</span><h2>积累有来处，<br>信任有依据。</h2><p>核心团队来自阿里巴巴人工智能实验室，先后获得红杉资本、靖亚资本、元生资本投资。</p></div><div class="brand-trust-links"><a href="/about/"><span>企业资质</span><strong>高新技术企业 · 专精特新</strong><b aria-hidden="true">↗</b></a><a href="/about/"><span>技术积累</span><strong>发明专利与软件著作权</strong><b aria-hidden="true">↗</b></a><a href="/security/"><span>服务说明</span><strong>账号连接与数据使用</strong><b aria-hidden="true">↗</b></a></div></section>

        <section class="brand-contact" id="contact"><div><span class="section-index">与百聆一起，走向下一步</span><h2>聊聊你的业务，<br>看看 AI 能做些什么。</h2></div><div><p>了解产品、探讨行业方案，或交流合作机会。</p><a class="primary-button" href="mailto:bailing@byering.com">联系百聆 <span aria-hidden="true">↗</span></a><a class="brand-contact-email" href="mailto:bailing@byering.com">bailing@byering.com</a></div></section>
      </main>

      <div class="product-entry-modal" id="product-entry" data-product-entry hidden>
        <div class="product-entry-modal__backdrop" data-product-entry-close></div>
        <section class="product-entry-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="product-entry-title">
          <button class="product-entry-modal__close" type="button" data-product-entry-close aria-label="关闭产品入口">×</button>
          <span class="section-index">BYERING</span>
          <h2 id="product-entry-title">选择适合你的版本</h2>
          <p class="product-entry-modal__intro">自助经营日常获客，或为企业配置协作流程。</p>
          <div class="product-entry-grid">
            <a class="product-entry-card product-entry-card--pro" data-product-entry-link="pro-c" href="#">
              <div class="product-entry-card__brand"><img class="product-entry-card__logo" src="/assets/bailing-logo-mark.png" alt=""><div><span class="product-entry-card__eyebrow">个人／小团队</span><strong>百聆个人版</strong></div></div>
              <span class="product-entry-card__copy">个人与小团队的智能获客管家。</span>
              <b>进入 百聆个人版 <span>↗</span></b>
            </a>
            <a class="product-entry-card product-entry-card--enterprise" data-product-entry-link="shuban" href="${SHUBAN_URL}">
              <div class="product-entry-card__brand"><img class="product-entry-card__logo" src="/assets/bailing-logo-mark.png" alt=""><div><span class="product-entry-card__eyebrow">企业</span><strong>百聆企业版</strong></div></div>
              <span class="product-entry-card__copy">企业客户线索、沟通和团队协作。</span>
              <b>进入百聆企业版 <span>↗</span></b>
            </a>
          </div>
        </section>
      </div>

      <footer class="marketing-footer">
        <a class="brand-lockup" href="#top"><img src="/assets/bailing-logo-mark.png" alt=""><span>百聆</span></a>
        <span>百聆科技有限公司</span>
        <div><a href="/product/">产品</a><a href="/cases/">行业实践</a><a href="/#results">客户成果</a><a href="/about/">关于百聆</a><a href="/blog/">新闻中心</a><a href="#product-entry" data-open-product-entry>产品入口</a><span>© 2026 Byering</span></div>
      </footer>
    </div>
  `;
}


function mountMarketingSite({ documentRef = globalThis.document } = {}) {
  if (!documentRef?.body) return null;
  let root = documentRef.getElementById(SITE_ROOT_ID);
  if (root) return root;

  root = documentRef.createElement("div");
  root.id = SITE_ROOT_ID;
  root.innerHTML = renderSite();
  documentRef.body.appendChild(root);
  documentRef.documentElement.classList.add("js-reveal");
  documentRef.documentElement.dataset.byeringMarketing = "1";
  documentRef.body.classList.add("byering-marketing-active");

  const productEntry = root.querySelector("[data-product-entry]");
  const productEntryProLink = root.querySelector('[data-product-entry-link="pro-c"]');
  const nav = root.querySelector("[data-nav]");
  const menuToggle = root.querySelector("[data-nav-menu-toggle]");
  const mobileNavigation = root.querySelector("#mobile-navigation");
  const backgroundRegions = [nav, root.querySelector("main"), root.querySelector("footer")].filter(Boolean);
  let productEntryLastFocus = null;
  const closeMenu = () => {
    if (!mobileNavigation || mobileNavigation.hidden) return;
    mobileNavigation.hidden = true;
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "打开导航");
    mobileNavigation.setAttribute("aria-hidden", "true");
    mobileNavigation.inert = true;
  };
  menuToggle?.addEventListener("click", () => {
    const opening = mobileNavigation.hidden;
    mobileNavigation.hidden = !opening;
    mobileNavigation.inert = !opening;
    mobileNavigation.setAttribute("aria-hidden", String(!opening));
    menuToggle.setAttribute("aria-expanded", String(opening));
    menuToggle.setAttribute("aria-label", opening ? "关闭导航" : "打开导航");
  });
  mobileNavigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  const syncProductEntryLinks = () => {
    if (productEntryProLink) productEntryProLink.href = resolveProCUrl(window.location);
  };
  const closeProductEntry = () => {
    if (!productEntry || productEntry.hidden) return;
    productEntry.hidden = true;
    documentRef.body.classList.remove("product-entry-open");
    backgroundRegions.forEach((region) => { region.inert = false; });
    if (window.location.hash === "#product-entry" || new URLSearchParams(window.location.search).get("entry") === "product") {
      const returnUrl = new URL(window.location.href);
      if (returnUrl.searchParams.get("entry") === "product") returnUrl.searchParams.delete("entry");
      if (returnUrl.hash === "#product-entry") returnUrl.hash = "";
      window.history?.replaceState?.(null, "", `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`);
    }
    productEntryLastFocus?.focus?.();
    productEntryLastFocus = null;
  };
  const openProductEntry = (event) => {
    event?.preventDefault?.();
    if (!productEntry) return;
    closeMenu();
    syncProductEntryLinks();
    const trigger = event?.currentTarget || documentRef.activeElement;
    productEntryLastFocus = trigger?.closest?.("#mobile-navigation") ? menuToggle : trigger;
    productEntry.hidden = false;
    documentRef.body.classList.add("product-entry-open");
    backgroundRegions.forEach((region) => { region.inert = true; });
    productEntry.querySelector(".product-entry-modal__close")?.focus?.();
  };
  root.querySelectorAll("[data-open-product-entry]").forEach((trigger) => {
    trigger.addEventListener("click", openProductEntry);
  });
  if (new URLSearchParams(window.location.search).get("entry") === "product") {
    root.querySelector('[data-open-product-entry]')?.click?.();
  }
  root.querySelectorAll("[data-product-entry-close]").forEach((closer) => {
    closer.addEventListener("click", closeProductEntry);
  });
  documentRef.addEventListener?.("keydown", (event) => {
    if (event.key === "Escape") {
      if (productEntry && !productEntry.hidden) closeProductEntry();
      else if (mobileNavigation && !mobileNavigation.hidden) {
        closeMenu();
        menuToggle?.focus?.();
      }
    }
    if (event.key !== "Tab" || !productEntry || productEntry.hidden) return;
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

  const updateNav = () => nav?.classList.toggle("is-scrolled", window.scrollY > 60);
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  const scrollToHash = (hash, updateHistory = false) => {
    const target = documentRef.getElementById(hash.slice(1));
    if (!target || hash === "#product-entry") return;
    if (updateHistory) window.history.pushState(null, "", hash);
    target.scrollIntoView({ behavior: "instant", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  root.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.hasAttribute("data-open-product-entry")) return;
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!documentRef.getElementById(hash.slice(1))) return;
      event.preventDefault();
      scrollToHash(hash, true);
    });
  });
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#product-entry") openProductEntry();
    else {
      if (!productEntry.hidden) closeProductEntry();
      scrollToHash(window.location.hash);
    }
  });
  window.requestAnimationFrame(() => {
    if (window.location.hash === "#product-entry") openProductEntry();
    else scrollToHash(window.location.hash);
  });
  window.matchMedia("(min-width: 1001px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
  documentRef.addEventListener("click", (event) => {
    if (!nav?.contains(event.target)) closeMenu();
  });

  const revealElements = [...root.querySelectorAll(".reveal")];
  if (typeof window.IntersectionObserver === "function") {
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8%" });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  return root;
}

export { mountMarketingSite };
