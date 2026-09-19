# GrowthU

The marketing site for **GrowthU**, a social media management agency helping
brands grow beyond limits. It is a responsive, single-page Next.js application
with an editorial cream, forest-green, and sage visual system.

## Stack

- Next.js 15 (App Router)
- React 19 and TypeScript
- CSS design system (no UI framework required)

## Run locally

### Prerequisites

- Node.js 20.9 or later
- npm 10 or later

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Quality checks

Run these before deploying:

```bash
npm run lint
npm run typecheck
npm run build
```

To test the production build locally:

```bash
npm run build
npm run start
```

## Deploy to Vercel

This repository is ready to deploy as a Next.js project and does not require
environment variables for the current version.

### Option 1: Deploy through the Vercel dashboard

1. Push the `main` branch to GitHub.
2. In the [Vercel dashboard](https://vercel.com/new), select **Add New → Project**.
3. Import the GrowthU GitHub repository.
4. Keep Vercel's detected **Next.js** framework preset and the default build settings.
5. Select **Deploy**.
6. Vercel will create a production deployment from `main`; future pull requests
   and non-production branches receive preview deployments automatically.

### Option 2: Deploy with the Vercel CLI

1. Install and authenticate the CLI:

   ```bash
   npm install --global vercel
   vercel login
   ```

2. From the repository root, create a preview deployment:

   ```bash
   vercel
   ```

3. To deploy the current commit to production intentionally, run:

   ```bash
   vercel --prod
   ```

The CLI prints the deployment URL when it completes. Do not use `--prod` for a
preview-only release.

## Contact form integration

The contact form currently provides accessible browser validation and a local
success state only. Before using it for live lead capture, connect its submit
handler in `app/page.tsx` to your preferred secure service (for example, a
server-side Next.js route, CRM, or email provider). Keep API keys and provider
credentials in Vercel Environment Variables rather than client-side code.
