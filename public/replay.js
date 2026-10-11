// Archived replay: historical index directions only. No network access or trade execution.
// Records [Unix UTC minute, past-only directional rule, BRTI close at timestamp,
//          BRTI close exactly 15 minutes later]. Derived from the project BRTI
// history of 5,902 consecutive real one-minute bars (Oct 5-9, 2026).
// Whole archive: 390 non-overlapping windows, 257 signals (110 correct, 147 wrong),
// 133 abstentions. The 32 most recent windows are displayed below.
const samples=[[1791539520,"UP",82578.6,82628.45],[1791540420,"UP",82628.45,82574.16],[1791541320,"DOWN",82574.16,82442.5],[1791542220,"DOWN",82442.5,82399.69],[1791543120,"DOWN",82399.69,82485.16],[1791544020,"UP",82485.16,82462.91],[1791544920,"ABSTAIN",82462.91,82861.7],[1791545820,"UP",82861.7,83188.45],[1791546720,"ABSTAIN",83188.45,83258.31],[1791547620,"UP",83258.31,83069.25],[1791548520,"DOWN",83069.25,83108.1],[1791549420,"ABSTAIN",83108.1,82965.61],[1791550320,"DOWN",82965.61,83096.59],[1791551220,"UP",83096.59,83008.23],[1791552120,"UP",83008.23,82552.84],[1791553020,"DOWN",82552.84,82648.22],[1791553920,"ABSTAIN",82648.22,82789.04],[1791554820,"UP",82789.04,83061.53],[1791555720,"UP",83061.53,83077.79],[1791556620,"ABSTAIN",83077.79,82954.52],[1791557520,"ABSTAIN",82954.52,82823.49],[1791558420,"DOWN",82823.49,82847.05],[1791559320,"DOWN",82847.05,82899.7],[1791560220,"ABSTAIN",82899.7,82894.81],[1791561120,"UP",82894.81,82839.43],[1791562020,"ABSTAIN",82839.43,82751.52],[1791562920,"DOWN",82751.52,82707.96],[1791563820,"DOWN",82707.96,82745.93],[1791564720,"UP",82745.93,82627.97],[1791565620,"DOWN",82627.97,82456.97],[1791566520,"DOWN",82456.97,82633.81],[1791567420,"UP",82633.81,82656.03]];
const formatDollar = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(n);
const rowsEl=document.getElementById("replay-rows");const mode=document.getElementById("replay-mode");
function render(){
 const filter=mode.value;rowsEl.replaceChildren();
 samples.slice().reverse().forEach(([ts,direction,entry,end])=>{
  if(filter==="signal"&&direction==="ABSTAIN")return;
  if(filter==="skip"&&direction!=="ABSTAIN")return;
  const pct=(end/entry-1)*100;const outcome=direction==="ABSTAIN"?"ABSTAIN":((direction==="UP"&&pct>0)||(direction==="DOWN"&&pct<0)?"CORRECT":"INCORRECT");
  const tr=document.createElement("tr");
  const vals=[new Date(ts*1000).toISOString().slice(0,16).replace("T"," "),direction,formatDollar(entry),formatDollar(end),(pct>=0?"+":"")+pct.toFixed(3)+"%",outcome];
  vals.forEach((value,i)=>{const td=document.createElement("td");if(i===1){const b=document.createElement("span");b.className="direction "+direction;b.textContent=value;td.append(b);}else if(i===5){const b=document.createElement("span");b.className="outcome "+(outcome==="CORRECT"?"good":outcome==="INCORRECT"?"bad":"skip");b.textContent=value;td.append(b);}else td.textContent=value;tr.append(td);});
  rowsEl.append(tr);
 });
}
mode.addEventListener("change",render);render();