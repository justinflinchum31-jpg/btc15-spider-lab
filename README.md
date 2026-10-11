# BTC15 Spider Lab — Deployment setup

This repository is reserved for the **paper-only** BTC15 Spider Bot research/dashboard application (v2.4).

**Current state:** The connected GitHub repository is initialized, but the application source has not been committed here and the Netlify deployment has not been published.

- Netlify project: https://app.netlify.com/projects/btc15-spider-lab-justin
- Intended production branch: `main`
- Runtime: Node.js 22+
- Build: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions`

## Safe setup

1. **Change this repository to Private** in Settings > General > Danger Zone > Change repository visibility before uploading app code or research datasets.
2. Upload the contents of the BTC15 v2.4 project ZIP to the repository root. Do **not** commit `.env`, passwords, API tokens, wallet credentials, local database files, or sensitive research data.
3. In Netlify's BTC15 project configuration, connect this repository for continuous deployment using the `main` branch. A Netlify project by itself is not a published app.
4. Configure database support and verify migrations, function logs, `/api/dashboard`, and `/api/live`.
5. Keep all execution in **paper mode**. Historical forecasting has not demonstrated positive out-of-sample net returns; do not infer profitability from a successful deployment.

The separate **TradeGuard** project is not part of this repository.
