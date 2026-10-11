## Read-only public BTC/USD spot feed (v2.6)

- **Live-view page:** `/spot.html`; the neon homepage also shows a source-timestamped BTC spot quote.
- **Netlify API:** `GET /api/spot-market` with `interval=60|300|900`; optional `mode=quote` limits a call to the ticker. Other query parameters and HTTP methods are rejected.
- **Fixed source:** public BTC/USD spot quote and OHLCV history through a server-side endpoint. This is a different venue/data series from archived BRTI reference data. Do not mix these sources for settlement or model evaluation.
- **Data checks:** actual ticker timestamp, price and OHLCV validity, only completed candles, explicit provider failures and stale-feed states. Never invent a quote when the source is unavailable.
- **Chart:** 1m, 5m, 15m switcher; volume bars; EMA20/EMA50 overlays; RSI14; MACD histogram; observed price, bid/ask spread and source freshness. The dashboard refreshes a cached same-origin read-only endpoint periodically.
- **Security:** no credentials or wallet connection; no trading/execution/recommendation endpoints; only one deployed GET-only function; site Content Security Policy permits same-origin data reads and blocks external browser connections.
- **Checks:** `node --test tests/spot-market.test.mjs`, plus the GitHub Actions read-only policy checks.

**Verification:** CI tests and the Netlify production deployment can be checked through GitHub/Netlify. Since external calls to the signed-in site may be restricted, the market-data response's runtime freshness is a separate check; source errors display as unavailable, rather than a fabricated successful price.

## Neon paper-research schematic (v2.5)

The **homepage** at `/` is now a fully coded dark-navy/neon-pink dashboard inspired by the supplied reference screenshot, not a mock image. It includes eight research status cards, a timestamped event monitor, 1m/5m/15m BTC OHLC candlesticks with EMA 20/50, an offline correctness chart, technical analysis, research guards, direction-filter buttons, an interactive historical replay journal, and CSV export.

All 240 displayed 1-minute OHLC candles are directly sourced from the archived BRTI dataset; high/low values are not generated. The 15-minute replay observations in the homepage use a deterministic past-only EMA9/EMA21 + 5-minute momentum diagnostic, with outcomes measured 15 minutes later. They do **not** reflect executed trades or profit. The original research UI remains at `/research.html` and the full earlier replay remains at `/replay.html`.

**No wallets, leverage, markets API calls, order routing, background bots, current trade execution, or fabricated balance/P&L are included.** The reference screenshot was used for visual layout and color guidance only.

# BTC15 Spider Research Lab

A **read-only** Bitcoin historical analysis and forecast-validation dashboard. This repo contains no order execution, wallet access, trade automation, collector jobs, paper accounts, prediction-market quote scraping or trading APIs.

## Published research

- Data source: BRTI one-minute historical BTC/USD observations collected through **October 9, 2026 17:58 UTC**.
- 5,902 actual candles available from 10,080 requested (58.6% coverage).
- 387 price-direction research samples; 287 predictions evaluated out-of-sample in four chronological folds.
- Model Brier score **0.2573947** versus constant 50% baseline **0.2500**; worse result, **no demonstrated advantage**.
- Seven research inputs; VWAP and order-book imbalance excluded for missing observations.
- The interface visualizes the **final 100 actual archived closing prices**, not live ticks or synthetic prices.
- Calibration bins have the counts and averages reported in the v2.4 evidence file.
- **No market-settlement results, executable P&L, or profitable strategy has been established.**

## Deploy on Netlify

The Netlify project is already created: https://app.netlify.com/projects/btc15-spider-lab-justin

Import repository `justinflinchum31-jpg/btc15-spider-lab` using production branch `main`. The checked-in `netlify.toml` publishes the `public` directory as a purely static site. There are no environment variables or database requirements for this safe research view.

**Important:** Source push and site creation do not by themselves establish a linked or successful Netlify deployment. Verify the Netlify build status and site URL after connecting.

## Safety / security

This is a deliberately public-safe static subset. It makes zero network requests from browser JavaScript; CSP sets `connect-src 'none'`. It includes no key material or private data. The main BTC15 automated bot from the earlier ZIP is **not** included.

## Historical signal replay

The site now includes [`/replay.html`](https://btc15-spider-lab-justin.netlify.app/replay.html), a **read-only historical directional research ledger**, not a trading bot. It uses the 5,902 consecutive October 5–9, 2026 BRTI candles already bundled in the earlier local research archive. Every 15 minutes starting at the 46th candle, a past-only rule assesses EMA 9 vs EMA 21 and the 5-minute price change. If both are up, the retrospective signal is UP; if both are down, DOWN; otherwise ABSTAIN. Outcomes use the BRTI index close exactly 15 minutes later. Across 390 windows: 257 directional signals, 110 correct directions, 147 incorrect, 133 abstentions; historical directional accuracy **42.8%**. The replay page displays the last 32 windows with timestamps and observed prices. This does not measure Polymarket execution, entry costs, contract settlement, actual trades, or net returns. It is unsuitable as a live decision policy without stronger validation.
