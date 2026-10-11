/**
 * Immutable ten-minute Bitcoin price study.
 * Each observation is a source-verified public BTC/USD spot price.
 * The $500 value is a hypothetical constant-exposure benchmark,
 * NOT an account, order, balance transfer, or trading algorithm.
 */
export const START_REFERENCE_USD = 500;
export const INTERVAL_SECONDS = 600;
export function slotFor(timestampSeconds) {
  if (!Number.isInteger(timestampSeconds) || timestampSeconds < 0) throw Error("Invalid observation time");
  return Math.floor(timestampSeconds / INTERVAL_SECONDS) * INTERVAL_SECONDS;
}
export function recordKey(slot) {
  if (!Number.isInteger(slot) || slot < 0 || slot % INTERVAL_SECONDS !== 0) throw Error("Invalid 10m slot");
  return "observations/"+new Date(slot*1000).toISOString().slice(0,10)+"/"+slot;
}
export function validateObservation(record, now=Math.floor(Date.now()/1000)) {
  if (!record || record.kind!=="BTC_SPOT_OBSERVATION" ||
      !Number.isInteger(record.slot) || record.slot<0 || record.slot%INTERVAL_SECONDS!==0 ||
      !Number.isInteger(record.sourceTimestamp) || record.sourceTimestamp < record.slot-180 ||
      record.sourceTimestamp>record.slot+INTERVAL_SECONDS ||
      !Number.isFinite(record.price) || record.price<=0 ||
      !Number.isInteger(record.observedAt) || record.observedAt<record.slot ||
      record.observedAt>record.slot+INTERVAL_SECONDS+180 ||
      record.observedAt>now+30 ||
      record.market!=="BTC-USD" || record.source!=="Coinbase Exchange") {
    return false;
  }
  return true;
}
export function calculateVirtualProgress(baseline, observations, starting=START_REFERENCE_USD) {
  if (!Number.isFinite(starting)||starting<=0)throw Error("Invalid start reference");
  if (!baseline||!Number.isFinite(baseline.price)||baseline.price<=0||
      !Number.isInteger(baseline.slot)) return [];
  const unique=new Map();
  for(const obs of observations){
    if(!validateObservation(obs))continue;
    if(obs.slot<baseline.slot)continue;
    unique.set(obs.slot,obs);
  }
  return [...unique.values()].sort((a,b)=>a.slot-b.slot).map(o=>{
    const value=starting*o.price/baseline.price;
    return {
      slot:o.slot, sourceTimestamp:o.sourceTimestamp,
      observedAt:o.observedAt, price:o.price,
      value:Math.round(value*100)/100,
      change:Math.round((value-starting)*100)/100,
      changePct:Math.round((value/starting-1)*10000)/100,
      kind:"hypothetical-hold-value"
    };
  });
}
