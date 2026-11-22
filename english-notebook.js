/*
 * 津考航线 · 外研社《英语》（新标准）八年级上册（2024 审定，修订六单元版）
 * Title/sequence and grammar topics identify textbook units; everything else
 * below is independently written practice, not official passages or recordings.
 * No network calls, app state mutations, or migration of existing records.
 * Load as a classic script before english-notebook.js. `label`, `passage`,
 * `grammar` and `phrases` are drop-in fields for the existing notebook.
 * Optional listening.questions use a zero-based correctIndex.
 */
(() => {
  'use strict';
  const book = 'fltrp-8a-2024';
  const speakLabel = '站内原创听力稿 · 可用设备合成语音朗读 · 非教材原声';
  const readingLabel = '站内原创跟读材料 · 非教材原文';
  const line = (text, translation) => ({text, translation});
  const choice = (prompt, options, correctIndex, answer) => ({prompt, options, correctIndex, answer});
  const raw = [
    {
      title: 'This is me',
      label: 'This is me',
      theme: '认识自己：用一件小事介绍你的变化',
      passage: {
        title: 'A voice on the school radio',
        hint: '听出 have/has + 过去分词。说一件你以前不敢做、现在已经尝试过的事，再用 last week 讲一个具体时刻。',
        lines: [
          line('I have never liked speaking in front of a crowd.', '我一直不喜欢在一群人面前讲话。'),
          line('Last month, our class needed someone to read the school news.', '上个月，我们班需要一个人播报校园新闻。'),
          line('I wrote down three short sentences and practised after class.', '我写下三句简短的话，课后练习。'),
          line('My first recording was a little too fast.', '我的第一段录音有点太快了。'),
          line('Since then, I have recorded two more reports.', '从那以后，我又录了两段报道。'),
          line('I have learned to pause and breathe between sentences.', '我学会了在句子之间停顿、换气。'),
          line('I still get nervous, but now I know I can begin.', '我还是会紧张，但现在我知道自己能迈出第一步。')
        ]
      },
      grammar: [
        ['现在完成时：have/has + 过去分词', '用来说明到现在为止的经历或与现在有关的变化。I/you/we/they 用 have，he/she/it 用 has。', 'Mia has learned to speak more slowly.', 'Mia ___ ___ (learn) to speak more slowly.', 'has learned / has learnt。Mia 是第三人称单数，learn 的过去分词两种拼写均可。'],
        ['询问到目前为止的经历', '用 Have/Has + 主语 + 过去分词提问。ever 可表示“曾经”，never 表示“从未”，不需要再加 not。', 'Have you ever recorded a short talk?', 'Have you ever ___ (write) a speech?', 'written。write → wrote → written；have 后接过去分词。'],
        ['和一般过去时区分', 'last Friday、yesterday 等指已结束的明确过去时间。说那个时间发生了什么，通常用一般过去时。', 'I have tried it twice. I tried it again last Friday.', 'I ___ (record) my first talk yesterday.', 'recorded。yesterday 明确指出已结束的时间。']
      ],
      phrases: [
        ['in front of a crowd','在一群人面前','I feel nervous in front of a crowd.'],
        ['write down','写下、记下','Write down one thing you do well.'],
        ['a little too fast','有点太快','I spoke a little too fast at first.'],
        ['learn to do something','学会做某事','We have learned to take useful notes.'],
        ['take the first step','迈出第一步','Asking a question can help you take the first step.']
      ],
      listening: {
        title: 'A photo for the school wall',
        tip: '先听一个变化，再听具体时间。留意 already 和 last Friday 的不同作用。',
        script: [
          'Leo has always enjoyed taking photos, but until last week he only showed them to his family.',
          'Last Friday, his class put his picture of an old bridge on the school wall.',
          'Then two classmates asked him to teach them how to take better photos.',
          'He has already planned a ten-minute lesson for next Tuesday.'
        ],
        questions: [
          choice('What did Leo’s class put on the wall?', ['A photo of a bridge.', 'A drawing of his school.', 'A list of lessons.'],0,'听到 his picture of an old bridge，说明墙上贴的是一张桥的照片。'),
          choice('What has Leo already planned?', ['A class trip.', 'A short photo lesson.', 'A photo competition.'],1,'最后一句的 a ten-minute lesson 是关键信息。')
        ]
      },
      speaking: {
        prompt: '给新同学介绍自己 20 秒：一件你喜欢的事、一次你尝试过的经历、一个具体时间。',
        frames: ['I enjoy ...', 'I have tried ...', 'Last ..., I ...']
      }
    },
    {
      title: 'Getting along',
      label: 'Getting along',
      theme: '和别人相处：先问清楚，再找办法',
      passage: {
        title: 'One desk, two plans',
        hint: '找出两处持续到现在的表达。复述时交代“认识多久、发生什么、最后怎么解决”。',
        lines: [
          line('Lina and I have shared a desk since September.', '从九月起，我和莉娜一直同桌。'),
          line('We have known each other for nearly a year.', '我们认识快一年了。'),
          line('On Monday, I wanted to work in silence, but she wanted to talk about our project.', '周一，我想安静地做事，可她想讨论我们的小组项目。'),
          line('I took a deep breath and asked what she needed.', '我深吸一口气，问她需要什么。'),
          line('She only needed a minute to choose a topic with me.', '她只需要花一分钟和我一起选定一个主题。'),
          line('We agreed to talk after we finished the first task.', '我们约好完成第一项任务后再讨论。'),
          line('It was a small change, but it helped both of us.', '这只是个小调整，却帮到了我们两个人。')
        ]
      },
      grammar: [
        ['for + 一段时间', '说持续了多久，用 for + 时间长度，而不是起点。', 'They have worked together for six months.', 'We have known each other ___ (for / since) two years.', 'for。two years 表示时长。'],
        ['since + 起点或从句', '说从什么时候开始，用 since + 起点，也可接含一般过去时的从句。', 'We have been friends since we met in the art club.', 'I have shared a desk with Lina ___ (for / since) September.', 'since。September 在这里是起点。'],
        ['How long 问持续多久', '想问一段状态延续到现在多久，可以用 How long have/has…? 询问认识多久用 have known，而不是用表示初次见面的 have met 搭配持续时长。', 'How long have you known your desk mate?', 'How long ___ (have / has) Sam known Ben?', 'has。Sam 是第三人称单数。']
      ],
      phrases: [
        ['share a desk','同桌；合用一张桌子','I share a desk with Omar.'],
        ['take a deep breath','深吸一口气','Take a deep breath before you answer.'],
        ['work in silence','安静地做事','We worked in silence for ten minutes.'],
        ['agree to do something','同意、约定做某事','They agreed to talk after lunch.'],
        ['find a way that works for both of us','找到对双方都合适的办法','Let’s find a way that works for both of us.']
      ],
      listening: {
        title: 'A different job for each person',
        tip: '听清认识有多久，以及他们最后怎样分工。',
        script: [
          'Ming and Nora have been in the school art club for two years.',
          'Yesterday, they both wanted to design the same poster.',
          'Their teacher asked them to decide which jobs they liked best.',
          'Ming liked choosing colours, and Nora wanted to write the message, so they worked on one poster together.'
        ],
        questions: [
          choice('How long have they been in the club?', ['Since yesterday.', 'For two years.', 'For two months.'],1,'第一句的 for two years 表示持续两年。'),
          choice('What did Nora want to do?', ['Ask the teacher to work alone.', 'Choose the colours.', 'Write the message.'],2,'结尾说 Nora wanted to write the message；选颜色的是 Ming。')
        ]
      },
      speaking: {prompt:'说说你和一位同学怎样合作。先说认识了多久，再举一件你们商量解决的小事。',frames:['I have known ... for ...','At first, we wanted different things.','In the end, we agreed to ...']}
    },
    {
      title: 'Make it happen!',
      label: 'Make it happen!',
      theme: '让想法成真：从发现问题到动手改进',
      passage: {
        title: 'A bookmark that stays put',
        hint: '分别圈出 decided to 和 kept 后面的动词。用 Problem、Try、Change 三步讲一个你想做的小改造。',
        lines: [
          line('Our library bookmarks often fell out of thin books.', '我们图书馆的书签经常从薄书里掉出来。'),
          line('I decided to make a bookmark that could hold onto a corner.', '我决定做一种能夹在书页角上的书签。'),
          line('My first one covered two lines of text.', '我做的第一个挡住了两行字。'),
          line('I kept testing smaller shapes until the words were easy to see.', '我不断试验更小的形状，直到文字能看清楚。'),
          line('Two friends enjoyed folding the paper with me.', '两个朋友很喜欢和我一起折纸。'),
          line('We plan to leave a few bookmarks by the library door.', '我们打算在图书馆门边放几枚书签。'),
          line('Now other readers can try them and tell us what to change.', '现在其他读者也能试用，并告诉我们哪里需要改。')
        ]
      },
      grammar: [
        ['decide / plan + to do', '这些动词后说“决定、计划做什么”时，用 to + 动词原形。', 'We plan to test a paper model.', 'I decided ___ (change) the shape.', 'to change。decide to do 表示决定做某事。'],
        ['enjoy / keep / finish + doing', '这些动词后接另一动作时，后面的动作常用 -ing 形式，不加 to。', 'They kept trying new ideas.', 'Nina enjoys ___ (fold) paper.', 'folding。enjoy 后接 doing。'],
        ['两种结构放在一句里', '先找每个空前面的动词，再决定用 to do 还是 doing；不是所有实义动词都接同一种形式。', 'We hope to finish it tomorrow, so we keep working today.', 'I finished ___ (draw) the plan and hope ___ (build) a model tomorrow.', 'drawing；to build。finish 接 doing，hope 接 to do。']
      ],
      phrases: [
        ['fall out of','从……掉出来','My pencil fell out of my bag.'],
        ['hold onto','抓住；夹住','This clip holds onto the edge of the paper.'],
        ['try a different shape','试试不同的形状','Let’s try a different shape for the sign.'],
        ['make a small change','做个小改动','We made a small change after the first test.'],
        ['ask for feedback','征求反馈','Ask for feedback before making another one.']
      ],
      listening: {
        title: 'A dry place for water bottles',
        tip: '听清第一版出了什么问题，以及改动怎样解决问题。',
        script: [
          'Wet water bottles often left puddles on our classroom shelf.',
          'Ava wanted to build a small tray for them.',
          'Her first tray was too narrow for the big bottles, so she kept measuring until she found a better size.',
          'Now the tray holds four bottles, and our class plans to test it for a week.'
        ],
        questions: [
          choice('What was wrong with the first tray?', ['It was too heavy.', 'It was too narrow.', 'It was too short.'],1,'too narrow for the big bottles 表示托盘太窄，大水瓶放不下。'),
          choice('How long does the class plan to test it?', ['For a morning.', 'For a month.', 'For a week.'],2,'注意结尾 for a week；four 是能放下的水瓶数量。')
        ]
      },
      speaking: {prompt:'介绍一个你可以在教室里做的小改造。说清它帮谁解决什么、你打算怎么试。',frames:['The problem is ...','I plan to ...','I will keep testing until ...']}
    },
    {
      title: 'Digital life',
      label: 'Digital life',
      theme: '数字生活：让设备帮到你，而不是打断你',
      passage: {
        title: 'A quieter homework hour',
        hint: '听清谁对谁提出要求。找出 told me to、asked my family not to 和 reminded me to。',
        lines: [
          line('I often checked my messages in the middle of homework.', '做作业做到一半时，我常常去看消息。'),
          line('One evening, my brother told me to turn off notifications for twenty minutes.', '一天晚上，哥哥让我关掉通知二十分钟。'),
          line('I asked my family not to send me videos during that time.', '我请家人在那段时间不要给我发视频。'),
          line('A timer reminded me to take a short break later.', '之后，计时器提醒我休息一会儿。'),
          line('I finished one hard question without looking at my phone.', '我没看手机就完成了一道难题。'),
          line('After my break, I used the phone to check a new word.', '休息后，我用手机查了一个生词。'),
          line('I did not have to give up my phone; I just used it at the right time.', '我不必彻底不用手机，只是在合适的时间使用它。')
        ]
      },
      grammar: [
        ['ask / tell + 某人 + to do', '宾语后面的 to do 说明希望或要求这个人做什么。注意 to do 的动作是谁做的。', 'Dad asked me to put the phone away.', 'Our teacher told us ___ (save) the file.', 'to save。us 是要保存文件的人。'],
        ['ask / tell + 某人 + not to do', '如果要求某人不要做某事，否定词 not 放在 to 前面。', 'She asked me not to share the photo.', 'My friend asked me ___ (not post) the video.', 'not to post。结构是 asked me not to do。'],
        ['remind + 某人 + to do', '说明提醒谁去做某事，先接人，再接 to + 动词原形。', 'The timer reminded me to take a break.', 'Please remind Kai ___ (check) the time.', 'to check。Kai 是需要查看时间的人。']
      ],
      phrases: [
        ['turn off notifications','关闭通知','I turn off notifications when I study.'],
        ['in the middle of','在……中途','The message arrived in the middle of class.'],
        ['put the phone away','把手机收起来','I put the phone away until dinner.'],
        ['take a short break','短暂休息一下','Take a short break before reading again.'],
        ['look up a word','查一个词','I looked up a word in an online dictionary.']
      ],
      listening: {
        title: 'A better group-chat habit',
        tip: '把旧习惯、新约定和例外分开听。',
        script: [
          'Our group chat used to be noisy after nine at night.',
          'We asked everyone to send ordinary messages before eight thirty.',
          'Our group leader reminded us to call instead if something really could not wait.',
          'After a week, people said it was easier to finish their evening reading.'
        ],
        questions: [
          choice('When should people send ordinary messages?', ['Before 8:30 p.m.', 'After 9 p.m.', 'Only in the morning.'],0,'before eight thirty 是新约定；after nine 描述以前的情况。'),
          choice('What should a person do if something cannot wait?', ['Send the same message twice.', 'Wait until the next day.', 'Make a phone call.'],2,'call instead 指遇到真的不能等的事，改用电话沟通。')
        ]
      },
      speaking: {prompt:'给自己设计一段不被打断的学习时间。用英语说一句你会请朋友做什么，以及一句设备可以提醒你做什么。',frames:['I will ask my friends to ...','I will ask them not to ...','My timer can remind me to ...']}
    },
    {
      title: 'Play by the rules?',
      label: 'Play by the rules?',
      theme: '理解规则：说清做法和它想解决的问题',
      passage: {
        title: 'A fair turn in the reading corner',
        hint: '把句中的 to do 换问成“为了什么”。再选一条班级规则，用英语解释它有什么用。',
        lines: [
          line('Our reading corner has four seats, but many students want to use it at lunch.', '我们的阅读角有四个座位，但午饭时间有很多学生想用。'),
          line('We made a sign-up sheet to give everyone a fair turn.', '我们做了一张登记表，好让每个人都有公平的使用机会。'),
          line('Each person writes down a name and chooses one fifteen-minute slot.', '每个人写下名字，并选一个十五分钟的时段。'),
          line('To keep the seats open for readers, we do not leave bags there.', '为了让座位留给读者，我们不把书包放在那里占座。'),
          line('Last week, a new student spent half of her first slot looking for the room.', '上周有位新同学在第一个时段里花了一半时间找阅读角。'),
          line('We put up a map near the door to help new students find it.', '我们在门边贴了一张地图，帮助新同学找到它。'),
          line('A useful rule works better when people know why it is there.', '大家知道规则是为什么设立的，有用的规则才能更好地发挥作用。')
        ]
      },
      grammar: [
        ['to do 表示目的', '在一个动作后加 to + 动词原形，回答“做这件事是为了什么”。', 'We made a sign to explain the rule.', 'We drew a map ___ (help) new students.', 'to help。画地图是为了帮助新同学。'],
        ['把目的放到句首', '强调目的时，可把 To do… 或 In order to do… 放在句首，通常用逗号把它与主句隔开。', 'To save space, we put the bags under the table.', '___ (keep) the doorway clear, we moved the boxes.', 'To keep。移开箱子是为了让门口保持畅通。'],
        ['辨别相同形式的不同作用', '同样是 to + 动词原形，want to read 说明“想做什么”，come here to read 说明“来这里的目的”。', 'I want to read. I came here to read.', 'Which to read answers “Why did I come here?” A. I wanted to read. B. I came here to read.', 'B。后一处 to read 是 come here 的目的；A 是 want 的宾语。']
      ],
      phrases: [
        ['give everyone a fair turn','让每个人都有公平的机会','Take turns to give everyone a fair turn.'],
        ['put up a sign','张贴一块标牌','We put up a sign near the door.'],
        ['keep the doorway clear','保持门口畅通','Keep the doorway clear before the meeting.'],
        ['follow the rules','遵守规则','It is easier to follow the rules when they are clear.'],
        ['make room for','给……腾出空间','We moved a chair to make room for the visitors.']
      ],
      listening: {
        title: 'Three minutes for a turn',
        tip: '重点听“限制多久”和“为什么要设限”，别把目的与流程细节混在一起。',
        script: [
          'At our school fair, many students waited to try a robot game.',
          'We set a three-minute limit to give more students a turn.',
          'Each player moved to the end of the line after playing.',
          'We also made a short instruction card to help new players start quickly.'
        ],
        questions: [
          choice('Why did they set a three-minute limit?', ['To finish the fair earlier.', 'To give more students a turn.', 'To charge each player less.'],1,'to give more students a turn 明确说明了设限的目的。'),
          choice('What helped new players start quickly?', ['A short instruction card.', 'An extra robot.', 'A new game controller.'],0,'最后一句提到 a short instruction card。')
        ]
      },
      speaking: {prompt:'为图书角、教室或运动场设计一条规则，再说为什么。注意规则是建议，不是要求同学无条件服从。',frames:['Our rule is ...','We made it to ...','It helps people ...']}
    },
    {
      title: 'When disaster strikes',
      label: 'When disaster strikes',
      theme: '讲述突发事件：说清当时在做什么、接着发生了什么',
      passage: {
        title: 'When the lights went out',
        hint: '听一遍区分背景动作和突然发生的事件。再用 When 或 While 说一句你自己的虚构故事。',
        lines: [
          line('A storm was passing over our town late on Friday.', '星期五晚些时候，一场暴风雨正在经过我们的小镇。'),
          line('I was doing my homework when the lights went out.', '停电时，我正在做作业。'),
          line('My sister was reading on the sofa, and my father was making dinner.', '姐姐在沙发上看书，爸爸正在做晚饭。'),
          line('Dad found a torch, and we sat together in the living room.', '爸爸找来一个手电筒，我们一起坐在客厅里。'),
          line('While we were waiting, my sister told us a story.', '等待时，姐姐给我们讲了个故事。'),
          line('The lights came back about an hour later.', '大约一小时后，灯又亮了。'),
          line('I remember the story more clearly than the storm.', '比起那场暴风雨，我对那个故事记得更清楚。')
        ]
      },
      grammar: [
        ['过去进行时：was / were + doing', '说过去某个时刻正在做什么，用 was/were + 动词-ing。主语 I/he/she/it 用 was，you/we/they 用 were。', 'At seven last night, we were eating dinner.', 'At nine yesterday, Mum ___ ___ (read) a book.', 'was reading。Mum 是单数，这里描述当时正在发生的动作。'],
        ['when：持续背景与突然事件', '一个过去动作正在进行时，另一个动作突然发生，常用“过去进行时 + when + 一般过去时”。', 'I was writing when the lights went out.', 'We ___ ___ (wait) when the bus arrived.', 'were waiting。等车是背景，arrived 是随后发生的动作。'],
        ['while：交代同时发生的动作', 'while 可引出持续的动作；两件事在同一个过去时段进行时，可以两边都用过去进行时。', 'While I was reading, my brother was packing his bag.', 'While we were talking, our neighbour ___ ___ (look) for a torch.', 'was looking。两件事同时在发生，our neighbour 是单数。']
      ],
      phrases: [
        ['the lights went out','灯熄了；停电了','The lights went out during the storm.'],
        ['look for a torch','找手电筒','We were looking for a torch.'],
        ['about an hour later','大约一小时以后','The bus arrived about an hour later.'],
        ['at the same time','同时','Two things happened at the same time.'],
        ['stay calm','保持镇定','We tried to stay calm and listen.']
      ],
      listening: {
        title: 'The storm outside the library',
        tip: '先听清雨开始前在做什么，再听地点和广播。内容是虚构听力练习，不是应急指南。',
        script: [
          'I was returning a book at the library desk when the rain suddenly grew much heavier.',
          'Several students were waiting by the windows.',
          'We heard an announcement asking everyone to move away from the windows.',
          'While we were waiting in the reading area, a member of staff checked that everyone was there.'
        ],
        questions: [
          choice('What was the speaker doing when the rain grew heavier?', ['Reading by a window.', 'Returning a book.', 'Leaving the library.'],1,'was returning a book 交代雨势变大时正在做的事。'),
          choice('Where did the group wait after the announcement?', ['In the reading area.', 'Outside the library.', 'Beside the windows.'],0,'结尾 while we were waiting in the reading area 说了之后等待的位置。')
        ]
      },
      speaking: {prompt:'用英语讲一段 25 秒的虚构大雨小故事：时间、背景动作、突然发生的事、最后结果。',frames:['At about ..., I was ...','When ... happened, we were ...','In the end, ...']}
    }
  ];
  window.TJ_FLTRP_META = Object.freeze({
    id: book,
    name: '外研版 · 英语八年级上册',
    edition: '2024 审定 · 修订六单元版',
    publisher: '外语教学与研究出版社',
    publisherConfirmation: 'https://www.fltrp.com/c/2025-10-23/539593.shtml',
    disclaimer: '本页依据教材单元与语法主题组织原创练习。跟读文、例句、练习和听力稿均非教材原文。朗读使用设备合成语音，不是教材原声。',
    originalAudio: false
  });
  window.TJ_FLTRP_UNITS = raw.map((row, index) => {
    const number = index + 1, id = `${book}-u${number}`;
    return {
      ...row, id, number, book, original: true,
      passage: {...row.passage,id:`${id}-read`,sourceLabel:readingLabel},
      listening: {...row.listening,id:`${id}-listen`,sourceLabel:speakLabel,original:true,language:'en',questions:row.listening.questions.map((q,j)=>({...q,id:`${id}-listen-q${j+1}`}))},
      speaking: {...row.speaking,id:`${id}-speak`}
    };
  });
})();
(() => {
 "use strict";
 const units=window.TJ_FLTRP_UNITS??[];
 const tabs=[['audio','听力练习'],['read','逐句跟读'],['grammar','语法练习'],['phrases','短语积累']];
 const guide='https://www.fltrp.com/c/2025-10-23/539593.shtml';
 const workbook='https://www.fltrp.com/fltrp/ui/catalog/15266/pc/index_15.shtml';
 const route=ctx=>{const i=Number(ctx.params?.unit);return{unit:i>=1&&i<=units.length&&Number.isInteger(i)?i:1,tab:tabs.some(([k])=>k===ctx.params?.tab)?ctx.params.tab:'audio'}};
 const asReading=(ctx,row)=>({...ctx,state:{...ctx.state,page:'english'},content:{...ctx.content,english:[{...row.passage,id:row.id}]}});
 function panel(ctx,row,tab){
  const {esc}=ctx;
  if(tab==='read')return '<div class="en-embedded">'+window.renderReading(asReading(ctx,row))+'</div>'+(row.speaking?`<section class="panel en-card"><h2>开口任务</h2><p>${esc(row.speaking.prompt)}</p><details><summary>需要时再看句型</summary><ul>${row.speaking.frames.map(f=>`<li lang="en">${esc(f)}</li>`).join('')}</ul></details></section>`:'');
  if(tab==='audio'){
   const listen=row.listening??{},lines=listen.script??row.passage.lines,checks=listen.questions??[];
   return `<section class="panel en-card"><span class="pill">自编听力 · 非课本原声</span><h2>${esc(listen.title||row.passage.title)}</h2><p>先听一遍，不看文本；答完再核对，最后试着复述。</p>
    <div class="actions"><button class="btn primary" type="button" data-tj-audio="play">播放本单元听力</button><button class="btn" type="button" data-tj-audio="stop">停止</button></div><p class="muted" role="status" data-tj-voice>使用本机英语合成语音，不是出版社录音。</p>
    <div class="en-entries">${checks.map((q,i)=>{const label=q.question??q.prompt,opts=q.options??q.choices??[],answer=Number.isInteger(q.correctIndex)?opts[q.correctIndex]:'';return `<article class="en-note"><h3 lang="en">${i+1}. ${esc(label)}</h3><ol type="A">${opts.map(o=>`<li lang="en">${esc(o)}</li>`).join('')}</ol><details><summary>核对答案</summary><p>${esc(answer)} ${esc(q.answer??'')}</p></details></article>`}).join('')}</div>
    <details><summary>查看听力文本</summary><ol>${lines.map(x=>`<li lang="en">${esc(typeof x==='string'?x:x.text)}</li>`).join('')}</ol></details></section>
    <section class="panel en-card"><h2>找教材配套资源</h2><p>课本录音请按手边教材的二维码或老师给的资源查找。下方外研社公开音频是对应的同步练习册，不是课本文本的录音。</p><div class="actions"><a class="btn" href="${guide}" target="_blank" rel="noopener">外研社配套说明</a><a class="btn" href="${workbook}" target="_blank" rel="noopener">外研社同步练习册音频</a></div></section>`;
  }
  if(tab==='grammar')return `<section class="panel en-card"><h2>单元语法练习</h2><p class="muted">按该单元的语法方向编写，例句和题目是原创。</p><div class="en-entries">${row.grammar.map(([name,point,example,quiz,answer])=>`<article class="en-note"><h3>${esc(name)}</h3><p>${esc(point)}</p><p class="en-example" lang="en">${esc(example)}</p><p lang="en">${esc(quiz)}</p><details><summary>对照答案</summary><p>${esc(answer)}</p></details></article>`).join('')}</div></section>`;
  return `<section class="panel en-card"><h2>单元短语练习</h2><p class="muted">这些是主题拓展，不是课本词汇表。先回忆意思，再试着换一个场景造句。</p><div class="en-entries">${row.phrases.map(([phrase,meaning,example])=>`<article class="en-note"><h3 lang="en">${esc(phrase)}</h3><details><summary>对照意思和例句</summary><p>${esc(meaning)}</p><p class="en-example" lang="en">${esc(example)}</p></details></article>`).join('')}</div></section>`;
 }
 window.renderEnglishNotebook=ctx=>{
  if(!units.length)return '<p class="panel" role="alert">暂时无法加载外研社八上单元，请刷新后重试。</p>';
  const {unit,tab}=route(ctx),r=units[unit-1],{esc}=ctx;
  return `<section class="en-notebook" aria-label="英语单元手账"><div class="en-intro"><p class="eyebrow">外研社 · 八年级上册 · 新版</p><h1>英语单元手账</h1><p class="muted">按你这版教材的六个单元安排，站内听力、文章和练习为原创，不是教材全文或录音。</p></div>
   <div class="en-unit-list" role="group" aria-label="切换教材单元">${units.map((x,i)=>`<button type="button" class="btn ${i+1===unit?'primary':''}" data-en-unit="${i+1}" aria-label="Unit ${i+1} ${esc(x.title)}" aria-pressed="${i+1===unit}">U${i+1}</button>`).join('')}</div>
   <p class="en-unit-label" lang="en">Unit ${unit} · ${esc(r.title)}</p><div class="en-view-list" role="group" aria-label="切换英语学习功能">${tabs.map(([id,label])=>`<button type="button" data-en-tab="${id}" class="btn ${id===tab?'primary':''}" aria-pressed="${id===tab}">${label}</button>`).join('')}</div>
   <div class="en-pane">${panel(ctx,r,tab)}</div></section>`;
 };
 let playback=null;
 const stop=()=>{if(!playback)return;playback.observer?.disconnect();playback.synth.cancel();playback=null;};
 function play(ctx,shell,row){
  stop();
  const label=shell.querySelector('[data-tj-voice]'),synth=window.speechSynthesis;
  const voice=synth?.getVoices().find(v=>v.localService&&/^en(?:-|_|$)/i.test(v.lang));
  if(!voice||typeof SpeechSynthesisUtterance!=='function'){label.textContent='当前设备没有可用的本地英语语音，可以先展开听力文本练读。';return;}
  const lines=row.listening?.script??row.passage.lines;
  const speech=new SpeechSynthesisUtterance(lines.map(x=>typeof x==='string'?x:x.text).join(' '));
  speech.voice=voice;speech.lang=voice.lang;speech.rate=.86;
  const observer=new MutationObserver(()=>{if(!shell.isConnected)stop();});
  observer.observe(ctx.root,{childList:true,subtree:true});playback={synth,observer,speech};
  const end=message=>{if(playback?.speech===speech){observer.disconnect();playback=null;label.textContent=message;}};
  speech.onend=()=>end('播放完毕。');speech.onerror=()=>end('没有完成播放，可以重试或展开文本。');label.textContent='正在播放原创听力…';synth.speak(speech);
 }
 window.bindEnglishNotebook=ctx=>{
  const {unit,tab}=route(ctx),row=units[unit-1],shell=ctx.root.querySelector('.en-notebook');
  if(!shell||!row)return;
  shell.onclick=e=>{
   const b=e.target.closest('button[data-en-unit],button[data-en-tab],button[data-tj-audio]');if(!b)return;
   if(b.dataset.tjAudio==='play'){play(ctx,shell,row);return;}
   if(b.dataset.tjAudio==='stop'){stop();shell.querySelector('[data-tj-voice]').textContent='已停止。';return;}
   stop();const nextUnit=Number(b.dataset.enUnit)||unit,nextTab=b.dataset.enTab??tab;
   if(nextUnit!==unit||nextTab!==tab)ctx.go('english',{unit:nextUnit,tab:nextTab});
  };
  if(tab==='read')window.bindReading(asReading(ctx,row));else window.cleanupReading?.();
 };
})();
