# Copilot Instructions – Dance Tracker

## Goal

Every task goes from user prompt → code change → `git push` → **live on GitHub Pages** with no manual steps in between. The user must be able to verify each completed task immediately at the deployed URL.

## Branch & Git Strategy

- **Work exclusively on the `main` branch.** Never create feature branches.
- **Never open pull requests.** Commit and push directly to `main`.
- Use `report_progress` (or `git commit` + push) after every meaningful change to trigger the deployment pipeline.

## Deployment

- Pushing to `main` automatically triggers `.github/workflows/deploy.yml`.
- The workflow runs: `npm ci` → `npm run lint` → `npm run build` → deploy to GitHub Pages.
- Live URL: **https://viktor2588.github.io/dance-tracker/**
- After every push, confirm the deployment succeeded via the GitHub Actions tab before declaring the task done.

## Project Stack

- React 18 + Vite 5 (PWA via `vite-plugin-pwa`)
- The Vite `base` is set to `/dance-tracker/` — keep this in all asset paths and router configs.
- Build output goes to `dist/`.

## Code Style

- Follow the existing ESLint config (`.eslintrc.cjs`). The build will fail if lint errors exist.
- Use functional React components and hooks.
- Keep components in `src/`.
