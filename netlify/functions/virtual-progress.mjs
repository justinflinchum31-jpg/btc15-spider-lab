/**
 * Read-only immutable BTC observation history.
 * Reconstructs a hypothetical $500 constant-BTC exposure benchmark.
 * No accounts, order routes, wallet data or "trades" are created.
 */
import { getStore } from "@netlify/blobs";
import { START_REFERENCE_USD, calculateVirtualProgress } from "../../src/virtual-benchmark.mjs";

const STORE="btc15-public-price-study-v1";
const headers={
  "content-type":"application/json; charset=utf-8",
  "cache-control":"no-store",
  "x-content-type-options":"nosniff",
};
const reply=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
function datePrefix(epoch){
  return "observations/"+new Date(epoch*1000).toISOString().slice(0,10)+"/";
}
function newDays(now) {
  const midnight=Math.floor(now/86400)*86400;
  return Array.from({length:3},(_,i)=>datePrefix(midnight-(2-i)*86400));
}
export default async function virtualProgress(request){
  if(request.method!=="GET")return reply({error:"Only GET is supported"},405,{"allow":"GET"});
  const query=new URL(request.url).searchParams;
  if([...query.keys()].some(key=>key!=="limit"))return reply({error:"Unsupported query parameter"},400);
  const max=query.has("limit")?Number(query.get("limit")):72;
  if(!Number.isInteger(max)||max<1||max>144)return reply({error:"limit must be 1–144"},400);
  const now=Math.floor(Date.now()/1000);
  const empty={
    kind:"BTC_SPOT_HYPOTHETICAL_STUDY",
    startReferenceUSD:START_REFERENCE_USD,
    startPrice:null,startedAt:null,records:[],recordCount:0,
    latestValue:null,latestChange:null,latestChangePct:null,latestTimestamp:null,
    status:"awaiting-first-observation",nextCadenceSeconds:600,
    source:"Coinbase Exchange",market:"BTC-USD",
    notice:"Educational $500 spot-price benchmark. This is not a trading account, trade fill, market bet, cash profit, or investment result."
  };
  try {
    const store=getStore(STORE);
    const baseline=await store.get("baseline",{type:"json"});
    if(!baseline||baseline.kind!=="BTC_SPOT_REFERENCE_START"||
       baseline.source!=="Coinbase Exchange"||baseline.market!=="BTC-USD"||
       !Number.isFinite(baseline.price)||baseline.price<=0||
       !Number.isInteger(baseline.slot))return reply(empty);
    const listed=await Promise.all(newDays(now).map(prefix=>store.list({prefix})));
    const keys=[...new Set(listed.flatMap(page=>page.blobs||[]).map(b=>b.key))]
      .filter(key=>/^observations\/\d{4}-\d{2}-\d{2}\/\d+$/.test(key))
      .sort((a,b)=>Number(a.split("/").at(-1))-Number(b.split("/").at(-1)))
      .slice(-max);
    const observations=[];
    // Bounded parallel reads avoid overwhelming the store during public requests.
    for(let i=0;i<keys.length;i+=12){
      const batch=await Promise.all(keys.slice(i,i+12).map(async key=>{
        try{return await store.get(key,{type:"json"});}catch{return null;}
      }));
      observations.push(...batch.filter(Boolean));
    }
    const records=calculateVirtualProgress(baseline,observations);
    const last=records.at(-1)??null;
    const lag=last?Math.max(0,now-last.observedAt):null;
    return reply({
      ...empty, startPrice:baseline.price,startedAt:baseline.slot,
      records,recordCount:records.length,
      latestValue:last?.value??null,
      latestChange:last?.change??null,
      latestChangePct:last?.changePct??null,
      latestTimestamp:last?.observedAt??null,
      ageSeconds:lag,
      status:!last?"waiting-for-recent-data":lag<=1200?"recording":"delayed",
      observationWindow:"Latest available 3 UTC days (up to "+max+" records)"
    });
  }catch(e){
    console.error("Read-only observation history unavailable", String(e?.message||e));
    return reply({...empty,status:"storage-unavailable",error:"Saved observations are unavailable. Nothing has been estimated."},503);
  }
}
export const config={path:"/api/virtual-progress",method:"GET"};
