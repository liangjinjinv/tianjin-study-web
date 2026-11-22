(() => {
  'use strict';
  const CURRICULA = 'https://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html';
  const SMART = 'https://basic.smartedu.cn/';
  const PEP = 'https://www.pep.com.cn/zslth/yyptzy/czyy/8s/';
  const FLTRP = 'https://www.fltrp.com/fltrp/ui/catalog/15266/pc/index_15.shtml';
  const zhDay = new Intl.DateTimeFormat('sv-SE', {
    timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit'
  });
  const dateString = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10)===s;
  const calendarDay = (ctx) => {
    try {
      const value = typeof ctx.day === 'function' ? ctx.day() : ctx.day;
      if (dateString(value)) return value;
    } catch (_) {}
    return zhDay.format(new Date());
  };
  const formatScore = value => Number(value).toLocaleString('zh-CN',{maximumFractionDigits:2});
  const toDate = s => new Date(s + 'T00:00:00Z');
  const offsetDate = (s, n) => {
    const dt = toDate(s);
    dt.setUTCDate(dt.getUTCDate() + n);
    return dt.toISOString().slice(0,10);
  };
  const md = d => (d || '').slice(5).replace('-', '/');
  const filterAttempt = a => a && a.kind === 'initial' && typeof a.correct === 'boolean' && dateString(a.at);
  const earliestAttempts = state => {
    const seen = new Set();
    return (state.attempts || []).filter(filterAttempt).map((a,i) => [a,i])
      .sort(([a, ai],[b, bi]) => a.at.localeCompare(b.at) || ai - bi)
      .map(([a]) => a).filter(a => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });
  };
  const summary = list => {
    const n = list.length;
    const right = list.filter(a=>a.correct).length;
    return {n,right,wrong:n-right,rate:n ? Math.round(right/n*100) : 0};
  };
  function selectSubjects(ctx, emptyLabel) {
    return (emptyLabel ? '<option value="">' + ctx.esc(emptyLabel) + '</option>' : '') +
      ctx.content.subjects.map(s => '<option>' + ctx.esc(s.name) + '</option>').join('');
  }
  function actionButton(ctx, label, page, subject, topic, prime) {
    const e = ctx.esc;
    return '<button type="button" class="btn'+(prime?' primary':'')+'" data-tji-go="'+e(page)+'"' +
      (subject?' data-tji-subject="'+e(subject)+'"':'') +
      (topic?' data-tji-topic="'+e(topic)+'"':'')+'>'+e(label)+'</button>';
  }
  const link = (url, text, description) => ({url,text,description});
  const official = [
    link(CURRICULA,'义务教育课程方案和课程标准（2022 年版）','教育部发布的课程标准。适合核对学习范围，不是天津考试题库或分值说明。'),
    link(SMART,'国家中小学智慧教育平台','按学段、学科和教材版本查找官方学习资源。先与实际使用的课本核对。'),
    link(PEP,'人教社八年级上册英语听力','出版社提供的对应版本栏目。仅在你使用的教材版本一致时选用。'),
    link(FLTRP,'外研社八年级上册同步练习册听力','对应同步练习册的官方听力入口，不等同于课本原文音频。')
  ];
  const known = [CURRICULA,SMART,PEP,FLTRP];

  function profile(ctx) {
    const e = ctx.esc;
    const {state,content} = ctx;
    const today = calendarDay(ctx);
    const subjects = new Set(content.subjects.map(s=>s.name));
    const attempts = earliestAttempts(state).filter(a=>subjects.has(a.subject));
    const scores = (state.scores || []).filter(x=>x && subjects.has(x.subject) && dateString(x.date) &&
      Number.isFinite(x.max) && Number.isFinite(x.earned) && x.max>0 && x.earned>=0 && x.earned<=x.max);
    const review = Object.values(state.review || {}).filter(Boolean);
    const tracked = attempts.reduce((acc,a) => {
      const topic = typeof a.topic === 'string' && a.topic.trim() ? a.topic : '未标知识点';
      const key = JSON.stringify([a.subject,topic]);
      if (!acc.has(key)) acc.set(key,{subject:a.subject,topic,list:[]});
      acc.get(key).list.push(a);
      return acc;
    }, new Map());
    const topics = [...tracked.values()].map(x=>({...x,...summary(x.list)}))
      .sort((a,b)=>b.wrong-a.wrong || a.rate-b.rate || a.subject.localeCompare(b.subject,'zh-CN'));
    const weaker = topics.filter(x=>x.n>=3 && x.wrong>0 && x.topic!=='未标知识点').slice(0,6);
    const insufficient = topics.filter(x=>x.n<3 && x.wrong>0 && x.topic!=='未标知识点').slice(0,3);
    const ordered = [...scores].sort((a,b)=>b.date.localeCompare(a.date) || Number(b.created||0)-Number(a.created||0));
    const totals = summary(attempts);
    const allSummary = content.subjects.map(s=>{
      const p = summary(attempts.filter(a=>a.subject===s.name));
      const score = ordered.find(x=>x.subject===s.name);
      const rate = score?Math.round(score.earned/score.max*100):null;
      const band = rate===null?'none':rate>=90?'strong':rate>=75?'growing':'focus';
      return '<li><div class="tji-donut '+band+'" style="--tji-score:'+(rate??0)+'%" aria-hidden="true"><strong>'+(rate===null?'—':rate+'%')+'</strong></div>' +
        '<b>'+e(s.name)+'</b><span class="muted">'+(score?e(formatScore(score.earned)+'/'+formatScore(score.max)+' 分 · '+md(score.date)+' · 得分率 '+rate+'%'):'未登记校内分数')+'</span>'+
        (p.n?'<small class="muted">练习 '+p.right+'/'+p.n+' 首次答对</small>':'')+'</li>';
    }).join('');
    const weakRows = list => list.map(x=>'<li><div><b>'+e(x.subject)+' · '+e(x.topic)+'</b><small class="muted">'+x.right+'/'+x.n+' 题首次答对'+
       (x.n<3?' · 样本不足':' · '+x.wrong+' 题首次答错')+'</small></div>'+actionButton(ctx,'专项练习','practice',x.subject,x.topic)+'</li>').join('');
    const weeks=Array.from({length:4},(_,i)=>{
      const endOffset=(3-i)*7;
      return {start:offsetDate(today,-endOffset-6),end:offsetDate(today,-endOffset)};
    });
    const heat = list => {
      const x=summary(list), band=!x.n?'none':x.n<3?'pending':x.rate>=80?'solid':x.rate>=60?'growing':'focus';
      const note=!x.n?'未练习':x.n<3?x.right+'/'+x.n+'，样本不足':x.right+'/'+x.n+'，正确率 '+x.rate+'%';
      return '<td><span class="tji-heat '+band+'" title="'+e(note)+'" aria-label="'+e(note)+'">'+(!x.n?'—':x.right+'/'+x.n)+'</span></td>';
    };
    const matrixTopics=topics.filter(x=>x.topic!=='未标知识点'&&x.list.some(a=>a.at>=weeks[0].start&&a.at<=today));
    const topicRows=matrixTopics.map(x=>'<tr><th scope="row">'+e(x.subject)+'<br>'+e(x.topic)+'</th>'+
      weeks.map(w=>heat(x.list.filter(a=>a.at>=w.start&&a.at<=w.end))).join('')+'</tr>').join('');
    const trends=content.subjects.map(s=>{
      const dates=new Set();
      const series=ordered.filter(x=>{
        if (x.subject!==s.name||dates.has(x.date)) return false;
        dates.add(x.date);return true;
      }).slice(0,6).reverse();
      if(series.length<2)return '';
      return '<details class="tji-trend" open><summary>'+e(s.name)+' · 最近 '+series.length+' 次</summary><ul class="tji-list tji-loss-list">'+series.map(x=>{
        const lost=x.max-x.earned, pct=Math.round(lost/x.max*1000)/10;
        return '<li><div><b>'+e(md(x.date)+(x.title?' · '+x.title:''))+'</b><small class="muted">失分 '+e(formatScore(lost))+'/'+e(formatScore(x.max))+' 分</small></div>'+
          '<progress aria-label="失分率 '+pct+'%" max="100" value="'+pct+'">'+pct+'%</progress><strong>'+pct+'%</strong></li>';
      }).join('')+'</ul></details>';
    }).filter(Boolean);
    const stat = totals.n>=3 ? totals.rate+'%' : '—';
    return '<div class="tji-page tji-profile"><div class="hero tji-hero"><p class="eyebrow">学习回顾</p><h1><span aria-hidden="true">📊 </span>全科个性化学习画像</h1><p>看校内测评得分、定位薄弱知识点，再练对应题目。分数与练习数据分别统计，不作提分预测。</p></div>'+
      '<div class="tji-split tji-profile-split"><section class="panel"><h2>各科得分率（环形图）</h2><p class="muted">每科取最近一次手动登记的校内测评；未登记不计分。首次答对另列，不能代替测评分数。</p><ul class="tji-rate-grid">'+allSummary+'</ul></section>'+
      '<section class="panel"><h2>薄弱知识点</h2><p class="muted">按知识点的首次错题数排序，只反映已做过的题。</p>'+
      (weaker.length?'<ul class="tji-list">'+weakRows(weaker)+'</ul>':'<p class="tji-empty">暂时没有足够的记录判断薄弱项。每个知识点至少练 3 道不同题才纳入排序。</p>')+
      (insufficient.length?'<h3>待确认</h3><ul class="tji-list">'+weakRows(insufficient)+'</ul>':(!totals.n?actionButton(ctx,'开始练习','practice','','',true):''))+'</section></div>'+
      '<div class="tji-split tji-profile-split"><section class="panel"><h2>知识点热力矩阵</h2><p class="muted">最近 28 天按每 7 天一组显示首次答对 / 作答数。不足 3 道题标为样本不足，未练显示「—」。</p>'+
      (topicRows?'<div class="tji-table tji-matrix" tabindex="0" role="region" aria-label="知识点热力矩阵"><table><thead><tr><th scope="col">学科 / 知识点</th>'+weeks.map(w=>'<th scope="col">'+md(w.start)+'–'+md(w.end)+'</th>').join('')+'</tr></thead><tbody>'+topicRows+'</tbody></table></div>'+
      '<p class="tji-key muted"><span class="tji-heat focus">低于 60%</span><span class="tji-heat growing">60–79%</span><span class="tji-heat solid">80–100%</span><span class="tji-heat pending">样本不足</span></p>':'<p class="tji-empty">练过的知识点会在这里出现。</p>')+
      '</section><section class="panel"><h2>失分趋势（按科目）</h2><p class="muted">按登记日期展示校内失分率＝失分 ÷ 满分。试卷难度不同，不能据此直接判断进步或退步。</p>'+
      (trends.length?trends.join(''):'<p class="tji-empty">同一学科登记至少两个不同日期的测评后，这里才显示趋势。</p>')+'</section></div>'+
      '<div class="tji-stat-grid"><div class="panel"><span class="muted">首次练习</span><strong>'+totals.n+'<small> 题</small></strong></div>'+
      '<div class="panel"><span class="muted">首次练习正确率</span><strong>'+stat+'</strong><span class="muted">'+(totals.n<3?'至少需 3 道不同题':'不含重做')+'</span></div>'+
      '<div class="panel"><span class="muted">待巩固知识题</span><strong>'+review.filter(r=>!r.mastered).length+'<small> 题</small></strong></div></div>'+
      '<section class="panel"><h2>校内测评记录</h2><p class="muted">手动登记实际分数，只保存在当前浏览器。校内分数与应用练习正确率分开统计，不做提分预测。</p>'+
      '<form class="tji-form" data-tji-score><label>学科<select name="subject" required>'+selectSubjects(ctx,'选择学科')+'</select></label>'+
      '<label>日期<input type="date" name="date" required value="'+e(today)+'" max="'+e(today)+'"></label>'+
      '<label>测评名称（选填）<input name="title" maxlength="40" placeholder="如：期中测评"></label>'+
      '<label>实际得分<input type="number" step="0.01" min="0" max="1000" name="earned" required placeholder="例如 75"></label>'+
      '<label>试卷满分<input type="number" step="0.01" min="0.01" max="1000" name="max" required placeholder="例如 80"></label>'+
      '<button class="btn primary" type="submit">登记分数</button><span class="tji-form-status" role="status" aria-live="polite"></span></form>'+
      (ordered.length?'<ul class="tji-list">'+ordered.map(x=>'<li><div><b>'+e(x.subject)+(x.title?' · '+e(x.title):'')+'</b><small class="muted">'+e(x.date)+'</small></div><strong>'+
        e(formatScore(x.earned)+' / '+formatScore(x.max)+' 分')+'</strong><small class="muted">本次失分 '+e(formatScore(x.max-x.earned))+'</small></li>').join('')+'</ul>':'<p class="tji-empty">还没有登记校内分数。</p>')+
      '</section></div>';
  }

  function subjects(ctx) {
    const e = ctx.esc;
    const questions = ctx.content.questions || [];
    return '<div class="tji-page"><div class="hero tji-hero"><p class="eyebrow">按科复习</p><h1>学科地图</h1><p>掌握一个做题方法，再找同类型题亲手练一遍。</p></div>'+
      '<div class="tji-subject-grid">'+ctx.content.subjects.map(s=>{
        const count = questions.filter(q=>q.subject===s.name).length;
        const method = Array.isArray(s.method)?'<ol>'+s.method.map(m=>'<li>'+e(m)+'</li>').join('')+'</ol>':'<p>'+e(s.method || '')+'</p>';
        const res=s.resource;
        return '<section class="panel tji-subject"><div><span class="tji-icon" aria-hidden="true">'+e(s.icon || s.name.slice(0,1))+'</span>'+
          '<h2>'+e(s.name)+'</h2><span class="tji-badge">'+(count?count+' 道示例':'资料入口')+'</span></div><p>'+e(s.tip || '')+'</p>'+
          '<details><summary>展开答题方法</summary><div class="tji-method">'+method+
          (res&&typeof res==='object'&&known.includes(res.url)?'<p><a href="'+e(res.url)+'" target="_blank" rel="noopener noreferrer">'+e(res.title || '参考来源')+'</a></p>':
            typeof res==='string'&&known.includes(res)?'<p><a href="'+e(res)+'" target="_blank" rel="noopener noreferrer">查阅官方资源</a></p>':typeof res==='string'&&!/^https?:/.test(res)?'<p class="muted">'+e(res)+'</p>':'')+
          (s.name==='道法'?'<p class="muted">答题方法不代表天津开卷或闭卷规定；请以对应年份公告为准。</p>':'')+
          '</div></details><div class="tji-actions">'+actionButton(ctx,'开始练习','practice',s.name,'',true)+
          (s.name==='语文'?actionButton(ctx,'古诗文','poems'):'')+
          (s.name==='英语'?actionButton(ctx,'听力跟读','english'):'')+'</div></section>';
      }).join('')+'</div></div>';
  }

  function resources(ctx) {
    const e = ctx.esc;
    return '<div class="tji-page"><header class="hero tji-hero si-hero"><div><p class="eyebrow">按科目收纳 · 不上传</p><h1>全科资料库</h1><p>知识点、练习题、错题，都从这里添加。选好科目，保存后自动归档。</p></div>'+
      window.StudyIntake.button(ctx)+'</header>'+window.StudyIntake.archive(ctx)+
      '<details class="panel si-sources"><summary>查看官方资料与来源说明</summary><div class="tji-split"><section><h2>官方资料入口</h2><ul class="tji-list tji-resource-links">'+official.map(r=>
        '<li><div><a href="'+e(r.url)+'" target="_blank" rel="noopener noreferrer">'+e(r.text)+'</a><small class="muted">'+e(r.description)+'</small></div></li>').join('')+
      '</ul></section><section><h2>怎么看来源标签</h2><dl class="tji-definition"><dt>自编练习</dt><dd>用于熟悉概念和答题方法，不是真题，也不是官方评分口径。</dd>'+
      '<dt>官方链接</dt><dd>仅提供查阅入口，不搬运受保护的教材、试卷或音频。</dd><dt>我的私有资料</dt><dd>照片和学习记录不会进入公共题库，也不会同步到其他设备。请避免拍入姓名、学号等个人信息。</dd></dl></section></div></details></div>';
  }

  window.renderInsights = ctx => ({
    profile, subjects, resources
  }[ctx.state.page] || subjects)(ctx);

  window.bindInsights = ctx => {
    const {root,state} = ctx;
    root.querySelectorAll('[data-tji-go]').forEach(b=>b.addEventListener('click', ()=>{
      const {tjiGo:page,tjiSubject:subject,tjiTopic:topic}=b.dataset;
      ctx.go(page,{...(subject?{subject}:{}),...(topic?{topic}:{})});
    }));
    function bindForm(selector, process) {
      const f = root.querySelector(selector);
      if (!f) return;
      f.addEventListener('submit', async event=>{
        event.preventDefault();
        const status=f.querySelector('[role="status"]');
        const button=f.querySelector('button[type="submit"]');
        if (button.disabled) return;
        status.textContent='';
        const data = Object.fromEntries(new FormData(f));
        if (!ctx.content.subjects.some(s=>s.name===data.subject)) {
          status.textContent='请选择有效的学科。'; return;
        }
        const outcome=process(data);
        if (typeof outcome==='string') {status.textContent=outcome;return;}
        const {key,record}=outcome;
        const previous=state[key];
        state[key]=[...(previous||[]),record];
        button.disabled=true;
        try {
          const result = await ctx.save();
          if (result===false) throw new Error('Storage unavailable');
          if(!f.isConnected)return;
          ctx.render();
          const next = root.querySelector(selector+' [role="status"]');
          if (next) next.textContent=key==='scores'?'分数已登记。':'笔记已保存。';
        } catch (_) {
          state[key]=(state[key]||[]).filter(item=>item!==record);
          button.disabled=false;
          status.textContent='尚未保存，内容还在。请检查本机空间后重试。';
        }
      });
    }
    bindForm('[data-tji-score]', data=>{
      const earned=Number(data.earned), max=Number(data.max), title=data.title.trim();
      if (!data.earned.trim() || !data.max.trim() || !Number.isFinite(earned)||!Number.isFinite(max)||max<=0||max>1000||earned<0||earned>max) {
        return '实际得分须在 0 与试卷满分之间。';
      }
      if (!dateString(data.date) || !Number.isFinite(+toDate(data.date)) || toDate(data.date).toISOString().slice(0,10)!==data.date || data.date>calendarDay(ctx)) return '请选择有效的测评日期。';
      return {key:'scores',record:{subject:data.subject,earned,max,date:data.date,title,created:Date.now()}};
    });
  };
})();
