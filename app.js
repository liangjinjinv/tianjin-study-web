"use strict";
(() => {
const content=window.CURRICULUM,root=document.getElementById('main'),nav=document.getElementById('nav'),status=document.getElementById('status');
const key='tianjin-study-compass-v1';
const pages=[['home','🏠','首页'],['practice','🎯','演练场'],['review','📝','错题本'],['upload','＋','我的题库'],['poems','📜','古诗文'],['guide','✎','阅读技巧'],['english','🎧','英语跟读'],['resources','🗂','全科资料库'],['profile','📊','学情画像']];
const all=new Set(pages.map(x=>x[0]).concat('settings','subjects','subject'));
const fmt=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Shanghai'});
const day=(offset=0)=>{const now=fmt.formatToParts().reduce((o,p)=>(o[p.type]=p.value,o),{});return new Date(Date.UTC(+now.year,+now.month-1,+now.day+offset)).toISOString().slice(0,10)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const empty=()=>({attempts:[],review:{},uploads:[],scores:[],resources:[],check:{},dates:{bio:'2027-06-22',mid:'2028-06-20'},page:'home'});
const validDate=s=>typeof s==='string'&&/^20\d\d-\d\d-\d\d$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
const noKeys=['__proto__','constructor','prototype'];
const safeId=s=>typeof s==='string'&&/^[\p{L}\p{N}_ -]{1,180}$/u.test(s)&&!noKeys.includes(s);
const safeQ=q=>plain(q)&&safeId(q.id)&&content.subjects.some(s=>s.name===q.subject)&&typeof q.topic==='string'&&typeof q.prompt==='string'&&(!q.image|| /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(q.image));
function normalize(raw,strict=false){
 if(!plain(raw))throw Error('备份不是有效的数据文件');
 if(strict&&(!Array.isArray(raw.attempts)||!Array.isArray(raw.uploads)||!plain(raw.review)||!plain(raw.dates)))throw Error('文件不是津考航线备份');
 const x=empty();
 for(const f of ['attempts','uploads','scores','resources'])if(Array.isArray(raw[f])) x[f]=raw[f].filter(plain);
 x.uploads=x.uploads.filter(safeQ);
 x.attempts=x.attempts.filter(a=>safeId(a.id)&&validDate(a.at)&&typeof a.correct==='boolean');
 if(plain(raw.review))for(const [id,r] of Object.entries(raw.review)) if(safeId(id)&&plain(r)&&safeQ(r.question)&&id===r.question.id&&(validDate(r.due)||(r.mastered===true&&r.due===null))) x.review[id]=r;
 if(plain(raw.check))for(const [k,v] of Object.entries(raw.check))if(validDate(k)&&Array.isArray(v))x.check[k]=v.filter(a=>typeof a==='string');
 if(plain(raw.dates))for(const k of ['bio','mid'])if(validDate(raw.dates[k]))x.dates[k]=raw.dates[k];
 return x;
}
let state=empty(),params={}, storageIssue='';
const disk=window.StudyPersistence.create({legacyKey:key});
let timer;
function tell(message){clearTimeout(timer);status.textContent=message;timer=setTimeout(()=>status.textContent='',4600)}
async function save(){
 const lock=root.inert;root.inert=true;
 try{const ok=await disk.save(state);if(!ok)tell(disk.error||'没能存好，请保留当前页面并重试。');return ok;}
 finally{root.inert=lock;}
}
function route(){const raw=location.hash.slice(1),[page,query]=raw.split('?');state.page=all.has(page)?page:'home';params=Object.fromEntries(new URLSearchParams(query||''));}
function go(page,p={}){const q=new URLSearchParams(p).toString(),n='#'+page+(q?'?'+q:'');if(location.hash===n){route();render();return}location.hash=n;}
const count=date=>Math.round((Date.parse(date)-Date.parse(day()))/864e5);
const line=(date)=>count(date)<0?'<strong>已过计划日</strong>':'<strong>'+count(date)+' <small>天</small></strong>';
const subjectIcons={'语文':'📖','数学':'📐','英语':'🔤','物理':'⚛','化学':'🧪','生物':'🧬','地理':'🌍','历史':'📜','道法':'⚖','体育':'⏱'};
const marks=(offset=0)=>state.check[day(offset)]||[];
const tally=()=>{let streak=0;for(let i=marks().length?0:1;i<370&&marks(-i).length;i++)streak++;const stars=Object.values(state.check).reduce((n,a)=>n+a.filter(x=>x.startsWith('s-')).length*20,0)+state.attempts.filter(a=>a.correct&&a.kind==='initial').length*5;return{streak,stars}};
function top(){
 const {streak,stars}=tally();
 return `<div class="nb-top-inner"><svg class="nb-sticker" viewBox="0 0 360 240" aria-hidden="true">
 <g transform="translate(188 115) rotate(7)"><circle r="77" fill="#ffe9f3" stroke="#edb5cf" stroke-dasharray="5 7"/><path class="line" fill="#f7a5c8" d="M-46 5Q-50-20-29-33C-46-69-41-98-23-99C-7-101-3-61-6-40L13-39C20-73 42-91 53-78C63-65 38-43 34-29Q58-13 55 12Q51 52 7 57Q-35 58-46 26Z"/><path fill="#fff9fb" d="M-32 10Q-26-20 5-20Q37-20 42 7Q48 35 17 42Q-17 50-31 27Z"/><circle fill="#663b55" cx="-12" cy="11" r="3.7"/><circle fill="#663b55" cx="24" cy="10" r="3.7"/><path class="line" fill="none" d="M3 19q5 6 10 0"/><ellipse cx="-21" cy="21" rx="7" ry="4" fill="#f6bfd5"/><ellipse cx="32" cy="19" rx="7" ry="4" fill="#f6bfd5"/><path class="line" fill="#fff5fa" d="M34-29q-16-13-21 0q4 13 21 3q14 13 22 2q-3-14-22-5Z"/></g>
 <g transform="translate(267 108) rotate(18)" class="line"><path fill="#fffafc" d="M0 32L-3 79q3 5 8 0l-1-47"/><path fill="#f6bbd5" d="M1-28l10 21 23 4-17 16 4 23-20-11-20 11 4-23-17-16 23-4Z"/><path d="M-7 5l6 7 10-12" fill="none"/></g>
 <g transform="translate(112 111) rotate(-17)" class="line"><rect x="-26" y="-41" width="42" height="65" rx="8" fill="#fff7fa"/><path fill="none" d="M-17-27H6m-23 9H6m-23 9H1m-9 18 6-6 5 6-5 5Z"/></g>
 <path class="line" fill="none" d="M87 51v17m-8-8h16m200-25v15m-8-7h16M99 173l4 8 9 1-6 6 1 9-8-4-8 4 1-9-6-6 9-1Z"/><circle cx="247" cy="43" r="4" fill="#e887ae"/><circle cx="306" cy="145" r="3" fill="#e887ae"/>
 </svg><h1>津考航线 · 冲刺中考</h1><section class="nb-exams" aria-label="考试倒计时"><article>${line(state.dates.bio)}<p>距生地会考 · 预计<br>目标生物、地理双优秀</p></article><article>${line(state.dates.mid)}<p>距天津中考 · 预计<br>规划口径：800 分</p></article></section><div class="nb-counters"><div class="nb-counter"><strong>${stars} ✦</strong>收集星光</div><div class="nb-counter"><strong>${streak} 天</strong>连续打卡</div><button data-nav="settings" class="btn compact">手账设置</button></div></div>`;
}
function dash(){
 const pending=Object.values(state.review).filter(r=>!r.mastered&&r.due<=day());
 const done=marks(),today=content.subjects.filter(s=>s.name==='生物'||s.name==='地理').sort((a,b)=>a.name==='生物'?-1:1),total=today.length;
 const last=[...state.attempts].reverse().find(a=>a.kind!=='review'&&(content.questions.some(q=>q.id===a.id)||state.uploads.some(q=>q.id===a.id)));
 const meta=window.SUBJECT_NOTEBOOK_META||{};
 return `<section class="panel nb-welcome nb-fan-card"><div class="nb-fan-copy"><h2>✨ 我的初二备考手账</h2><p class="muted">天津初二 · 近期目标：生地双优秀<br>天津中考总分按 800 分规划，考试日期以当年通知为准。</p><div class="actions"><span class="pill">已完成 ${today.filter(s=>done.includes('s-'+s.name)).length} / ${total}</span>${pending.length?`<button class="btn compact" data-nav="review">${pending.length} 道待复习</button>`:''}${last?`<button class="btn compact" data-nav="practice" data-id="${esc(last.id)}">继续上次练习</button>`:''}</div></div><figure class="nb-fan-drawing"><span class="nb-fan-cheer">加油！</span>${window.FAN_DUO_ART||''}</figure></section>
 <div class="split"><h2>✦ 今天先学：生地会考</h2><p class="nb-note">两小项，不用一天刷完所有科</p></div>
 <section class="nb-task-list" aria-label="今日生地任务">${today.map(subject=>{const name=subject.name,k='s-'+name,m=meta[name]||{};return `<article class="panel nb-task"><div class="nb-task-head"><div class="nb-task-icon" aria-hidden="true">${subjectIcons[name]||esc(subject.icon)}</div><div><div class="eyebrow">${esc(name)}</div><h3>${esc(m.title||subject.tip)}</h3></div><span class="nb-reward">+20 ✦</span></div><span class="pill">${esc(m.tag||'知识点 · 答题方法')}</span><p class="muted">${esc(m.description||subject.method)}</p><div class="actions">${name==='语文'?'<button class="btn primary" data-nav="poems">古诗文背诵</button><button class="btn" data-nav="guide">阅读技巧</button>':name==='英语'?'<button class="btn primary" data-nav="english">打开英语单元</button>':`<button class="btn primary" data-nav="subject" data-subject="${esc(name)}">展开速查</button><button class="btn" data-nav="practice" data-subject="${esc(name)}">去练习</button>`}<label class="nb-check"><input type="checkbox" data-task="${esc(k)}" ${done.includes(k)?'checked':''}> 打卡</label></div></article>`}).join('')}</section>
 <section class="section"><h2>跟上正在学的课</h2><p class="nb-note">根据学校进度挑一科；这里是专题，不是假定你们学校的章节目录。</p><div class="grid cols2">${content.subjects.filter(s=>!['生物','地理','化学'].includes(s.name)).map(s=>`<article class="panel"><h3>${subjectIcons[s.name]||''} ${esc(s.name)}</h3><p class="muted">${esc(meta[s.name]?.title||s.tip)}</p><button class="btn" data-nav="subject" data-subject="${esc(s.name)}">按这科的方法学</button></article>`).join('')}</div></section>`;
}
function guide(){return `<section class="hero"><p class="eyebrow">语文 · 现代文阅读</p><h1>阅读答题指南</h1><p class="muted">先圈出题干问的是什么，再找原文证据。以下是原创示例，不是统一评分模板。</p></section><div class="grid cols2 guide">${(content.readingMethods||[]).map(m=>`<details class="panel"><summary>${esc(m.title)}</summary><p>${esc(m.method)}</p><p class="muted">${esc(m.example)}</p>${m.questionId?`<button class="btn" data-nav="practice" data-id="${esc(m.questionId)}">做一道示例题</button>`:''}</details>`).join('')}</div>`;}
function settings(){return `<section class="hero"><p class="eyebrow">局部存储 · 不上传</p><h1>本机设置与备份</h1><p class="muted">照片、题目、错题、成绩只保存在当前浏览器。题目自动保存，不用每次导出。换手机、换浏览器、换网址或清除网站数据前，再用下面的备份功能。</p></section><div class="grid cols2"><section class="panel"><h2>调整计划日期</h2><p class="muted">初始值按你提供的 213 / 577 天换算，非官方考试日期。</p><form id="dates"><label>生地会考 <input name="bio" type="date" value="${esc(state.dates.bio)}" required></label><label>天津中考 <input name="mid" type="date" value="${esc(state.dates.mid)}" required></label><button class="btn primary">保存日期</button></form><details><summary>调整今日打卡</summary><p>只清除今天的勾选，不删题照、错题、成绩或往日打卡。</p><button id="reset-today" class="btn" type="button">清除今日打卡</button></details></section><section class="panel"><h2>转到新设备 · 备份与恢复</h2><p>备份可能包含题照和成绩，请只存在你自己的设备，不要把文件传到仓库或发给无关的人。</p><div class="actions"><button id="export" class="btn primary">导出备份</button><button id="backup-pick" class="btn">选择备份恢复</button><input id="backup" type="file" accept=".json,application/json" hidden></div><div id="backup-confirm" hidden><p>恢复会用这份备份替换当前记录。请先导出一份当前备份。</p><button class="btn primary" id="restore">确认替换</button> <button class="btn" id="cancel-restore">取消</button></div></section></div>`;}
function bindSettings(){
 root.querySelector('#reset-today').onclick=async()=>{const d=day(),old=marks();if(!old.length){tell('今天没有打卡记录');return}state.check[d]=[];if(await save()){render();tell('今日打卡已清除')}else state.check[d]=old;};
 root.querySelector('#dates').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),bio=f.get('bio'),mid=f.get('mid');if(!validDate(bio)||!validDate(mid)){tell('请输入有效日期');return}const prior=state.dates;state.dates={bio,mid};if(await save())tell('日期已保存');else state.dates=prior;};
 root.querySelector('#export').onclick=()=>{const {page,...data}=state;const u=URL.createObjectURL(new Blob([JSON.stringify({app:'tianjin-study-compass',version:1,data},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='津考航线备份-'+day()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),2000);tell('备份文件已导出')};
 const file=root.querySelector('#backup'),box=root.querySelector('#backup-confirm');let pending=null;
 root.querySelector('#backup-pick').onclick=()=>file.click();
 file.onchange=async()=>{pending=null;box.hidden=true;const f=file.files[0];file.value='';if(!f)return;try{if(f.size>64*1024*1024){tell('这份备份超过 64 MB，暂不支持在这里恢复。当前记录未变更。');return}const x=JSON.parse(await f.text());if(x.app!=='tianjin-study-compass'||x.version!==1)throw Error('不支持这份备份');pending=normalize(x.data,true);box.hidden=false}catch{tell('无法读取这份备份，当前记录未变更。')}};
 root.querySelector('#cancel-restore').onclick=()=>{pending=null;box.hidden=true};
 root.querySelector('#restore').onclick=async()=>{if(!pending)return;const old=state;state={...pending,page:'settings'};if(await save()){pending=null;render();tell('备份已恢复');}else state=old;};
}
function render(){
 if(state.page!=='poems'&&state.page!=='english')window.cleanupReading?.();
 document.getElementById('notebook-top').innerHTML=top();
 const items=pages.slice(0,4).concat(content.subjects.map(s=>['subject',subjectIcons[s.name]||s.icon,s.name==='化学'?'化学预习':s.name,s.name]),pages.slice(4));
 nav.innerHTML=items.map(([id,icon,label,subject])=>`<a href="#${id}${subject?'?subject='+encodeURIComponent(subject):''}" ${state.page===id&&(!subject||params.subject===subject)?'aria-current="page"':''}><span aria-hidden="true">${esc(icon)}</span>${esc(label)}</a>`).join('');
 const c={state,save,render,esc,content,root,go,day,params};
 c.addRecall=q=>window.addRecallToReview(c,q);
 const p=state.page;
 if(p==='home')root.innerHTML=dash();
 else if(['practice','review','upload'].includes(p)){root.innerHTML=window.renderPractice(c);window.bindPractice(c)}
 else if(p==='poems'){root.innerHTML=window.renderReading(c);window.bindReading(c)}
 else if(p==='english'){root.innerHTML=window.renderEnglishNotebook(c);window.bindEnglishNotebook(c)}
 else if(p==='subject'){root.innerHTML=window.renderSubjectNotebook(c);window.bindSubjectNotebook(c);const lab=window.renderGradeEightLab(c);if(lab){root.insertAdjacentHTML('beforeend',lab);window.bindGradeEightLab(c)}}
 else if(['profile','subjects','resources'].includes(p)){root.innerHTML=window.renderInsights(c);window.bindInsights(c)}
 else if(p==='guide')root.innerHTML=guide();
 else if(p==='settings'){root.innerHTML=settings();bindSettings()}
 if(storageIssue)root.insertAdjacentHTML('afterbegin','<p class="panel" role="alert">'+esc(storageIssue)+'</p>');
}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-nav]');if(!b)return;const dest=b.dataset.nav;if(!all.has(dest))return;const p={};for(const k of ['subject','id'])if(b.dataset[k])p[k]=b.dataset[k];go(dest,p)});
root.addEventListener('change',async e=>{const b=e.target;if(!b.matches('[data-task]'))return;const d=day(),old=state.check[d]||[],a=new Set(old);b.checked?a.add(b.dataset.task):a.delete(b.dataset.task);state.check[d]=[...a];if(!await save())state.check[d]=old;render()});
window.addEventListener('hashchange',()=>{route();render();window.scrollTo(0,0);root.focus({preventScroll:true});});
disk.load().then(({raw,issue})=>{storageIssue=issue;if(raw)try{state=normalize(raw)}catch{storageIssue='本机记录读不出来，请不要清理旧数据。'}route();render()}).catch(()=>{storageIssue='当前浏览器打不开本机存储。';route();render()});
})();
