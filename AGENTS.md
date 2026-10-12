# Repository Guidelines

## Project Structure & Module Organization

This is an Astro site deployed to Cloudflare Workers. Pages live in `src/pages/` and are prerendered (`export const prerender = true`), so add that line to any new static page; they build to slash-less addresses such as `/projects`. Shared page chrome, theme variables, navigation, and global browser interactions are in `src/layouts/Layout.astro`. Reusable UI belongs in `src/components/`, and public assets belong in `public/` (software preview images use `public/images/software/`, official logos use `public/images/logos/`).

Blog posts are MDX files in `src/content/posts/`. Their schema is defined in `src/content/config.ts`; `title`, `description`, and `date` are required, and posts with `draft: true` are omitted from listings.

## Build, Test, and Development Commands

```bash
npm run dev      # Start the Astro development server
npm run build    # Build dist/ and configure Cloudflare asset exclusions
npm run preview  # Preview the production build locally
```

No automated tests or linter are configured. Treat `npm run build` as the required validation step and manually check affected routes, responsive layouts, both themes, and interactive states.

## Coding Style & Naming Conventions

Follow the existing Astro and TypeScript style: two-space indentation in page/component markup, double quotes, semicolons in scripts, and descriptive camelCase variables. Name components in PascalCase (`Preview.astro`) and routes/assets in lowercase. Prefer scoped `<style>` blocks; reserve `Layout.astro` for genuinely site-wide styles and behavior. The site is set in JetBrains Mono (`--font-mono`) with running text in Libron (`--font-prose`); both are self-hosted under `public/fonts/`; `Layout.astro` applies the prose font to page paragraphs, blog post bodies, and modal text. Reuse theme tokens such as `--bg`, `--text`, `--text-muted`, `--text-faint`, `--border`, and `--link`.

## Hover Previews & Tooltips

Use `<Preview>` for image previews attached to words or links. Pass `src` and useful `alt` text; add `href` for a link or `modal` plus optional `title`/`caption` for an enlarged view. Pass both and the click opens the modal, whose image and title link out to `href`. Pass `notes` (an array of plain-text paragraphs) for a longer write-up under the caption. Leave `src` off for a text-only modal. Pass `logo` to show just that logo on hover, with no card around it, while the modal keeps `src`. Its shared positioning, fading, adaptive border, and modal logic lives in `Layout.astro` and is driven by `data-preview`/`data-modal` attributes. Do not duplicate that script in pages.

Use `<Tooltip term="..." />` for definitions. Add or edit definitions in `src/data/terms.ts`.

## Section Headings

Use `<SectionHeading>` for page titles and section labels. It renders the small letter-spaced label with a hairline rule that runs to the edge of the column. Pass `as="h1"` for the first heading on a page and leave the default `h2` for sections below it. Keep the label text lowercase.

## Recommendation Images

Take recommendation screenshots with `npm run screenshot -- <url> <name>`, never by hand. It writes `public/images/software/<name>.webp` at a fixed window size, zoom, colour scheme, and output width so every modal image matches; change the constants in `scripts/screenshot.mjs` to restyle the whole set. Hover logos are the tool's official logo, unmodified, in `public/images/logos/`.

## Monthly Summaries

The homepage "month in review" section is generated from `src/data/months.ts`: one entry per month with a one-line `summary`, optional `notes` paragraphs, and an optional `photo`. It shows the latest four and hides itself when the list is empty.

## Pages & Navigation

The `/recommendations` page is generated from category/item data in `src/data/recommendations.ts`. When adding a top-level page, also update the navigation and active-route logic in `Layout.astro` and the page list in `src/pages/sitemap.xml.ts`. `Layout.astro` appends the site name to each page `title` and emits the description, canonical, and link-preview tags, so pass a bare `title` and a `description`.

## Commits & Pull Requests

Recent history uses short, imperative summaries such as `design overhaul` and `update config`. Keep commits focused. Pull requests should describe visible and architectural changes, note manual validation, link relevant issues, and include screenshots for UI changes in light, dark, and narrow-screen states where applicable.

## Deployment

Deployment is automatic: pushing to `main` triggers a Cloudflare Workers build that runs `npm clean-install`, `npm run build`, then `npx wrangler deploy` to the `aaron-portfolio` Worker, so a push publishes the site. Keep `package-lock.json` in sync with `package.json`, or the install step fails. The build writes `dist/.assetsignore` so Cloudflare’s static asset handler ignores `_worker.js` and `.DS_Store`. The `ASSETS` binding in `wrangler.toml` is required by the Astro adapter; without it unknown routes return a 500.
