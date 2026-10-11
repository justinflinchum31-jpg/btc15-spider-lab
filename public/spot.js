/* Read-only BTC spot-market chart. This browser requests only /api/spot-market. */
const $=id=>document.getElementById(id);
const money=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n):'—';
const nfmt=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'—';
const clock=ts=>Number.isFinite(ts)?new Date(ts*1000).toISOString().slice(11,19)+' UTC':'—';
const tfAllowed=new Set([60,300,900]);
let interval=60, candles=[], ticker=null, lastMeta=null, loading=false, chartHover=-1, lastOkAt=0;
function ema(vals,n){const result=Array(vals.length).fill(null);if(vals.length<n)return result;let value=vals.slice(0,n).reduce((a,b)=>a+b,0)/n;result[n-1]=value;const k=2/(n+1);for(let i=n;i<vals.length;i++){value=k*vals[i]+(1-k)*value;result[i]=value;}return result;}
function rsi(vals,n=14){if(vals.length<=n)return null;let gain=0,loss=0;for(let i=1;i<=n;i++){let v=vals[i]-vals[i-1];gain+=Math.max(v,0);loss+=Math.max(-v,0);}gain/=n;loss/=n;for(let i=n+1;i<vals.length;i++){let v=vals[i]-vals[i-1];gain=(gain*(n-1)+Math.max(v,0))/n;loss=(loss*(n-1)+Math.max(-v,0))/n;}return loss===0?100:100-100/(1+gain/loss);}
function macdHistogram(vals){const a=ema(vals,12),b=ema(vals,26);const line=a.map((v,i)=>v!=null&&b[i]!=null?v-b[i]:null),valid=line.filter(x=>x!=null),sig=ema(valid,9);return valid.length>=9?valid.at(-1)-sig.at(-1):null;}
function setHealth(health,text){$('spot-health').textContent=text;$('spot-health').style.color=health==='fresh'?'#52efa5':'#ffbb7c';$('spot-status').textContent=health==='fresh'?'Fresh exchange quote':'Unavailable or delayed · not live';}
function showError(message){$('feed-error').hidden=false;$('feed-error').textContent='Market data unavailable or delayed. '+message+' No substitute prices are generated.';}
function clearError(){$('feed-error').hidden=true;}
async function request(mode='candles',frame=interval){
 const url='/api/spot-market?mode='+mode+'&interval='+frame;
 const response=await fetch(url,{headers:{accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(11000)});
 const payload=await response.json();
 if(!response.ok)throw Error(payload.error||payload.errors?.join('; ')||'Market data request failed');
 return payload;
}
function tickerRender(){
 const now=Math.floor(Date.now()/1000);
 const age=ticker&&Number.isFinite(ticker.timestamp)?Math.max(0,now-ticker.timestamp):null;
 const freshness=ticker?.fresh&&age!==null&&age<=120;
 $('spot-price').textContent=ticker?money(ticker.price):'—';
 $('spot-age').textContent=age===null?'—':age+'s';
 $('spot-time').textContent=ticker?'Source time: '+clock(ticker.timestamp):'No verified quote timestamp';
 $('spot-spread').textContent=ticker?.bid&&ticker?.ask?money(ticker.ask-ticker.bid):'—';
 $('spot-bidask').textContent=ticker?.bid&&ticker?.ask?'Bid '+money(ticker.bid)+' / Ask '+money(ticker.ask):'No verified bid/ask';
 $('spot-volume').textContent=ticker&&Number.isFinite(ticker.volume24hBTC)?nfmt(ticker.volume24hBTC,1)+' BTC':'—';
 setHealth(freshness?'fresh':'stale',freshness?'FRESH':'STALE / UNAVAILABLE');
 if(!freshness && ticker)showError('The last verified quote is too old.');
}
function drawGraph(canvas, type){
 const rect=canvas.parentElement.getBoundingClientRect();
 const w=Math.max(260,rect.width),h=Math.max(70,rect.height),dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 canvas.style.width=w+'px';canvas.style.height=h+'px';
 const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
 const len=candles.length;if(len===0)return;
 const left=12,right=75,top=14,bottom=26;
 const cw=w-left-right,ch=h-top-bottom,step=cw/len;
 if(type==='volume'){
   const max=Math.max(...candles.map(d=>d.volume),.000001);
   candles.forEach((d,i)=>{
     const height=(d.volume/max)*ch;
     c.fillStyle=d.close>=d.open?'#29de91':'#f0737d';
     c.fillRect(left+i*step+step*.16,top+ch-height,Math.max(1,step*.68),height);
   });
   c.fillStyle='#8098b5';c.font='10px monospace';c.fillText('BTC volume',left+4,top+12);return;
 }
 const closes=candles.map(x=>x.close),e20=ema(closes,20),e50=ema(closes,50);
 const values=candles.flatMap(x=>[x.high,x.low]).concat(e20.filter(Number.isFinite),e50.filter(Number.isFinite));
 let lo=Math.min(...values),hi=Math.max(...values);const expand=Math.max(1,(hi-lo)*.07);lo-=expand;hi+=expand;
 const y=v=>top+(hi-v)/(hi-lo)*ch;
 c.font='10px monospace';
 for(let i=0;i<=4;i++){const yy=top+ch*i/4;c.beginPath();c.strokeStyle='#203252';c.lineWidth=1;c.moveTo(left,yy);c.lineTo(w-right,yy);c.stroke();c.fillStyle='#90a2bc';c.fillText((hi-(hi-lo)*i/4).toLocaleString('en-US',{maximumFractionDigits:0}),w-right+8,yy+3);}
 candles.forEach((d,i)=>{
   const xx=left+(i+.5)*step;
   c.strokeStyle=c.fillStyle=d.close>=d.open?'#24e495':'#f46a79';
   c.beginPath();c.moveTo(xx,y(d.high));c.lineTo(xx,y(d.low));c.stroke();
   c.fillRect(xx-Math.max(1,step*.28),Math.min(y(d.open),y(d.close)),Math.max(1.5,step*.56),Math.max(1,Math.abs(y(d.close)-y(d.open))));
 });
 for(const [values,color] of [[e20,'#35c4ff'],[e50,'#f9af49']]){
   c.strokeStyle=color;c.lineWidth=1.6;c.beginPath();let started=false;
   values.forEach((v,i)=>{if(v===null)return;const xx=left+(i+.5)*step;if(!started){c.moveTo(xx,y(v));started=true;}else c.lineTo(xx,y(v));});c.stroke();
 }
 c.fillStyle='#8ba0bf';
 for(let i=0;i<len;i+=Math.max(1,Math.floor(len/5)))c.fillText(clock(candles[i].timestamp).slice(0,5),left+i*step,h-7);
 if(chartHover>=0&&chartHover<len){const xx=left+(chartHover+.5)*step;c.beginPath();c.setLineDash([3,4]);c.strokeStyle='#ff6ac7';c.moveTo(xx,top);c.lineTo(xx,top+ch);c.stroke();c.setLineDash([]);}
}
function showMetrics(){
 const vals=candles.map(x=>x.close),e20=ema(vals,20).at(-1),e50=ema(vals,50).at(-1);
 $('ema20').textContent=money(e20);$('ema50').textContent=money(e50);
 $('spot-rsi').textContent=nfmt(rsi(vals),1);
 $('spot-macd').textContent=nfmt(macdHistogram(vals),3);
 $('spot-trend').textContent=e20==null||e50==null?'—':e20>e50?'EMA 20 ABOVE 50':e20<e50?'EMA 20 BELOW 50':'FLAT';
 $('spot-bars').textContent=String(candles.length);
 $('spot-bar-age').textContent=lastMeta?.candleAgeSeconds!=null?Math.max(0,lastMeta.candleAgeSeconds)+' seconds':'—';
 const showing=chartHover>=0&&candles[chartHover]?candles[chartHover]:candles.at(-1);
 $('spot-ohlc').textContent=showing?'O '+money(showing.open)+' H '+money(showing.high)+' L '+money(showing.low)+' C '+money(showing.close):'O — H — L — C —';
 $('spot-candle-info').textContent=candles.length+' closed '+(interval/60)+'m bars, UTC';
}
function draw(){drawGraph($('spot-canvas'),'price');drawGraph($('volume-canvas'),'volume');showMetrics();}
async function refreshFull(){
 if(loading)return;loading=true;$('spot-refresh').disabled=true;
 try{
   const data=await request('candles');
   const obs=Array.isArray(data.candles)?data.candles:[];
   if(!obs.length)throw Error(data.errors?.join('; ')||'No completed candle observations');
   const good=obs.every((v,i)=>Number.isFinite(v.open)&&Number.isFinite(v.high)&&Number.isFinite(v.low)&&Number.isFinite(v.close)&&Number.isFinite(v.timestamp)&&v.high>=Math.max(v.open,v.close)&&v.low<=Math.min(v.open,v.close)&&(!i||v.timestamp>obs[i-1].timestamp));
   if(!good)throw Error('Candle validation failed');
   candles=obs;lastMeta=data;lastOkAt=Date.now();ticker=data.ticker??null;
   $('spot-updated').textContent=clock(Math.floor(lastOkAt/1000));
   if(data.errors?.length)showError(data.errors.join('; '));else clearError();
   tickerRender();draw();
 }catch(e){showError(e.message||'Source offline');ticker=null;setHealth('stale','UNAVAILABLE');$('spot-status').textContent='Feed unavailable · archived data not substituted';}
 finally{loading=false;$('spot-refresh').disabled=false;}
}
async function refreshQuote(){
 if(loading)return;
 try{const data=await request('quote');
   if(data.ticker){ticker=data.ticker;tickerRender();$('spot-updated').textContent=clock(Math.floor(Date.now()/1000));}
   else if(data.errors?.length)showError(data.errors.join('; '));
 }catch(e){showError(e.message||'Ticker offline');setHealth('stale','UNAVAILABLE');}
}
$('spot-refresh').addEventListener('click',refreshFull);
for(const button of document.querySelectorAll('[data-granularity]'))button.addEventListener('click',()=>{
 const v=Number(button.dataset.granularity);if(!tfAllowed.has(v)||v===interval)return;
 interval=v;chartHover=-1;document.querySelectorAll('[data-granularity]').forEach(x=>x.classList.toggle('on',x===button));candles=[];drawGraph($('spot-canvas'),'price');drawGraph($('volume-canvas'),'volume');$('spot-candle-info').textContent='Loading '+v/60+'m candles…';refreshFull();
});
$('spot-canvas').addEventListener('mousemove',event=>{
 if(!candles.length)return;
 const rect=event.currentTarget.getBoundingClientRect(),step=(rect.width-87)/candles.length;
 chartHover=Math.floor((event.clientX-rect.left-12)/step);
 if(chartHover<0||chartHover>=candles.length)chartHover=-1;
 draw();
});
$('spot-canvas').addEventListener('mouseleave',()=>{chartHover=-1;draw();});
window.addEventListener('resize',draw);
setInterval(()=>{if(candles.length)refreshFull();},60000);
setInterval(refreshQuote,30000);
setInterval(()=>{if(ticker)tickerRender();},15000);
refreshFull();
