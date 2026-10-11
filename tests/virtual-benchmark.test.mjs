import {test} from "node:test";
import assert from "node:assert/strict";
import {START_REFERENCE_USD, INTERVAL_SECONDS, slotFor, recordKey, validateObservation, calculateVirtualProgress} from "../src/virtual-benchmark.mjs";

const now=Math.floor(Date.now()/1000);
const earlier=slotFor(now-3000);
function observation(slot,price,extra={}) {
  return {kind:"BTC_SPOT_OBSERVATION",source:"Coinbase Exchange",market:"BTC-USD",
    slot,sourceTimestamp:slot+5,observedAt:slot+8,price,...extra};
}
const baseline={slot:earlier,price:100};

test("fixed starting virtual reference is exactly $500 and cadence is 600 seconds",()=>{
  assert.equal(START_REFERENCE_USD,500);
  assert.equal(INTERVAL_SECONDS,600);
  assert.equal(slotFor(1805),1800);
  assert.equal(recordKey(1800),"observations/1970-01-01/1800");
});
test("hypothetical value is computed from observed price ratios with no trade execution",()=>{
  const one=observation(earlier,100),two=observation(earlier+600,110),three=observation(earlier+1200,95);
  const rows=calculateVirtualProgress(baseline,[three,one,two]);
  assert.deepEqual(rows.map(x=>x.value),[500,550,475]);
  assert.deepEqual(rows.map(x=>x.change),[0,50,-25]);
  assert.deepEqual(rows.map(x=>x.changePct),[0,10,-5]);
  assert(rows.every(x=>x.kind==="hypothetical-hold-value"));
});
test("invalid, foreign-market, and timestamp-corrupt observations cannot affect the record",()=>{
  const valid=observation(earlier+600,106);
  const corrupt=observation(earlier+1200,140,{source:"Other source"});
  const bad=observation(earlier+1800,-8);
  const future=observation(earlier+6000,300,{observedAt:Math.floor(Date.now()/1000)+3600});
  assert.equal(validateObservation(corrupt),false);
  assert.equal(validateObservation(bad),false);
  assert.equal(validateObservation(future),false);
  const rows=calculateVirtualProgress(baseline,[valid,corrupt,bad,future]);
  assert.equal(rows.length,1);assert.equal(rows[0].value,530);
});
test("replayed duplicate scheduled observation slots are deduplicated by immutable slot",()=>{
  const a=observation(earlier+600,101);
  const b=observation(earlier+600,101);
  assert.equal(calculateVirtualProgress(baseline,[a,b]).length,1);
});
test("no baseline means no invented current value",()=>{
  assert.deepEqual(calculateVirtualProgress(null,[observation(earlier,90)]),[]);
});
