# BTC15 Spider Lab deployment status

This repository is reserved for the paper-only BTC15 Spider Bot v2.4 project.

- Netlify project: https://app.netlify.com/projects/btc15-spider-lab-justin
- The application code has not yet been uploaded to this repository.
- No production deployment or working cloud database has yet been verified.
- All trading execution must remain paper-only.

Before deployment, upload the complete v2.4 source files at the repository root, including `package.json`, `netlify.toml`, `public/`, `src/`, and `netlify/`. Do not upload any `.env`, credentials, wallet keys or private data. Then connect the repository's `main` branch in the Netlify project settings and configure the supported database integration. Validate the CI tests and API endpoints before trusting paper-trading results.
