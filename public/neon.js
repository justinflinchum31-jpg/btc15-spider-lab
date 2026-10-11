"use strict";
/* BTC15 archived OHLC viewer. Data points are observed BRTI 1m candles.
   No external requests, user accounts, real trades, betting, or paper order routing. */
const PACK = "0.0.-2no.-1fu;-da.13m.-6uw.-3t1;-37.0.-6tt.-6fx;6a.8g4.-2cp.6dv;-y.6ok.-mu.6k7;5u.2yv.-wl.2yv;-6o.2fu.-8v.163;33.5m9.-r1.5m8;50.6eo.-mu.57x;6v.0.-6a2.-2id;-7.vl.-1hi.-15q;e.3tq.-1sc.2x3;-1u.0.-bff.-63i;-1d.477.-7i.400;k7.178.-2zb.-2gv;-ck.6kf.-g2.4i0;bx.7t6.-5z.6yk;6w.44c.-5k.435;o.3ze.-3xn.-fq;-m9.3ve.-6s.3lm;-1q.2w0.-15p.2jp;r.2zx.-15q.si;-8d.9zw.-1a3.9zw;cs.n1.-78f.-61k;sh.7tj.0.4m8;-f5.0.-3dk.-305;-rk.0.-2t8.-pk;-3v.3ci.-2n0.-226;do.31b.-1ss.31b;-h.dw.-2oi.-2h2;2j.3ik.0.32p;7l.4wa.-fu.4wa;-if.21c.-4tz.-24i;162.1jv.-1jn.-a3;-co.2ax.-1x6.2ax;-2d.5xt.-55.5xt;-ca.49.-7hp.-6wm;-3e.1ub.-5f6.-5f6;-3y.2ym.-1s1.j0;-av.59.-60n.-5nm;24.1fh.-35j.-2mm;-16.3ns.-po.3b0;1o.13l.-6uq.-6uq;-c7.0.-4lv.-45a;80.3je.-2i.3dj;ef.6j3.-44.5l3;72.31a.-2gi.6r;-g.245.-49m.-q9;ot.11.-6i0.-6i0;-1x.1g6.-3uf.-2aw;10.re.-1pl.78;-5x.8d7.-16x.7rf;-p6.19f.-238.-2q;-9v.1ek.-1ko.-sv;-1w.pz.-1za.-92;3k.x1.-1gs.-pu;6.3jt.-12m.3du;-4d.219.-1he.219;-4z.5bt.0.3bp;-7l.i.-3uc.-3bo;-2c.12x.-3c6.-33q;-q3.zs.-3ph.-pu;69.4j6.-qu.2ai;4d.82.-5up.-5up;2qa.3uq.-6q3.-545;-7t.395.-oz.1m7;1f4.2gc.-434.-3ei;bo.0.-2dc.-1ve;-2b.dw.-28w.-1oo;-gg.98.-5gd.-5gd;-ey.54m.0.2yl;-2w.51g.-xe.4zl;a.2nb.-1u5.2fc;-k.0.-40z.-40z;-7l.1wl.-2gf.-2gf;9o.nl.-1rj.-105;-10.2x0.-221.25j;-2g.1n5.-1m9.1ju;-7.62v.0.62v;cx.8z.-4f0.-31v;28.234.-1ti.-1ti;-q4.mk.-20y.-30;2k.5ap.-1ld.553;-17.0.-4be.-4be;4p.e.-3cg.-1s0;5f.37x.-l.37x;1.ir.-2h2.-1hg;a.a9.-1g7.-jm;a2.1ro.-1ug.1em;-7.ff.-2g7.-qt;m.8q.-1bw.-10l;-11p.5x2.-23.599;-6a.6zl.0.5bb;-o0.1mr.-xi.um;-20.sv.-636.-4zh;1a.oi.-33y.oi;-4g.0.-4e8.-3dt;-11h.23g.-18e.1l4;-4o.2xb.-m3.2b2;4.377.-mu.25z;-u6.2ht.0.1qc;-2a.0.-2xe.-1cy;c.21z.-ap.1hz;-ev.229.-1ph.-1os;9j.5h.-2p6.-xq;ai.205.-jr.1sr;j.14.-37t.-uy;-5k.281.-1vp.-xp;24.1hs.-zn.-zn;n.0.-2by.-22m;-2.2ph.-pl.2b0;m.2qb.0.n0;21.27d.0.mh;2a.7.-20l.-1mi;-bv.63.-8nv.-8ba;26.1yj.-52.6g;-1l0.1kj.-fs.1ki;a9.43.-2rw.43;-8g.43g.-33.42w;-a4.n.-23t.-1ix;-82.1in.-vl.-vl;m.0.-5oa.-5cy;-j.0.-37w.-23c;3k.2as.-r8.-1a;-z.22p.-cg.as;-62.4ys.-95.4n0;31.4xt.-27.4xt;1l.13y.-39t.-yr;-11p.3tk.0.2ea;-vq.jn.-20i.gs;-h.7x.-4st.-2hp;-8z.3g.-2c3.29;-1i.1xx.-1cc.1he;-1s.5vq.-1o.4ex;0.1uw.-2qj.-25j;40.1dl.-kx.jh;j.4ba.0.454;-6i.2qg.-5v.1ru;4n.0.-4ui.-3at;-53.0.-2fo.-2f2;-v.2f.-2z4.-2z4;-fu.1xx.-m0.-b0;21.0.-3mb.-1u6;tj.j8.-3y8.-3al;-45.1qo.-5d7.-4a3;-ca.hx.-1q7.-x3;-c.s3.-1dk.-qu;6p.1ay.-1w3.-1w3;30.2gw.-m1.3q;w.1sb.-jd.zp;1p.o9.-zr.-8j;-2j.151.-1l.bn;-1y.3n6.-yv.169;bc.5xk.-77.4kz;5s.0.-4ap.-2fc;-1t.av.-1ak.-11;-at.1cd.-ai.11k;-1r.3k2.0.2bf;8.0.-3hx.-37b;4s.13b.-4d3.-3un;34.sx.-10f.-33;49.1ie.-hu.1fs;-k6.1z4.-i8.-b4;-4.78.-1rg.-1p9;1k.165.-rl.h;k.e7.-kp.6x;rw.2ae.-82.1qh;-f.3sb.0.uk;jt.1ph.-th.1bi;i4.0.-2b4.-2b4;23.3er.0.3er;-8k.1qh.-24s.1h6;-aa.2n0.-sl.1zg;-el.1kd.-20f.-20f;am.2a.-31r.-29j;l0.l9.-1vs.-1rf;-1f.1j2.-112.xh;-4t.178.-ue.-fh;-48.g3.-py.-8b;2u.4.-3c7.-30z;b.1ko.-tp.ik;2x.1ww.-7l.1wb;-12.1db.-2we.-2j7;-21.mr.-18g.-ru;-aj.1gs.-1bf.-z5;6z.24q.-2d.fq;-92.xb.-ia.9z;-2d.f4.-26w.-vx;-m1.hp.-1e9.2y;7.1ca.0.nz;-1f.8p.-3fi.-3e7;-3z.1ap.-nf.65;fe.ra.-zk.-om;26.2ej.-1wz.26w;-2.17x.-1g8.-199;-a.i.-4hj.-3yo;-1m.2js.-26r.2js;-3x.0.-25s.-io;52.39f.-1r.1yj;-1m.nf.-2dy.-18a;2i.263.-17l.-101;6j.1ur.-dj.1js;1p.131.-1od.-1ct;-r.0.-ao3.-9fi;4z.5al.0.2bk;46.0.-3e1.-1vt;-5d.4pj.-4l.4pj;p9.3ld.-hv.3ld;-23.239.-ro.239;-5f.1oo.-3r.z7;5a.7v.-1rs.-180;1p.um.-3ts.-2p2;-21.1bb.-45j.-14g;1b.4nv.-n2.q2;-n.3xp.-1uv.3dj;jy.i2.-1lz.-i3;-a.3u3.-lw.hh;2u.2ug.-70.232;29.xn.-18r.-qa;j.ue.-1gg.-zy;2c.9t.-1e4.-1h;u.29.-28y.-1bb;j.4hc.-48.3rq;5h.1np.-tu.mi;3s.0.-2sm.-2a4;6.v4.-1cn.-yt;29.1r.-5or.-3tb;9u.3vy.-1b1.32d;18.0.-29h.-1ga;-2f.18w.-5g.nx;gm.ze.-14r.eb;-95.2kq.-af.2bn;t.2c2.0.2a4;-mu.71.-342.-tl;ak.0.-1bc.-45;cb.0.-1tb.-179;-1j.iw.-zt.-1g;15.2nc.-1pr.224;1t.9j.-1n1.-107;-95.m3.0.bx";
const START=1791554340, FIRST_OPEN_CENTS=8258007;
const $ = id => document.getElementById(id);
const money = x => '$'+Number(x).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const formatTime = ts => new Date(ts*1000).toISOString().slice(11,16);
const formatDate = ts => new Date(ts*1000).toISOString().slice(0,16).replace('T',' ');
const pct = x => (x>=0?'+':'')+x.toFixed(2)+'%';
function decode() {
  let prev = FIRST_OPEN_CENTS;
  return PACK.split(';').map((str,i)=>{
    const [a,b,c,d]=str.split('.').map(x=>parseInt(x,36));
    const open=prev+a, high=open+b, low=open+c, close=open+d;
    prev=close;
    return {timestamp:START+i*60,open:open/100,high:high/100,low:low/100,close:close/100};
  });
}
const candles=decode();
const prices=candles.map(x=>x.close);
function ema(values,n) {
  const arr=Array(values.length).fill(null);
  if(values.length<n)return arr;
  let v=values.slice(0,n).reduce((a,b)=>a+b,0)/n;
  arr[n-1]=v;
  const k=2/(n+1);
  for(let i=n;i<values.length;i++){v=k*values[i]+(1-k)*v;arr[i]=v;}
  return arr;
}
function rsi(values,n=14) {
  if(values.length<=n)return NaN;
  let gains=0,losses=0;
  for(let i=1;i<=n;i++){const d=values[i]-values[i-1];gains+=Math.max(d,0);losses+=Math.max(-d,0);}
  let au=gains/n,ad=losses/n;
  for(let i=n+1;i<values.length;i++){const d=values[i]-values[i-1];au=(au*(n-1)+Math.max(d,0))/n;ad=(ad*(n-1)+Math.max(-d,0))/n;}
  return ad===0?100:100-100/(1+au/ad);
}
function macdHist(values){
  const e12=ema(values,12),e26=ema(values,26);
  const vals=e12.map((v,i)=>v!=null&&e26[i]!=null?v-e26[i]:null);
  const present=vals.filter(v=>v!=null),s=ema(present,9);
  return present.length>=9?present.at(-1)-s.at(-1):NaN;
}
function aggregate(rows,mins) {
  if(mins===1)return rows;
  const groups=new Map(),seconds=mins*60;
  for(const c of rows){const t=Math.floor(c.timestamp/seconds)*seconds;if(!groups.has(t))groups.set(t,[]);groups.get(t).push(c);}
  return [...groups].filter(([t,g])=>g.length===mins&&g.every((x,i)=>x.timestamp===t+i*60)).map(([t,g])=>({
    timestamp:t,open:g[0].open,high:Math.max(...g.map(v=>v.high)),low:Math.min(...g.map(v=>v.low)),close:g.at(-1).close
  }));
}
const e9=ema(prices,9),e21=ema(prices,21),samples=[];
for(let i=55;i<candles.length-15;i+=15){
  const trend=e9[i]>e21[i]?'UP':e9[i]<e21[i]?'DOWN':'NONE';
  const momentum=prices[i]>prices[i-5]?'UP':prices[i]<prices[i-5]?'DOWN':'NONE';
  const direction=trend===momentum?trend:'ABSTAIN';
  const outcome=direction==='ABSTAIN'?'ABSTAIN':(direction==='UP'&&prices[i+15]>prices[i] || direction==='DOWN'&&prices[i+15]<prices[i]?'CORRECT':'INCORRECT');
  samples.push({index:i,timestamp:candles[i].timestamp,entry:prices[i],exit:prices[i+15],direction,outcome,change:100*(prices[i+15]/prices[i]-1)});
}
const signals=samples.filter(s=>s.direction==='UP'||s.direction==='DOWN');
const correct=signals.filter(s=>s.outcome==='CORRECT').length;
let tf=1,barLimit=120,historyFilter='ALL',scoreSpan='all',hover=-1,chosen=-1;
const last=candles.at(-1),prev=candles.at(-6);
$('archive-clock').textContent='ARCHIVE · '+formatDate(last.timestamp)+' UTC';
$('st-source').textContent=candles.length+' observed 1-minute bars';
$('st-scan').textContent=samples.length+' inspected 15-minute windows';
$('score-candles').textContent=candles.length;
$('score-windows').textContent=samples.length;
$('score-signals').textContent=signals.length;
$('score-correct').textContent=correct;
$('score-rate').textContent=signals.length?(100*correct/signals.length).toFixed(1)+'%':'—';
$('market-price').textContent=money(last.close);
const change=(last.close/prev.close-1)*100;
$('market-change').textContent=pct(change)+' vs 5m earlier';
$('market-change').style.color=change>=0?'#6bf8ac':'#ff889a';
$('analysis-rsi').textContent=rsi(prices).toFixed(1);
$('analysis-macd').textContent=macdHist(prices).toFixed(2);
$('analysis-trend').textContent=e9.at(-1)>e21.at(-1)?'EMA 9 ABOVE 21':'EMA 9 BELOW 21';
$('analysis-momentum').textContent=pct(change);
function initLogs(){
  const log=$('log-list'),items=[{ts:last.timestamp,text:'BRTI candle archive loaded',cls:'ok'},{ts:last.timestamp,text:'Read-only controls active',cls:'ok'},{ts:last.timestamp,text:'Historical 15m review complete',cls:''},{ts:last.timestamp,text:'Out-of-sample Brier: 0.2574',cls:'fail'}];
  for(const s of samples.slice().reverse().slice(0,12)){
    items.push({ts:s.timestamp,text:(s.direction==='ABSTAIN'?'ABSTAIN':s.direction+' historical signal')+' · '+s.outcome.toLowerCase(),cls:s.outcome==='CORRECT'?'ok':s.outcome==='INCORRECT'?'fail':''});
  }
  log.replaceChildren(...items.map(x=>{const d=document.createElement('div');d.className='log-entry';
    const t=document.createElement('time');t.textContent=formatTime(x.ts);const b=document.createElement('b');b.className=x.cls;b.textContent=x.text;d.append(t,b);return d;}));
}
initLogs();
function initSignalSnapshots(){
  const list=$('signal-list');
  list.replaceChildren(...samples.filter(s=>s.direction!=='ABSTAIN').slice(-7).reverse().map(s=>{
    const d=document.createElement('div');d.className='signal-item';
    const orb=document.createElement('i');orb.className=s.direction.toLowerCase();
    const span=document.createElement('span');span.textContent=s.direction+' · BTC '+money(s.entry);
    const tail=document.createElement('b');tail.textContent=formatTime(s.timestamp);
    d.append(orb,span,tail);return d;
  }));
}
initSignalSnapshots();
function renderJournal(){
  const data=samples.filter(s=>historyFilter==='ALL'||s.direction===historyFilter).slice().reverse();
  $('filter-status').textContent=historyFilter==='ALL'?'ALL HISTORICAL WINDOWS':historyFilter+' SCENARIOS';
  const body=$('journal-body');
  if(!data.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=6;td.textContent='No matching historical signal windows.';tr.append(td);body.replaceChildren(tr);return;}
  body.replaceChildren(...data.map(s=>{
    const tr=document.createElement('tr');tr.tabIndex=0;tr.title='Inspect this historical window on the chart';
    const values=[formatDate(s.timestamp),s.direction,money(s.entry),money(s.exit),pct(s.change),s.outcome];
    values.forEach((v,i)=>{
      const td=document.createElement('td');
      if(i===1||i===5){const label=document.createElement('span');label.className='tag '+(i===1?s.direction.toLowerCase()==='abstain'?'neutral':s.direction.toLowerCase():s.outcome==='ABSTAIN'?'neutral':s.outcome.toLowerCase());label.textContent=v;td.append(label);}
      else td.textContent=v;
      tr.append(td);
    });
    tr.addEventListener('click',()=>{chosen=s.index;tf=1;document.querySelectorAll('[data-timeframe]').forEach(b=>b.classList.toggle('on',Number(b.dataset.timeframe)===1));drawCandles();$('market').scrollIntoView({behavior:'smooth'});});
    tr.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tr.click();}});
    return tr;
  }));
}
renderJournal();
function makeCsv(){
 const q=x=>'"'+String(x).replaceAll('"','""')+'"';
 const head=['timestamp_utc','direction','index_entry','index_plus_15m','index_change_percent','outcome'];
 const body=samples.filter(s=>historyFilter==='ALL'||s.direction===historyFilter).map(s=>[formatDate(s.timestamp),s.direction,s.entry.toFixed(2),s.exit.toFixed(2),s.change.toFixed(4),s.outcome]);
 const content=[head,...body].map(r=>r.map(q).join(',')).join('\n');
 const blob=new Blob([content],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='btc15-historical-replay.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$('download-csv').addEventListener('click',makeCsv);
for(const b of document.querySelectorAll('[data-filter]'))b.addEventListener('click',()=>{
  historyFilter=b.dataset.filter;
  document.querySelectorAll('.scenario-buttons button').forEach(x=>x.classList.toggle('chosen',x.dataset.filter===historyFilter));
  renderJournal();
});
const canvas=$('candle-canvas');
function drawCandles(){
 const all=aggregate(candles,tf),rows=all.slice(-barLimit),rect=canvas.parentElement.getBoundingClientRect();
 const w=Math.max(240,rect.width),h=Math.max(210,rect.height),dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';
 const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
 const pad={left:8,right:75,top:20,bottom:29},cw=w-pad.left-pad.right,ch=h-pad.top-pad.bottom;
 const e20=ema(all.map(r=>r.close),20).slice(-rows.length),e50=ema(all.map(r=>r.close),50).slice(-rows.length);
 const data=rows.flatMap(r=>[r.high,r.low]).concat(e20.filter(Number.isFinite),e50.filter(Number.isFinite));
 if(!data.length)return;
 const rawLow=Math.min(...data),rawHigh=Math.max(...data),margin=Math.max(1,(rawHigh-rawLow)*.08),lo=rawLow-margin,hi=rawHigh+margin;
 const y=v=>pad.top+(hi-v)/(hi-lo)*ch,step=cw/rows.length;
 c.font='10px ui-monospace,monospace';
 for(let i=0;i<=4;i++){const yy=pad.top+ch*i/4;c.strokeStyle='#203550';c.lineWidth=1;c.beginPath();c.moveTo(pad.left,yy);c.lineTo(w-pad.right,yy);c.stroke();c.fillStyle='#819bb9';c.fillText(Math.round(hi-(hi-lo)*i/4).toLocaleString('en-US'),w-pad.right+9,yy+4);}
 rows.forEach((r,i)=>{const x=pad.left+(i+.5)*step,up=r.close>=r.open;c.strokeStyle=c.fillStyle=up?'#2ef29a':'#ff687b';c.beginPath();c.moveTo(x,y(r.high));c.lineTo(x,y(r.low));c.stroke();c.fillRect(x-Math.max(1,step*.29),Math.min(y(r.open),y(r.close)),Math.max(2,step*.58),Math.max(1,Math.abs(y(r.close)-y(r.open))));});
 for(const [line,color] of [[e20,'#2ebefe'],[e50,'#f5a945']]){c.beginPath();c.strokeStyle=color;c.lineWidth=1.7;let started=false;line.forEach((v,i)=>{if(v==null)return;const x=pad.left+(i+.5)*step;if(!started){c.moveTo(x,y(v));started=true;}else c.lineTo(x,y(v));});c.stroke();}
 if(chosen!==-1){const s=candles[chosen];const j=rows.findIndex(v=>tf===1?v.timestamp===s.timestamp:s.timestamp>=v.timestamp&&s.timestamp<v.timestamp+tf*60);if(j>=0){const x=pad.left+(j+.5)*step;c.strokeStyle='#ff5bbe';c.setLineDash([3,5]);c.beginPath();c.moveTo(x,pad.top);c.lineTo(x,pad.top+ch);c.stroke();c.setLineDash([]);}}
 c.fillStyle='#90a9c5';for(let i=0;i<rows.length;i+=Math.max(1,Math.floor(rows.length/5)))c.fillText(formatTime(rows[i].timestamp),pad.left+i*step,h-8);
 if(hover>=0&&hover<rows.length){const r=rows[hover],x=pad.left+(hover+.5)*step;c.strokeStyle='#ff6ec6';c.setLineDash([3,4]);c.beginPath();c.moveTo(x,pad.top);c.lineTo(x,pad.top+ch);c.stroke();c.setLineDash([]);}
 const shown=hover>=0&&hover<rows.length?rows[hover]:rows.at(-1);
 $('ohlc-values').textContent='O '+money(shown.open)+' H '+money(shown.high)+' L '+money(shown.low)+' C '+money(shown.close);
 $('bar-label').textContent=rows.length+' × '+tf+'m candles · UTC';
 $('ema20-value').textContent=e20.at(-1)==null?'UNAVAILABLE':money(e20.at(-1));
 $('ema50-value').textContent=e50.at(-1)==null?'UNAVAILABLE':money(e50.at(-1));
 canvas._chart={w,pad,cw,step,count:rows.length};
}
canvas.addEventListener('mousemove',e=>{
 if(!canvas._chart)return;
 const box=canvas.getBoundingClientRect(),v=canvas._chart;
 hover=Math.floor((e.clientX-box.left-v.pad.left)/v.step);
 if(hover<0||hover>=v.count)hover=-1;
 drawCandles();
});
canvas.addEventListener('mouseleave',()=>{hover=-1;drawCandles();});
for(const b of document.querySelectorAll('[data-timeframe]'))b.addEventListener('click',()=>{tf=Number(b.dataset.timeframe);hover=-1;document.querySelectorAll('[data-timeframe]').forEach(x=>x.classList.toggle('on',x===b));drawCandles();});
for(const b of document.querySelectorAll('[data-bars]'))b.addEventListener('click',()=>{barLimit=Number(b.dataset.bars);hover=-1;document.querySelectorAll('[data-bars]').forEach(x=>x.classList.toggle('on',x===b));drawCandles();});
const scores=$('score-canvas');
function drawScore(){
 const rect=scores.parentElement.getBoundingClientRect(),w=Math.max(240,rect.width),h=Math.max(140,rect.height),dpr=Math.min(window.devicePixelRatio||1,2);
 scores.width=Math.round(w*dpr);scores.height=Math.round(h*dpr);scores.style.width=w+'px';scores.style.height=h+'px';
 const c=scores.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
 const points=[];let hits=0,seen=0;
 for(const s of signals){seen++;if(s.outcome==='CORRECT')hits++;points.push({rate:100*hits/seen,t:s.timestamp,outcome:s.outcome});}
 const subset=scoreSpan==='all'?points:points.slice(-Number(scoreSpan));const pad={left:25,right:28,top:13,bottom:24},cw=w-pad.left-pad.right,ch=h-pad.top-pad.bottom;
 const x=i=>pad.left+(subset.length===1?cw/2:i*cw/(subset.length-1)),y=n=>pad.top+(100-n)/100*ch;
 c.strokeStyle='#213550';c.font='10px monospace';c.fillStyle='#91a3c2';
 for(let k=0;k<=4;k++){const value=100-k*25,yy=y(value);c.beginPath();c.moveTo(pad.left,yy);c.lineTo(w-pad.right,yy);c.stroke();c.fillText(value+'%',2,yy+4);}
 c.strokeStyle='#53657e';c.setLineDash([4,4]);c.beginPath();c.moveTo(pad.left,y(50));c.lineTo(w-pad.right,y(50));c.stroke();c.setLineDash([]);
 if(subset.length){c.beginPath();c.moveTo(x(0),y(subset[0].rate));subset.slice(1).forEach((p,i)=>c.lineTo(x(i+1),y(p.rate)));c.lineWidth=2;c.strokeStyle='#ff6ab8';c.stroke();subset.forEach((p,i)=>{c.fillStyle=p.outcome==='CORRECT'?'#33ee99':'#ff677b';c.fillRect(x(i)-3,h-pad.bottom-7,6,7);c.beginPath();c.arc(x(i),y(p.rate),2.4,0,Math.PI*2);c.fillStyle='#ff9dd4';c.fill();});c.fillStyle='#ffadd9';c.fillText(subset.at(-1).rate.toFixed(1)+'%',Math.max(pad.left,x(subset.length-1)-47),y(subset.at(-1).rate)-9);}
 if(subset.length){c.fillStyle='#859ab9';c.fillText(formatTime(subset[0].t),pad.left,h-6);c.fillText(formatTime(subset.at(-1).t),w-pad.right-39,h-6);}
}
for(const b of document.querySelectorAll('[data-score-span]'))b.addEventListener('click',()=>{scoreSpan=b.dataset.scoreSpan;document.querySelectorAll('[data-score-span]').forEach(x=>x.classList.toggle('on',x===b));drawScore();});
window.addEventListener('resize',()=>{drawCandles();drawScore();});
drawCandles();drawScore();
