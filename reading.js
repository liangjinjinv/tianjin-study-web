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
    const items = ctx.content[page] ?? [];
    const work = items[fromPage[page]] ?? items[0];
    return {page, items, work, ancient: page === 'poems'};
  };

  window.renderReading = (ctx) => {
    const {esc} = ctx;
    const {page, items, work, ancient} = readPage(ctx);
    const title = ancient ? '古诗文背诵' : '英语跟读';
    const caption = ancient ? '读懂意思，再遮住原文默写。' : '听一句、跟一句，再试着不看原文复述。';
    if (!work) return '<section class="panel"><h1>' + title + '</h1><p>暂无篇目。</p></section>';
    return `<section class="study-reading" data-reading-page="${page}">
      <div class="panel reading-heading">
        <p class="eyebrow">${ancient ? '语言积累' : '听说训练'}</p>
        <h1>${title}</h1><p>${caption}</p>
      </div>
      <div class="panel reading-content">
        <div class="reading-select">
          <label for="read-work">选择篇目</label>
          <select id="read-work">${items.map((w,i)=>`<option value="${i}" ${w===work?'selected':''}>${esc(w.title)}</option>`).join('')}</select>
        </div>
        <h2>${ancient?'《':''}${esc(work.title)}${ancient?'》':''}</h2>
        <p class="muted">${esc(ancient ? work.author || '' : '自编跟读材料 · 非教材原声')}</p>
        ${work.hint?`<p class="reading-hint">${esc(work.hint)}</p>`:''}
        ${ancient && work.title==='三峡'?`<details class="reading-vocab"><summary>实词与虚词小练习</summary><p>先自己想：在「略无阙处」中，“阙”是什么意思？「自非亭午夜分」的“自非”又怎样理解？</p><details><summary>核对答案</summary><p>“阙”同“缺”，指空缺、中断；“自非”是“如果不是”，“自”表假设，“非”是否定。</p></details></details>`:''}
        <div class="reading-actions" aria-label="朗读及回忆控制">
          <button class="btn primary" data-r="speak" type="button">${ancient?'朗读全文':'播放全文'}</button>
          <button class="btn" data-r="stop" type="button">停止朗读</button>
          <label><input data-r="repeat" type="checkbox"> 每句多播一遍</label>
          ${ancient?`<label><input data-r="translate" type="checkbox"> 显示译文</label>`:''}
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
        <p class="reading-status muted" data-r="feedback" aria-live="polite"></p>
      </div>
      <div class="panel reading-record">
        <h2>录音复听</h2>
        <p class="muted">仅保存在本页内存，离开或刷新会清除。不上传，不自动评分。一次最多录制 60 秒。</p>
        <div class="reading-actions">
          <button class="btn" type="button" data-r="record">开始录音</button>
          <button class="btn" type="button" data-r="end-record" disabled>结束录音</button>
          <button class="btn" type="button" data-r="clear-record" disabled>清除录音</button>
        </div>
        <p class="reading-status muted" data-r="record-status" aria-live="polite"></p>
        <audio controls preload="none" data-r="player" hidden></audio>
      </div>
    </section>`;
  };

  const normalize = x => x.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]/gu, '');

  window.bindReading = (ctx) => {
    window.cleanupReading();
    const {page, ancient, work} = readPage(ctx);
    const section = ctx.root.querySelector('.study-reading');
    if (!section || !work) return;
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
        id: 'recall-' + page + '-' + work.title + '-' + i,
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
