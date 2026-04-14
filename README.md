# SERC Website

Website for Southeast Reptile Conservation, built with Astro and hosted on Firebase.

## Getting started

```
npm install
npm run dev
```

Open http://localhost:4321

## Build and deploy

```
npm run build
firebase deploy
```

Pushing to main triggers an automatic deploy via GitHub Actions.

## Adding a blog post

1. Create `src/pages/blog/your-post-slug.astro`
2. Use the existing post as a template
3. Add the post to the array in `src/pages/blog/index.astro`
4. Drop any images in `public/images/`
