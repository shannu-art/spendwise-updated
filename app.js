const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n||0);
const today=()=>new Date().toISOString().slice(0,10);
const seed=[
 {date:today(),description:'Zepto Groceries',amount:-420,category:'Groceries',source:'Sample',reference:'demo-001'},
 {date:today(),description:'Cafe Coffee Day',amount:-180,category:'Food & Drink',source:'Sample',reference:'demo-002'},
 {date:today(),description:'Metro Recharge',amount:-250,category:'Transport',source:'Sample',reference:'demo-003'},
 {date:today(),description:'Electricity Bill',amount:-980,category:'Bills',source:'Sample',reference:'demo-004'},
 {date:today(),description:'Monthly Salary',amount:25000,category:'Income',source:'Sample',reference:'demo-005'}
];
let transactions=load(); let toastTimer;
function load(){try{return JSON.parse(localStorage.getItem('spendwise.transactions'))||seed}catch{return seed}}
function save(){localStorage.setItem('spendwise.transactions',JSON.stringify(transactions))}
function fingerprint(t){return [String(t.date||'').trim(),String(t.description||'').toLowerCase().replace(/[^a-z0-9]/g,''),Number(t.amount).toFixed(2),String(t.reference||'').trim().toLowerCase()].join('|')}
function categorize(desc,type=''){const s=(desc+' '+type).toLowerCase();if(/salary|payroll|refund|cashback|interest credit/.test(s))return 'Income';if(/transfer|imps|neft|rtgs|self transfer/.test(s))return 'Transfer';if(/zepto|blinkit|bigbasket|grocery|supermarket|dmart|reliance fresh/.test(s))return 'Groceries';if(/swiggy|zomato|restaurant|cafe|coffee|food|domino|pizza/.test(s))return 'Food & Drink';if(/uber|ola|metro|rapido|fuel|petrol|bus|train|irctc/.test(s))return 'Transport';if(/electricity|water bill|recharge|broadband|insurance|bill|utility/.test(s))return 'Bills';if(/hospital|pharmacy|medical|doctor|clinic/.test(s))return 'Health';if(/amazon|flipkart|mall|shopping|myntra/.test(s))return 'Shopping';return 'Other'}
function expense(t){return Number(t.amount)<0 && t.category!=='Transfer'}
function monthItems(){let m=new Date().toISOString().slice(0,7);return transactions.filter(t=>String(t.date).slice(0,7)===m)}
function render(){let month=monthItems(), expenses=month.filter(expense), total=expenses.reduce((s,t)=>s+Math.abs(Number(t.amount)),0), budget=Math.max(0,Number($('#budget').value)||0), days=Math.max(1,new Date().getDate());$('#spent').textContent=money(total);if($('#budget-view-spent'))$('#budget-view-spent').textContent=money(total);if($('#budget-view-remaining'))$('#budget-view-remaining').textContent=money(budget-total);if($('#budget-tip'))$('#budget-tip').textContent=total>budget?'You are over your monthly budget. Review recent transactions and adjust your plan.':total>budget*.75?'You have used more than 75% of your budget. Keep an eye on upcoming bills.':'You are within your monthly budget. Keep tracking expenses for better insights.';if($('#home-balance'))$('#home-balance').textContent=money(total);$('#remaining').textContent=money(budget-total);$('#average').textContent=money(total/days);$('#transaction-count').textContent=month.length+' transactions this month';$('#budget-caption').textContent='Budget: '+money(budget);$('#budget-used').textContent=money(total)+' spent';$('#budget-percent').textContent=(budget?Math.round(total/budget*100):0)+'% used';$('#progress-bar').style.width=Math.min(100,budget?total/budget*100:0)+'%';$('#progress-bar').style.background=total>budget?'#ff8291':'#c7f36b';
 const groups={};expenses.forEach(t=>groups[t.category||'Other']=(groups[t.category||'Other']||0)+Math.abs(Number(t.amount)));let cats=Object.entries(groups).sort((a,b)=>b[1]-a[1]);$('#category-chart').innerHTML=cats.length?cats.slice(0,6).map(([k,v])=>`<div class="cat-row"><span>${esc(k)}</span><b>${money(v)}</b><div class="bar"><span style="width:${total?v/total*100:0}%"></span></div></div>`).join(''):'<div class="empty">No spending yet.</div>';
 $('#recent-list').innerHTML=txHtml([...transactions].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5),false);renderTransactions()}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function txHtml(items,removable){if(!items.length)return '<div class="empty">No transactions found.</div>';return items.map((t)=>`<div class="tx"><div class="tx-icon">${icon(t.category)}</div><div class="grow"><div class="tx-title">${esc(t.description)}</div><div class="tx-meta">${esc(t.date)} · ${esc(t.category||'Other')} · ${esc(t.source||'Manual')}</div></div><div class="tx-amount ${Number(t.amount)>=0?'income':'expense'}">${Number(t.amount)>=0?'+':'−'}${money(Math.abs(Number(t.amount)))}</div>${removable?`<button class="icon-btn remove" data-fp="${esc(fingerprint(t))}" aria-label="Delete transaction">×</button>`:''}</div>`).join('')}
function icon(c){return ({'Groceries':'🛒','Food & Drink':'☕','Transport':'🚇','Bills':'🧾','Shopping':'🛍️','Health':'💊','Income':'↗','Transfer':'⇄'})[c]||'◈'}
function renderTransactions(){let q=($('#search')?.value||'').toLowerCase();let items=[...transactions].sort((a,b)=>String(b.date).localeCompare(String(a.date))).filter(t=>(t.description+' '+t.category+' '+t.date).toLowerCase().includes(q));$('#transaction-list').innerHTML=txHtml(items,true);$$('.remove').forEach(b=>b.onclick=()=>{transactions=transactions.filter(t=>fingerprint(t)!==b.dataset.fp);save();render();notify('Transaction deleted')})}
function notify(s){let t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}
function showView(v){
  const allowed=['dashboard','payments','bills','transactions','import','connections','privacy','profile','budget','scan'];
  if(!allowed.includes(v)) v='dashboard';
  $$('.view').forEach(e=>e.classList.add('hidden'));
  const target=$('#view-'+v);
  if(target) target.classList.remove('hidden');
  const activeNav=v==='scan'?'payments':v;
  $$('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===activeNav));
  if(v==='transactions')renderTransactions();
  if(v==='budget')updateBudgetView();
  window.scrollTo({top:0,behavior:'auto'});
}
$$('.nav').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
$$('[data-focus-pay]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>{const f=$('#demo-pay-form');f?.scrollIntoView({behavior:'smooth',block:'center'});$('#demo-payee')?.focus({preventScroll:true});},80)));$('#budget').value=localStorage.getItem('spendwise.budget')||'10000';$('#budget').addEventListener('input',()=>{localStorage.setItem('spendwise.budget',$('#budget').value);render()});$('#search').addEventListener('input',renderTransactions);
const openAddExpense=()=>{$('#date').value=today();$('#add-dialog').showModal()};$('#profile-add-expense')?.addEventListener('click',openAddExpense);
$('#add-form').addEventListener('submit',e=>{e.preventDefault();let t={date:$('#date').value,description:$('#merchant').value.trim(),amount:-Math.abs(Number($('#amount').value)),category:$('#category').value,source:'Manual',reference:''};if(!t.description||!t.date||!Number.isFinite(t.amount)||t.amount===0)return;let fp=fingerprint(t);if(transactions.some(x=>fingerprint(x)===fp)){notify('Duplicate transaction ignored');return}transactions.push(t);save();render();$('#add-dialog').close();$('#add-form').reset();notify('Expense saved')});
function parseCSV(text){let rows=[],row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){let c=text[i];if(c==='"'&&quoted&&text[i+1]==='"'){cell+='"';i++}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(cell.trim());cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());if(row.some(x=>x!==''))rows.push(row);row=[];cell=''}else cell+=c}row.push(cell.trim());if(row.some(x=>x!==''))rows.push(row);return rows}
function col(headers,patterns){return headers.findIndex(h=>patterns.some(p=>p.test(h)))}
$('#csv-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;const status=$('#import-status');try{if(file.size>10*1024*1024)throw Error('File exceeds 10 MB limit.');let rows=parseCSV(await file.text());if(rows.length<2)throw Error('CSV must contain a header and at least one row.');let headers=rows[0].map(h=>h.toLowerCase().replace(/^\uFEFF/,''));let di=col(headers,[/^date$/, /transaction date/, /value date/]), desc=col(headers,[/description/,/narration/,/merchant/,/details/,/particulars/]), amt=col(headers,[/^amount$/, /transaction amount/,/^amt$/]), debit=col(headers,[/^debit$/, /withdrawal/]), credit=col(headers,[/^credit$/, /deposit/]), typ=col(headers,[/^type$/, /dr.cr/,/transaction type/]), cat=col(headers,[/^category$/]), ref=col(headers,[/reference/,/ref no/,/transaction id/,/utr/]);if(di<0||desc<0||(amt<0&&debit<0&&credit<0))throw Error('Could not identify required columns. Need date, description, and amount (or debit/credit).');let added=0,dupes=0,skipped=0;for(const r of rows.slice(1)){let date=normalDate(r[di]||'');let description=(r[desc]||'').trim();let raw=amt>=0?(r[amt]||''):(r[debit]||r[credit]||'');let n=Number(String(raw).replace(/[₹,\s]/g,'').replace(/[()]/g,''));if(!date||!description||!Number.isFinite(n)||raw===''){skipped++;continue}let isCredit=credit>=0&&Number(String(r[credit]||'').replace(/[₹,\s]/g,''))>0;let type=(typ>=0?r[typ]:'').toLowerCase();let amount=amt>=0?n:(isCredit?Math.abs(n):-Math.abs(n));if(amt>=0){if(/debit|withdraw|dr\b/.test(type))amount=-Math.abs(n);else if(/credit|deposit|cr\b/.test(type))amount=Math.abs(n)}let category=(cat>=0&&r[cat].trim())||categorize(description,type);let t={date,description,amount,category,source:'CSV import',reference:ref>=0?(r[ref]||'').trim():''};if(transactions.some(x=>fingerprint(x)===fingerprint(t))){dupes++;continue}transactions.push(t);added++}save();render();status.textContent=`Import complete: ${added} added, ${dupes} duplicates skipped, ${skipped} rows skipped.`;notify('Statement imported')}catch(err){status.textContent=err.message;status.style.color='#ff8291'}finally{e.target.value=''}});
function normalDate(s){s=String(s).trim();if(!s)return '';if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.slice(0,10);let m=s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);if(m){let a=+m[1],b=+m[2],y=+m[3];if(y<100)y+=2000; // Common Indian export format DD/MM/YYYY; ambiguous dates are interpreted as DD/MM/YYYY.
let d=a,mo=b;if(a<=12&&b>12){d=b;mo=a}let out=new Date(y,mo-1,d);if(out.getFullYear()===y&&out.getMonth()===mo-1&&out.getDate()===d)return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`}let parsed=new Date(s);return Number.isNaN(+parsed)?'':parsed.toISOString().slice(0,10)}
$('#provider-info')?.addEventListener('click',()=>$('#provider-checklist')?.classList.toggle('hidden'));
$('#clear-data').onclick=()=>{if(confirm('Delete all transactions saved in this browser? This cannot be undone.')){transactions=[];save();render();notify('Local transaction data deleted')}};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();

// Android-only UPI notification prototype. Transactions require user confirmation.
const pendingUpi = new Map();
function parseUpiAlert(data){
  const raw=[data.title,data.text].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
  const amountMatch=raw.match(/(?:₹|rs\.?\s?|inr\s*)([\d,]+(?:\.\d{1,2})?)/i);
  if(!amountMatch)return null;
  const amount=Number(amountMatch[1].replace(/,/g,'')); if(!Number.isFinite(amount)||amount<=0)return null;
  const low=raw.toLowerCase();
  if(/request(ed)? money|collect request|pending request/.test(low))return null;
  const incoming=/received|credited|got paid|refund received/.test(low);
  const outgoing=/paid|sent|debited|payment of/.test(low);
  if(!incoming&&!outgoing)return null;
  let description=(data.title||'UPI transaction').trim();
  description=description.replace(/\b(you have|you just|payment|transaction|successful|successfully|paid|received|sent|debited|credited)\b/ig,' ').replace(/\s+/g,' ').trim();
  if(!description||description.length<2)description='UPI transaction';
  return {date:new Date(data.postedAt||Date.now()).toISOString().slice(0,10),description,amount:incoming?amount:-amount,category:incoming?'Income':categorize(raw),source:'UPI notification',reference:'notif-'+String(data.packageName||'app')+'-'+String(data.postedAt||Date.now()),raw};
}
function showUpiAlert(data){
  const parsed=parseUpiAlert(data); if(!parsed){$('#upi-help').textContent='A payment notification arrived, but SpendWise could not safely identify its amount and direction. No transaction was added.';return;}
  const key=fingerprint(parsed); if(transactions.some(t=>fingerprint(t)===key)||pendingUpi.has(key))return;
  pendingUpi.set(key,parsed); renderUpiAlerts();
}
function renderUpiAlerts(){
  const host=$('#upi-alerts'); if(!host)return;
  if(!pendingUpi.size){host.innerHTML='<p>No notifications awaiting review.</p>';return;}
  host.innerHTML=[...pendingUpi.entries()].map(([key,t])=>`<div class="checklist-item"><p><b>${esc(t.description)}</b> · ${esc(t.date)} · ${esc(t.source)}</p><p>${t.amount>=0?'+':'−'}${money(Math.abs(t.amount))} · Suggested: ${esc(t.category)}</p><p class="muted">${esc(t.raw)}</p><div class="button-row"><button class="primary" data-upi-confirm="${esc(key)}">Confirm & save</button><button class="secondary" data-upi-dismiss="${esc(key)}">Dismiss</button></div></div>`).join('');
  host.querySelectorAll('[data-upi-confirm]').forEach(b=>b.onclick=()=>{const t=pendingUpi.get(b.dataset.upiConfirm);if(!t)return;const clean={date:t.date,description:t.description,amount:t.amount,category:t.category,source:t.source,reference:t.reference};if(!transactions.some(x=>fingerprint(x)===fingerprint(clean))){transactions.push(clean);save();render();notify('UPI alert saved after review')}pendingUpi.delete(b.dataset.upiConfirm);renderUpiAlerts()});
  host.querySelectorAll('[data-upi-dismiss]').forEach(b=>b.onclick=()=>{pendingUpi.delete(b.dataset.upiDismiss);renderUpiAlerts()});
}
async function refreshUpiStatus(){
  const status=$('#upi-status'),help=$('#upi-help');
  const isAndroid=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
  if(!isAndroid){status.textContent='Android app required';status.className='pill warning';help.textContent='Open the installed Android build. Notification access cannot be enabled from the website.';return;}
  try{const plugin=window.Capacitor.Plugins&&window.Capacitor.Plugins.UpiNotification;if(!plugin)throw Error('Native notification plugin is missing from this Android build.');const result=await plugin.getStatus();status.textContent=result.granted?'Enabled':'Not enabled';status.className='pill '+(result.granted?'success':'warning');help.textContent=result.granted?'Notification access is enabled. Supported alerts can be detected while Android allows the service to run.':'Tap Enable notification access and select SpendWise in Android settings.';}catch(e){status.textContent='Setup needed';status.className='pill warning';help.textContent=e.message||'Rebuild the Android app with the native integration files.';}
}
$('#upi-enable')?.addEventListener('click',async()=>{try{const plugin=window.Capacitor?.Plugins?.UpiNotification;if(!plugin)throw Error('Native plugin not installed. Complete the Android setup steps in ANDROID_UPI_SETUP.md, then rebuild.');await plugin.openNotificationSettings();}catch(e){$('#upi-help').textContent=e.message;}});
$('#upi-refresh')?.addEventListener('click',refreshUpiStatus);
if(window.Capacitor?.Plugins?.UpiNotification){window.Capacitor.Plugins.UpiNotification.addListener('transactionNotification',showUpiAlert).catch(()=>{});}
renderUpiAlerts();refreshUpiStatus();

// Payment UX prototypes only: these handlers do not transfer money or scan live QR codes.
$('#demo-upi')?.addEventListener('click',()=>{document.querySelector('#demo-payee')?.focus();document.querySelector('#demo-pay-form')?.scrollIntoView({behavior:'smooth',block:'center'});notify('Enter a UPI ID below to preview a demo payment.')});
$('#demo-bank')?.addEventListener('click',()=>notify('Bank transfers require an eligible UPI partner and approvals.'));
$('#demo-wallet')?.addEventListener('click',()=>notify('SpendWise Wallet is a visual preview only and is not a stored-value wallet.'));
$('#demo-balance')?.addEventListener('click',()=>notify('Balance checks require an approved bank/UPI integration. No bank account is connected.'));
$('#demo-history')?.addEventListener('click',()=>showView('transactions'));
$('#demo-pay-form')?.addEventListener('submit',e=>{e.preventDefault();const payee=$('#demo-payee').value.trim();const amount=Number($('#demo-pay-amount').value);if(!/^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}$/.test(payee)){notify('Enter a valid-looking UPI ID for the demo.');return;}if(!Number.isFinite(amount)||amount<1){notify('Enter a valid demo amount.');return;}notify(`Demo preview: ₹${amount.toFixed(2)} to ${payee}. No money moved.`);});


// Recharge & Bills directory is a service-category preview; no biller payments are initiated.
let selectedBill='';
$$('[data-bill]').forEach(b=>b.addEventListener('click',()=>{selectedBill=b.dataset.bill||'Service';$('#bill-dialog-title').textContent=selectedBill+' preview';$('#bill-dialog-copy').textContent='Enter details to preview this service. This does not contact a biller or move money.';$('#bill-customer').value='';$('#bill-amount').value='';$('#bill-dialog').showModal();}));
$('#bill-form')?.addEventListener('submit',e=>{e.preventDefault();const customer=$('#bill-customer').value.trim(),amount=Number($('#bill-amount').value);if(!customer||!Number.isFinite(amount)||amount<=0){notify('Enter valid demo details');return;}$('#bill-dialog').close();notify(`${selectedBill} preview for ${customer}: ₹${amount.toFixed(2)}. Not paid.`);});
function updateBudgetView(){const budget=Math.max(0,Number($('#budget').value)||0),spent=monthItems().filter(expense).reduce((s,t)=>s+Math.abs(Number(t.amount)),0);if($('#budget-view-spent'))$('#budget-view-spent').textContent=money(spent);if($('#budget-view-remaining'))$('#budget-view-remaining').textContent=money(budget-spent);}
$('#demo-scan')?.addEventListener('click',()=>showView('scan'));
$('#start-scan')?.addEventListener('click',startQrCamera);
$('#stop-scan')?.addEventListener('click',stopQrCamera);
$('#qr-image')?.addEventListener('change',handleQrImage);
let scanStream=null,scanTimer=null;
async function startQrCamera(){const status=$('#scan-status'),video=$('#scan-video');if(!navigator.mediaDevices?.getUserMedia){status.textContent='Camera is not supported in this browser. Try choosing a QR image.';return;}if(!('BarcodeDetector'in window)){status.textContent='This browser does not support built-in QR detection. You can choose a QR image instead.';return;}try{const detector=new BarcodeDetector({formats:['qr_code']});scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});video.srcObject=scanStream;video.classList.remove('hidden');await video.play();status.textContent='Camera active. Point it at a QR code.';clearInterval(scanTimer);scanTimer=setInterval(async()=>{try{if(video.readyState<2)return;const codes=await detector.detect(video);if(codes.length){$('#scan-result').textContent='QR content: '+codes[0].rawValue+' — preview only; no payment was initiated.';status.textContent='QR detected.';stopQrCamera();}}catch{}},700);}catch(err){status.textContent='Camera permission was denied or unavailable. Choose a QR image instead.';}}
function stopQrCamera(){if(scanTimer)clearInterval(scanTimer);scanTimer=null;if(scanStream)scanStream.getTracks().forEach(t=>t.stop());scanStream=null;const video=$('#scan-video');if(video){video.pause();video.srcObject=null;video.classList.add('hidden');}const status=$('#scan-status');if(status&&status.textContent==='Camera active. Point it at a QR code.')status.textContent='Camera stopped.';}
async function handleQrImage(e){const file=e.target.files?.[0];if(!file)return;const result=$('#scan-result');if(!('BarcodeDetector'in window)){result.textContent='QR image detection is not supported in this browser. Try camera scanning on a supported Android browser.';return;}try{const bitmap=await createImageBitmap(file);const detector=new BarcodeDetector({formats:['qr_code']});const codes=await detector.detect(bitmap);result.textContent=codes.length?'QR content: '+codes[0].rawValue+' — preview only; no payment was initiated.':'No QR code found in that image.';}catch{result.textContent='Could not read this image. Try another clear QR image.'}finally{e.target.value=''}}
$('#demo-invite')?.addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:'SpendWise',text:'Try SpendWise to track expenses and manage your budget.',url:location.href});else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);notify('SpendWise link copied to clipboard');}else notify('Share this website link with your friends.')}catch(e){if(e.name!=='AbortError')notify('Invite sharing is not available in this browser.')}});
