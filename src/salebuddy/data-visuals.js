const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

function renderGrowth(facts) {
  return `<figure class="data-figure data-growth"><figcaption><strong>线索增长对比</strong><span>各指标将增长前水平设为 100</span></figcaption><div class="data-legend"><span><i></i>增长前</span><span><i></i>增长后</span></div>${facts.map(([label, value]) => {
    const growth = Number.parseFloat(value);
    const after = 100 + growth;
    return `<div class="data-growth-row"><div class="data-row-heading"><span>${escape(label)}</span><strong>+${escape(value)}</strong></div><div class="data-bar-row"><span>增长前</span><div class="data-track"><i class="data-bar data-bar--baseline" style="width:${100 / 250 * 100}%"></i></div><b>100</b></div><div class="data-bar-row"><span>增长后</span><div class="data-track"><i class="data-bar" style="width:${after / 250 * 100}%"></i></div><b>${after}</b></div></div>`;
  }).join("")}<p class="data-caption">指数用于呈现增长幅度，不代表原始线索数量；两项指标分别比较。</p></figure>`;
}

function renderRate(facts) {
  const rate = facts.find(([label]) => label === "私信留资率");
  const volume = facts.find(([label]) => label === "月均线索量");
  return `<figure class="data-figure data-rate"><figcaption><strong>客户沟通与线索沉淀</strong><span>蚂蚁好车 · 历史服务成果</span></figcaption><div class="data-rate-layout"><div class="data-donut" style="--data-rate:${Number.parseFloat(rate[1])}%" role="img" aria-label="${escape(rate[0])} ${escape(rate[1])}"><div><strong>${escape(rate[1])}</strong><span>${escape(rate[0])}</span></div></div><div class="data-volume"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12h32v24H8zM8 18h32M15 25h8m-8 6h18"/></svg><span>${escape(volume[0])}</span><strong>${escape(volume[1])}</strong><p>线索量与留资率分别展示，沿用历史案例口径。</p></div></div></figure>`;
}

function renderJourney(facts) {
  const icons = ["M20 20m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0M27 27l8 8M16 20h8M20 16v8", "M7 9h26v19H19l-8 6v-6H7zM12 15h16M12 21h10", "M8 10h24v23H8zM8 17h24M14 6v8M26 6v8M14 23l4 4 9-8"];
  return `<figure class="data-figure data-journey"><figcaption><strong>7 天客户经营流程</strong><span class="data-simulation-tag">模拟数据 · 使用示意</span></figcaption><ol>${facts.map(([label, value], index) => `<li><span class="data-journey-step">0${index + 1}</span><svg viewBox="0 0 40 40" aria-hidden="true"><path d="${icons[index]}"/></svg><strong>${escape(value)}</strong><span>${escape(label)}</span>${index < facts.length - 1 ? `<i aria-hidden="true">→</i>` : ""}</li>`).join("")}</ol><p class="data-caption">各阶段按自己的单位展示数量，用于说明流程，不作转化率比较。</p></figure>`;
}

export function renderFactVisual(facts, pageSlug, sectionHeading) {
  if (pageSlug === "cases" && facts.every(([, value]) => /^\d+(\.\d+)?%$/.test(value))) return renderGrowth(facts);
  if (pageSlug === "cases" && facts.some(([label]) => label === "私信留资率")) return renderRate(facts);
  if (pageSlug === "product" && sectionHeading === "使用示意 · 模拟数据") return renderJourney(facts);
  if (pageSlug === "cases" && facts.some(([label]) => label === "常见信号")) {
    return `<ol class="data-process" aria-label="场景业务流程">${facts.map(([label, value], index) => `<li><span class="data-process-node" aria-hidden="true">0${index + 1}</span><strong>${escape(label)}</strong><p>${escape(value)}</p></li>`).join("")}</ol>`;
  }
  return "";
}

export function renderPlanComparison(plans) {
  const metrics = [{ key: "monthlyCredits", label: "每月 AI 积分", unit: "积分" }, { key: "monthlyLeadLimit", label: "每月线索额度", unit: "条" }];
  return `<figure class="data-figure data-plans"><figcaption><strong>套餐额度，一眼比较</strong><span>三档功能相同，额度不同</span></figcaption><div class="data-plan-grid">${metrics.map((metric) => {
    const values = plans.map((plan) => Number.parseFloat(plan[metric.key].replaceAll(",", "")));
    const maximum = Math.max(...values);
    return `<div><h4>${metric.label}</h4>${plans.map((plan, index) => `<div class="data-plan-row"><span>${escape(plan.name)}</span><div class="data-track"><i class="data-bar" style="width:${values[index] / maximum * 100}%"></i></div><strong>${values[index].toLocaleString("en-US")} <small>${metric.unit}</small></strong></div>`).join("")}</div>`;
  }).join("")}</div><p class="data-caption">两项额度独立计量，每档包含 1 个授权账号与 1 台云电脑。</p></figure>`;
}
