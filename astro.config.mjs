// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import mdx from '@astrojs/mdx';
import { execSync } from 'node:child_process';

// Commit the site was built from, shown in the footer. Empty when git is
// unavailable or the working tree has uncommitted changes, so the footer never
// names a commit that doesn't match what was built.
const git = (args) =>
  execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
const buildCommit = (() => {
  try {
    return git('status --porcelain') ? '' : git('rev-parse HEAD');
  } catch {
    return '';
  }
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://aaronminhas.com',
  // Pre-built pages are written as /projects.html, which Cloudflare serves at
  // /projects with no redirect, matching the site's slash-less links.
  build: {
    format: 'file'
  },
  trailingSlash: 'never',
  integrations: [mdx()],
  vite: {
    define: {
      __BUILD_COMMIT__: JSON.stringify(buildCommit)
    }
  },
  output: 'server',
  image: {
    service: passthroughImageService()
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  })
});