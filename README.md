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
