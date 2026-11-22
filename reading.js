/* 八年级上册统编语文（2025 秋修订实书，目录与 2026 秋样本交叉核对）。
   课内按教材“思考·探究·积累”明确指令分组；课外为书内单独的诵读栏目。
   古诗文仅录公版正文，按课本范围和常用简体校字；不含注释、导读、练习或近现代正文。
   天津家庭使用的具体印次及教师另加任务未核实。证据详见 tianjin-study-cn-recitations-sources.md。 */
(() => {
  'use strict';
  const groupA = '课内背诵';
  const groupB = '课外诵读';
  const rows = [
    ['cn8-sanxia', '三峡', '郦道元', groupA, '第11课·课后第1题·背诵课文全文', [
      '自三峡七百里中，两岸连山，略无阙处。',
      '重岩叠嶂，隐天蔽日，自非亭午夜分，不见曦月。',
      '至于夏水襄陵，沿溯阻绝。',
      '或王命急宣，有时朝发白帝，暮到江陵，其间千二百里，虽乘奔御风，不以疾也。',
      '春冬之时，则素湍绿潭，回清倒影。',
      '绝巘多生怪柏，悬泉瀑布，飞漱其间，清荣峻茂，良多趣味。',
      '每至晴初霜旦，林寒涧肃，常有高猿长啸，属引凄异，空谷传响，哀转久绝。',
      '故渔者歌曰：“巴东三峡巫峡长，猿鸣三声泪沾裳。”'
    ]],
    ['cn8-daxiezhongshushu', '答谢中书书', '陶弘景', groupA, '第12课《短文二篇》·课后第1题·背诵全文', [
      '山川之美，古来共谈。', '高峰入云，清流见底。',
      '两岸石壁，五色交晖。', '青林翠竹，四时俱备。',
      '晓雾将歇，猿鸟乱鸣；夕日欲颓，沉鳞竞跃。',
      '实是欲界之仙都。自康乐以来，未复有能与其奇者。'
    ]],
    ['cn8-jichengtiansiyeyou', '记承天寺夜游', '苏轼', groupA, '第12课《短文二篇》·课后第1题·背诵全文', [
      '元丰六年十月十二日夜，解衣欲睡，月色入户，欣然起行。',
      '念无与为乐者，遂至承天寺寻张怀民。',
      '怀民亦未寝，相与步于中庭。',
      '庭下如积水空明，水中藻、荇交横，盖竹柏影也。',
      '何夜无月？何处无竹柏？但少闲人如吾两人者耳。'
    ]],
    ['cn8-yuzhuyuansishu', '与朱元思书', '吴均', groupA, '第13课·课后第1题·背诵课文全文', [
      '风烟俱净，天山共色。从流飘荡，任意东西。',
      '自富阳至桐庐一百许里，奇山异水，天下独绝。',
      '水皆缥碧，千丈见底。游鱼细石，直视无碍。',
      '急湍甚箭，猛浪若奔。',
      '夹岸高山，皆生寒树，负势竞上，互相轩邈，争高直指，千百成峰。',
      '泉水激石，泠泠作响；好鸟相鸣，嘤嘤成韵。',
      '蝉则千转不穷，猿则百叫无绝。',
      '鸢飞戾天者，望峰息心；经纶世务者，窥谷忘反。',
      '横柯上蔽，在昼犹昏；疏条交映，有时见日。'
    ]],
    ['cn8-yewang', '野望', '王绩', groupA, '第14课《唐诗五首》·课后第6题·全诗', [
      '东皋薄暮望，徙倚欲何依。', '树树皆秋色，山山唯落晖。',
      '牧人驱犊返，猎马带禽归。', '相顾无相识，长歌怀采薇。'
    ]],
    ['cn8-huanghelou', '黄鹤楼', '崔颢', groupA, '第14课《唐诗五首》·课后第6题·全诗', [
      '昔人已乘黄鹤去，此地空余黄鹤楼。', '黄鹤一去不复返，白云千载空悠悠。',
      '晴川历历汉阳树，芳草萋萋鹦鹉洲。', '日暮乡关何处是？烟波江上使人愁。'
    ]],
    ['cn8-shizhisaishang', '使至塞上', '王维', groupA, '第14课《唐诗五首》·课后第6题·全诗', [
      '单车欲问边，属国过居延。', '征蓬出汉塞，归雁入胡天。',
      '大漠孤烟直，长河落日圆。', '萧关逢候骑，都护在燕然。'
    ]],
    ['cn8-dujingmensongbie', '渡荆门送别', '李白', groupA, '第14课《唐诗五首》·课后第6题·全诗', [
      '渡远荆门外，来从楚国游。', '山随平野尽，江入大荒流。',
      '月下飞天镜，云生结海楼。', '仍怜故乡水，万里送行舟。'
    ]],
    ['cn8-qiantanghuchunxing', '钱塘湖春行', '白居易', groupA, '第14课《唐诗五首》·课后第6题·全诗', [
      '孤山寺北贾亭西，水面初平云脚低。', '几处早莺争暖树，谁家新燕啄春泥。',
      '乱花渐欲迷人眼，浅草才能没马蹄。', '最爱湖东行不足，绿杨阴里白沙堤。'
    ]],
    ['cn8-dedaoduozhu-shidaoguazhu', '得道多助，失道寡助', '孟子', groupA, '第23课《孟子》三章·课后第1题·背诵全文', [
      '天时不如地利，地利不如人和。',
      '三里之城，七里之郭，环而攻之而不胜。',
      '夫环而攻之，必有得天时者矣，然而不胜者，是天时不如地利也。',
      '城非不高也，池非不深也，兵革非不坚利也，米粟非不多也，委而去之，是地利不如人和也。',
      '故曰：域民不以封疆之界，固国不以山溪之险，威天下不以兵革之利。',
      '得道者多助，失道者寡助。寡助之至，亲戚畔之；多助之至，天下顺之。',
      '以天下之所顺，攻亲戚之所畔，故君子有不战，战必胜矣。'
    ]],
    ['cn8-fuguibunengyin-segment', '富贵不能淫（指定段）', '孟子', groupA, '第23课《孟子》三章·课后第2题·从“居天下之广居”至“此之谓大丈夫”', [
      '居天下之广居，立天下之正位，行天下之大道。',
      '得志，与民由之；不得志，独行其道。',
      '富贵不能淫，贫贱不能移，威武不能屈。此之谓大丈夫。'
    ]],
    ['cn8-shengyuyouhuan-siyuanle', '生于忧患，死于安乐', '孟子', groupA, '第23课《孟子》三章·课后第1题·背诵全文', [
      '舜发于畎亩之中，傅说举于版筑之间，胶鬲举于鱼盐之中，管夷吾举于士，孙叔敖举于海，百里奚举于市。',
      '故天将降大任于是人也，必先苦其心志，劳其筋骨，饿其体肤，空乏其身，行拂乱其所为，所以动心忍性，曾益其所不能。',
      '人恒过，然后能改；困于心，衡于虑，而后作；征于色，发于声，而后喻。',
      '入则无法家拂士，出则无敌国外患者，国恒亡。',
      '然后知生于忧患而死于安乐也。'
    ]],
    ['cn8-yugongyishan', '愚公移山', '《列子·汤问》', groupA, '第24课·课后第2题·背诵课文全文', [
      '太行、王屋二山，方七百里，高万仞，本在冀州之南，河阳之北。',
      '北山愚公者，年且九十，面山而居。',
      '惩山北之塞，出入之迂也，聚室而谋曰：“吾与汝毕力平险，指通豫南，达于汉阴，可乎？”杂然相许。',
      '其妻献疑曰：“以君之力，曾不能损魁父之丘，如太行、王屋何？且焉置土石？”杂曰：“投诸渤海之尾，隐土之北。”',
      '遂率子孙荷担者三夫，叩石垦壤，箕畚运于渤海之尾。',
      '邻人京城氏之孀妻有遗男，始龀，跳往助之。寒暑易节，始一反焉。',
      '河曲智叟笑而止之曰：“甚矣，汝之不惠！以残年余力，曾不能毁山之一毛，其如土石何？”',
      '北山愚公长息曰：“汝心之固，固不可彻，曾不若孀妻弱子。虽我之死，有子存焉。',
      '子又生孙，孙又生子；子又有子，子又有孙；子子孙孙无穷匮也，而山不加增，何苦而不平？”河曲智叟亡以应。',
      '操蛇之神闻之，惧其不已也，告之于帝。帝感其诚，命夸蛾氏二子负二山，一厝朔东，一厝雍南。',
      '自此，冀之南，汉之阴，无陇断焉。'
    ]],
    ['cn8-yinjiu-5', '饮酒（其五）', '陶渊明', groupA, '第26课《诗词五首》·课后第5题·全诗', [
      '结庐在人境，而无车马喧。', '问君何能尔？心远地自偏。', '采菊东篱下，悠然见南山。',
      '山气日夕佳，飞鸟相与还。', '此中有真意，欲辨已忘言。'
    ]],
    ['cn8-chunwang', '春望', '杜甫', groupA, '第26课《诗词五首》·课后第5题·全诗', [
      '国破山河在，城春草木深。', '感时花溅泪，恨别鸟惊心。',
      '烽火连三月，家书抵万金。', '白头搔更短，浑欲不胜簪。'
    ]],
    ['cn8-yanmentaishouxing', '雁门太守行', '李贺', groupA, '第26课《诗词五首》·课后第5题·全诗', [
      '黑云压城城欲摧，甲光向日金鳞开。', '角声满天秋色里，塞上燕脂凝夜紫。',
      '半卷红旗临易水，霜重鼓寒声不起。', '报君黄金台上意，提携玉龙为君死。'
    ]],
    ['cn8-chibi', '赤壁', '杜牧', groupA, '第26课《诗词五首》·课后第5题·全诗', [
      '折戟沉沙铁未销，自将磨洗认前朝。', '东风不与周郎便，铜雀春深锁二乔。'
    ]],
    ['cn8-yujiaao-tianjie', '渔家傲（天接云涛连晓雾）', '李清照', groupA, '第26课《诗词五首》·课后第5题·全词', [
      '天接云涛连晓雾，星河欲转千帆舞。', '仿佛梦魂归帝所，闻天语，殷勤问我归何处。',
      '我报路长嗟日暮，学诗谩有惊人句。', '九万里风鹏正举。风休住，蓬舟吹取三山去！'
    ]],
    ['cn8-tingzhongyouqishu', '庭中有奇树', '佚名（《古诗十九首》）', groupB, '第三单元后·课外古诗词诵读', [
      '庭中有奇树，绿叶发华滋。', '攀条折其荣，将以遗所思。',
      '馨香盈怀袖，路远莫致之。', '此物何足贵？但感别经时。'
    ]],
    ['cn8-guisuishou', '龟虽寿', '曹操', groupB, '第三单元后·课外古诗词诵读', [
      '神龟虽寿，犹有竟时。', '腾蛇乘雾，终为土灰。',
      '老骥伏枥，志在千里；烈士暮年，壮心不已。',
      '盈缩之期，不但在天；养怡之福，可得永年。', '幸甚至哉，歌以咏志。'
    ]],
    ['cn8-zengcongdi-2', '赠从弟（其二）', '刘桢', groupB, '第三单元后·课外古诗词诵读', [
      '亭亭山上松，瑟瑟谷中风。', '风声一何盛，松枝一何劲！',
      '冰霜正惨凄，终岁常端正。', '岂不罹凝寒？松柏有本性。'
    ]],
    ['cn8-liangfuxing', '梁甫行', '曹植', groupB, '第三单元后·课外古诗词诵读', [
      '八方各异气，千里殊风雨。', '剧哉边海民，寄身于草野。',
      '妻子象禽兽，行止依林阻。', '柴门何萧条，狐兔翔我宇。'
    ]],
    ['cn8-huanxisha-yiqu', '浣溪沙（一曲新词酒一杯）', '晏殊', groupB, '第六单元后·课外古诗词诵读', [
      '一曲新词酒一杯，去年天气旧亭台。', '夕阳西下几时回？',
      '无可奈何花落去，似曾相识燕归来。', '小园香径独徘徊。'
    ]],
    ['cn8-caisangzi-qingzhou', '采桑子（轻舟短棹西湖好）', '欧阳修', groupB, '第六单元后·课外古诗词诵读', [
      '轻舟短棹西湖好，绿水逶迤。', '芳草长堤，隐隐笙歌处处随。',
      '无风水面琉璃滑，不觉船移。', '微动涟漪，惊起沙禽掠岸飞。'
    ]],
    ['cn8-xiangjianhuan-jinling', '相见欢（金陵城上西楼）', '朱敦儒', groupB, '第六单元后·课外古诗词诵读', [
      '金陵城上西楼，倚清秋。', '万里夕阳垂地、大江流。',
      '中原乱，簪缨散，几时收？', '试倩悲风吹泪、过扬州。'
    ]],
    ['cn8-rumengling-changji', '如梦令（常记溪亭日暮）', '李清照', groupB, '第六单元后·课外古诗词诵读', [
      '常记溪亭日暮，沉醉不知归路。', '兴尽晚回舟，误入藕花深处。', '争渡，争渡，惊起一滩鸥鹭。'
    ]]
  ];
  const source = '统编八上·修订教材';
  window.TJ_CN_RECITATION = Object.freeze(rows.map(([id,title,author,group,scope,lines]) =>
    Object.freeze({id,title,author,group,scope,lines:Object.freeze(lines),source})));
})();
(() => {
  'use strict';
  let mount = null;
  const fromPage = { poems: 0, english: 0 };

  window.cleanupReading = () => {
    mount?.dispose();
    mount = null;
  };

  const readPage = (ctx) => {
    const page = ctx.state.page === 'english' ? 'english' : 'poems';
    const items = page==='poems' ? (window.TJ_CN_RECITATION ?? ctx.content.poems ?? []) : (ctx.content.english ?? []);
    const work = items[fromPage[page]] ?? items[0];
    return {page, items, work, ancient: page === 'poems'};
  };

  window.renderReading = (ctx) => {
    const {esc} = ctx;
    const {page, items, work, ancient} = readPage(ctx);
    const title = ancient ? '古诗文背诵' : '英语跟读';
    const caption = ancient ? '读懂意思，再遮住原文默写。' : '听一句、跟一句，再试着不看原文复述。';
    if (!work) return '<section class="panel"><h1>' + title + '</h1><p>暂无篇目。</p></section>';
    const menu=ancient ? [...new Set(items.map(i=>i.group||'古诗文'))].map(group=>`<optgroup label="${esc(group)}">${items.map((w,i)=>[w,i]).filter(([w])=>(w.group||'古诗文')===group).map(([w,i])=>`<option value="${i}" ${w===work?'selected':''}>${esc(w.title)}</option>`).join('')}</optgroup>`).join('') : items.map((w,i)=>`<option value="${i}" ${w===work?'selected':''}>${esc(w.title)}</option>`).join('');
    const intro=ancient ? '<p class="muted">按统编语文八上整理。课内要求和课外诵读分开；校内加背以老师要求为准。</p>' : '';
    return `<section class="study-reading" data-reading-page="${page}">
      <div class="panel reading-heading">
        <p class="eyebrow">${ancient ? '语言积累' : '听说训练'}</p>
        <h1>${title}</h1><p>${caption}</p>${intro}
      </div>
      <div class="panel reading-content">
        <div class="reading-select">
          <label for="read-work">选择篇目</label>
          <select id="read-work">${menu}</select>
        </div>
        <h2>${ancient?'《':''}${esc(work.title)}${ancient?'》':''}</h2>
        <p class="muted">${esc(ancient ? work.author || '' : '自编跟读材料 · 非教材原声')}</p>
        ${ancient&&work.scope?`<p class="reading-hint"><b>背诵范围：</b>${esc(work.scope)}</p>`:''}
        ${ancient&&work.source?`<p class="muted">${esc(work.source)}</p>`:''}
        ${work.hint?`<p class="reading-hint">${esc(work.hint)}</p>`:''}
        ${ancient && work.title==='三峡'?`<details class="reading-vocab"><summary>实词与虚词小练习</summary><p>先自己想：在「略无阙处」中，“阙”是什么意思？「自非亭午夜分」的“自非”又怎样理解？</p><details><summary>核对答案</summary><p>“阙”同“缺”，指空缺、中断；“自非”是“如果不是”，“自”表假设，“非”是否定。</p></details></details>`:''}
        ${work.lines.length?`<div class="reading-actions" aria-label="朗读及回忆控制">
          <button class="btn primary" data-r="speak" type="button">${ancient?'朗读全文':'播放全文'}</button>
          <button class="btn" data-r="stop" type="button">停止朗读</button>
          <label><input data-r="repeat" type="checkbox"> 每句多播一遍</label>
          ${work.lines.some(x=>typeof x==='object'&&x.translation)?`<label><input data-r="translate" type="checkbox"> 显示译文</label>`:''}
          <button class="btn" data-r="recall" type="button" aria-pressed="false">${ancient?'开始遮挡默写':'开始不看稿回忆'}</button>
        </div>
        <p class="reading-status muted" data-r="speech-status" aria-live="polite">朗读使用设备上的本地合成语音，有些设备未安装对应语音。</p>
        <ol class="reading-lines">${work.lines.map((row, i) => {
          const {text,translation} = typeof row === 'string' ? {text:row} : row;
          return `<li class="reading-line" data-line="${i}">
            <div class="reading-source"><p ${ancient?'':'lang="en"'}>${esc(text)}</p><button class="btn" type="button" data-read-line="${i}" aria-label="朗读第 ${i+1} 段">听这一段</button></div>
            ${translation?`<p hidden class="reading-translation muted">${esc(translation)}</p>`:''}
            <div class="reading-recall" hidden>
              <label for="reading-recall-${i}">第 ${i+1} 段</label>
              <textarea rows="2" id="reading-recall-${i}" placeholder="写下你记得的内容，或先留空"></textarea>
              <p class="reading-result" aria-live="polite" hidden></p>
              <button type="button" class="btn" data-add-miss="${i}" hidden>加入到期复习</button>
            </div>
          </li>`;
        }).join('')}</ol>
        <div class="reading-actions" data-r="compare-group" hidden><button class="btn primary" type="button" data-r="compare">揭晓并对照</button><button class="btn" type="button" data-r="retry" hidden>重新默写</button></div>
        <p class="reading-status muted" data-r="feedback" aria-live="polite"></p>`: '<p class="muted">此项仅标出范围，请配合手边的课本背诵。</p>'}
      </div>
      ${work.lines.length?`<div class="panel reading-record">
        <h2>录音复听</h2>
        <p class="muted">仅保存在本页内存，离开或刷新会清除。不上传，不自动评分。一次最多录制 60 秒。</p>
        <div class="reading-actions">
          <button class="btn" type="button" data-r="record">开始录音</button>
          <button class="btn" type="button" data-r="end-record" disabled>结束录音</button>
          <button class="btn" type="button" data-r="clear-record" disabled>清除录音</button>
        </div>
        <p class="reading-status muted" data-r="record-status" aria-live="polite"></p>
        <audio controls preload="none" data-r="player" hidden></audio>
      </div>`: ''}
    </section>`;
  };

  const normalize = x => x.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]/gu, '');

  window.bindReading = (ctx) => {
    window.cleanupReading();
    const {page, ancient, work} = readPage(ctx);
    const section = ctx.root.querySelector('.study-reading');
    if (!section || !work) return;
    const selector=section.querySelector('#read-work');
    if (!work.lines.length) {
      selector?.addEventListener('change',()=>{fromPage[page]=+selector.value;ctx.render();});
      return;
    }
    const by = key => section.querySelector('[data-r="' + key + '"]');
    const rows = [...section.querySelectorAll('.reading-line')];
    const texts = work.lines.map(line => typeof line === 'string' ? line : line.text);
    const synth = window.speechSynthesis;
    const player = by('player');
    let activeSpeech = false, utter = null, speakToken = 0;
    let recallMode = false, compared = false;
    let active = true, recorder = null, stream = null, objectUrl = null, recordTimeout = null;
    let generation = 0;
    let tried = new Set();
    const translations = () => rows.forEach(row => {
      const tx = row.querySelector('.reading-translation');
      if (tx) tx.hidden = recallMode || !by('translate').checked;
    });
    const stopSpeech = (announce = false) => {
      speakToken++;
      if (activeSpeech) synth?.cancel();
      utter = null; activeSpeech = false;
      rows.forEach(row=>row.classList.remove('is-speaking'));
      if (announce) by('speech-status').textContent = '朗读已停止。';
    };
    const clearMedia = () => {
      if (recordTimeout != null) clearTimeout(recordTimeout);
      recordTimeout = null;
      stream?.getTracks().forEach(track => track.stop());
      stream = null;
    };
    const clearPlayer = () => {
      player.pause();
      player.removeAttribute('src');
      player.load();
      player.hidden = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = null;
      by('clear-record').disabled = true;
    };
    const dispose = () => {
      if (!active) return;
      active = false; generation++;
      stopSpeech();
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      clearMedia();
      clearPlayer();
      observer.disconnect();
    };
    const observer = new MutationObserver(() => {if (!section.isConnected) dispose();});
    observer.observe(ctx.root, {subtree:true, childList:true});
    mount = {dispose};

    function speak(indexes) {
      stopSpeech();
      if (!synth || typeof SpeechSynthesisUtterance !== 'function') {
        by('speech-status').textContent = '当前浏览器不支持合成朗读。'; return;
      }
      const prefix = ancient?'zh':'en';
      const local = synth.getVoices().filter(v => v.localService && v.lang.toLowerCase().startsWith(prefix));
      const voice = (ancient && local.find(v=>/^zh[-_]cn$/i.test(v.lang))) || local[0];
      if (!voice) {
        by('speech-status').textContent = ancient ? '找不到本地中文语音。请在设备的语音设置中安装普通话声音后重试。' : '找不到本地英文语音。请在设备的语音设置中安装英语声音后重试。'; return;
      }
      const playList = by('repeat').checked ? indexes.flatMap(i => [i,i]) : indexes;
      const token = speakToken;
      let cursor = 0;
      const next = () => {
        if (!active || token !== speakToken) return;
        rows.forEach(row => row.classList.remove('is-speaking'));
        if (cursor === playList.length) {
          activeSpeech = false; utter = null; by('speech-status').textContent = '朗读结束。'; return;
        }
        const i = playList[cursor++];
        rows[i].classList.add('is-speaking');
        by('speech-status').textContent = '正在朗读第 ' + (i+1) + ' 段。';
        utter = new SpeechSynthesisUtterance(texts[i]);
        utter.voice = voice;
        utter.lang = voice.lang;
        utter.rate = ancient ? .85 : .88;
        utter.onend = next;
        utter.onerror = () => {
          if (token !== speakToken || !active) return;
          stopSpeech();
          by('speech-status').textContent = '朗读未能播放。请检查系统语音后重试。';
        };
        activeSpeech = true;
        synth.speak(utter);
      };
      next();
    }

    function showRecall(on) {
      recallMode = on;
      compared = false;
      if (on) stopSpeech(true);
      by('speak').disabled = on;
      by('repeat').disabled = on;
      if (by('translate')) by('translate').disabled = on;
      by('recall').setAttribute('aria-pressed', String(on));
      by('recall').textContent = on ? '退出回忆' : ancient ? '开始遮挡默写' : '开始不看稿回忆';
      by('compare-group').hidden = !on;
      by('compare').disabled = false;
      by('retry').hidden = true;
      by('feedback').textContent = on ? '先回忆，再点击「揭晓并对照」。' : '';
      rows.forEach(row => {
        row.querySelector('.reading-source').hidden = on;
        const recall = row.querySelector('.reading-recall');
        recall.hidden = !on;
        const field = recall.querySelector('textarea');
        field.value = '';
        field.readOnly = false;
        recall.querySelector('.reading-result').hidden = true;
        recall.querySelector('[data-add-miss]').hidden = true;
      });
      translations();
    }
    function compare() {
      if (!recallMode || compared) return;
      compared = true;
      let matches = 0;
      rows.forEach((row,i) => {
        const typed = row.querySelector('textarea');
        typed.readOnly = true;
        const result = row.querySelector('.reading-result');
        const input = normalize(typed.value);
        const exact = !!input && input === normalize(texts[i]);
        if (exact) matches++;
        result.hidden = false;
        result.classList.toggle('is-match', exact);
        result.textContent = exact ? '与原文一致。' : (!input ? '未作答。' : '与原文有差异。') + ' 原文：' + texts[i];
        const add = row.querySelector('[data-add-miss]');
        add.hidden = exact;
        add.disabled = tried.has(i);
        add.textContent = tried.has(i) ? '已加入复习' : '加入到期复习';
      });
      by('compare').disabled = true;
      by('retry').hidden = false;
      by('feedback').textContent = '与原文一致：' + matches + '/' + rows.length + ' 段。仅做文本对照，忽略标点、空格和大小写；不是考试评分。';
    }

    function addMiss(i, control) {
      if (!compared || tried.has(i) || typeof ctx.addRecall !== 'function') return;
      control.disabled = true;
      const q = {
        id: 'recall-' + page + '-' + (work.id ?? work.title) + '-' + i,
        subject: ancient ? '语文' : '英语',
        topic: ancient ? '古诗文背诵' : '英语跟读',
        prompt: (ancient ? '默写' : '回忆') + '《' + work.title + '》第 ' + (i + 1) + ' 段。' + (i>0 ? '上一段结尾：' + texts[i-1].slice(-24) : ''),
        answer: texts[i],
        explain: '先独立回忆，再与原文逐句对照；如有遗漏，订正后隔一段时间再做。',
        response: rows[i].querySelector('textarea').value.trim()
      };
      Promise.resolve().then(()=>ctx.addRecall(q)).then(result=>{
        if (result === false) throw new Error();
        tried.add(i);
        control.textContent = '已加入复习';
        if(control.isConnected)by('feedback').textContent = '第 ' + (i+1) + ' 段已加入复习。';
      }).catch(()=>{
        control.disabled = false;
        if(control.isConnected)by('feedback').textContent = '暂时无法加入复习，可再试一次。';
      });
    }

    function endRecording() {
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      by('end-record').disabled = true;
      if (recordTimeout != null) clearTimeout(recordTimeout);
      recordTimeout = null;
      by('record-status').textContent = '正在准备录音回放。';
    }
    async function beginRecording() {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder !== 'function') {
        by('record-status').textContent = '当前页面或浏览器不支持麦克风录音。请尝试在 HTTPS 网页用系统浏览器打开。'; return;
      }
      stopSpeech();
      player.pause();
      by('record').disabled = true;
      by('record-status').textContent = '等待麦克风许可…';
      const thisRecording = ++generation;
      try {
        const incoming = await navigator.mediaDevices.getUserMedia({audio:true});
        if (!active || !section.isConnected || generation !== thisRecording) {
          incoming.getTracks().forEach(track=>track.stop()); return;
        }
        stream = incoming;
        recorder = new MediaRecorder(incoming);
        const chunks = [];
        recorder.ondataavailable = event => {if (event.data?.size) chunks.push(event.data);};
        recorder.onerror = () => {
          if (!active || generation !== thisRecording) return;
          generation++;
          if (recorder.state !== 'inactive') recorder.stop();
          clearMedia();
          by('record-status').textContent = '录音失败，请检查麦克风后重试。';
          by('record').disabled = false;
          by('end-record').disabled = true;
        };
        recorder.onstop = () => {
          if (!active || !section.isConnected || generation !== thisRecording) return;
          clearMedia();
          const blob = new Blob(chunks, {type:recorder.mimeType || chunks[0]?.type});
          if (blob.size) {
            clearPlayer();
            objectUrl = URL.createObjectURL(blob);
            player.src = objectUrl;
            player.hidden = false;
            by('clear-record').disabled = false;
          }
          by('record-status').textContent = blob.size ? '录音完成，可点击播放器复听。' : '没有录到音频，可以再试一次。';
          by('record').disabled = false;
          by('end-record').disabled = true;
        };
        recorder.start();
        recordTimeout = setTimeout(endRecording, 60000);
        by('end-record').disabled = false;
        by('record-status').textContent = '正在录音（最多 60 秒）';
      } catch (err) {
        if (!active || generation !== thisRecording) return;
        clearMedia();
        by('record').disabled = false;
        by('end-record').disabled = true;
        by('record-status').textContent = err?.name === 'NotAllowedError' ? '未获麦克风许可。你可在浏览器站点设置中允许后重试。' : '无法打开麦克风，请检查设备后重试。';
      }
    }

    section.querySelector('#read-work').addEventListener('change', event => {
      fromPage[page] = Number(event.target.value);
      window.cleanupReading();
      ctx.render();
    });
    by('translate')?.addEventListener('change', translations);
    section.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || button.disabled) return;
      if (button.dataset.readLine != null && !recallMode) return speak([Number(button.dataset.readLine)]);
      if (button.dataset.addMiss != null) return addMiss(Number(button.dataset.addMiss),button);
      switch (button.dataset.r) {
        case 'speak': if (!recallMode) speak(texts.map((_, i)=>i)); break;
        case 'stop': stopSpeech(true); break;
        case 'recall': showRecall(!recallMode); break;
        case 'retry': showRecall(true); break;
        case 'compare': compare(); break;
        case 'record': beginRecording(); break;
        case 'end-record': endRecording(); break;
        case 'clear-record': clearPlayer(); by('record-status').textContent = '录音已清除。'; break;
      }
    });
  };
})();
