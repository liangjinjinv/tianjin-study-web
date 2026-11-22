"use strict";
(() => {
  const points=20;
  const raw={
    "语文":["📖","古诗文跟读与现代文阅读","背诵 · 阅读表达","先任选一段古诗文跟读，再用原文证据回答一道现代文问题。"],
    "数学":["📐","函数模型与应用题","函数 · 实际应用","把题目里的数量关系写成式子，最后回到题目检查答案。"],
    "英语":["🔤","听力与课文逐句跟读","听读 · 语法 · 短语","先听一遍抓大意，再逐句跟读；不必每个词都立刻听清。"],
    "物理":["⚛️","实验读数与解题","实验 · 量和单位","先看仪器量程、分度值和单位，再写证据和结论。"],
    "化学":["🧪","九年级预习 · 化学入门","预习 · 不计入八年级今日任务","这里只供选读，不计入八年级今日任务。先认识化学式，再初步接触方程式和质量守恒。"],
    "生物":["🧬","生物会考 · 专题与实验","结构 · 对照实验","从细胞结构和光合作用开始，练习从对照组和实验现象中提取证据。"],
    "地理":["🌍","地理会考 · 图表与区位","比例尺 · 等高线 · 天津区位","读完图名、图例和单位，再按题目要求比较或解释。"],
    "历史":["📜","时间轴 / 重大事件 / 答题技巧","时间轴 · 材料题","按时间把事件串起来，再用史实判断材料支持什么结论。"],
    "道法":["⚖️","初中道法 · 三段式 / 辨析题","审题 · 联系材料 · 采分","从题目要求出发，练习观点、依据与做法；不是每道题都需要写三段。"],
    "体育":["🏃","运动节奏与训练记录","热身 · 节奏 · 不估算考试分数","根据学校指导练习，先热身再记录。身体不适时停下来，不必凑打卡。"]
  };
  const meta=Object.freeze(Object.fromEntries(Object.entries(raw).map(([k,[icon,title,tag,description]])=>[k,{icon,title,tag,description,points:k==="化学"?0:points}])));
  const historyEvents=[
    ["1840—1842","鸦片战争与《南京条约》","清政府战败后签订《南京条约》；记住战争和条约的名称，再从割地、开放通商口岸等角度分析影响。"],
    ["1856—1860","第二次鸦片战争","英法联军攻入北京，圆明园遭焚毁；对照第一次鸦片战争，归纳列强侵略范围怎样扩大。"],
    ["1894—1895","甲午中日战争与《马关条约》","用战争结果连接条约内容，进一步说明列强对华经济侵略方式的变化。"],
    ["1900—1901","八国联军侵华与《辛丑条约》","区分入侵发生的时间与条约签订的年份，材料题可从赔款及对清政府的控制切入。"],
    ["1911—1912","辛亥革命与中华民国建立","把武昌起义、中华民国临时政府成立、清帝退位排成先后顺序，不把它们都记成同一年。"],
    ["1919","五四运动","从外交背景、学生发起、工人等群体参与三个层面梳理，区分导火线、过程和意义。"]
  ];
  const historyTabs=[
    ["time","📅 时间轴","把近代史事件排成一条线",historyEvents.map(([date,title,desc])=>[date,title,desc])],
    ["events","🏛 重大事件","每张卡抓住史实与变化",historyEvents.map(([date,title,desc])=>[title,date,desc])],
    ["errors","⚠ 易错题","做题前先辨清这几组关系",[
      ["不要混淆","战争年份和条约年份","如问《马关条约》签订时间，应答 1895 年，而不是甲午战争开始的 1894 年。"],
      ["不要倒置","事件和历史影响","先交代具体事实，再解释它怎样造成变化，不能把后果写成事件背景。"],
      ["不要过度推断","材料说了什么、没说什么","一段口述回忆可以反映当事人的经历，但不能直接证明所有地方都一样。"]
    ]],
    ["skill","✍ 答题技巧","材料题怎么找采分点",[
      ["找线索","圈出时间、人物和地点","先判断时期，再回到设问确认需回答原因、变化还是影响。"],
      ["列证据","让史实支撑观点","每个判断都配一条可核对的材料信息或史实。"],
      ["写影响","主体＋变化","不要只写“影响很大”，要写清哪个群体或制度发生了怎样的变化。"]
    ]],
    ["search","⌕ 资料检索","在本地历史速查卡中找关键词",[]]
  ];
  const moralTabs=[
    ["three","📖 三段式答题","先读设问，再按需要组织答案",[
      ["1 · 定观点","是什么","用一个准确的概念回答题目。例如问“体现何种责任”，不要先写一段空泛评价。"],
      ["2 · 用依据","为什么","指出材料中的具体行为，再解释它为什么能支撑你的判断。"],
      ["3 · 给做法","怎么办","只有题目问做法、启示或建议时才写。交代谁做、做什么和怎么做。"]
    ]],
    ["judge","⚖ 辨析题","判断、说明、补全",[
      ["拆开观点","观点里哪一部分成立？","把绝对化表述拆成可分别判断的主张，如先区分“可以”与“只能”。"],
      ["给出理由","用概念解释适用条件","说明哪些条件下成立，再指出忽略了什么。"],
      ["补完整","给出更准确的观点","不要只重复“片面”，把条件和结论写成可独立理解的一句话。"]
    ]],
    ["search","⌕ 关键词检索","在本道法速查卡中检索",[]],
    ["points","✓ 采分规范","答完用三条检查",[
      ["看动词","说明、分析和建议不是同一种回答","用题目要求来决定写概念、理由还是做法。"],
      ["对材料","每条理由都能指回材料","可用一句“材料中……说明……”检查自己有没有把概念和行为连起来。"],
      ["分条写","一条表达一个独立要点","同义句不算新要点；先写最贴题的，再补其他维度。"]
    ]]
  ];
  const subjectTabs={
    "语文":[
      ["recite","📜 古诗文","先读顺，再遮住原文回想",[
        ["《三峡》","用景物串起段落","先找两岸的山势，再看不同季节的江水。试着用“山势—夏水—春冬—秋景”提示自己复述。","@poems"],
        ["文言词义","把解释代回原句","先猜这个词在句中的意思，再读整句看是否通顺。不要只背单个词的现代义。","cn02"]]],
      ["read","✍ 现代文阅读","先找证据，再写分析",[
        ["作用题","数字具体表现了什么","答列数字时，说明这组数字比较了什么，体现了对象哪项特点，而不是只写“准确”。","cn01"],
        ["语句赏析","表现效果要贴语境","先指出词句的具体写法，再写它把什么形象或情绪表现得更明显。","@guide"]]],
      ["practice","◎ 学科练习","本页练习可直接自评",[
        ["说明文","效果题自评","答案至少包含一个具体对象和一个可核对的特点。","cn03"]]]
    ],
    "数学":[
      ["function","📈 函数专题","先描述变量，再写关系",[
        ["坐标","同一条直线上的点","斜率表示自变量每增加 1 时因变量的改变量，截距对应自变量为 0 时的函数值。","math01"],
        ["取值","数学答案要符合题意","时间、瓶数等量有实际限制。解出数值后，把它放回题目验算。","math02"]]],
      ["example","✎ 典型应用题","把题意画成表，再列式",[
        ["数量关系","总费用可以拆成固定费＋每份费用","例如固定费 8 元、每本 3 元，买 x 本的总价为 8＋3x 元。总价给定时先列方程，再判断本数是不是整数。","math02"]]],
      ["errors","⚠ 易错整理","检查坐标、符号和单位",[
        ["常见漏步","判断交点时要令同一个 x 对应的 y 相等","不能直接把图上两条线的数字相加；解出 x 后代回求 y。","math01"]]]
    ],
    "英语":[
      ["listen","🎧 听力与跟读","先听主旨，再跟着停顿读",[
        ["跟读","把长句分成几个意思完整的小组","第一遍只听在讲谁、做了什么；第二遍跟读，再回放自己的录音做对比。","@english"]]],
      ["grammar","📚 语法","根据时间线索选择时态",[
        ["叙事","区分习惯和已发生的事","usually 常用于描述习惯；last weekend 提醒你叙述过去已经发生的动作。","@english"]]],
      ["phrases","🔤 重点短语","搭配放回完整句子里记",[
        ["语境","看到生词先用上下文缩小范围","先看词在句里是动作还是事物，再结合后一句有没有解释、例子或转折。","en01"],
        ["观点","用 because 给观点补一个具体理由","先说你赞成什么，再用一个事实或场景解释。","en02"]]]
    ],
    "物理":[
      ["formula","⚛ 公式速查","代公式之前先写共同单位",[
        ["速度","路程和时间必须对应同一段运动","平均速度等于总路程除以总时间。不是简单把两段速度相加再除以二。","phy01"]]],
      ["experiment","🧰 实验与读数","一次只改变一个比较条件",[
        ["分度值","先辨认两条数字刻度之间分了几格","用两处已知刻度的差除以间隔数，再从指针所在处读数，记录单位。"],
        ["控制变量","选两组其他条件一致的测量结果","用同一把仪器、相同起点和记录方式比较，结果才容易说明问题。","phy02"]]],
      ["errors","⚠ 易错提醒","定量题读完再核对单位",[
        ["单位","把分钟换成秒再代入 SI 单位","60 m 用时 2 min，要把 2 min 换为 120 s，速度是 0.5 m/s。","phy01"]]]
    ],
    "化学":[
      ["notation","🧪 化学用语","先识别化学式中的数字",[
        ["原子个数","区分右下角数字和式子前面的系数","2H₂O 表示两个水分子，一共有 4 个氢原子、2 个氧原子。"]]],
      ["equation","✎ 方程式","先写正确物质，再配平",[
        ["配平","只改系数，不改下标","左右逐种元素清点原子数，配平后再看有没有遗漏反应条件。","chem02"]]],
      ["experiment","⚖ 质量守恒","先明确称量系统的边界",[
        ["称量","气体逸出会影响天平读数","不是质量不守恒，而是称量时有反应产物离开了原来计算的范围。","chem01"]]]
    ],
    "生物":[
      ["concept","🧬 核心概念","对照同类结构与功能",[
        ["细胞结构","植物细胞通常有细胞壁","叶绿体与光合作用有关，但不是每一个植物细胞都有叶绿体。","bio01"],
        ["生态关系","按能量流向读食物链","箭头由被取食者指向取食者。先检查链条是不是从生产者开始。","bio05"]]],
      ["experiment","🧫 实验探究","把变量、条件和结果写成三栏",[
        ["光合作用","同一片叶的见光和遮光部分作对照","其他处理一致时，比较两部分淀粉检测结果，判断光照的作用。","bio03"],
        ["方案设计","萌发实验只改变要研究的变量","比较温度影响时，让种子数量、品种和供水等条件保持一致，记录相同时间的发芽率。","bio07"]]],
      ["diagram","◉ 图表辨识","先读标题，再看标注和箭头",[
        ["显微镜","物镜倍数升高，观察范围通常缩小","如果换高倍物镜后目标不在视野里，先回到低倍找目标并移到中央。","bio02"],
        ["数据图","样方数据不是整个池塘的精确总数","先写清测量范围与抽样方法，再解释趋势能支持什么结论。","bio08"]]]
    ],
    "地理":[
      ["map","🗺 地图与等高线","读地图先找比例尺和方向",[
        ["比例尺","图上厘米和实地距离用同一单位","图上 2 cm、比例尺 1∶100 000，对应 200 000 cm，也就是 2 km。","geo01"],
        ["地形","相同等高距时，看等高线的疏密","同一张图上，等高线越密，坡度通常越陡；比较前先确认比例尺相同。","geo03"]]],
      ["coordinate","⌖ 经纬网与方位","先读南北纬，再判断东西半球",[
        ["经纬网","赤道以北为北纬","东、西半球以 20°W 和 160°E 为分界，不是简单按东经和西经划分。","geo02"],
        ["方位","从参照点判断另一个点的方向","有指向标或经纬网时以图上方向信息为准，不直接套用上北下南。","geo06"]]],
      ["climate","☁ 气候与区域","从数值和当地条件提取证据",[
        ["读表","比较比例先定分子和分母","计算连续三个月降水量所占比例时，分子是这三个月合计，分母是全年降水量。","geo05"],
        ["天津区位","解释一个区位条件怎样产生影响","写出“濒临渤海”后，再说明它怎样连通海上交通。","geo04"]]]
    ],
    "体育":[
      ["prep","🏃 训练准备","按学校指导安排训练",[
        ["开始前","先活动关节，再逐步加快节奏","把准备活动和正式练习分开记录。遇到疼痛或明显不适及时暂停。"]]],
      ["record","📝 记录与复盘","只记录能帮助下次调整的指标",[
        ["分段","记录时间与每段主观感受","同一项目尽量使用相同距离和记录方式，再比较分段节奏。","pe01"],
        ["动作","一次只调整一个动作线索","例如先观察落地是否稳定。调整后再记录改善与否。","pe02"]]]
    ]
  };
  function sequence(tabs,order){return order.map(key=>tabs.find(t=>t[0]===key)).filter(Boolean);}
  const path={
    "语文":"读原文 → 读懂与定位 → 独立表达",
    "数学":"读例题 → 独立做变式 → 解释错因",
    "英语":"听主旨 → 跟读语块 → 联系情境练表达",
    "物理":"先观察 → 找变量与测量 → 解释并应用",
    "化学":"认识用语 → 会看方程式 → 初步理解质量守恒",
    "生物":"理解概念 → 看图 → 从实验找证据 → 独立练习",
    "地理":"定位 → 读图例与数据 → 比较解释 → 独立练习",
    "历史":"按时间定位 → 根据史料取证 → 解释原因与影响",
    "道法":"看设问 → 定观点 → 找依据 → 有要求再写做法",
    "体育":"热身准备 → 按指导练习 → 记录复盘"
  };
  subjectTabs["数学"]=sequence(subjectTabs["数学"],["example","function","errors"]);
  subjectTabs["数学"][1][1]="📈 独立变式";
  subjectTabs["物理"]=sequence(subjectTabs["物理"],["experiment","formula","errors"]);
  subjectTabs["物理"][0][1]="🧰 观察与实验";
  subjectTabs["物理"][0][3].unshift(["先观察","同一路段，两辆小车用时不同","先说清现象：测量起点和终点相同，比较到达终点用时。不先猜是斜面角度或小车重量造成的。"]);
  subjectTabs["生物"]=sequence(subjectTabs["生物"],["concept","diagram","experiment"]);
  subjectTabs["生物"].push(["practice","◎ 独立练习","不看速查答案，先自己解释",[
    ["迁移练习","实验条件变了，结论还能成立吗？","先找比较的组别，再写控制的条件；作答后回到实验页检查证据。","bio07"]
  ]]);
  subjectTabs["地理"]=sequence(subjectTabs["地理"],["coordinate","map","climate"]);
  subjectTabs["地理"][1][1]="🗺 图例、比例尺与数据";
  subjectTabs["地理"][1][3].unshift(["图例","先确认符号和颜色代表什么","面积颜色可能表示海拔，也可能表示人口密度。先读图例和单位，再比较。"]);
  subjectTabs["地理"].push(["practice","◎ 独立练习","用材料中的数据或事实解释",[
    ["迁移练习","回答区域差异时写出依据","作答时先引用材料信息，再说明它与题目所问现象的关系。","geo08"]
  ]]);
  const historySequence=sequence(historyTabs,["time","skill","events","errors","search"]);
  historySequence[1][1]="✍ 史料与答题技巧";
  const choices=new Map();
  const opened=new Map();
  const terms=new Map();
  const current=c=>c.content.subjects.find(x=>x.name===c.params.subject)||c.content.subjects[0];
  const goto=(c,subject,link)=>link==="practice"?c.go("practice",{subject}):c.go(link,{});
  const tabdata=s=>s==="历史"?historySequence:s==="道法"?moralTabs:subjectTabs[s]||null;
  function matches(cards,q) {
    const tokens=q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return cards.filter(row=>tokens.every(t=>row.join(" ").toLocaleLowerCase().includes(t)));
  }
  function cardsHtml(c,cards){
    return cards.map(([tag,title,desc,link])=>`<article class="sn-info"><span class="sn-item-tag">${c.esc(tag)}</span><h3>${c.esc(title)}</h3><p>${c.esc(desc)}</p>${link?`<button type="button" class="btn sn-card-link" data-sn-card="${c.esc(link)}">${link.startsWith("@")?"打开对应工具":"练一道对应题"}</button>`:""}</article>`).join("")||'<p class="sn-empty">没有找到相关卡片，试试其他关键词。</p>';
  }
  function body(c,subject,tabs,selected) {
    if(!tabs){
      const s=current(c), e=c.esc;
      return `<section aria-label="科目练习建议"><p class="sn-subheading">学习要点</p><div class="sn-stack">${cardsHtml(c,[["今日方法",s.tip,s.method]])}</div><div class="sn-links"><button type="button" class="btn primary" data-sn-link="practice">${e(subject)}专项练习</button>${subject==="语文"?'<button type="button" class="btn" data-sn-link="poems">📜 古诗文背诵</button><button type="button" class="btn" data-sn-link="guide">✍ 阅读技巧</button>':subject==="英语"?'<button type="button" class="btn" data-sn-link="english">🎧 听力和逐句跟读</button>':""}</div></section>`;
    }
    const [, , heading, cards]=tabs.find(t=>t[0]===selected)||tabs[0];
    const query=terms.get(subject)||"";
    return `<section aria-label="${c.esc(heading)}"><p class="sn-subheading">${c.esc(heading)}</p>${selected==="search"?`<label class="sn-search"><span>关键词</span><input type="search" placeholder="${subject==="历史"?"如：甲午、条约":"如：材料、条件"}" value="${c.esc(query)}" data-sn-search></label><div class="sn-stack" data-sn-results>${cardsHtml(c,matches(searchCards(subject),query))}</div>`:`<div class="sn-stack">${cardsHtml(c,cards)}</div>`}${["errors","skill","judge","points"].includes(selected)?`<div class="sn-links"><button type="button" class="btn" data-sn-link="practice">${c.esc(subject)}专项练习</button></div>`:""}</section>`;
  }
  function searchCards(subject){
    if(subject==="历史")return historyTabs[1][3];
    return moralTabs.filter(t=>t[0]!=="search").flatMap(t=>t[3]);
  }
  function renderSubjectNotebook(c){
    const e=c.esc, s=current(c), subject=s.name, m=meta[subject]||{...s,title:s.tip,tag:"专项练习",description:s.method,points};
    const tabs=tabdata(subject), isOpen=opened.get(subject)!==false;
    const selected=choices.get(subject)||tabs?.[0][0];
    const checked=(c.state.check?.[c.day()]||[]).includes("s-"+subject);
    return `<article class="panel sn-task" aria-label="${e(subject)}学习卡">
      <div class="sn-head"><span class="sn-subject-icon" aria-hidden="true">${e(m.icon)}</span><div><div class="sn-kicker">${e(subject)}</div><h1>${e(m.title)}</h1></div>${subject==="化学"?'<span class="sn-points">选读</span>':`<span class="sn-points">+${points} ✨</span>`}</div>
      <p class="sn-tag"><span class="pill">${e(m.tag)}</span></p><p class="sn-intro">${e(m.description)}</p><p class="sn-path"><strong>学习路径</strong> ${e(path[subject]||"")}</p>
      <div class="sn-actions"><button type="button" class="btn primary" data-sn-toggle aria-expanded="${isOpen}" aria-controls="sn-details">${isOpen?"收起速查":"展开速查"}</button>
        ${subject==="化学"?"":`<label class="sn-check"><input data-sn-check type="checkbox" ${checked?"checked":""}><span>${checked?"已打卡":"打卡"}</span></label>`}</div>
      <p class="sn-error" data-sn-error role="status" hidden>未能保存本次打卡，请再试一次。</p>
      <div class="sn-details" id="sn-details" ${isOpen?"":"hidden"}>
      ${tabs?`<div class="sn-tabs" aria-label="${e(subject)}速查分类">${tabs.map(([id,label])=>`<button type="button" class="btn ${id===selected?"primary":""}" aria-pressed="${id===selected}" data-sn-tab="${id}">${e(label)}</button>`).join("")}</div>`:""}
      <div data-sn-body>${body(c,subject,tabs,selected)}</div></div>
    </article>`;
  }
  function bindSubjectNotebook(c){
    const el=c.root.querySelector(".sn-task");
    if(!el)return;
    const subject=current(c).name;
    const tabs=tabdata(subject), toggle=el.querySelector("[data-sn-toggle]"), details=el.querySelector("#sn-details"), area=el.querySelector("[data-sn-body]");
    toggle.onclick=()=>{
      details.hidden=!details.hidden;
      opened.set(subject,!details.hidden);
      toggle.setAttribute("aria-expanded",String(!details.hidden));
      toggle.textContent=details.hidden?"展开速查":"收起速查";
    };
    el.addEventListener("click",ev=>{
      const tab=ev.target.closest("[data-sn-tab]");
      const link=ev.target.closest("[data-sn-link]"), card=ev.target.closest("[data-sn-card]");
      if(card){
        const id=card.dataset.snCard;
        if(["@poems","@guide","@english"].includes(id))c.go(id.slice(1),{});
        else if(c.content.questions.some(q=>q.id===id&&q.subject===subject))c.go("practice",{subject,id});
      }
      if(link)goto(c,subject,link.dataset.snLink);
      if(!tab||!tabs?.some(t=>t[0]===tab.dataset.snTab))return;
      const selected=tab.dataset.snTab;choices.set(subject,selected);
      el.querySelectorAll("[data-sn-tab]").forEach(item=>{
        const active=item===tab;
        item.setAttribute("aria-pressed",String(active));
        item.classList.toggle("primary",active);
      });
      area.innerHTML=body(c,subject,tabs,selected);
    });
    el.addEventListener("input",ev=>{
      if(!ev.target.matches("[data-sn-search]"))return;
      const q=ev.target.value;terms.set(subject,q);
      el.querySelector("[data-sn-results]").innerHTML=cardsHtml(c,matches(searchCards(subject),q));
    });
    const input=el.querySelector("[data-sn-check]"), error=el.querySelector("[data-sn-error]");
    if(!input)return;
    input.onchange=async ()=>{
      const date=c.day(), checks=c.state.check ||= {}, previous=checks[date]||[], next=new Set(previous), key="s-"+subject;
      if(input.checked)next.add(key); else next.delete(key);
      input.disabled=true;error.hidden=true;
      checks[date]=Array.from(next);
      let saved=false;
      try { saved=(await c.save())!==false; } catch {}
      finally { if(el.isConnected)input.disabled=false; }
      if(!saved){checks[date]=previous;if(el.isConnected){input.checked=previous.includes(key);error.hidden=false;}return;}
      if(el.isConnected)c.render();
    };
  }
  window.SUBJECT_NOTEBOOK_META=meta;
  window.renderSubjectNotebook=renderSubjectNotebook;
  window.bindSubjectNotebook=bindSubjectNotebook;
})();
