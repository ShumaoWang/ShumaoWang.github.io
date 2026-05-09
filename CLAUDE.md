# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install Ruby gem dependencies
bundle install

# Serve locally with live reload
bash run_server.sh          # runs: bundle exec jekyll liveserve

# Build site
bundle exec jekyll build
```

No npm/Node.js tooling — Ruby/Bundler only.

## Architecture

Academic personal homepage built with Jekyll and a custom theme derived from [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io). No theme gem — the theme lives entirely in `_layouts/`, `_includes/`, `_sass/`, and `assets/`.

**Single layout:** All pages use `_layouts/default.html`, which wraps content in a sidebar + main content structure. The sidebar shows an author profile card (configured in `_config.yml` under `author:`).

**Content lives in `_pages/`** — these are standalone Markdown files with YAML front matter, not Jekyll posts or collections. Navigation structure is defined in `_data/navigation.yml`.

**Dynamic updates feed** is driven by `_data/updates.yml` — a list of article cards with fields: `date`, `title`, `summary`, `url`, `image`, and optionally `hide_in_production: true` to suppress entries in production builds.

**Google Scholar citation data** is fetched automatically by a GitHub Actions workflow (`.github/workflows/google_scholar_crawler.yaml`) that runs daily and pushes JSON results to the `google-scholar-stats` branch. The `_includes/fetch_google_scholar_stats.html` include reads from this branch via CDN.

## Key Config

`_config.yml` controls:
- `author:` block — all sidebar profile fields (avatar, bio, social links for 15+ platforms)
- `google_scholar_stats_use_cdn: true/false` — toggles whether scholar stats load from CDN or raw GitHub
- `timezone: Asia/Shanghai`
- `compress_html:` — enabled in production, disabled in development (`JEKYLL_ENV=development`)

Pages default to `layout: default` and `author_profile: true` via the `defaults:` block in `_config.yml`.

## Hiding Content in Development vs Production

In `_data/updates.yml`, set `hide_in_production: true` on any entry to prevent it from rendering when `JEKYLL_ENV=production`. The template checks this flag before rendering each card.
