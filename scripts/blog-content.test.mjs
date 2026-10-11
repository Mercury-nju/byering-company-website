import test from "node:test";
import assert from "node:assert/strict";
import { blogArticles } from "../src/salebuddy/blog-content.js";

const expected = [
  ["high-intent-customer-signals", "获客实战"],
  ["douyin-comment-leads", "获客实战"],
  ["after-price-question", "触达方法"],
  ["lead-conversion-gaps", "客户经营"],
  ["small-team-acquisition", "方法论"],
  ["ai-acquisition-boundaries", "获客方法"]
];

test("blog content follows the editorial contract", () => {
  assert.equal(blogArticles.length, expected.length);

  const slugs = new Set();
  blogArticles.forEach((article, index) => {
    const [slug, category] = expected[index];
    assert.equal(article.slug, slug);
    assert.equal(article.category, category);
    assert.ok(article.title);
    assert.ok(article.description);
    assert.ok(article.readTime);
    assert.equal(article.author, "Byering 内容团队");
    assert.ok(article.keywords.length >= 3 && article.keywords.length <= 5);
    assert.ok(article.answer.length >= 60);
    assert.ok(article.sections.length >= 3 && article.sections.length <= 5);
    assert.equal(article.sections.length, article.outline.length);
    assert.ok(article.faq.length >= 2 && article.faq.length <= 3);
    if (article.date) assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(article.targetLength.min < article.targetLength.max);
    assert.ok(article.sections.every((section) => section.heading && section.paragraphs?.length));
    assert.ok(!slugs.has(article.slug));
    slugs.add(article.slug);
  });
});
