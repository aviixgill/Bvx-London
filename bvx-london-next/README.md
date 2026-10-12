# BVX London — Next.js migration (foundation)

This folder is the new, in-progress Next.js codebase for the BVX London
storefront. It exists **alongside** the current production site, not in
place of it.

## Current production (unaffected by this folder)

- The live site (`wearbvx.com`) is served from the root `index.html`, with
  `api/products.js` as the WooCommerce proxy — both one directory up from
  here.
- Vercel's project root directory is `./` (the repo root), **not** this
  folder. Nothing in this project changes that setting, and nothing here
  is live.
- Until an explicit, later cutover PR says otherwise, treat the root
  `index.html` as the only source of truth for what's actually running in
  production.

## Migration rules

This is a **migration, not a redesign**. For every piece of UI, behaviour,
or logic that gets ported into this project:

- Preserve the current design, spacing, and typography exactly.
- Preserve current mobile/desktop behaviour and responsive breakpoints
  exactly, unless the migration technically requires an equivalent (not
  visually different) implementation.
- Preserve the current product flow, cart behaviour, and WooCommerce
  handoff exactly — including the `bvx_cart` / `bvx_cart_token` /
  `bvx_cart_pending_sync` / `bvx_cart_last_synced` reverse-sync model and
  the `admin-post.php` rebuild handoff against the BVX Cart Bridge plugin.
- Preserve existing URLs/routes where required.
- Do not simplify, refactor behaviour, rename customer-facing copy, or
  "improve" anything as a side effect of moving it. If something looks
  improvable, that's a separate, explicitly-approved change — not part of
  a migration PR.

## Planned structure

```
src/
  app/              route segments (App Router)
  components/       shared UI, extracted incrementally (Header, MobileMenu,
                    CartDrawer, Footer, ProductCard, CollectionHero,
                    LoadingScreen, ...)
  lib/
    products/       product-fetching logic
    cart/           cart logic, once migrated:
      storage/      bvx_cart read/write (localStorage)
      bridge/       the admin-post.php rebuild handoff
      reconciliation/  reverse-sync against the Cart Bridge read endpoint
  styles/           migrated CSS (currently a placeholder)

public/
  images/
  icons/

tests/
```

## What's in this PR

Foundation only:

- Next.js 14 (App Router) + TypeScript project scaffold
- Global CSS entry point (placeholder — real styles are not migrated yet)
- A placeholder homepage and root layout, not the real site
- This README

What's explicitly **not** in this PR: the homepage, header, cart logic,
product pages, or any WooCommerce integration. Those move over in later,
small, reviewable PRs.

## Workflow

- Work happens on branches named `migration/<area>` (this one:
  `migration/foundation`), opened as PRs into `main`.
- Each PR should be small enough to review against the rules above —
  "does this look and behave exactly like production, just in a new
  file?" — rather than bundling multiple areas together.
- Production continues to be served from the root `index.html` until a
  dedicated cutover PR explicitly switches Vercel's root directory (or
  otherwise repoints production) — and says so clearly in its
  description.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck   # tsc --noEmit
npm run build       # production build
```
