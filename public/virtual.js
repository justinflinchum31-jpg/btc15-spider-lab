/* Educational 10-minute $500 BTC spot benchmark; no orders, wagers or accounts. */
const $=id=>document.getElementById(id);
const money=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n):'—';
const pct=n=>Number.isFinite(n)?(n>=0?'+':'')+n.toFixed(2)+'%':'—';
const stamp=s=>Number.isFinite(s)?new Date(s*1000).toISOString().replace('T',' ').slice(0,16)+' UTC':'—';
const time=s=>Number.isFinite(s)?new Date(s*1000).toISOString().slice(11,16):'—';
const START_USD=500;
let page=null,visible=72,loading=false;
function setText(id,value){$(id).textContent=String(value);}
function setClass(id,value){$(id).className=value;}
function valueClass(value){return value>=0?'virtual-positive':'virtual-negative';}
function draw(){
  const canvas=$('virtual-graph'),wrapper=canvas.parentElement,rect=wrapper.getBoundingClientRect();
  const dpr=Math.min(2,window.devicePixelRatio||1),w=Math.max(260,rect.width),h=Math.max(180,rect.height);
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
  canvas.style.width=w+'px';canvas.style.height=h+'px';
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const series=(page?.records||[]).slice(-visible);
  $('virtual-empty').hidden=series.length===0;
  if(!series.length)return;
  const pad={left:48,right:72,top:24,bottom:32},cw=w-pad.left-pad.right,ch=h-pad.top-pad.bottom;
  const values=[START_USD,...series.map(s=>s.value)];
  let lo=Math.min(...values),hi=Math.max(...values);
  const margin=Math.max(0.50,(hi-lo)*0.16);lo-=margin;hi+=margin;
  const px=i=>pad.left+(series.length===1?cw/2:i*cw/(series.length-1));
  const py=value=>pad.top+(hi-value)/(hi-lo)*ch;
  ctx.font='10px ui-monospace,monospace';
  for(let i=0;i<=4;i++){
    const y=pad.top+i*ch/4;
    ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(w-pad.right,y);
    ctx.strokeStyle='#273952';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='#94a8c6';ctx.fillText(money(hi-(hi-lo)*i/4),3,y+3);
  }
  // The flat line is a static $500 comparison, never a real-money balance.
  ctx.beginPath();ctx.moveTo(pad.left,py(START_USD));ctx.lineTo(w-pad.right,py(START_USD));
  ctx.setLineDash([4,5]);ctx.strokeStyle='#ffc778';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
  const grad=ctx.createLinearGradient(0,pad.top,0,pad.top+ch);
  grad.addColorStop(0,'rgba(255,83,181,0.22)');grad.addColorStop(1,'rgba(255,83,181,0.01)');
  ctx.beginPath();ctx.moveTo(px(0),py(series[0].value));
  series.forEach((s,i)=>{if(i)ctx.lineTo(px(i),py(s.value));});
  ctx.lineTo(px(series.length-1),pad.top+ch);ctx.lineTo(px(0),pad.top+ch);
  ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  ctx.beginPath();series.forEach((s,i)=>{if(i===0)ctx.moveTo(px(i),py(s.value));else ctx.lineTo(px(i),py(s.value));});
  ctx.strokeStyle='#ff79ba';ctx.lineWidth=2;ctx.stroke();
  const latest=series.at(-1);
  ctx.beginPath();ctx.arc(px(series.length-1),py(latest.value),3.5,0,Math.PI*2);
  ctx.fillStyle=latest.change>=0?'#4af1a4':'#ff889c';ctx.fill();
  const step=Math.max(1,Math.floor(series.length/5));
  for(let i=0;i<series.length;i+=step){ctx.fillStyle='#92a4c1';ctx.fillText(time(series[i].slot),px(i)-13,h-11);}
  ctx.fillStyle='#ffb8dc';ctx.fillText(money(latest.value),Math.max(pad.left,px(series.length-1)-60),Math.max(pad.top,py(latest.value)-11));
}
function renderTable(){
  const records=(page?.records||[]).slice(-visible).reverse(),body=$('virtual-rows');
  if(!records.length){
    const tr=document.createElement('tr'),td=document.createElement('td');
    td.colSpan=6;td.textContent=page?.status==='storage-unavailable'?'Stored observations unavailable.':'Awaiting verified ten-minute observations.';
    tr.append(td);body.replaceChildren(tr);return;
  }
  const rows=records.map(row=>{
    const tr=document.createElement('tr');
    const vals=[stamp(row.slot),stamp(row.sourceTimestamp),money(row.price),money(row.value),money(row.change),pct(row.changePct)];
    vals.forEach((value,i)=>{
      const td=document.createElement('td');td.textContent=value;
      if(i>=4)td.className=valueClass(row.change);
      tr.append(td);
    });
    return tr;
  });
  body.replaceChildren(...rows);
}
function render(){
  const started=Number.isFinite(page?.startPrice),newest=page?.records?.at(-1),progress=Boolean(newest);
  setText('virtual-count',page?.recordCount??0);
  setText('virtual-start-price',started?money(page.startPrice):'—');
  setText('virtual-started',started?stamp(page.startedAt):'—');
  setText('virtual-first',started?'First reference: '+stamp(page.startedAt):'Awaiting first source observation');
  setText('virtual-latest',newest?stamp(newest.observedAt):'—');
  setText('virtual-last-price',newest?money(newest.price):'—');
  setText('virtual-value',progress?money(newest.value):'—');
  setText('virtual-change',progress?money(newest.change):'—');
  setText('virtual-pct',progress?pct(newest.changePct)+' from $500 reference':'No calculated change yet');
  setText('virtual-value-note',progress?'Hypothetical benchmark, not held funds':'Awaiting first verified price');
  setClass('virtual-change',progress?valueClass(newest.change):'');
  setClass('virtual-value',progress?valueClass(newest.change):'');
  const active=page?.status==='recording';
  $('study-dot').classList.toggle('active',active);
  setText('study-state',active?'OBSERVATIONS SAVED':page?.status==='delayed'?'SOURCE DELAYED':page?.status==='storage-unavailable'?'STORAGE UNAVAILABLE':'AWAITING FIRST OBSERVATION');
  setText('study-age',active||page?.status==='delayed'?'Most recent verified reading '+Math.max(0,page.ageSeconds||0)+' seconds ago':'Every 10 minutes on UTC schedule; first record pending');
  setText('virtual-window-label','LATEST '+visible+' RECORDS');
  draw();renderTable();
}
async function load(){
  if(loading)return;loading=true;$('virtual-refresh').disabled=true;
  try{
    const response=await fetch('/api/virtual-progress?limit=144',{headers:{accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(11000)});
    const body=await response.json();
    if(!response.ok)throw Error(body.error||'History endpoint unavailable');
    if(body.kind!=='BTC_SPOT_HYPOTHETICAL_STUDY'||body.startReferenceUSD!==START_USD||!Array.isArray(body.records))throw Error('Unexpected history format');
    // Recheck row integrity client side. Never display unverified account balances.
    if(body.records.some(x=>!Number.isFinite(x.price)||x.price<=0||!Number.isFinite(x.value)||!Number.isFinite(x.slot)))throw Error('Unverified history rows');
    page=body;
  }catch(e){
    if(!page)page={status:'storage-unavailable',records:[],recordCount:0,startPrice:null};
    setText('study-state','DATA NOT VERIFIED');
    setText('study-age','Unable to verify persistent observations');
  }finally{loading=false;$('virtual-refresh').disabled=false;render();}
}
for(const button of document.querySelectorAll('[data-window]'))button.addEventListener('click',()=>{
  visible=Number(button.dataset.window);
  document.querySelectorAll('[data-window]').forEach(b=>b.classList.toggle('on',b===button));
  render();
});
$('virtual-refresh').addEventListener('click',load);
$('virtual-export').addEventListener('click',()=>{
  const rows=(page?.records||[]).slice(-visible);
  if(!rows.length)return;
  const fields=['slot_utc','source_time_utc','btc_usd','hypothetical_value_usd','hypothetical_change_usd','hypothetical_change_pct'];
  const lines=[fields,...rows.map(x=>[stamp(x.slot),stamp(x.sourceTimestamp),x.price.toFixed(2),x.value.toFixed(2),x.change.toFixed(2),x.changePct.toFixed(2)])];
  const csv=lines.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='btc15-500-virtual-price-study.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
window.addEventListener('resize',draw);
setInterval(load,60000);
load();
