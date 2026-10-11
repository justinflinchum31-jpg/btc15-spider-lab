# BTC15 deployment status

**2026-10-10:** The research-only static dashboard is committed to GitHub on `main`. Its `public` directory includes an accessible HTML dashboard, styles, and browser-only historical price/indicator analysis. No trading server endpoints or wallet functionality are included.

GitHub repository: https://github.com/justinflinchum31-jpg/btc15-spider-lab

Netlify project: https://app.netlify.com/projects/btc15-spider-lab-justin

**Not yet live:** The GitHub source is not automatically linked to the existing Netlify site. The current Netlify project still reports no published deployment. Finish in Netlify dashboard: Project configuration → Build & deploy → Continuous deployment → Link repository → GitHub → justinflinchum31-jpg/btc15-spider-lab → main. Read-only `netlify.toml` sets publish directory `public`. No API keys or background services are needed.

Historical dataset snapshot: Oct 9, 2026; Brier score 0.2574, worse than 0.2500 baseline. No demonstrated trading profitability.
