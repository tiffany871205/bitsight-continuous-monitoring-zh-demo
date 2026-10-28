const portfolioState={expiredQuery:'',expiredInactive:true,expiredMenu:-1,assetFilters:{},assetFilterOpen:'',assetUploadOpen:false,assets:[],compareEditing:false,compareSelected:[1,3],compareHidden:[],compareVectors:[]};

function portfolioView(page){
  if(page==='critical-assets')return criticalAssetsView();
  if(page==='compare')return comparePortfolioView();
  return expiredSubscriptionsView();
}

const expiredSubscriptions=[
  [1,'範例商業銀行','金融','持續監控','2025/10/17','710','重大',true],
  [4,'範例製造企業','製造','持續監控','2025/10/02','710','穩定',true],
  [5,'範例電信公司','電信','持續監控','2025/03/05','630','輕微',true],
  [0,'範例金融控股','金融','持續監控','2025/01/08','670','穩定',true],
  [11,'範例雲端服務','科技','持續監控','2024/12/17','750','重大',true],
  [6,'範例電子收費','商業服務','持續監控','2024/11/22','750','重大',true],
  [3,'範例國際銀行','金融','持續監控','2024/11/01','760','穩定',true],
  [9,'範例數位娛樂','媒體／娛樂','持續監控','2024/10/22','680','重大',true],
  [2,'範例資訊服務','科技','持續監控','2024/10/04','720','重大',true],
  [8,'範例證券集團','金融','持續監控','2024/10/03','680','輕微',true],
  [10,'範例保險公司','保險','持續監控','2026/11/18','770','穩定',false],
  [7,'範例第一銀行','金融','持續監控','2026/12/01','760','輕微',false]
];
function expiredSubscriptionsView(){
  const q=portfolioState.expiredQuery.trim().toLowerCase();
  const rows=expiredSubscriptions.filter(r=>(!portfolioState.expiredInactive||r[7])&&(!q||r.slice(1,7).join(' ').toLowerCase().includes(q)));
  return `${pagebar('到期訂閱')}<div class="expired-original-wrap"><section class="panel expired-original-card"><div class="expired-original-tools"><label class="expired-search"><input id="expiredSearch" value="${e(portfolioState.expiredQuery)}" placeholder="搜尋"><span>⌕</span></label><label class="expired-inactive"><input type="checkbox" id="expiredInactive" ${portfolioState.expiredInactive?'checked':''}> 僅顯示非啟用訂閱</label></div><div class="table-scroll"><table class="data-table expired-original-table"><thead><tr><th>公司 <button data-toast="公司欄位選項">⋮</button></th><th>訂閱類型 <button data-toast="訂閱類型欄位選項">⋮</button></th><th class="expired-sorted">到期日　↓ <button data-toast="到期日欄位選項">⋮</button></th><th>到期時評等 <button data-toast="評等欄位選項">⋮</button></th><th>評等變化 <button data-toast="評等變化欄位選項">⋮</button></th><th></th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td><button class="expired-company" data-company="${r[0]}"><span class="expired-logo">${e(r[1].replace('範例','').slice(0,2))}</span><span><b>${e(r[1])}</b><small>${e(r[2])}</small></span></button></td><td>${e(r[3])}</td><td>${e(r[4])}</td><td>${e(r[5])}</td><td><strong class="rating-change ${r[6]==='重大'?'major':r[6]==='輕微'?'minor':'stable'}">${e(r[6])}</strong></td><td class="expired-resubscribe-cell"><button class="expired-resubscribe" data-expired-menu="${i}">重新訂閱　⌄</button>${portfolioState.expiredMenu===i?`<div class="expired-menu"><button data-toast="已開啟持續監控重新訂閱流程">持續監控</button><button data-toast="已開啟供應商選擇重新訂閱流程">供應商選擇</button></div>`:''}</td></tr>`).join('')}</tbody></table>${rows.length?'':'<div class="portfolio-empty"><span>⌕</span><p>找不到結果</p></div>'}</div><div class="expired-pagination"><span>顯示 1 - ${rows.length}，共 ${portfolioState.expiredInactive?'7,268':(7268+2).toLocaleString()} 筆</span><button disabled>上一頁</button><input value="1" aria-label="頁碼"><span>／182</span><button>下一頁</button></div></section></div><div class="footer">獨立繁體中文操作範例 · 公司與評分為示意資料，版面依原廠頁面重建</div>`;
}

function portfolioFilterOptions(label,opts,type){
  if(type==='number-range')return `<div class="filter-options portfolio-range-filter"><label>最小值<input type="number" min="0" inputmode="numeric" aria-label="${e(label)}最小值"></label><span>－</span><label>最大值<input type="number" min="0" inputmode="numeric" aria-label="${e(label)}最大值"></label></div>`;
  if(type==='date-range')return `<div class="filter-options portfolio-date-filter"><label>開始日期<input type="date" aria-label="${e(label)}開始日期"></label><label>結束日期<input type="date" aria-label="${e(label)}結束日期"></label></div>`;
  if(type==='empty')return `<div class="filter-options portfolio-empty-filter">沒有可用選項</div>`;
  return `<div class="filter-options">${opts.map(o=>`<label><input type="checkbox" data-asset-filter-value="${e(label)}" value="${e(o)}" ${portfolioState.assetFilters[label]?.includes(o)?'checked':''}> ${e(o)}</label>`).join('')}</div>`;
}
function portfolioFilters(list){return list.map(([label,opts,type='checkbox'])=>{const open=portfolioState.assetFilterOpen===label;return `<div class="filter-row"><button data-portfolio-filter="${e(label)}" aria-expanded="${open}">${e(label)}<span>${open?'⌃':'⌄'}</span></button>${open?portfolioFilterOptions(label,opts,type):''}</div>`;}).join('');}
function criticalAssetsView(){
  const filters=[
    ['資產類型',['IP 位址','網域','Android','iOS']],
    ['發現事項數量',[],'number-range'],
    ['重要性',['重大','高','中','低']],
    ['寬限期',['是','否']],
    ['寬限期結束日期',[],'date-range'],
    ['訪客網路排除',['是','否']],
    ['訪客網路排除結束日期',[],'date-range'],
    ['雲端平台',[],'empty'],
    ['雲端服務',[],'empty'],
    ['雲端區域',[],'empty'],
    ['產品支援',['不受支援','受支援','未指定']],
    ['已識別產品',[],'empty'],
    ['弱點',[],'empty'],
    ['弱點嚴重程度',['重大（CVSS 9.0–10.0）','高（CVSS 7.0–8.9）','中（CVSS 4.0–6.9）','低（CVSS 0.0–3.9）']],
    ['弱點證據確定程度',['已確認','很可能','可能']],
    ['弱點證據偵測',['暴露','緩解']],
    ['弱點聲明',['無聲明','未審查','不受影響','審查中','已接受風險']],
    ['弱點聲明可見性',['內部','外部']]
  ];
  const rows=portfolioState.assets;
  return `${pagebar('關鍵資產',`<button class="outline" data-assets-upload>↥　上傳資產</button>`)}<div class="content portfolio-content"><div class="companies-layout"><div class="filters"><div class="filter-top"><button class="active">▽ 篩選</button><button data-modal="views">♧</button></div><input class="filter-search" placeholder="搜尋篩選條件…"><div class="filter-scroll">${portfolioFilters(filters)}</div><button class="filter-bottom" data-modal="create-view">建立檢視</button></div><div class="panel table-panel"><div class="table-tools"><span>${rows.length} 筆</span><button class="portfolio-unmonitor" data-assets-unmonitor>停止監控（${rows.length}）</button><span class="spacer"></span><button data-toast="可搜尋示範資產">⌕</button><button data-toast="已準備示範匯出">↓</button><button data-toggle="fullscreen">⛶</button></div><div class="table-scroll"><table class="data-table"><thead><tr><th><input type="checkbox" data-select-all></th><th>資產</th><th>資產類型</th><th>公司</th><th>重要性　↓</th><th>訪客網路排除</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td><input type="checkbox" class="row-check" data-asset-check="${i}"></td><td class="name">${e(r[0])}</td><td>${e(r[1])}</td><td>${e(r[2])}</td><td>${e(r[3])}</td><td>否</td></tr>`).join('')}</tbody></table>${rows.length?'':'<div class="asset-empty"><div class="asset-illustration">▤<span>⌕</span></div><p>要開始使用，請從供應商的基礎設施頁面選取資產，<br>或使用「上傳資產」按鈕匯入 CSV。</p><button class="portfolio-blue" data-toast="可從基礎設施頁面選取資產，或載入下方示範資料">了解更多</button></div>'}</div><div class="pager"><button>30⌄</button><span>0 – ${rows.length}，共 ${rows.length} 筆</span><span class="spacer"></span><button>‹</button><span>${rows.length?'1 / 1':'0 / 0'}</span><button>›</button></div></div></div>${portfolioState.assetUploadOpen?`<div class="portfolio-upload panel"><strong>上傳資產</strong><p>這是本機示範操作。你可以載入虛構範例資產，或選擇自己的 CSV；資料只在此瀏覽器分頁處理。</p><input type="file" id="assetFile" accept=".csv,text/csv"><div><button class="outline" data-assets-cancel>取消</button><button class="portfolio-blue" data-assets-example>載入示範資產</button></div></div>`:''}</div>`;
}

const compareRiskGroups=[
  ['受入侵系統',['殭屍網路感染','垃圾郵件傳播','惡意程式伺服器','未經請求的通訊','可能遭到利用']],
  ['盡職調查',['SPF','DKIM','DMARC','TLS/SSL 憑證','TLS/SSL 設定','開放連接埠','Web 應用程式安全','重大弱點管理','不安全系統','DNSSEC','伺服器軟體','桌面軟體','行動軟體','Web 應用程式標頭']],
  ['使用者行為',['檔案分享']]
];
function compareRiskCard(name,selected){
  const eventType=['殭屍網路感染','垃圾郵件傳播','惡意程式伺服器','未經請求的通訊','可能遭到利用'].includes(name);
  const critical=name==='重大弱點管理',file=name==='檔案分享';
  const heads=eventType?['排名','公司','等級','事件（過去一年）','平均持續天數']:critical?['排名','公司','等級','弱點','平均修補天數（過去一年）']:file?['排名','公司','等級','應用程式事件','非應用程式事件']:['排名','公司','等級','發現事項','等級分布'];
  const grades=name==='桌面軟體'?['D','N/A']:name==='SPF'||name==='DKIM'||name==='DMARC'||name==='開放連接埠'?['A','B']:['A','A'];
  const findings=eventType||critical||file?['0','0']:name==='TLS/SSL 憑證'?['101','51']:name==='TLS/SSL 設定'?['177','80']:name==='開放連接埠'?['29','109']:['3','28'];
  return `<article class="panel compare-risk-card ${selected?'selected':''}"><h2>${e(name)}</h2><table class="data-table"><thead><tr>${heads.map(h=>`<th>${e(h)}</th>`).join('')}</tr></thead><tbody>${[1,3].map((companyIndex,i)=>`<tr><td>${grades[i]===grades[0]?'1':i+1}</td><td><button class="compare-company-link" data-company="${companyIndex}"><span class="compare-mini-logo">${i?'國際':'商銀'}</span>${e(companies[companyIndex][0])}</button></td><td><span class="compare-grade grade-${grades[i].replace('/','')}">${grades[i]}</span></td><td><button class="compare-finding" data-toast="已開啟 ${e(name)} 發現事項">${findings[i]}</button></td><td>${eventType||critical||file?'0':`<span class="grade-distribution"><i style="width:${i?58:82}%"></i></span>`}</td></tr>`).join('')}</tbody></table></article>`;
}
function comparePortfolioView(){
  const selected=portfolioState.compareSelected.map(i=>[...companies[i],i]).slice(0,4);
  const visible=selected.filter(x=>!portfolioState.compareHidden.includes(x[5]));
  const sorted=[...selected].sort((a,b)=>+b[1]-+a[1]);
  const colors=['#4b9387','#74649d','#b67846','#3c7395'];
  const graph=visible.map((c,j)=>{const points=Array.from({length:30},(_,i)=>`${38+i*24},${90-(+c[1]-700)*.45+Math.sin(i*.58+j)*3+(i>17?i-17:0)*.7}`).join(' ');return `<polyline points="${points}" fill="none" stroke="${colors[j%colors.length]}" stroke-width="2"/>`;}).join('');
  const allVectors=compareRiskGroups.flatMap(g=>g[1]);
  return `${pagebar('公司比較',`<button class="outline" data-compare-edit>${portfolioState.compareEditing?'完成':'編輯'}</button><button class="compare-download" data-compare-download>下載</button>`)}<div class="compare-original-page">${portfolioState.compareEditing?`<div class="panel compare-editor"><strong>選擇要比較的公司（最多 4 家）</strong><div>${companies.slice(0,8).map((c,i)=>`<label><input type="checkbox" data-compare-company="${i}" ${portfolioState.compareSelected.includes(i)?'checked':''}> ${e(c[0])}</label>`).join('')}</div></div>`:''}<section class="panel compare-rating-card"><h2>安全評等</h2><div class="compare-chart-row"><div class="compare-chart"><svg viewBox="0 0 760 280" preserveAspectRatio="none" role="img" aria-label="公司安全評等趨勢"><g class="chart-grid"><line x1="38" y1="45" x2="735" y2="45"/><line x1="38" y1="90" x2="735" y2="90"/><line x1="38" y1="135" x2="735" y2="135"/><line x1="38" y1="180" x2="735" y2="180"/><line x1="38" y1="225" x2="735" y2="225"/></g><text x="2" y="50">800</text><text x="2" y="95">700</text><text x="2" y="140">600</text><text x="2" y="185">500</text><text x="2" y="230">400</text>${graph}<text x="38" y="267">2025/11</text><text x="215" y="267">2026/01</text><text x="405" y="267">2026/05</text><text x="650" y="267">2026/09</text></svg></div><aside class="compare-legend">${selected.map((c,j)=>`<button data-compare-hide="${c[5]}"><span class="legend-dot" style="border-color:${colors[j%colors.length]};background:${portfolioState.compareHidden.includes(c[5])?'transparent':colors[j%colors.length]}"></span><span>${e(c[0])}</span><b>≡ ${e(c[1])}</b></button>`).join('')}</aside></div></section><section class="panel compare-leaderboard"><h2>排行榜</h2><table class="data-table"><thead><tr><th>排名</th><th>公司</th><th>安全評等</th><th>產業</th><th>子產業</th></tr></thead><tbody>${sorted.map((c,i)=>`<tr><td>${i+1}</td><td><button class="compare-company-link" data-company="${c[5]}"><span class="compare-mini-logo">${i?'商銀':'國際'}</span>${e(c[0])}</button></td><td><b class="compare-score">≡ ${e(c[1])}</b></td><td>金融</td><td>銀行</td></tr>`).join('')}</tbody></table></section><h1 class="compare-risk-title">風險面向</h1><div class="compare-risk-layout"><aside class="compare-risk-sidebar">${compareRiskGroups.map(([group,items])=>`<h3>${e(group)}</h3>${items.map(v=>`<label><input type="checkbox" data-compare-vector="${e(v)}" ${portfolioState.compareVectors.includes(v)?'checked':''}> ${e(v)}</label>`).join('')}`).join('')}</aside><div class="compare-risk-cards">${allVectors.map(v=>compareRiskCard(v,portfolioState.compareVectors.includes(v))).join('')}</div></div></div>`;
}

document.addEventListener('click',event=>{
  const x=event.target.closest('[data-assets-upload],[data-assets-cancel],[data-assets-example],[data-assets-unmonitor],[data-compare-edit],[data-compare-hide],[data-compare-download],[data-compare-detail],[data-portfolio-filter],[data-expired-menu]');
  if(!x)return;
  if(x.hasAttribute('data-expired-menu')){const i=+x.dataset.expiredMenu;portfolioState.expiredMenu=portfolioState.expiredMenu===i?-1:i;render();return;}
  if(x.hasAttribute('data-assets-upload')){portfolioState.assetUploadOpen=true;render();return;}
  if(x.hasAttribute('data-assets-cancel')){portfolioState.assetUploadOpen=false;render();return;}
  if(x.hasAttribute('data-assets-example')){portfolioState.assets=[['portal.demo.example','網域','範例資訊服務','高'],['198.51.100.10','IP 位址','範例商業銀行','中']];portfolioState.assetUploadOpen=false;showToast('已載入兩筆虛構資產');return;}
  if(x.hasAttribute('data-assets-unmonitor')){if(portfolioState.assets.length)showToast('請先勾選要停止監控的資產');return;}
  if(x.hasAttribute('data-compare-edit')){portfolioState.compareEditing=!portfolioState.compareEditing;render();return;}
  if(x.hasAttribute('data-compare-hide')){const id=+x.dataset.compareHide;portfolioState.compareHidden=portfolioState.compareHidden.includes(id)?portfolioState.compareHidden.filter(n=>n!==id):[...portfolioState.compareHidden,id];render();return;}
  if(x.hasAttribute('data-compare-download')){const csv='公司,安全評等\n'+portfolioState.compareSelected.map(i=>`${companies[i][0]},${companies[i][1]}`).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download='公司比較示範.csv';a.click();URL.revokeObjectURL(a.href);return;}
  if(x.hasAttribute('data-compare-detail')){state.selected=+x.dataset.compareDetail;render();return;}
  if(x.hasAttribute('data-portfolio-filter')){portfolioState.assetFilterOpen=portfolioState.assetFilterOpen===x.dataset.portfolioFilter?'':x.dataset.portfolioFilter;render();return;}
});
document.addEventListener('change',event=>{
  const x=event.target;
  if(x.id==='expiredInactive'){portfolioState.expiredInactive=x.checked;portfolioState.expiredMenu=-1;render();return;}
  if(x.hasAttribute('data-compare-company')){const id=+x.dataset.compareCompany;if(x.checked&&portfolioState.compareSelected.length>=4){x.checked=false;showToast('最多比較 4 家公司');return;}portfolioState.compareSelected=x.checked?[...portfolioState.compareSelected,id]:portfolioState.compareSelected.filter(n=>n!==id);render();return;}
  if(x.hasAttribute('data-compare-vector')){portfolioState.compareVectors=x.checked?[...portfolioState.compareVectors,x.dataset.compareVector]:portfolioState.compareVectors.filter(n=>n!==x.dataset.compareVector);render();return;}
  if(x.hasAttribute('data-asset-filter-value')){const key=x.dataset.assetFilterValue;const old=portfolioState.assetFilters[key]||[];portfolioState.assetFilters[key]=x.checked?[...old,x.value]:old.filter(v=>v!==x.value);render();return;}
  if(x.id==='assetFile'&&x.files?.length){const file=x.files[0];const reader=new FileReader();reader.onload=()=>{const rows=String(reader.result).split(/\r?\n/).slice(1,21).filter(Boolean).map(line=>{const cols=line.split(',');return [cols[0]||'未命名資產',cols[1]||'網域',cols[2]||'示範公司',cols[3]||'中'];});portfolioState.assets=rows;portfolioState.assetUploadOpen=false;showToast(`已在本機讀取 ${rows.length} 筆資產`);};reader.readAsText(file);}
});

document.addEventListener('input',event=>{if(event.target.id==='expiredSearch'){portfolioState.expiredQuery=event.target.value;render();requestAnimationFrame(()=>{const el=document.getElementById('expiredSearch');el?.focus();el?.setSelectionRange(el.value.length,el.value.length);});}});
