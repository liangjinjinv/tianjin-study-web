/* Local-only personal material intake. Uses the original app state/backup schema. */
(() => {
  'use strict';
  const choices = {
    knowledge:{title:'记知识点', icon:'✎', hint:'记下一个定义、板书或好用的方法', stored:'知识点'},
    practice:{title:'加练习题', icon:'◇', hint:'没做过，或以后想再练的一道题', stored:'练习题'},
    wrong:{title:'录错题', icon:'↻', hint:'补录纸质作业或试卷上做错的题', stored:'错题'}
  };
  let context, opened, noteBusy=false;
  const subjects=c=>(c.content.subjects||[]).map(s=>s.name);
  const sections=subject=>window.StudyCatalog?.sections(subject)||[];
  const sectionFor=(subject,id)=>sections(subject).find(s=>s.id===id);
  const id=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  const esc=(c,v)=>c.esc(String(v??''));
  const path=(subject,section)=>section?.title?subject+' › '+section.title:subject+' · 未分章节';
  const option=(c,v,label,sel='')=>'<option value="'+esc(c,v)+'"'+(sel===v?' selected':'')+'>'+esc(c,label)+'</option>';
  const safeImage=s=>typeof s==='string'&&s.length<650000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(s);
  const photo=(c,s,alt)=>safeImage(s)?'<img class="si-photo" loading="lazy" src="'+esc(c,s)+'" alt="'+esc(c,alt)+'">':'';
  const data=(c,k,v)=>v?' data-si-'+k+'="'+esc(c,v)+'"':'';
  const button=(c,{subject='',section='',label='＋ 添加',kind=''}={})=>
    '<button type="button" class="btn primary si-add" data-si-add'+data(c,'subject',subject)+data(c,'section',section)+data(c,'kind',kind)+' aria-haspopup="dialog">'+esc(c,label)+'</button>';
  function records(c,{subject='',section='',kind=''}={}) {
    const upload=c.state.uploads||[], wrong=c.state.review||{}, stored=c.state.resources||[];
    const byId=new Map(upload.map(q=>[q.id,q]));
    const knowledge=stored.filter(n=>n&&subjects(c).includes(n.subject)&&typeof n.title==='string').map(n=>({kind:'knowledge',subject:n.subject,section:n.section||'',n}));
    const exercises=upload.map(q=>({kind:'practice',subject:q.subject,section:q.section||'',q,r:wrong[q.id]}));
    const misses=Object.values(wrong).filter(r=> r?.question && r.question.source!=='knowledge').map(r=>{
      const q=byId.get(r.question.id)||r.question;
      return {kind:'wrong',subject:q.subject,section:q.section||'',q,r};
    });
    const all=kind==='knowledge'?knowledge:kind==='practice'?exercises:kind==='wrong'?misses:
      [...knowledge,...exercises.map(row=>row.r?{...row,kind:'wrong'}:row),
       ...misses.filter(row=>!byId.has(row.q.id))];
    return all.filter(row=>(!subject||row.subject===subject)&&(!section||row.section===section)).reverse();
  }
  const route=(page,p)=>'#'+page+(p?'?'+new URLSearchParams(p):'');
  function row(c,record){
    const {kind,subject,section,n,q,r}=record, real=sectionFor(subject,section);
    const marked=n?.id&&Object.hasOwn(c.state.review||{},'note-'+n.id);
    const label=kind==='wrong'?'错题':kind==='practice'?'练习题':'知识点';
    const title=n?.title||q?.prompt||'看图作答';
    let action='';
    if(q) {
      const view=kind==='wrong'||r?'review':'practice';
      action='<a class="btn si-row-action" href="'+esc(c,route(view,{subject,id:q.id}))+'">'+(view==='review'?'去重做':'去做题')+'</a>';
    } else if(n?.id) {
      action=marked?'<span class="si-tag">已加入复习</span>':'<button class="btn si-row-action" type="button" data-si-remember="'+esc(c,n.id)+'">加入复习</button><span class="si-row-feedback" role="status"></span>';
    }
    return '<article class="si-row"'+data(c,'record-subject',subject)+'><div class="si-row-top"><span class="si-tag si-tag-'+kind+'">'+label+'</span><small>'+esc(c,path(subject,real))+'</small></div>'+
      (n?'<details><summary>'+esc(c,title)+'</summary><p class="si-note-body">'+esc(c,n.body)+'</p>'+photo(c,n.image,'知识点照片')+'</details>':
        '<div class="si-title">'+esc(c,String(title).length>120?String(title).slice(0,120)+'…':title)+'</div>')+
      '<div class="si-row-controls">'+action+(r&&!r.mastered?'<small class="si-due">下次复习 '+esc(c,r.due)+'</small>':'')+'</div></article>';
  }
  function panel(c,args={}){
    const all=records(c,args);
    const label=args.kind==='knowledge'?'我记的知识点':args.kind==='practice'?'我加的题目':'我加的资料';
    return '<section class="panel si-personal"><h3>'+label+'</h3>'+(all.length?
      '<div class="si-list">'+all.map(r=>row(c,r)).join('')+'</div>':
      '<p class="muted">这里还没有自建内容。用小节顶部的「＋ 添加」记下一条吧。</p>')+'</section>';
  }
  function archive(c){
    const groups=[['','全部'],['knowledge','知识点'],['practice','练习题'],['wrong','错题']];
    const selected=groups.some(([v])=>v===c.params?.kind)?c.params.kind:'';
    return '<section class="panel si-archive"><div class="si-archive-top"><div><h2>我的资料</h2><p class="muted">按科目找资料，记录只保存在当前浏览器。</p></div>'+
      '<label>按科目筛选<select data-si-archive-subject>'+option(c,'','全科')+subjects(c).map(s=>option(c,s,s)).join('')+'</select></label></div>'+
      '<div class="si-filters" role="group" aria-label="资料类型">'+groups.map(([v,label])=>'<button class="btn" type="button" data-si-archive-kind="'+v+'" aria-pressed="'+(v===selected)+'">'+label+'</button>').join('')+'</div>'+
      '<label class="si-search">搜索我的资料<input type="search" data-si-archive-search placeholder="搜标题、科目、章节或内容"></label>' +
      '<div data-si-archive-list>'+archiveList(c,{kind:selected})+'</div></section>';
  }
  function archiveList(c,args={}){
    const terms=(args.search||'').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const all=records(c,args).filter(({subject,section,n,q,r})=>{
      if(!terms.length)return true;
      const search=[subject,sectionFor(subject,section)?.title,n?.title,n?.body,q?.topic,q?.prompt,r?.reason].join(' ').toLocaleLowerCase();
      return terms.every(t=>search.includes(t));
    }), buckets=new Map();
    for(const r of all) {if(!buckets.has(r.subject)) buckets.set(r.subject,[]); buckets.get(r.subject).push(r);}
    return all.length?'<div class="si-groups">'+subjects(c).filter(s=>buckets.has(s)).map(s=>'<section><h3>'+esc(c,s)+'</h3><div class="si-list">'+buckets.get(s).map(r=>row(c,r)).join('')+'</div></section>').join('')+'</div>':
      '<p class="si-empty" role="status">'+(terms.length?'没有搜到匹配的资料。换个词，或试试全科。':'这里还没有这类资料。可以点页面顶部的「＋ 添加」。')+'</p>';
  }
  function close(screen=opened){
    if(!screen)return;
    if(screen.node.open) screen.node.close();
    screen.node.remove();
    if(opened===screen)opened=null;
  }
  function open(c,source) {
    if(opened)return;
    const subject=source.dataset.siSubject||'', section=sectionFor(subject,source.dataset.siSection);
    const node=document.createElement('dialog');
    node.className='si-dialog';
    node.setAttribute('aria-labelledby','si-dialog-title');
    node.addEventListener('cancel',ev=>{ev.preventDefault();if(!screen.busy)close(screen);});
    node.addEventListener('close',()=>{if(opened===screen)close(screen);});
    const screen={c,source,node,hash:location.hash,subject:subjects(c).includes(subject)?subject:'',section:section?.id||'',busy:false,mode:''};
    opened=screen;
    document.body.append(node);
    choose(screen);
    node.showModal();
    if(Object.hasOwn(choices,source.dataset.siKind)) edit(screen,source.dataset.siKind);
    else node.querySelector('[data-si-choose]')?.focus();
  }
  function frame(screen,title,subtitle,markup){
    screen.node.innerHTML='<div class="si-sheet"><header class="si-sheet-head"><div><p class="si-kicker">我的资料 · 本机保存</p><h2 id="si-dialog-title">'+title+'</h2><p>'+subtitle+'</p></div><button type="button" class="btn si-close" data-si-close aria-label="关闭">✕</button></header>'+markup+'</div>';
    screen.node.querySelector('[data-si-close]').onclick=()=>{if(!screen.busy)close(screen);};
  }
  function choose(screen){
    const {c,subject,section}=screen;
    screen.mode='';
    const where=subject?'将添加到 '+esc(c,path(subject,sectionFor(subject,section)))+'。':'先选这份资料的用途，再选科目。';
    frame(screen,'添加资料',where,'<div class="si-options">'+Object.entries(choices).map(([key,m])=>
      '<button type="button" class="si-option" data-si-choose="'+key+'"><span class="si-opt-icon" aria-hidden="true">'+m.icon+'</span><span><strong>'+m.title+'</strong><small>'+m.hint+'</small></span></button>').join('')+'</div>');
    screen.node.querySelectorAll('[data-si-choose]').forEach(b=>b.onclick=()=>edit(screen,b.dataset.siChoose));
  }
  function edit(screen,mode) {
    screen.mode=mode;
    const c=screen.c, knowledge=mode==='knowledge', wrong=mode==='wrong';
    const optSelect=(subject,sel)=>option(c,'',sections(subject).length?'暂不分章节（选填）':'无可选章节，保存到科目',sel)+
      sections(subject).map(l=>option(c,l.id,l.title,sel)).join('');
    const file='<label class="si-file">附照片 <small>可选 · JPG / PNG / WebP，不超过 12 MB</small><input type="file" name="image" accept="image/jpeg,image/png,image/webp"><span class="si-file-selected" aria-live="polite"></span><small>请先裁掉姓名、学校等信息。</small></label>';
    const grade='<details class="si-extra"><summary>答案与判题设置（选填）</summary>'+
      '<label>方式<select name="type"><option value="self">对照答案自评</option><option value="auto">单选题 · 自动判题</option></select></label>'+
      '<fieldset name="opts" hidden disabled><legend>至少填写两个不同选项，选中正确项</legend>'+
      ['A','B','C','D'].map((s,i)=>'<div class="si-choice"><input type="radio" name="correct" value="'+i+'" aria-label="'+s+' 为正确答案"><label>'+s+'<input type="text" name="opt'+i+'" maxlength="150"></label></div>').join('')+'</fieldset>'+
      '<label>参考答案<textarea name="answer" rows="2" maxlength="1500"></textarea></label><label>解析<textarea name="explain" rows="2" maxlength="2000"></textarea></label></details>';
    frame(screen,choices[mode].title,wrong?'存好就会加入错题本，安排再练。':knowledge?'把资料放到课本对应的位置。':'先收进题库，想练的时候再做。',
      '<form class="si-form"><div class="si-form-pair"><label>科目<select required name="subject">'+option(c,'','请选择科目',screen.subject)+subjects(c).map(s=>option(c,s,s,screen.subject)).join('')+'</select></label>'+
      '<label>章节<select name="section">'+optSelect(screen.subject,screen.section)+'</select></label></div>'+
      (knowledge?'<label>标题<input name="title" required maxlength="60" placeholder="例如：三角形成立的条件"></label><label>要点<textarea name="body" rows="3" maxlength="2500" placeholder="可以写下要点，也可以附一张照片"></textarea></label>':
      '<label>题干<textarea name="prompt" rows="3" maxlength="1500" placeholder="输入题干，或者只附一张题图"></textarea></label>')+
      file+(wrong?'<details class="si-extra"><summary>当时怎么做错的（选填）</summary><label>当时的答案<textarea name="original" rows="2" maxlength="1500"></textarea></label><label>错因<input name="reason" maxlength="250" placeholder="例如：漏看了单位"></label></details>':'')+
      (knowledge?'':grade)+'<p class="si-feedback" role="status"></p><footer class="si-sheet-actions"><button class="btn" type="button" data-si-back>返回选择</button><button class="btn primary" type="submit">保存'+choices[mode].stored+'</button></footer></form>');
    const form=screen.node.querySelector('form'), {elements}=form;
    elements.subject.addEventListener('change',()=>{elements.section.innerHTML=optSelect(elements.subject.value,'');});
    elements.type?.addEventListener('change',()=>{const auto=elements.type.value==='auto';elements.opts.hidden=!auto;elements.opts.disabled=!auto;});
    elements.image.addEventListener('change',()=>{const f=elements.image.files[0];form.querySelector('.si-file-selected').textContent=f?'已选：'+f.name:'';});
    form.querySelector('[data-si-back]').onclick=()=>{
      if(screen.busy)return;
      if([...new FormData(form)].some(([key,v])=>!['subject','section','type'].includes(key)&&(typeof v==='string'?v.trim():v.size))) {
        const f=form.querySelector('.si-feedback');
        if(f.dataset.confirmBack!=='1'){f.dataset.confirmBack='1';f.textContent='返回会清空当前填写的内容。确定的话再点一次。';return;}
      }
      screen.subject=elements.subject.value;screen.section=elements.section.value;choose(screen);screen.node.querySelector('[data-si-choose]')?.focus();
    };
    form.oninput=()=>{const f=form.querySelector('.si-feedback');if(f.dataset.confirmBack==='1'){f.dataset.confirmBack='';f.textContent='';}};
    form.onsubmit=event=>submit(event,screen,form);
    form.elements[screen.subject?(knowledge?'title':'prompt'):'subject'].focus();
  }
  function makeRecord(c,d,mode,image=''){
    const val=k=>String(d.get(k)||'').trim();
    const subject=val('subject'), section=sectionFor(subject,val('section'));
    if(!subjects(c).includes(subject))throw Error('请先选择科目。');
    if(val('section')&&!section)throw Error('这个章节不属于所选科目，请重新选择。');
    if(mode==='knowledge'){
      const title=val('title'),body=val('body');
      if(!title || (!body && !image)) throw Error('请填写标题，并写下要点或附一张照片。');
      return {key:'resources',label:path(subject,section),record:{id:id(),subject,section:section?.id||'',title,body,image,date:c.day()}};
    }
    const prompt=val('prompt');
    if(!prompt&&!image)throw Error('请填写题干或添加题图。');
    const q={id:'mine-'+id(),subject,section:section?.id||'',topic:section?.title||'未分章节',prompt,image,answer:val('answer'),explain:val('explain'),source:'private'};
    if(val('type')==='auto'){
      const nonEmpty=Array.from({length:4},(_,i)=>({s:val('opt'+i),i})).filter(v=>v.s);
      const correct=nonEmpty.findIndex(o=>String(o.i)===val('correct'));
      if(nonEmpty.length<2||correct<0||new Set(nonEmpty.map(o=>o.s)).size!==nonEmpty.length)throw Error('请填写至少两个不同选项，并标出其中的正确答案。');
      q.options=nonEmpty.map(o=>o.s);q.correct=correct;if(!q.answer)q.answer=q.options[correct];
    }
    const {image:_,...lite}=q;
    const review=mode==='wrong'?{question:lite,due:c.day(1),stage:0,reason:val('reason'),original:val('original'),mastered:false}:null;
    return {key:'uploads',label:path(subject,section),record:q,review};
  }
  async function persist(c,entry){
    const {key,record,review}=entry, prior=c.state[key], priorReview=c.state.review;
    const next=[...(prior||[]),record];
    const nextReview=review?{...priorReview,[record.id]:review}:null;
    c.state[key]=next;
    if(review)c.state.review=nextReview;
    try {if(await c.save()!==false)return true;}
    catch {}
    // Respect any later in-memory update rather than overwriting it wholesale.
    if(c.state[key]===next)c.state[key]=prior;
    else c.state[key]=(c.state[key]||[]).filter(x=>x!==record);
    if(review&&c.state.review===nextReview)c.state.review=priorReview;
    else if(review&&c.state.review?.[record.id]===review)delete c.state.review[record.id];
    return false;
  }
  async function submit(event,screen,form){
    event.preventDefault();
    if(screen.busy||opened!==screen)return;
    const c=screen.c, mode=screen.mode, d=new FormData(form), btn=form.querySelector('[type=submit]'), feedback=form.querySelector('.si-feedback');
    const controls=[...form.querySelectorAll('button,input,select,textarea')].filter(el=>!el.disabled);
    screen.busy=true;controls.forEach(el=>el.disabled=true);
    const closeBtn=screen.node.querySelector('[data-si-close]');closeBtn.disabled=true;
    feedback.textContent='正在保存…';
    try {
      const image=d.get('image')?.size?await window.studyQuestionPhoto(d.get('image')):'';
      if(opened!==screen||!form.isConnected)return;
      const entry=makeRecord(c,d,mode,image);
      if(!await persist(c,entry)) throw Error('尚未保存，填写的内容还在。请重试，或先裁小照片。');
      if(opened!==screen||!form.isConnected)return;
      close(screen);
      c.render();
      const notice=document.createElement('p');
      notice.className='si-notice';notice.setAttribute('role','status');notice.tabIndex=-1;
      notice.textContent='已存到 '+entry.label+(entry.review?'，下次复习 '+entry.review.due+'。':'。');
      if(mode!=='knowledge') {
        const a=document.createElement('a');
        a.href=route(entry.review?'review':'practice',{subject:entry.record.subject,id:entry.record.id});
        a.textContent=entry.review?'查看这道错题':'去练这道题';notice.append(' ',a);
      }
      c.root.prepend(notice);
      notice.focus({preventScroll:true});notice.scrollIntoView({block:'nearest'});
    } catch(err){if(form.isConnected)feedback.textContent=err.message||'没能保存这项资料，请重试。';}
    finally{screen.busy=false;controls.forEach(el=>el.disabled=false);closeBtn.disabled=false;btn.disabled=false;}
  }
  async function remember(c,b){
    if(noteBusy || b.disabled)return;
    const n=(c.state.resources||[]).find(x=>x.id===b.dataset.siRemember);
    if(!n || !subjects(c).includes(n.subject))return;
    const status=b.parentElement.querySelector('.si-row-feedback');
    noteBusy=true;b.disabled=true;
    try {
      const noteSection=sectionFor(n.subject,n.section);
      const q={id:'note-'+n.id,subject:n.subject,section:noteSection?.id||'',topic:noteSection?.title||'知识点回想',
        prompt:'不看笔记，回想：'+n.title,answer:n.body||'',source:'knowledge',noteId:n.id};
      const ok=await window.addRecallToReview(c,q,{reason:'知识点回想',original:'手动加入间隔复习'});
      if(ok){status.textContent='已加入，下次 '+c.day(1);b.textContent='已加入复习';}
      else {b.disabled=false;status.textContent='没能保存，请再试一次。';}
    } catch {b.disabled=false;status.textContent='没能保存，请再试一次。';}
    finally {noteBusy=false;}
  }
  function refresh(c,origin){
    const host=origin.closest('.si-archive');if(!host)return;
    const kind=host.querySelector('[data-si-archive-kind][aria-pressed=true]')?.dataset.siArchiveKind||'';
    const subject=host.querySelector('[data-si-archive-subject]')?.value||'';
    const search=host.querySelector('[data-si-archive-search]')?.value||'';
    host.querySelector('[data-si-archive-list]').innerHTML=archiveList(c,{subject,kind,search});
  }
  document.addEventListener('click',event=>{
    if(!context)return;
    const add=event.target.closest?.('[data-si-add]');if(add){open(context,add);return;}
    const r=event.target.closest?.('[data-si-remember]');if(r){remember(context,r);return;}
    const filter=event.target.closest?.('[data-si-archive-kind]');
    if(filter){filter.parentElement.querySelectorAll('[data-si-archive-kind]').forEach(b=>b.setAttribute('aria-pressed',b===filter));refresh(context,filter);}
  });
  document.addEventListener('change',event=>{if(context&&event.target.matches?.('[data-si-archive-subject]'))refresh(context,event.target);});
  document.addEventListener('input',event=>{if(context&&event.target.matches?.('[data-si-archive-search]'))refresh(context,event.target);});
  function attach(c){
    if(opened&&(!opened.source.isConnected||location.hash!==opened.hash))close();
    context=c;
  }
  window.StudyIntake=Object.freeze({button,panel,archive,attach,
    testing:Object.freeze({makeRecord,persist,records})});
})();
