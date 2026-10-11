import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("src/salebuddy/marketing-site.js", root), "utf8");
const stylesheet = await readFile(new URL("src/salebuddy/marketing-site.css", root), "utf8");
const document = await readFile(new URL("index.html", root), "utf8");
const blogContent = await readFile(new URL("src/salebuddy/blog-content.js", root), "utf8");
const blogSite = await readFile(new URL("src/salebuddy/blog-site.js", root), "utf8");
const blogStylesheet = await readFile(new URL("src/salebuddy/blog-site.css", root), "utf8");

test("public homepage presents Byering as the company and routes two identities", () => {
  assert.match(document, /百聆/);
  assert.match(document, /百聆科技有限公司/);
  assert.match(source, /百聆个人版/);
  assert.match(source, /百聆企业版/);
  assert.match(source, /选择适合你的版本/);
  assert.match(source, /个人／小团队/);
  assert.match(source, /企业/);
  assert.match(source, /产品入口/);
  assert.match(source, /data-product-entry-link="pro-c"/);
  assert.match(source, /data-product-entry-link="shuban"/);
  assert.doesNotMatch(source.match(/<nav class="nav-links"[\s\S]*?<\/nav>/)?.[0] || "", /账号与数据安全|href="\/security\//);
  assert.doesNotMatch(source.match(/<nav class="mobile-navigation"[\s\S]*?<\/nav>/)?.[0] || "", /账号与数据安全|href="\/security\//);
  assert.match(source, /id="account-security"/);
  assert.match(source, /get\("entry"\) === "product"/);
  assert.match(source, /get\("entry"\) === "product"\) \{/);
  assert.match(stylesheet, /\.product-lines-grid\s*\{\s*display: grid;\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(stylesheet, /\.product-line-card > p\s*\{\s*min-height: 76px/);
  assert.doesNotMatch(source, /Byering（ClueVibe）/);
});

test("company identity and historical evidence precede Agent products", () => {
  assert.match(source, /让人工智能，<br>走进生意的每一步/);
  const sections = ["company", "acquisition", "results", "scenarios", "evolution", "products"];
  for (let index = 1; index < sections.length; index++) {
    assert.ok(source.indexOf(`id="${sections[index - 1]}"`) < source.indexOf(`id="${sections[index]}"`));
  }
  assert.match(source, /截至 2024 年 1 月，旧官网披露/);
  assert.match(source, /不代表当前 Agent 产品的使用效果或承诺/);
  assert.doesNotMatch(source, /模拟数据|ClueVibe|数班|爆款内容一键生成|没有封号风险/);
  assert.match(source, /mailto:bailing@byering.com/);
  assert.match(source, /价格承诺、客户投诉/);
});

test("blog matches product automation boundaries and company naming", () => {
  assert.match(blogContent, /哪些获客工作可以放心交给管家/);
  assert.match(blogContent, /日常发现和常规跟进由获客管家持续处理/);
  assert.doesNotMatch(blogContent, /AI 获客应该自动化到哪一步|任务范围|平台回执|逐条审批/);
  assert.match(blogSite, /百聆科技有限公司/);
  assert.match(blogSite, /产品入口/);
  assert.doesNotMatch(blogSite, /BAILING TECHNOLOGY|进入工作台/);
  assert.match(blogSite, /data-blog-category/);
  assert.match(blogSite, /data-blog-filter-status/);
  assert.match(blogSite, /aria-current="page"/);
  assert.match(blogSite, /data-nav-menu-toggle/);
  assert.match(blogSite, /wechatTrigger\?\.focus/);
  assert.match(blogSite, /event\.key !== "Tab" \|\| !wechatModal/);
  assert.match(blogSite, /<details class="article-outline/);
});

test("mobile navigation and product chooser preserve accessible interaction", () => {
  assert.match(source, /aria-controls="mobile-navigation" aria-expanded="false"/);
  assert.match(source, /mobileNavigation\.hidden = !opening/);
  assert.match(source, /backgroundRegions\.forEach\(\(region\) => \{ region\.inert = true; \}\)/);
  assert.match(source, /event\.key !== "Tab" \|\| !productEntry \|\| productEntry\.hidden/);
  assert.match(stylesheet, /\.team-visual--flow \{ width: 100%; min-width: 0; max-width: 100%; aspect-ratio: auto; grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(stylesheet, /\.process-loop__track \{ display: grid; grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(stylesheet, /\.marketing-hero \{ min-height: min\(700px, 82svh\)/);
  assert.match(stylesheet, /linear-gradient\(112deg, #5a84e4 0%, #7eafe9 29%, #9bcce9 62%, #c9c9c2 82%, #e8c9ad 100%\)/);
  assert.match(blogStylesheet, /background: linear-gradient\(112deg, #5a84e4 0%, #7eafe9 29%, #9bcce9 62%, #c9c9c2 82%, #e8c9ad 100%\);/);
  assert.match(blogStylesheet, /\.blog-page--official \.marketing-nav \{ position: fixed; z-index: 50; top: 10px/);
  assert.match(stylesheet, /\.hero-wash[\s\S]*?rgba\(36, 54, 77, \.36\)/);
  assert.match(stylesheet, /\.cloud-section \{ background: linear-gradient\(112deg, #4f78cf 0%, #6d9ddb 40%, #8ebfd8 72%, #babcb8 100%\)/);
});

test("the public-site repository does not bundle product workspace implementation", async () => {
  for (const path of ["project", "backend", "electron", ".env.local", ".openai"]) {
    await assert.rejects(access(new URL(path, root)));
  }
});


test("founder cards keep readable text below portraits across widths", () => {
  const desktopStyles = blogStylesheet.split("@media (max-width: 680px)")[0];
  assert.match(desktopStyles, /\.founder-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.doesNotMatch(blogStylesheet, /\.founder-profile\s*\{[^}]*grid-template-columns:\s*(?:148|100)px/);
  assert.match(blogStylesheet, /@media \(max-width:\s*680px\)\s*\{[\s\S]*?\.founder-grid\s*\{\s*grid-template-columns:\s*1fr/);
});
