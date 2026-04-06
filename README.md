# Dance Tracker

A progressive web app (PWA) to track your dance sessions — built with React, Vite, and deployed automatically to GitHub Pages.

🔗 **Live App:** https://viktor2588.github.io/dance-tracker/

---

## Development Workflow

### Branch Strategy

- **We work exclusively on the `main` branch.** No feature branches, no pull requests.
- Commit and push your changes directly to `main`.

### Automatic Deployment

Every `git push` to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which:

1. Installs dependencies (`npm ci`)
2. Lints the code (`npm run lint`)
3. Builds the app (`npm run build`)
4. Deploys the `dist/` folder to **GitHub Pages**

This means every push is immediately live — you can verify your changes at the URL above within seconds of pushing.

---

## Local Development

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

---

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — Service Worker & Web App Manifest
- [GitHub Pages](https://pages.github.com/) — Hosting
- [GitHub Actions](https://github.com/features/actions) — CI/CD
