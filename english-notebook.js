(() => {
  "use strict";
  const official = "https://www.pep.com.cn/zslth/yyptzy/czyy/8s/";
  const tabs = [
    ["audio", "🎧 教材原声"],
    ["read", "📖 逐句跟读"],
    ["grammar", "📐 单元语法"],
    ["phrases", "✎ 重点短语"]
  ];
  const units = [
    {
      label: "讲述一次经历", work: 0,
      grammar: [
        ["一般过去时", "有明确的过去时间，用过去式讲已经结束的动作。meet、see 的过去式分别是 met、saw。", "We met by the river after school.", "Yesterday we ___ (see) a boat.", "saw。昨天发生的动作，用一般过去时。"],
        ["过去时间的否定", "用 didn’t + 动词原形，不再把后面的实义动词改成过去式。", "We didn’t see a train.", "We didn’t ___ (stop) at the shop.", "stop。didn’t 已经标明过去。"]
      ],
      phrases: [
        ["at first", "起初", "At first, I did not know the way."],
        ["some fresh air", "一点新鲜空气", "Let’s go outside for some fresh air."],
        ["for a while", "一会儿", "They sat by the river for a while."]
      ]
    },
    {
      label: "介绍我的学习计划", work: 1,
      grammar: [
        ["used to + 动词原形", "说过去常做、现在不一样的事，不要把 used to 后面接成动词的 -ing 形式。", "I used to read my notes again and again.", "I used to ___ (study) late, but now I start earlier.", "study。used to 后接原形。"],
        ["if 条件句", "讲平时的做法，两部分都可以用一般现在时；if 引出的部分表示条件。", "If I get stuck, I check my notes.", "If I ___ (get) stuck, I ask for help.", "get。这里说的是经常怎样做。"]
      ],
      phrases: [
        ["again and again", "反复地", "You do not have to read the note again and again."],
        ["get stuck", "遇到卡住的地方", "If you get stuck, underline the hard part."],
        ["a few days later", "几天以后", "Read the question again a few days later."]
      ]
    },
    {
      label: "询问参观规则", work: 2,
      grammar: [
        ["can + 动词原形", "Can I…? 可礼貌地询问许可。陈述规则时可以用 You can… 或 You can’t…。", "Can I take photos inside?", "Can I ___ (bring) my bag in?", "bring。情态动词 can 后面接原形。"],
        ["开放时间的问法", "be 动词提到主语前，open 在这里作形容词，表示开放。", "Is the museum open on Mondays?", "___ the museum open on Fridays?", "Is。主语是单数，is 放到句首。"]
      ],
      phrases: [
        ["take photos", "拍照", "Can we take photos in this room?"],
        ["from Tuesday to Sunday", "从周二到周日", "The library is open from Tuesday to Sunday."],
        ["turn off the flash", "关闭闪光灯", "Please turn off the flash before taking a photo."]
      ]
    },
    {
      label: "比较两条路线",
      passage: {title:"Two ways to school",lines:["The bus is faster than walking on most mornings.","Walking is quieter, and I can listen to the birds.","On rainy days, I take the bus.","On sunny days, I prefer to walk with my friend."],hint:"对比 faster 和 quieter；试着用 than 比较你熟悉的两种交通方式。"},
      grammar: [
        ["形容词比较级", "比较两者时常用比较级 + than，像 fast 这样常见的短词通常加 -er。", "The bus is faster than walking.", "This road is ___ (short) than that one.", "shorter。short 加 -er。"],
        ["时间介词 on", "on 可以引出具体的某天或某类日子，如 on rainy days。", "On sunny days, I walk to school.", "I walk to school ___ Friday.", "on。Friday 是具体的一天。"]
      ],
      phrases: [["on most mornings","大多数早晨","I read for ten minutes on most mornings."],["take the bus","乘公交车","Let’s take the bus to school."],["prefer to walk","更愿意步行","I prefer to walk when the weather is good."]]
    },
    {
      label: "读懂简单的做法",
      passage: {title:"A fruit bowl",lines:["First, wash an apple and a pear.","Next, cut up the fruit and put it in a bowl.","Then, add two spoonfuls of yogurt.","Finally, mix everything and share it with a friend."],hint:"留意四个顺序词；合上文字后说出四个动作。"},
      grammar: [
        ["祈使句：动作指令", "写步骤时，肯定祈使句常直接以动词原形开头。", "Wash an apple and a pear.", "___ (add) some yogurt.", "Add。指令从动词原形开始。"],
        ["不可数名词的数量", "yogurt 表示食物时常作不可数名词，可以借助 spoonfuls 等量词说具体数量。", "Add two spoonfuls of yogurt.", "two ___ (spoonful) of yogurt", "spoonfuls。two 后接量词的复数形式。"]
      ],
      phrases: [["cut up","切碎；切成小块","Cut up the apple."],["put it in a bowl","把它放进碗里","Put it in a bowl and add yogurt."],["share it with a friend","和朋友一起分享它","I can share it with a friend."]]
    },
    {
      label: "说出周末计划",
      passage: {title:"A weekend project",lines:["I am going to make a poster this weekend.","My classmate is going to draw the pictures.","We are going to write three short tips together.","After lunch, we are going to show it to our family."],hint:"听清 am、is、are 如何随主语变化；说一个你的周末计划。"},
      grammar: [
        ["be going to + 动词原形", "说已经打算做的事时可以用 be going to；be 要和主语一致。", "I am going to make a poster.", "We ___ going to write three tips.", "are。主语 We 要用 are。"],
        ["单数和复数主语", "My classmate 指一个同学，用 is；My classmates 指多个同学，用 are。", "My classmate is going to draw the pictures.", "My classmates ___ going to help.", "are。classmates 是复数。"]
      ],
      phrases: [["make a poster","做一张海报","We are going to make a poster."],["write a short tip","写一条简短小贴士","Please write a short tip for the class."],["show it to someone","把它展示给某人","Can you show it to me?"]]
    },
    {
      label: "预测未来的变化",
      passage: {title:"A quieter school garden",lines:["There will be more plants in our school garden next year.","Some students will measure how fast the beans grow.","Other students will make signs for the paths.","I think the garden will be a quieter place at lunchtime."],hint:"标记 will 后的动词；用一句话预测下一年学校会有什么变化。"},
      grammar: [
        ["will + 动词原形", "will 可用来表达对未来的预测，在它后面用动词原形。", "The garden will be quieter next year.", "The beans will ___ (grow) quickly.", "grow。will 后接动词原形。"],
        ["There will be", "预测未来将出现什么，可用 There will be + 名词。", "There will be more plants.", "There ___ be a new path.", "will。这句话是在预测将有一条新路。"]
      ],
      phrases: [["next year","明年","We will plant more trees next year."],["measure how fast","测量有多快","We can measure how fast the beans grow."],["make signs for","为……制作标牌","Let’s make signs for the paths."]]
    },
    {
      label: "给朋友一条建议",
      passage: {title:"Let us talk it through",lines:["My friend and I wanted to do different things after school.","I asked her why she wanted to stay inside.","She told me that she felt tired after class.","Next time, I should ask how she feels before making a plan."],hint:"从 ask why 到 ask how，练习先理解对方，再给建议。"},
      grammar: [
        ["should + 动词原形", "用 should 给建议，语气通常不如 must 强。", "We should listen first.", "You should ___ (ask) how your friend feels.", "ask。should 后面接原形。"],
        ["间接提问的语序", "why、how 在 asked 后引出从句时，从句用陈述语序：主语在谓语前。", "I asked her why she wanted to stay inside.", "I asked her why ___ (she was / was she) tired.", "she was。间接提问从句不用疑问语序。"]
      ],
      phrases: [["stay inside","待在室内","We can stay inside if it rains."],["feel tired","感到疲倦","I sometimes feel tired after class."],["make a plan","制订计划","Let’s make a plan after we talk."]]
    }
  ];
  const officialUnits = ["Happy Holiday","Home Sweet Home","Same or Different","Amazing Plants and Animals","What a Delicious Meal!","Plan for Yourself","When Tomorrow Comes","Let's Communicate!"];
  function route(ctx) {
    const query = ctx.params ?? {};
    const id = Number(query.unit);
    return {
      unit: Number.isInteger(id) && id > 0 && id <= units.length ? id : 1,
      tab: tabs.some(([key]) => key === query.tab) ? query.tab : "audio"
    };
  }
  const readingContext = (ctx, row) => {
    const work = row.passage ?? ctx.content.english?.[row.work];
    return {...ctx, state:{...ctx.state,page:"english"},content:{...ctx.content,english:work?[work]:[]}};
  };
  function panel(ctx, unit, tab) {
    const {esc} = ctx;
    const row = units[unit - 1];
    if (tab === "read") {
      return `<div class="en-embedded">${window.renderReading(readingContext(ctx,row))}</div>`;
    }
    if (tab === "audio") {
      return `<section class="panel en-card"><span class="pill">人教版 · 官方参考</span>
        <h2>教材原声</h2><p>这里不内置教材录音。确认你用的是人教版八年级上册后，再去出版社页面找对应的 Unit。官方目录收录 Unit 1–8 的听力、语音等音频。</p>
        <p>当前选中的是站内原创 U${unit}「${esc(row.label)}」，与教材同号单元不一一对应。</p>
        <div class="actions"><a class="btn primary" href="${official}" target="_blank" rel="noopener noreferrer">打开人教社八上原声目录</a><button type="button" class="btn" data-en-tab="read">练这一单元的逐句跟读</button></div>
        </section>
        <section class="panel en-card"><h2>怎么找教材录音</h2><ol class="en-audio-guide"><li>在出版社页面找你课本上的单元名称。</li><li>按老师布置的课时选 Section A / B 或 Pronunciation。</li><li>不同教材版本的单元和课时不能混用。</li></ol><details><summary>查看人教社八上目录单元名称</summary><ol class="en-audio-guide">${officialUnits.map(name=>`<li lang="en">${esc(name)}</li>`).join("")}</ol></details></section>`;
    }
    if (tab === "grammar") {
      return `<section class="panel en-card"><span class="pill">原创 U${unit} · ${esc(row.label)}</span><h2>单元语法</h2><div class="en-entries">${row.grammar.map(([name,point,example,quiz,answer])=>`<article class="en-note"><h3>${esc(name)}</h3><p>${esc(point)}</p><p class="en-example" lang="en">${esc(example)}</p><div class="en-quiz"><strong>试一题</strong><p lang="en">${esc(quiz)}</p><details><summary>对照答案</summary><p>${esc(answer)}</p></details></div></article>`).join("")}</div></section>`;
    }
    return `<section class="panel en-card"><span class="pill">原创 U${unit} · ${esc(row.label)}</span><h2>重点短语</h2><p class="muted">先想它适用的情景，再看例句，用这个短语说一句自己的话。</p><div class="en-entries">${row.phrases.map(([phrase,meaning,example])=>`<article class="en-note"><h3 lang="en">${esc(phrase)}</h3><p>${esc(meaning)}</p><details><summary>看例句</summary><p class="en-example" lang="en">${esc(example)}</p></details></article>`).join("")}</div></section>`;
  }
  window.renderEnglishNotebook = ctx => {
    const {unit,tab} = route(ctx);
    return `<section class="en-notebook" aria-label="英语单元手账">
      <div class="en-intro"><p class="eyebrow">abc · 八上英语</p><h1>英语单元手账</h1>
        <p class="muted">教材原声参考、逐句跟读、单元语法和重点短语。本站提供 8 个原创主题单元，不代替学校的教材。</p></div>
      <div class="en-unit-list" role="group" aria-label="切换主题单元">${units.map((row,i)=>`<button type="button" class="btn ${i+1===unit?"primary":""}" data-en-unit="${i+1}" aria-label="U${i+1} ${ctx.esc(row.label)}" aria-pressed="${i+1===unit}">U${i+1}</button>`).join("")}</div>
      <p class="en-unit-label">原创 U${unit} · ${ctx.esc(units[unit-1].label)}</p>
      <div class="en-view-list" role="group" aria-label="切换英语学习功能">${tabs.map(([id,label])=>`<button type="button" data-en-tab="${id}" class="btn ${id===tab?"primary":""}" aria-pressed="${id===tab}">${label}</button>`).join("")}</div>
      <div class="en-pane">${panel(ctx,unit,tab)}</div>
    </section>`;
  };
  window.bindEnglishNotebook = ctx => {
    const {unit,tab} = route(ctx);
    const shell = ctx.root.querySelector(".en-notebook");
    if (!shell) return;
    shell.onclick = ev => {
      const btn = ev.target.closest("button[data-en-unit],button[data-en-tab]");
      if (!btn || !shell.contains(btn)) return;
      const nextUnit = Number(btn.dataset.enUnit) || unit;
      const nextTab = btn.dataset.enTab ?? tab;
      if (nextUnit === unit && nextTab === tab) return;
      ctx.go("english",{unit:nextUnit,tab:nextTab});
    };
    if (tab === "read") window.bindReading(readingContext(ctx,units[unit-1]));
    else window.cleanupReading?.();
  };
})();
