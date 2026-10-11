# Byering Company Website

Standalone source for the public Byering (百聆科技) company website.

It contains the brand homepage, company and founder information, products and services, historical customer results, data visualizations, news pages, credentials, and public image assets. Product entry links redirect to separate applications; this repository contains no product workspace implementation or backend service.

Live website: https://byering-official-homepage.vercel.app/

## Local preview

No dependency installation is required. Run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/.

## Build and checks

Use Node.js 22 or later:

```sh
npm run build:blog
npm test
```

The build regenerates static inner pages and news articles from the source modules. Run it after modifying page content or the renderer.

## Structure

- `index.html`: homepage entry point.
- `src/salebuddy/`: website rendering, page content, data graphics, routing, and styles.
- `assets/`: public fonts, brand imagery, portraits, and credentials.
- `about/`, `product/`, `cases/`, `security/`, `pricing-rules/`, `blog/`: generated static content pages.
- `scripts/`: page generator and repository checks.
- `vercel.json`: static hosting routes.

## Deployment

Import this repository as a separate static project in Vercel. Use the repository root as the output directory, with no framework preset. The generated HTML is committed; run `npm run build:blog` before publishing source changes.

Hosting credentials, local environment files, and Vercel project bindings are excluded. Historical case results retain their source notes; simulated product examples are labeled separately.
