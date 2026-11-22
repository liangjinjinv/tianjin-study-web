(() => {
  'use strict';
  const S = { key: '', subject: '', topic: '', origin: '', mode: '', id: '', phase: '', draft: '', correct: false, note: '', tab: 'due', flash: '', savedQuestion: '' };
  let writing = false;
  const qBank = c => [...(c.content.questions || []), ...(c.state.uploads || [])];
  const topics = c => [...new Set(qBank(c).filter(q => !S.subject || q.subject === S.subject).map(q => q.topic))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  const mcq = q => Array.isArray(q.options) && q.options.length >= 2 && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length;
  const e = (c,v) => c.esc(String(v ?? ''));
  const label = (c,v,txt,sel) => '<option value="'+e(c,v)+'"'+(sel===v?' selected':'')+'>'+e(c,txt)+'</option>';
  const paras = (c,v) => '<div class="qp-preserve">'+e(c,v)+'</div>';
  const page = c => String(c.state.page);
  function route(c) {
    const p = c.params || {};
    const key = JSON.stringify([page(c),p.subject||'',p.topic||'',p.id||'']);
    if (S.key === key) return;
    S.key=key; S.subject=p.subject||''; S.topic=p.topic||''; S.origin=''; const bank=qBank(c), direct=bank.find(q=>q.id===p.id);
    const match=bank.filter(q=>(!p.subject||q.subject===p.subject)&&(!p.topic||q.topic===p.topic));
    S.mode=direct?(mcq(direct)?'auto':'self'):match.some(mcq)||!match.length?'auto':'self'; S.tab=p.id?'all':'due';
    S.flash=''; reset(p.id||'');
  }
  function reset(id) { S.id=id; S.phase=''; S.draft=''; S.correct=false; S.note=''; }
  function eligible(c) {
    return qBank(c).filter(q => (!S.subject || q.subject===S.subject) && (!S.topic || q.topic===S.topic) &&
      (!S.origin || (S.origin==='private' ? q.source==='private' : q.source!=='private')) &&
      (!S.mode || (S.mode==='auto' ? mcq(q) : !mcq(q))));
  }
  function records(c) {
    return Object.values(c.state.review||{}).filter(r=>r && r.question && (!S.subject || r.question.subject===S.subject))
      .sort((a,b)=>Number(!!a.mastered)-Number(!!b.mastered)||String(a.due).localeCompare(String(b.due)));
  }
  const due = (c,r) => !r.mastered && r.due<=c.day();
  const dept = c => (c.content.subjects||[]).map(s=>s.name);
  function reviews(c) { return records(c).filter(r=> S.tab==='all'||due(c,r)||r.question.id===S.id); }
  function subjectChips(c) {
    const labels=[...new Set(['生物','地理',...dept(c)])];
    return '<div class="qp-subjects" role="group" aria-label="按科目筛选">'+[['','全部'],...labels.map(s=>[s,s])].map(([v,name])=>'<button class="btn '+(S.subject===v?'primary':'')+'" aria-pressed="'+(S.subject===v)+'" type="button" data-qp-subject="'+e(c,v)+'">'+e(c,name)+'</button>').join('')+'</div>';
  }
  const sourceName = q => q.source==='private'?'本机私题':q.source==='recall'?'背诵复习':'原创示例题';
  const statCards = (c,stats,cls='') => '<section class="qp-stats '+cls+'" aria-label="统计">'+stats.map(([label,value])=>'<div class="panel"><span class="muted">'+e(c,label)+'</span><strong>'+e(c,value)+'</strong></div>').join('')+'</section>';
  function question(c,q,r,position="") {
    const review = !!r, auto = mcq(q);
    const result = S.phase==='done';
    const reveal = result || S.phase==='revealed';
    const original = review ? '<div class="qp-original"><p><b>上次错在哪：</b> '+e(c,r.reason||'未标注')+'</p><p><b>当时的作答：</b> '+e(c,r.original||'未记录')+'</p>'+(Number.isFinite(r.lost)?'<p><b>原卷失分：</b> '+e(c,r.lost)+' 分</p>':'')+'</div>' : '';
    const image = typeof q.image==='string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(q.image) ? '<img class="qp-image" src="'+e(c,q.image)+'" alt="题目照片">' : '';
    const answers = auto ? '<fieldset class="qp-choices"><legend>选择你的答案</legend>'+q.options.map((s,i)=>'<label><input type="radio" name="choice" value="'+i+'" '+(String(i)===S.draft?'checked':'')+' '+(reveal?'disabled':'')+'><span class="qp-letter">'+String.fromCharCode(65+i)+'</span><span>'+e(c,s)+'</span></label>').join('')+'</fieldset>' : '<label class="qp-answer-label">写下你的答案或解题思路<textarea name="written" rows="3" maxlength="1500" '+(reveal?'readonly':'')+' placeholder="先独立作答；不会也可以写下卡在哪里。">'+e(c,S.draft)+'</textarea></label>';
    const ref = q.answer || (auto ? q.options[q.correct] : '');
    return '<article class="panel qp-question"><div class="qp-tags"><span>'+e(c,q.subject)+'</span><span>'+e(c,auto?'单选题':'对照自评')+'</span>'+(!review?'<span class="qp-gold">首答对 +5 ✨</span>':'<span>'+e(c,r.mastered?'已掌握':due(c,r)?'今日到期':'待复习')+'</span>')+'</div><p class="qp-meta muted">来源：'+e(c,sourceName(q))+' · 知识点：'+e(c,q.topic||'综合')+(position?' · '+e(c,position):'')+(review?' · '+e(c,r.mastered?'已掌握':'下次复习 '+r.due):'')+'</p><h2>'+e(c,q.prompt||'看图作答')+'</h2>'+image+original+
      (S.savedQuestion===q.id?'<p class="muted" role="status">已存进我的题库，可以直接开始练习。</p>':'')+'<form id="qp-do">'+answers+(!reveal?'<div class="qp-actions"><button class="btn primary" type="submit">'+(auto?'提交答案':'提交并对照')+'</button></div>':'')+'</form>'+
      (reveal?'<div class="qp-reference" aria-live="polite">'+(result?'<strong>'+(S.correct?'本次答对':'还需要再练')+'</strong>':'<strong>对照作答要点</strong>')+'<div>'+paras(c,ref||'这道私题未填写参考答案，请对照已核实的原卷或老师反馈再自评。')+'</div>'+(q.explain?paras(c,q.explain):'')+'</div>':'')+
      (S.phase==='revealed'? '<div class="qp-actions"><button class="btn primary" type="button" data-qp-grade="yes">独立做对</button><button class="btn" type="button" data-qp-grade="no">不完整 / 还不会</button></div>':'')+
      (result ? '<p class="muted">'+e(c,S.note)+'</p><div class="qp-actions"><button class="btn primary" type="button" id="qp-next">'+(review?'下一道复习题':'下一题')+'</button></div>':'')+
      (r ? '<form id="qp-memo" class="qp-memo"><label>错因<input name="reason" maxlength="100" value="'+e(c,r.reason)+'" placeholder="比如：漏看题目条件"></label><label>原卷失分（选填）<input type="number" name="lost" min="0" max="800" step="0.5" value="'+e(c,r.lost)+'"></label><button class="btn" type="submit">保存错因</button><small aria-live="polite" id="qp-memo-note"></small></form>' : '')+
      '</article>';
  }
  function renderBank(c) {
    const list=eligible(c), selected=list.find(q=>q.id===S.id)||list[0], ids=new Set(list.map(q=>q.id));
    const first=[];const seen=new Set();
    for (const at of c.state.attempts||[]) if(at.kind==='initial'&&ids.has(at.id)&&!seen.has(at.id)){first.push(at);seen.add(at.id);}
    const right=first.filter(a=>a.correct).length;
    const stats=statCards(c,[['题库总量',list.length],['已作答',first.length],['答对 / 答错',right+' / '+(first.length-right)],['首答正确率',first.length?Math.round(100*right/first.length)+'%':'—'],['刷题星光',right*5+' ✨']]);
    if(selected?.id!==S.id) reset(selected?.id||'');
    const mode=(id,title,icon)=>'<button class="btn '+(S.mode===id?'primary':'')+'" type="button" data-qp-mode="'+id+'" aria-pressed="'+(S.mode===id)+'"><span aria-hidden="true">'+icon+'</span>'+title+'</button>';
    const filters='<details class="qp-filter" '+(S.topic||S.origin?'open':'')+'><summary>按专题、来源或题号选择</summary><div class="qp-controls"><label>专题<select id="qp-topic">'+label(c,'','全部专题',S.topic)+topics(c).map(t=>label(c,t,t,S.topic)).join('')+'</select></label><label>来源<select id="qp-source">'+label(c,'','全部来源',S.origin)+label(c,'built','原创练习',S.origin)+label(c,'private','本机私题',S.origin)+'</select></label>'+(selected?'<label>切换题目<select id="qp-id">'+list.map(q=>label(c,q.id,String(q.prompt||'看图作答').slice(0,40),selected.id)).join('')+'</select></label>':'')+'</div></details>';
    return '<header class="hero qp-hero"><h1>🎯 练题演练场</h1><p class="muted">自动判卷 · 首答正确加星光 · 答错自动归入错题本。题库由原创示例及本机私题组成。</p></header><div class="qp-mode" role="group" aria-label="判题方式">'+mode('auto','自动判卷题','📝')+mode('self','对照自评题','📖')+'</div>'+stats+subjectChips(c)+filters+
      (selected?question(c,selected,null,'第 '+(list.indexOf(selected)+1)+' / '+list.length+' 题'):'<section class="panel"><h2>没有符合筛选的题</h2><p class="muted">试试切到另一种判题方式，或加入自己的题。</p><button class="btn primary" id="qp-upload" type="button">录入私题</button></section>');
  }
  function renderReview(c) {
    const all=records(c), queue=reviews(c), target=queue.find(r=>r.question.id===S.id)||queue[0];
    if(target?.question.id!==S.id) reset(target?.question.id||'');
    const graded=all.filter(r=>Number.isFinite(r.lost));
    const others=queue.filter(r=>r!==target);
    const otherCards=others.length?'<section class="qp-review-list" aria-label="其他错题">'+others.map(r=>'<article class="panel"><p class="qp-meta muted">'+e(c,r.question.subject)+' · '+e(c,sourceName(r.question))+' · '+e(c,r.mastered?'已掌握':'下次复习 '+r.due)+'</p><h3>'+e(c,r.question.prompt||'看图作答')+'</h3><p><b>当时的作答：</b> '+e(c,r.original||'未记录')+'</p><p><b>错因：</b> '+e(c,r.reason||'未标注')+'</p><button class="btn" data-qp-open="'+e(c,r.question.id)+'" type="button">重做这道题</button></article>').join('')+'</section>':'';
    const stats=statCards(c,[['错题总量',all.length],['今日到期',all.filter(r=>due(c,r)).length],['已掌握',all.filter(r=>r.mastered).length],['已记录原卷失分',graded.length?graded.reduce((sum,r)=>sum+r.lost,0)+' 分':'未记录']],'qp-review-stats');
    return '<header class="hero qp-hero"><h1>📝 错题本</h1><p class="muted">看当时答了什么；先独立重做，再对照答案。到期复习会更新下次日期。</p></header>'+stats+'<div class="qp-pills" aria-label="复习范围"><button class="btn '+(S.tab==='due'?'primary':'')+'" type="button" data-qp-tab="due" aria-pressed="'+(S.tab==='due')+'">今日到期</button><button class="btn '+(S.tab==='all'?'primary':'')+'" type="button" data-qp-tab="all" aria-pressed="'+(S.tab==='all')+'">全部错题</button></div>'+subjectChips(c)+
      (target?'<details class="qp-filter"><summary>选择错题（'+queue.length+' 道）</summary><div class="qp-controls"><label>切换错题<select id="qp-id">'+queue.map(r=>label(c,r.question.id,r.question.subject+' · '+String(r.question.prompt).slice(0,44),S.id)).join('')+'</select></label></div></details>'+question(c,target.question,target,'第 '+(queue.indexOf(target)+1)+' / '+queue.length+' 题')+otherCards:'<section class="panel"><h2>'+(S.tab==='due'?'没有到期错题':'还没有错题')+'</h2><p class="muted">做错的题会自动加入；新错题从次日开始间隔复习，也可在「全部错题」提前练习。</p><button class="btn primary" id="qp-practice" type="button">去练题</button></section>');
  }
  function renderUpload(c) {
    return '<header class="hero qp-hero"><span class="eyebrow">题库 · 本机保存</span><h1>录入我的题</h1><p>手动录题或添加一张题图，自选科目和专题。内容只存在此浏览器，不会传到服务器。</p></header><section class="panel"><form id="qp-upload-form" class="qp-form"><div class="qp-controls"><label>科目<select name="subject" required>'+label(c,'','请选择科目','')+dept(c).map(s=>label(c,s,s,'')).join('')+'</select></label><label>专题<input name="topic" maxlength="35" placeholder="例如：等高线地形图"></label><label>判题方式<select name="type"><option value="self">主观题 / 对照自评</option><option value="auto">选择题 / 自动判题</option></select></label></div><label>题干<textarea name="prompt" maxlength="1500" rows="3" placeholder="可填写题干、或只添加一张题图"></textarea></label><label>题图（选填）<input name="image" type="file" accept="image/jpeg,image/png,image/webp"></label><p class="muted">请先裁掉姓名、学校等身份信息。支持 JPG、PNG、WebP，每次一张，不超过 12 MB。</p><fieldset id="qp-upload-options" hidden disabled><legend>填写两个及以上选项，选定正确项</legend>'+['A','B','C','D'].map((v,i)=>'<label>选项 '+v+'<input maxlength="300" name="opt'+i+'"></label>').join('')+'<label>正确选项<select name="correct" required><option value="">请选择</option>'+['A','B','C','D'].map((v,i)=>label(c,String(i),v,null)).join('')+'</select></label></fieldset><label>参考答案 / 答题要点（自评可留空）<textarea name="answer" maxlength="1500" rows="2"></textarea></label><label>解析或来源备注（选填）<textarea name="explain" maxlength="1500" rows="2"></textarea></label><p class="qp-error" aria-live="polite" id="qp-upload-error"></p><div class="qp-actions"><button class="btn primary" type="submit">保存题目</button><button class="btn" id="qp-practice" type="button">去练题</button></div></form></section>';
  }
  async function save(c) { try { return (await c.save()) !== false; } catch { return false; } }
  async function addRecallToReview(c,q) {
    if(writing || !q?.id || !dept(c).includes(q.subject)) return false;
    const map=(c.state.review ||= {});
    if(Object.hasOwn(map,q.id)) return true;
    writing=true;
    try {
      map[q.id]={question:{...q,source:'recall'},due:c.day(1),stage:0,reason:'默写未掌握',original:q.response||'未完整默写',mastered:false};
      if (!(await save(c))) { delete map[q.id]; return false; }
      return true;
    } finally { writing=false; }
  }
  async function finish(c,q,ok,r,node) {
    if (writing || S.phase==='done') return;
    writing=true;
    const controls=[...node.querySelectorAll('button, input, textarea')].filter(el=>!el.disabled);
    controls.forEach(el=>el.disabled=true);
    const attempts=(c.state.attempts ||= []), store=(c.state.review ||= {});
    const before=store[q.id] ? {...store[q.id]} : undefined;
    const priorPhase=S.phase;
    const attempt={id:q.id,subject:q.subject,topic:q.topic||'综合',correct:ok,at:c.day(),
      kind:r?'review':attempts.some(a=>a.id===q.id&&a.kind==='initial')?'practice':'initial'};
    attempts.push(attempt);
    let note=ok?'已记录本次练习。':'已记入错题本，从明天开始间隔复习。';
    const original = mcq(q) ? String.fromCharCode(65+Number(S.draft))+' · '+q.options[Number(S.draft)] : S.draft;
    if(!ok&&!r) {
      if (!before) store[q.id]={question:{...q},due:c.day(1),stage:0,reason:'',original,mastered:false};
      else {
        const record=store[q.id], next=c.day(1);
        record.due=!record.mastered && record.due<next ? record.due : next;
        record.mastered=false;record.stage=0;
        note='已记录再次答错。下次复习：'+record.due+'。';
      }
    }
    if(r) {
      if(!ok) { r.stage=0; r.mastered=false; r.due=c.day(1); note='已保存。这题明天再练。'; }
      else if (due(c,r)) {
        r.stage=Math.min(4,Math.max(0,Number(r.stage)||0)+1); r.mastered=r.stage>=4;
        r.due=r.mastered?null:c.day([1,3,7,14][r.stage]); note=r.mastered?'到期复习连续四次答对，已标记掌握。':'已保存。下次复习：'+r.due+'。';
      } else { note=r.mastered?'这题已标记掌握，仍可自由练习。':'已记录提前练习，不缩短下次到期时间。'; }
    }
    try {
      if(!(await save(c))) {
        const index=attempts.indexOf(attempt);
        if(index!==-1)attempts.splice(index,1);
        if(before) Object.assign(store[q.id],before); else delete store[q.id];
        if(node.isConnected) {
          S.phase=priorPhase;
          // Keep the existing inputs / recalled answer, so a failure never erases a draft.
          let msg=node.querySelector('.qp-save-error');
          if(!msg) {msg=document.createElement('p');msg.className='qp-error qp-save-error';msg.setAttribute('role','alert');node.append(msg);}
          msg.textContent='未能保存本次练习。答案还在，请重试。';
        }
        return;
      }
      if(node.isConnected) {
        S.correct=ok; S.phase='done'; S.note=note; c.render();
      }
    } finally {
      writing=false;
      controls.forEach(el=>el.disabled=false);
    }
  }
  async function picture(file) {
    if(!file || !file.size) return '';
    if(!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>12*1024*1024) throw Error('请添加不超过 12 MB 的 JPG、PNG 或 WebP 图片。');
    const url=URL.createObjectURL(file), img=new Image();
    try {
      img.src=url; await img.decode();
      if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth*img.naturalHeight>80e6) throw Error('图片像素过高，请裁剪后重试。');
      const scale=Math.min(1,1400/Math.max(img.naturalWidth,img.naturalHeight));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(img.naturalWidth*scale)); canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
      const g=canvas.getContext('2d'); if(!g) throw Error('浏览器无法处理图片，请尝试只录入文字。');
      g.fillStyle='#ffffff';g.fillRect(0,0,canvas.width,canvas.height);g.drawImage(img,0,0,canvas.width,canvas.height);
      let data=canvas.toDataURL('image/jpeg',0.76);
      if (data.length>620000) data=canvas.toDataURL('image/jpeg',0.50);
      if (data.length>620000 || data==='data:,') throw Error('图片压缩后仍太大，请先裁剪。');
      return data;
    } finally {URL.revokeObjectURL(url);}
  }
  function bindUpload(c,find) {
    const form=find('#qp-upload-form');
    const toggle=()=>{const gate=find('#qp-upload-options'), self=form.elements.type.value!=='auto';gate.hidden=self; gate.disabled=self;};
    form.elements.type.addEventListener('change',toggle); toggle();
    form.addEventListener('submit',async ev=>{
      ev.preventDefault();const d=new FormData(form), submit=form.querySelector('[type=submit]'), error=find('#qp-upload-error');
      if(submit.disabled || writing) return;
      const val=k=>String(d.get(k)||'').trim();
      const subject=val('subject'), prompt=val('prompt');
      submit.disabled=true;error.textContent='';
      try {
        if(!dept(c).includes(subject)) throw Error('请选择科目。');
        let q={id:'mine-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2)),subject,topic:val('topic')||'自选练习',prompt,answer:val('answer'),explain:val('explain'),source:'private'};
        if(val('type')==='auto') {
          const opts=Array.from({length:4},(_,i)=>val('opt'+i));
          const nonEmpty=opts.map((s,i)=>({s,i})).filter(v=>v.s), idx=nonEmpty.findIndex(o=>String(o.i)===val('correct'));
          if(nonEmpty.length<2||idx<0||new Set(nonEmpty.map(o=>o.s)).size!==nonEmpty.length) throw Error('请填写至少两个不同的选项，并选中已填写的正确选项。');
          q.options=nonEmpty.map(o=>o.s); q.correct=idx; if(!q.answer)q.answer=q.options[idx];
        }
        q.image=await picture(d.get('image'));
        if(!form.isConnected) return;
        if(!q.prompt&&!q.image) throw Error('请填写题干或添加题图。');
        if(writing) throw Error('上一项还在保存，请稍后重试。');
        const list=(c.state.uploads ||= []);
        writing=true;
        try {
          list.push(q);
          if(!(await save(c))) {
            const i=list.indexOf(q);
            if(i!==-1)list.splice(i,1);
            throw Error('这道题尚未保存，填写的内容还在。请重试，或裁剪图片后再保存。');
          }
          if(form.isConnected) {S.savedQuestion=q.id;c.go('practice',{subject:q.subject,topic:q.topic,id:q.id});}
        } finally {writing=false;}
      } catch(err) {if(form.isConnected)error.textContent=err.message||'图片读取失败，请换一张试试。';}
      finally {submit.disabled=false;}
    });
  }
  function renderPractice(c) {
    route(c);
    return page(c)==='review'?renderReview(c):page(c)==='upload'?renderUpload(c):renderBank(c);
  }
  function bindPractice(c) {
    const find=q=>c.root.querySelector(q);
    find('#qp-practice')?.addEventListener('click',()=>c.go('practice'));
    find('#qp-upload')?.addEventListener('click',()=>c.go('upload'));
    if(page(c)==='upload') {bindUpload(c,find);return;}
    for(const [id,field] of Object.entries({sub:'subject',topic:'topic',source:'origin',mode:'mode',id:'id'})) {
      find('#qp-'+id)?.addEventListener('change',ev=>{ S[field]=ev.target.value; if(field==='subject') S.topic=''; reset(field==='id'?S.id:'');c.render();});
    }
    c.root.querySelectorAll('[data-qp-mode]').forEach(b=>b.addEventListener('click',()=>{if(writing||S.mode===b.dataset.qpMode)return;S.mode=b.dataset.qpMode;reset('');c.render();}));
    c.root.querySelectorAll('[data-qp-subject]').forEach(b=>b.addEventListener('click',()=>{if(writing||S.subject===b.dataset.qpSubject)return;S.subject=b.dataset.qpSubject;S.topic='';reset('');c.render();}));
    c.root.querySelectorAll('[data-qp-tab]').forEach(b=>b.addEventListener('click',()=>{S.tab=b.dataset.qpTab;reset('');c.render();}));
    c.root.querySelectorAll('[data-qp-open]').forEach(b=>b.addEventListener('click',()=>{if(writing)return;reset(b.dataset.qpOpen);c.render();c.root.querySelector('.qp-question')?.scrollIntoView({block:'start'});}));
    const isReview=page(c)==='review', list=isReview?reviews(c).map(r=>r.question):eligible(c);
    const q=list.find(q=>q.id===S.id), r=isReview?c.state.review?.[S.id]:null;
    if (!q) return;
    find('#qp-next')?.addEventListener('click',()=>{
      const i=list.findIndex(v=>v.id===q.id);
      if(isReview && S.tab==='due') {
        const next=list.slice(i+1).concat(list.slice(0,i)).find(v=>due(c,c.state.review[v.id]));
        reset(next?.id||'');
      } else reset(list[(i+1)%list.length]?.id||'');
      c.render();
    });
    find('#qp-do')?.addEventListener('submit',ev=>{
      ev.preventDefault(); if(S.phase || writing) return;
      const form=ev.currentTarget, el=form.elements.namedItem(mcq(q)?'choice':'written');
      const value=String(new FormData(form).get(mcq(q)?'choice':'written')||'').trim();
      let msg=form.querySelector('.qp-error');
      if(!value) {
        if(!msg) { msg=document.createElement('p');msg.className='qp-error';msg.setAttribute('role','alert');form.append(msg); }
        msg.textContent=mcq(q)?'先选一个答案再提交。':'先写下你的答案，或写下你卡在哪里。';
        const input=mcq(q)?form.querySelector('input[type=radio]'):el;input?.focus();return;
      }
      S.draft=value;
      if(mcq(q)) finish(c,q,Number(value)===q.correct,r,form.closest('article'));
      else {S.phase='revealed';c.render();}
    });
    c.root.querySelectorAll('[data-qp-grade]').forEach(b=>b.addEventListener('click',()=>{if(S.phase==='revealed')finish(c,q,b.dataset.qpGrade==='yes',r,b.closest('article'));}));
    find('#qp-memo')?.addEventListener('submit',async ev=>{
      ev.preventDefault();if(writing)return;
      const form=ev.currentTarget, button=form.querySelector('[type=submit]'), status=form.querySelector('#qp-memo-note');
      const d=new FormData(form), oldReason=r.reason, oldLost=r.lost;
      r.reason=String(d.get('reason')||'').trim();const lost=d.get('lost');
      if(lost!==''&&Number.isFinite(Number(lost))) r.lost=Number(lost); else delete r.lost;
      writing=true;button.disabled=true;status.textContent='正在保存…';
      try {
        if(await save(c)) status.textContent='已保存';
        else {r.reason=oldReason;if(oldLost==null)delete r.lost;else r.lost=oldLost;status.textContent='尚未保存。内容还在，请重试。';}
      } finally {writing=false;button.disabled=false;}
    });
  }
  Object.assign(window,{renderPractice,bindPractice,addRecallToReview});
})();
