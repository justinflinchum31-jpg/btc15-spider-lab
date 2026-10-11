/* Public BTC spot quote on the main research dashboard; never a trading signal. */
const price=document.getElementById('spot-mini-price');
const stamp=document.getElementById('spot-mini-stamp');
const status=document.getElementById('spot-mini-health');
async function checkPublicSpot(){
 try {
  const response=await fetch('/api/spot-market?mode=quote',{cache:'no-store',headers:{accept:'application/json'},signal:AbortSignal.timeout(10000)});
  const data=await response.json();
  if(!response.ok||!data.ticker||!Number.isFinite(data.ticker.price)||!data.ticker.fresh) throw Error(data.errors?.join('; ')||'Spot ticker unavailable or stale');
  const now=Math.floor(Date.now()/1000),age=Math.max(0,now-data.ticker.timestamp);
  if(age>120)throw Error('Source price is stale');
  price.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(data.ticker.price);
  stamp.textContent='Spot quote '+new Date(data.ticker.timestamp*1000).toISOString().slice(11,19)+' UTC';
  status.textContent='FRESH · '+age+'s';status.className='fresh';
 } catch(e) {
  price.textContent='Unavailable';
  status.textContent='NO VERIFIED SPOT QUOTE';status.className='stale';
  stamp.textContent='Unable to verify fresh BTC/USD data';
 }
}
checkPublicSpot();setInterval(checkPublicSpot,30000);
