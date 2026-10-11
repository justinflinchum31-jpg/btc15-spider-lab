/**
 * Production-only 10-minute archival BTC spot observation.
 * Stores immutable individual measurements with no read/modify/write balances.
 * $500 is a benchmark reference calculated by the read-only history endpoint.
 * No market orders, signals, positions, accounts, or wagering.
 */
import { getStore } from "@netlify/blobs";
import { normalizeTicker } from "./spot-market.mjs";
import { INTERVAL_SECONDS, slotFor, recordKey, validateObservation } from "../../src/virtual-benchmark.mjs";

const URL="https://api.exchange.coinbase.com/products/BTC-USD/ticker";
const STORE="btc15-public-price-study-v1";

export default async function scheduledObservation() {
  const now=Math.floor(Date.now()/1000),slot=slotFor(now);
  // When called outside its ten-minute window, the scheduler should not save anything.
  if (now-slot > 150) {console.warn("Skipping delayed research tick", {slot,now});return;}
  let ticker;
  try {
    const response=await fetch(URL,{
      method:"GET", headers:{"accept":"application/json","user-agent":"BTC15-ReadOnly-Educational-Study/1.0"},
      signal:AbortSignal.timeout(8500),redirect:"error"
    });
    if(!response.ok)throw Error("BTC spot provider response "+response.status);
    ticker=normalizeTicker(await response.json(),now);
    if(!ticker.fresh||ticker.ageSeconds>90) throw Error("Verified BTC price unavailable or stale");
  } catch(e) {console.warn("BTC 10m research observation skipped; no invented value",{slot,error:String(e?.message||e)});return;}
  const observation={
    kind:"BTC_SPOT_OBSERVATION",source:"Coinbase Exchange",market:"BTC-USD",
    slot,sourceTimestamp:ticker.timestamp,observedAt:now,price:ticker.price
  };
  if(!validateObservation(observation,now)) {console.warn("Invalid BTC observation", {slot});return;}
  try{
    const store=getStore(STORE);
    const saved=await store.setJSON(recordKey(slot),observation,{onlyIfNew:true});
    // Immutable initial benchmark; concurrent runs can only create it once.
    await store.setJSON("baseline",{
      kind:"BTC_SPOT_REFERENCE_START",source:"Coinbase Exchange",
      market:"BTC-USD",slot,sourceTimestamp:ticker.timestamp,
      price:ticker.price,startReferenceUSD:500
    },{onlyIfNew:true});
    console.log(JSON.stringify({kind:"RESEARCH_OBSERVATION",slot,saved:Boolean(saved?.modified),sourceTimestamp:ticker.timestamp}));
  } catch(e){
    console.error("BTC research observation storage unavailable",{slot,error:String(e?.message||e)});
    throw e;
  }
}
// UTC minute :00, :10, :20, :30, :40, :50; not invoked by a user-accessible URL.
export const config={schedule:"*/10 * * * *"};
