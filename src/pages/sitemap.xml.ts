import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

// Lists every public page. Writing only appears once there is a published post,
// matching the navigation.
export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const paths = [
    "/",
    "/recommendations",
    "/projects",
    "/contact",
    ...(posts.length > 0
      ? ["/blog", ...posts.map((post) => `/blog/${post.slug}`)]
      : []),
  ];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
