(() => {
  'use strict';
  const catalog = window.StudyCatalog;
  const byId = catalog.byId;
  const intents={
    preview:{label:'课前预习',instruction:'选老师下一节要讲的课。先看看知识点，准备好带着问题上课。',action:'先看知识点',pane:'knowledge'},
    practice:{label:'课后练习',instruction:'选今天刚学的一节。做对应的题，卡住再回看知识点。',action:'直接到题目',pane:'questions'}
  };
  const intentOf=c=>Object.hasOwn(intents,c.params.intent)?c.params.intent:'';
  const withIntent=(c,params)=>intentOf(c)?{...params,intent:intentOf(c)}:params;
  const pending = new WeakMap();
  const icons = {数学:'∠',物理:'⚛',生物:'叶',地理:'图'};
  function href(page, params={}) {
    const q = new URLSearchParams(params).toString();
    return '#'+page+(q?'?'+q:'');
  }
  function link(c, page, params, label, className='btn') {
    return '<a class="'+className+'" href="'+c.esc(href(page,params))+'">'+label+'</a>';
  }
  function route(c) {
    const section = byId(c.params.section);
    if (section && (!c.params.subject || section.subject === c.params.subject)) return section;
    return null;
  }
  function subjectOf(c) {
    return route(c)?.subject || catalog.courses.find(r=>r.name===c.params.subject)?.name || byId(c.state.courseLast)?.subject || '数学';
  }
  function choice(c, subject) {
    return '<div class="tjp-subjects" role="group" aria-label="选择学科">'+catalog.courses.map(s =>
      '<a href="'+c.esc(href('study',withIntent(c,{subject:s.name})))+'" class="btn tjp-subject"'+(subject===s.name?' aria-current="true"':'')+'><span aria-hidden="true">'+icons[s.name]+'</span>'+s.name+'</a>'
    ).join('')+'</div>';
  }
  function progress(c) {
    const section = byId(c.state.courseLast);
    if (!section) return '';
    return '<div class="tjp-resume"><span class="tjp-marker" aria-hidden="true">续</span><div><small>上次打开 · '+section.subject+'</small><strong>'+c.esc(section.title)+'</strong></div>'+
      link(c,'study',withIntent(c,{subject:section.subject,section:section.id}),'继续学','btn primary')+'</div>';
  }
  function statuses(c) {
    const own = new Set([...(c.state.resources||[]),...(c.state.uploads||[])].map(i=>i.section));
    const right = new Set((c.state.attempts || []).filter(a=>a.correct).map(a=>a.id));
    return {own,right};
  }
  function renderList(c) {
    const subject = subjectOf(c);
    const course = catalog.courses.find(r=>r.name===subject);
    const {own,right} = statuses(c);
    const last = byId(c.state.courseLast);
    const situation=intents[intentOf(c)];
    return '<div class="tjp-page"><section class="tjp-intro"><div><p class="eyebrow">课本目录 · 八年级上</p><h1>'+(situation?.label||'跟课本学')+'</h1><p>'+(situation?.instruction||'直接打开学校正在讲的那一节。先看知识点，再做对应练习。')+'</p></div>'+
      link(c,'review',{},'今日复习')+'</section>'+(situation?'':progress(c))+choice(c,subject)+
      '<section aria-label="'+subject+'章节目录"><div class="tjp-title-row"><h2>'+subject+' · 八上目录</h2></div><p class="muted">'+c.esc(course.method)+'</p>'+
      course.chapters.map((ch,i)=>'<details class="panel tjp-chapter" '+(i===(last?.subject===subject?last.chapterIndex:0)?'open':'')+'><summary><span class="tjp-chapter-num" aria-hidden="true">'+(i+1)+'</span><span>'+c.esc(ch.title)+'</span><small>'+ch.lessons.length+' 节</small></summary><ol>'+
      ch.lessons.map(lesson=>{
        const sample = catalog.sampleQuestion(lesson.id);
        const badge = sample && right.has(sample.id)? '样例已做对' : own.has(lesson.id)? '有我添加的资料' : sample? '有样例' : '';
        return '<li><a class="tjp-node" href="'+c.esc(href('study',withIntent(c,{subject,section:lesson.id})))+'"><span aria-hidden="true" class="tjp-node-dot">'+(sample && right.has(sample.id)?'✓':'')+'</span><span>'+c.esc(lesson.title)+'</span>'+(badge?'<small>'+badge+'</small>':'')+'</a></li>';
      }).join('')+'</ol></details>').join('')+
      '<p class="tjp-footnote muted">目录按已核过的四科教材排列；内置样例不等于全套教材内容。<a href="#resources">查看全科资料库</a></p></section></div>';
  }
  function knowledgeSample(c,section,sample) {
    if (!sample) return '';
    const math = section.id==='m13-1' ? '<svg class="tjp-diagram" viewBox="0 0 360 110" role="img" aria-label="左边闭合且三个顶点不共线；中间没有接回起点；右边三个点在同一直线上"><g fill="none" stroke="#902452" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 77L55 23L102 77Z" fill="#f3c7dd"/><path d="M132 77L164 23L211 56L194 75"/><path d="M251 63H337"/></g><g fill="#902452"><circle cx="251" cy="63" r="4"/><circle cx="288" cy="63" r="4"/><circle cx="337" cy="63" r="4"/></g><g fill="#542d47" font-size="13" text-anchor="middle"><text x="60" y="99">闭合</text><text x="172" y="99">没闭合</text><text x="293" y="99">三点共线</text></g></svg>' : '';
    return '<article class="panel tjp-sample"><p class="eyebrow">原创样例</p><h3>先理解</h3><p>'+c.esc(sample.concept)+'</p>'+math+
      '<details><summary>看一道例子</summary><p>'+c.esc(sample.example)+'</p></details></article>';
  }
  function piece(c,section) {
    const q = catalog.sampleQuestion(section.id);
    const personal = (c.state.uploads||[]).find(q=>q.id===c.params.question&&q.subject===section.subject&&q.section===section.id);
    return personal || q;
  }
  function embedded(c,q,base,sample) {
    if (!q) return '';
    return '<article class="panel tjp-sample tjp-exercise"><p class="eyebrow">'+(q.source==='private'?'我的练习题':'原创样例')+'</p>'+
      (sample&&q.id!==sample.id?link(c,'study',{...base,pane:'questions'},'回到本节样例','btn compact tjp-reset-exercise'):'')+
      (window.renderSectionQuestion&&window.bindSectionQuestion?
        '<div data-course-exercise aria-label="本节作答">'+window.renderSectionQuestion(c,q.id)+'</div>':
        '<h3>练一道，看看懂没懂</h3><p>'+c.esc(q.prompt||'看图作答')+'</p>'+
          link(c,'practice',{subject:q.subject,topic:q.topic,id:q.id},'开始这一题','btn primary'))+'</article>';
  }
  function empty(c,base,kind) {
    const add=window.StudyIntake?.button;
    return '<div class="tjp-empty"><strong>这一节还没有'+(kind==='knowledge'?'知识点':'练习题')+'</strong><p>'+
      (kind==='knowledge'?'把课堂笔记、公式或图片记在这里。':'把想练的作业题或习题放在这里。')+'</p>'+
      (add?add(c,{...base,kind,label:kind==='knowledge'?'＋ 记知识点':'＋ 加练习题'}):'')+'</div>';
  }
  function renderLesson(c,section) {
    const add = window.StudyIntake?.button;
    const base = withIntent(c,{subject:section.subject,section:section.id});
    const situation=intents[intentOf(c)];
    const matching = item=>item?.section===section.id&&item.subject===section.subject;
    const sample = catalog.sampleQuestion(section.id), q = piece(c,section);
    const ownKnowledge = (c.state.resources||[]).some(n=>matching(n)&&typeof n.title==='string');
    const ownPractice = (c.state.uploads||[]).some(matching);
    const wrong = Object.values(c.state.review || {}).filter(r=>matching(r?.question)&&r.question.source!=='knowledge')
      .sort((a,b)=>Number(!!a.mastered)-Number(!!b.mastered)||String(a.due).localeCompare(String(b.due)));
    const panel = kind=>window.StudyIntake?.panel?.(c,{...base,kind})||'';
    const jump = (pane,label)=>'<a class="btn'+(situation?.pane===pane?' primary':'')+'" data-course-jump="'+pane+'" href="'+c.esc(href('study',{...base,...(c.params.question&&piece(c,section)?.id===c.params.question?{question:c.params.question}:{}),pane}))+'">'+label+'</a>';
    return '<div class="tjp-page"><div class="tjp-crumb">'+link(c,'study',withIntent(c,{subject:section.subject}),'返回 '+section.subject+' 目录','btn')+
      '<span>'+c.esc(section.chapter)+'</span></div><section class="tjp-intro tjp-intro-lesson"><div><p class="eyebrow">'+section.subject+' · 八上</p><h1>'+c.esc(section.title)+'</h1><p>边看知识点边做题；两边都是这一节的内容。</p></div>'+
      (add?add(c,{...base,label:'＋ 添加'}):'')+'</section>'+
      '<div class="tjp-jumps'+(situation?' tjp-situation':'')+'" role="group" aria-label="本节快速定位">'+jump('knowledge',situation?.pane==='knowledge'?situation.action:'定位知识点')+jump('questions',situation?.pane==='questions'?situation.action:'定位题目')+'</div>'+
      '<div class="tjp-columns">'+
        '<section class="tjp-column tjp-knowledge" aria-labelledby="tjp-knowledge-heading"><div class="tjp-column-header"><span class="tjp-marker" aria-hidden="true">知</span><div><h2 id="tjp-knowledge-heading" tabindex="-1">知识点</h2><p>先看懂，再试着用自己的话解释。</p></div></div>'+
          knowledgeSample(c,section,sample&&catalog.samples[section.id])+(ownKnowledge?panel('knowledge'):sample?'':empty(c,base,'knowledge'))+'</section>'+
        '<section class="tjp-column tjp-questions" aria-labelledby="tjp-questions-heading"><div class="tjp-column-header"><span class="tjp-marker" aria-hidden="true">练</span><div><h2 id="tjp-questions-heading" tabindex="-1">题目</h2><p>先自己做，再看答案和解析。</p></div></div>'+
          embedded(c,q,base,sample)+(ownPractice?panel('practice'):q||wrong.length?'':empty(c,base,'practice'))+
          (wrong.length?'<div class="panel tjp-review"><div><h3>本节错题</h3><p class="muted">'+wrong.length+' 道，可到错题本重做。</p></div>'+
            link(c,'review',{subject:section.subject,id:wrong[0].question.id},'回看错题')+'</div>':'')+'</section>'+
      '</div></div>';
  }
  function render(c) {
    const section = route(c);
    return section?renderLesson(c,section):renderList(c);
  }
  function remember(c,state,section) {
    if (pending.has(state)) { pending.get(state).next = section.id; return; }
    if (state.courseLast === section.id) return;
    const job = { next: '' }, previous = state.courseLast;
    pending.set(state,job);
    state.courseLast = section.id;
    (async () => {
      let ok = false;
      try { ok = (await c.save())!==false; } catch {}
      if (!ok && state.courseLast===section.id) state.courseLast=previous;
      pending.delete(state);
      const next = byId(job.next);
      if (next && next.id!==section.id && next.id!==state.courseLast) remember(c,state,next);
    })();
  }
  function focusPane(c,pane) {
    if (!['questions','knowledge'].includes(pane)) return;
    const heading = c.root.querySelector('#tjp-'+pane+'-heading');
    if (!heading) return;
    heading.focus({preventScroll:true});
    heading.scrollIntoView({block:'start'});
  }
  function bindExercise(c,section) {
    const q=piece(c,section), host=c.root.querySelector('[data-course-exercise]');
    if (!host || !q || !window.bindSectionQuestion) return;
    const inline={...c,root:host,render(){
      if(!host.isConnected)return;
      host.innerHTML=window.renderSectionQuestion(inline,q.id);
      window.bindSectionQuestion(inline,q.id);
      const result=host.querySelector('.qp-reference'), first=host.querySelector('.qp-question h2');
      if(result || first){ const target=result||first; target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'nearest'}); }
      if (result&&Object.hasOwn(c.state.review||{},q.id)) {
        host.insertAdjacentHTML('beforeend',link(c,'review',{subject:q.subject,id:q.id},'到错题本看这道题','btn tjp-review-link'));
      }
    }};
    window.bindSectionQuestion(inline,q.id);
  }
  let jumpForParams;
  function bind(c) {
    const section = route(c);
    if (!section) return;
    remember(c,c.state,section);
    bindExercise(c,section);
    c.root.querySelectorAll('[data-course-jump]').forEach(link=>link.addEventListener('click',ev=>{
      if(ev.button!==0||ev.altKey||ev.ctrlKey||ev.metaKey||ev.shiftKey)return;
      ev.preventDefault();focusPane(c,link.dataset.courseJump);
    }));
    if(window.renderSectionQuestion&&window.bindSectionQuestion) {
      c.root.querySelectorAll('.tjp-questions .si-row-action[href^="#practice?"]').forEach(link=>link.addEventListener('click',ev=>{
        if(ev.button!==0||ev.altKey||ev.ctrlKey||ev.metaKey||ev.shiftKey)return;
        const target=new URLSearchParams(link.getAttribute('href').split('?')[1]).get('id');
        if(!(c.state.uploads||[]).some(q=>q.id===target&&q.subject===section.subject&&q.section===section.id))return;
        ev.preventDefault();
        if(c.params.question===target){focusPane(c,'questions');return;}
        c.go('study',withIntent(c,{subject:section.subject,section:section.id,question:target,pane:'questions'}));
      }));
    }
    const legacy = c.params.tab==='practice'?'questions':c.params.tab==='knowledge'?'knowledge':'', pane = c.params.pane || legacy;
    if(!['knowledge','questions'].includes(pane))return;
    // Maintain the old bookmark destination without hiding the other column.
    const heading=c.root.querySelector('#tjp-'+(pane==='questions'?'questions':'knowledge')+'-heading');
    if(!heading||jumpForParams===c.params)return;
    jumpForParams=c.params;
    requestAnimationFrame(()=>{if(heading.isConnected)focusPane(c,pane)});
  }
  window.renderCoursePath = render;
  window.bindCoursePath = bind;
})();
