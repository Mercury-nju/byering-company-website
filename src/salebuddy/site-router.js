import { mountMarketingSite } from "./marketing-site.js?v=theme-20261012";
import { renderBlogRoute } from "./blog-site.js?v=theme-20261012";
import { getOfficialPage } from "./official-pages.js";

const PRODUCTION_APP_LOGIN_URL = "https://project-mercury-njus-projects.vercel.app/?page=login";

function normalizePath(pathname = "/") {
  const path = pathname.split("?")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path;
  return path === "/blog" ? "/blog/" : path;
}

export function resolveAppLoginUrl(locationRef = {}) {
  const hostname = String(locationRef.hostname || "").toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const protocol = locationRef.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${hostname}:8888/?page=login`;
  }
  return PRODUCTION_APP_LOGIN_URL;
}

export function resolveRoute({ pathname = "/", search = "" } = {}) {
  const params = new URLSearchParams(search);
  const path = normalizePath(pathname);
  if (params.get("page") === "login") return { kind: "app-login" };
  if (params.get("page") === "blog") {
    const article = params.get("article");
    return article ? { kind: "blog-article", slug: article } : { kind: "blog-index" };
  }
  if (path.startsWith("/") && path.endsWith("/") && getOfficialPage(path.slice(1, -1))) {
    return { kind: "official-page", slug: path.slice(1, -1) };
  }
  if (path === "/platforms/" || path === "/platforms") return { kind: "home-platforms" };
  if (path === "/blog/") return { kind: "blog-index" };
  if (path.startsWith("/blog/")) {
    const slug = decodeURIComponent(path.slice("/blog/".length).replace(/\/$/, ""));
    return slug ? { kind: "blog-article", slug } : { kind: "blog-index" };
  }
  if (path === "/b/" || path === "/b") return { kind: "app-login" };
  if (path !== "/") return { kind: "official-page", slug: "not-found" };
  return { kind: "home" };
}

export function startSite({ windowRef = globalThis.window, documentRef = globalThis.document } = {}) {
  if (!documentRef?.body) return null;
  const route = resolveRoute({ pathname: windowRef?.location?.pathname || "/", search: windowRef?.location?.search || "" });
  if (route.kind === "app-login") {
    const loginUrl = resolveAppLoginUrl(windowRef?.location);
    windowRef?.location?.assign?.(loginUrl);
    return loginUrl;
  }
  if (route.kind === "home-platforms") {
    windowRef?.location?.replace?.("/#platforms");
    return "/#platforms";
  }
  if (route.kind === "home") {
    const root = mountMarketingSite({ documentRef });
    const params = new URLSearchParams(windowRef?.location?.search || "");
    const shouldOpenProductChooser = windowRef?.location?.hash === "#product-entry" || params.get("entry") === "product";
    if (shouldOpenProductChooser) root?.querySelector('[data-open-product-entry]')?.click?.();
    return root;
  }
  if (route.kind === "official-page" && !getOfficialPage(route.slug)) return renderBlogRoute({ route: { kind: "official-page", slug: "not-found" }, documentRef, windowRef });
  return renderBlogRoute({ route, documentRef, windowRef });
}
