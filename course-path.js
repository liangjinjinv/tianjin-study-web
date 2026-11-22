(() => {
  'use strict';
  const catalog = window.StudyCatalog;
  const byId = catalog.byId;
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
      '<a href="'+c.esc(href('study',{subject:s.name}))+'" class="btn tjp-subject"'+(subject===s.name?' aria-current="true"':'')+'><span aria-hidden="true">'+icons[s.name]+'</span>'+s.name+'</a>'
    ).join('')+'</div>';
  }
  function progress(c) {
    const section = byId(c.state.courseLast);
    if (!section) return '';
    return '<div class="tjp-resume"><span class="tjp-marker" aria-hidden="true">续</span><div><small>上次打开 · '+section.subject+'</small><strong>'+c.esc(section.title)+'</strong></div>'+
      link(c,'study',{subject:section.subject,section:section.id},'继续学','btn primary')+'</div>';
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
    return '<div class="tjp-page"><section class="tjp-intro"><div><p class="eyebrow">课本目录 · 八年级上</p><h1>跟课本学</h1><p>直接打开学校正在讲的那一节。先看知识点，再做对应练习。</p></div>'+
      link(c,'review',{},'今日复习')+'</section>'+progress(c)+choice(c,subject)+
      '<section aria-label="'+subject+'章节目录"><div class="tjp-title-row"><h2>'+subject+' · 八上目录</h2></div><p class="muted">'+c.esc(course.method)+'</p>'+
      course.chapters.map((ch,i)=>'<details class="panel tjp-chapter" '+(i===(last?.subject===subject?last.chapterIndex:0)?'open':'')+'><summary><span class="tjp-chapter-num" aria-hidden="true">'+(i+1)+'</span><span>'+c.esc(ch.title)+'</span><small>'+ch.lessons.length+' 节</small></summary><ol>'+
      ch.lessons.map(lesson=>{
        const sample = catalog.sampleQuestion(lesson.id);
        const badge = sample && right.has(sample.id)? '样例已做对' : own.has(lesson.id)? '有我添加的资料' : sample? '有样例' : '';
        return '<li><a class="tjp-node" href="'+c.esc(href('study',{subject,section:lesson.id}))+'"><span aria-hidden="true" class="tjp-node-dot">'+(sample && right.has(sample.id)?'✓':'')+'</span><span>'+c.esc(lesson.title)+'</span>'+(badge?'<small>'+badge+'</small>':'')+'</a></li>';
      }).join('')+'</ol></details>').join('')+
      '<p class="tjp-footnote muted">目录按已核过的四科教材排列；内置样例不等于全套教材内容。<a href="#resources">查看全科资料库</a></p></section></div>';
  }
  function sampleMarkup(c,section,tab) {
    const q = catalog.sampleQuestion(section.id), sample = q && catalog.samples[section.id];
    if (!sample) return '';
    if (tab==='practice') {
      return '<article class="panel tjp-sample"><p class="eyebrow">原创样例</p><h2>练一道，看看懂没懂</h2><p>'+c.esc(q.prompt)+'</p>'+
        link(c,'practice',{subject:q.subject,topic:q.topic,id:q.id},'开始这一题','btn primary')+'</article>';
    }
    const math = section.id==='m13-1' ? '<svg class="tjp-diagram" viewBox="0 0 360 110" role="img" aria-label="左边闭合且三个顶点不共线；中间没有接回起点；右边三个点在同一直线上"><g fill="none" stroke="#902452" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 77L55 23L102 77Z" fill="#f3c7dd"/><path d="M132 77L164 23L211 56L194 75"/><path d="M251 63H337"/></g><g fill="#902452"><circle cx="251" cy="63" r="4"/><circle cx="288" cy="63" r="4"/><circle cx="337" cy="63" r="4"/></g><g fill="#542d47" font-size="13" text-anchor="middle"><text x="60" y="99">闭合</text><text x="172" y="99">没闭合</text><text x="293" y="99">三点共线</text></g></svg>' : '';
    return '<article class="panel tjp-sample"><p class="eyebrow">原创样例</p><h2>先理解</h2><p>'+c.esc(sample.concept)+'</p>'+math+
      '<details><summary>看一道例子</summary><p>'+c.esc(sample.example)+'</p></details>'+
      link(c,'study',{subject:section.subject,section:section.id,tab:'practice'},'去做本节题','btn primary')+'</article>';
  }
  function renderLesson(c,section) {
    const tab = c.params.tab==='practice'?'practice':'knowledge', add = window.StudyIntake?.button;
    const base = {subject:section.subject,section:section.id};
    const sample = sampleMarkup(c,section,tab);
    const own = window.StudyIntake?.panel?.(c,{...base,kind:tab})||'';
    const wrong = Object.values(c.state.review || {}).filter(r => r?.question?.section === section.id && r.question.subject===section.subject).sort((a,b)=>Number(!!a.mastered)-Number(!!b.mastered)||String(a.due).localeCompare(String(b.due)));
    return '<div class="tjp-page"><div class="tjp-crumb">'+link(c,'study',{subject:section.subject},'返回 '+section.subject+' 目录','btn')+
      '<span>'+c.esc(section.chapter)+'</span></div><section class="tjp-intro tjp-intro-lesson"><div><p class="eyebrow">'+section.subject+' · 八上</p><h1>'+c.esc(section.title)+'</h1><p>先理解，再练习。卡住时可以回到同一节的知识点。</p></div>'+
      (add?add(c,{...base,label:'＋ 添加',className:'btn primary'}):'')+'</section>'+
      '<div class="tjp-switch" role="group" aria-label="本节资料">'+[['knowledge','知识点'],['practice','练习题']].map(([k,label])=>'<a href="'+c.esc(href('study',{...base,tab:k}))+'"'+(tab===k?' aria-current="page"':'')+' class="btn">'+label+'</a>').join('')+'</div>'+
      (sample||'<div class="tjp-empty"><strong>这节的内置'+(tab==='knowledge'?'知识点':'练习题')+'还没补齐</strong><p>可以点标题旁的「＋添加」，把自己的'+(tab==='knowledge'?'课堂笔记':'课后题')+'存到本节。</p></div>')+
      own+
      (wrong.length?'<section class="panel tjp-review"><div><h2>本节错题</h2><p class="muted">'+wrong.length+' 道，复习结果会更新下次练习时间。</p></div>'+
        link(c,'review',{subject:section.subject,id:wrong[0].question.id},'回看错题')+'</section>':'')+
      '</div>';
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
  function bind(c) {
    const section = route(c);
    if (section) remember(c,c.state,section);
  }
  window.renderCoursePath = render;
  window.bindCoursePath = bind;
})();
