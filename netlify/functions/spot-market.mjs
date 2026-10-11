/**
 * BTC15 public BTC/USD market-data reader. Coinbase Exchange spot market only.
 * No keys, wallets, order placement, trading endpoints, or user inputs
 * selecting external URLs. Real data is returned or an explicit error.
 */
const BASE = "https://api.exchange.coinbase.com/products/BTC-USD";
const FRAMES = new Set([60, 300, 900]);
const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "public, max-age=10, s-maxage=15, stale-while-revalidate=30",
  "x-content-type-options": "nosniff",
};
function reply(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...HEADERS, ...extra } });
}
function finitePositive(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : null;
}
export function normalizeCandles(rows, seconds, serverNow) {
  if (!Array.isArray(rows)) throw Error("Unexpected candle data format");
  const map = new Map();
  for (const item of rows) {
    if (!Array.isArray(item) || item.length < 6) continue;
    const [rawTime, rawLow, rawHigh, rawOpen, rawClose, rawVol] = item;
    const time = Number(rawTime);
    const low = finitePositive(rawLow), high = finitePositive(rawHigh);
    const open = finitePositive(rawOpen), close = finitePositive(rawClose);
    const volume = Number(rawVol);
    if (!Number.isInteger(time) || time <= 0 || time % seconds !== 0 ||
        time + seconds > serverNow || time > serverNow ||
        [low, high, open, close].some(v => v === null) ||
        high < Math.max(open, close) || low > Math.min(open, close) ||
        !Number.isFinite(volume) || volume < 0) continue;
    map.set(time, { timestamp: time, open, high, low, close, volume, complete: true });
  }
  return [...map.values()].sort((a,b)=>a.timestamp-b.timestamp).slice(-240);
}
export function normalizeTicker(raw, serverNow) {
  if (!raw || typeof raw !== "object") throw Error("Unexpected ticker format");
  const price=finitePositive(raw.price);
  const when=Date.parse(raw.time);
  const ts=Number.isFinite(when) ? Math.floor(when/1000) : NaN;
  if (price===null || !Number.isFinite(ts) || ts<=0 || ts>serverNow+30) {
    throw Error("Invalid ticker price or timestamp");
  }
  const ageSeconds = Math.max(0, serverNow-ts);
  return {
    price, timestamp: ts, ageSeconds,
    fresh: ageSeconds <= 120,
    bid: finitePositive(raw.bid),
    ask: finitePositive(raw.ask),
    volume24hBTC: finitePositive(raw.volume)
  };
}
async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { accept:"application/json", "user-agent":"BTC15-Spider-Lab-ReadOnly-Research/1.0" },
    signal: AbortSignal.timeout(7000),
    redirect: "error",
  });
  if (!response.ok) throw Error(response.status === 429 ? "Market-data provider rate-limited the request" : "Market-data provider unavailable ("+response.status+")");
  return await response.json();
}
export default async function handler(request) {
  if (request.method !== "GET") return reply({error:"Only GET is supported"},405,{"allow":"GET"});
  let params;
  try { params=new URL(request.url).searchParams; } catch { return reply({error:"Invalid URL"},400); }
  const allowed = new Set(["interval","mode"]);
  for (const key of params.keys()) if (!allowed.has(key)) return reply({error:"Unsupported query parameter"},400);
  const interval = params.has("interval") ? Number(params.get("interval")) : 60;
  const mode = params.get("mode") ?? "candles";
  if (!FRAMES.has(interval) || !["candles","quote"].includes(mode)) return reply({error:"Use interval=60,300,900 and mode=candles or quote"},400);
  const serverNow=Math.floor(Date.now()/1000);
  const tickerUrl=BASE+"/ticker";
  const end=Math.ceil(serverNow/interval)*interval;
  const start=end-(interval*242);
  const candleUrl=BASE+"/candles?granularity="+interval+"&start="+encodeURIComponent(new Date(start*1000).toISOString())+"&end="+encodeURIComponent(new Date(end*1000).toISOString());
  // The API response can include up to 300 buckets; we request only 242.
  const results=await Promise.allSettled(mode==="quote" ? [fetchJson(tickerUrl)] : [fetchJson(tickerUrl),fetchJson(candleUrl)]);
  const errors=[], payload={
    source:"Coinbase Exchange", market:"BTC-USD", marketType:"SPOT",
    observedAt: new Date(serverNow*1000).toISOString(),
    intervalSeconds:interval, ticker:null,
    candles: mode==="quote" ? undefined : [],
    candleAgeSeconds:null, candleCount:0,
    warning:"Independent BTC/USD spot prices. Not BRTI settlement index, not prediction-market prices, and not trading signals."
  };
  try {
    if (results[0].status==="fulfilled") payload.ticker=normalizeTicker(results[0].value,serverNow);
    else throw results[0].reason;
  } catch (e) { errors.push("Ticker: "+String(e?.message||"unavailable")); }
  if (mode==="candles") {
    try {
      if (results[1].status!=="fulfilled") throw results[1].reason;
      payload.candles=normalizeCandles(results[1].value,interval,serverNow);
      payload.candleCount=payload.candles.length;
      if (!payload.candleCount) throw Error("No valid completed candles available");
      payload.candleAgeSeconds=Math.max(0, serverNow-(payload.candles.at(-1).timestamp+interval));
    } catch(e) { errors.push("Candles: "+String(e?.message||"unavailable"));payload.candles=[];payload.candleCount=0; }
  }
  payload.errors=errors;
  payload.status=errors.length===0 && payload.ticker?.fresh && (mode==="quote"||payload.candleAgeSeconds<=interval*3) ? "fresh" : errors.length===0?"stale":"partial";
  if (!payload.ticker && (mode==="quote"||!payload.candleCount)) return reply(payload,503,{"cache-control":"no-store"});
  return reply(payload,200, errors.length?{"cache-control":"no-store"}:{});
}
export const config = { path:"/api/spot-market", method:"GET" };
