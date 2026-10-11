import { test } from "node:test";
import assert from "node:assert/strict";
import handler, { normalizeCandles, normalizeTicker } from "../netlify/functions/spot-market.mjs";

test("OHLCV uses Coinbase's [time, low, high, open, close, volume] order and excludes incomplete bars",()=>{
 const now=1791600100,base=Math.floor(now/60)*60;
 const rows=[[base-60,96,106,100,103,4],[base,95,108,101,102,5],[base-120,90,111,99,105,3],[base-180,150,105,110,108,1]];
 const candles=normalizeCandles(rows,60,now);
 assert.equal(candles.length,2);
 assert.deepEqual(candles.map(x=>x.timestamp),[base-120,base-60]);
 assert.deepEqual(candles[1],{timestamp:base-60,open:100,high:106,low:96,close:103,volume:4,complete:true});
});
test("Ticker freshness compares true source trade time",()=>{
 const ticker=normalizeTicker({price:"50000.12",time:new Date(1791600000*1000).toISOString(),bid:"50000",ask:"50001",volume:"1400"},1791600040);
 assert.equal(ticker.price,50000.12);assert.equal(ticker.fresh,true);assert.equal(ticker.ageSeconds,40);
 assert.equal(normalizeTicker({price:"99",time:new Date(1791600000*1000).toISOString()},1791601000).fresh,false);
});
test("Unsupported user input rejected before making any external request",async()=>{
 const response=await handler(new Request("https://site.example/api/spot-market?interval=100"));
 assert.equal(response.status,400);
 const unexpected=await handler(new Request("https://site.example/api/spot-market?url=https://example.com"));
 assert.equal(unexpected.status,400);
});
test("Read-only function returns verified candle rows without order capabilities",async()=>{
 const old=globalThis.fetch;
 const epoch=Math.floor(Date.now()/60000)*60;
 const when=new Date((epoch-5)*1000).toISOString();
 const called=[];
 globalThis.fetch=async(url)=>{
   called.push(String(url));
   if(String(url).endsWith("/ticker"))return new Response(JSON.stringify({price:"98765.01",time:when,bid:"98764",ask:"98766",volume:"1050"}),{status:200});
   return new Response(JSON.stringify([[epoch-60,98700,98800,98735,98765,22],[epoch,98710,98900,98750,98850,23]]),{status:200});
 };
 try{
   const response=await handler(new Request("https://site.example/api/spot-market?interval=60"));
   assert.equal(response.status,200);
   const payload=await response.json();
   assert.equal(payload.market,"BTC-USD");assert.equal(payload.marketType,"SPOT");
   assert.equal(payload.ticker.price,98765.01);
   assert.equal(payload.candles.length,1);
   assert.equal(payload.candles[0].open,98735);
   assert.equal(payload.candles[0].high,98800);
   assert.equal(payload.candles[0].close,98765);
   assert.equal(payload.candles[0].volume,22);
   assert.equal(called.length,2);
   assert(called.every(x=>x.startsWith("https://api.exchange.coinbase.com/products/BTC-USD/")));
 }finally{globalThis.fetch=old;}
});
test("Upstream outage does not produce invented prices",async()=>{
 const old=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({message:"provider failed"}),{status:503});
 try{
   const response=await handler(new Request("https://site.example/api/spot-market?mode=quote"));
   assert.equal(response.status,503);
   const payload=await response.json();assert.equal(payload.ticker,null);assert.notEqual(payload.status,"fresh");
 }finally{globalThis.fetch=old;}
});
