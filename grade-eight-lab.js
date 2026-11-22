"use strict";
(() => {
const content = {
生物: {
 title:'种子萌发：用数据判断条件', skill:'会考专项 · 实验探究', intro:'同批种子、同样温度和光照，同样观察 5 天。观察两组发芽数，找出唯一改变的条件。',
 visual:`<table class="study-table"><thead><tr><th scope="col">组别</th><th scope="col">滤纸条件</th><th scope="col">种子数</th><th scope="col">发芽数</th></tr></thead><tbody><tr><th scope="row">甲</th><td>湿润</td><td>20</td><td>18</td></tr><tr><th scope="row">乙</th><td>干燥</td><td>20</td><td>0</td></tr></tbody></table>`,
 steps:['先圈出不同条件：滤纸是否湿润。','用数字作证据：甲组 18/20 发芽，乙组 0/20。','只下本实验支持的结论：在本实验条件下，水分有助于种子萌发。'],
 question:'如果乙组温度也更低，还能把两组发芽差异只归因于水分吗？',
 options:['能，因为甲组发芽更多','不能，因为乙组同时改变了水分和温度','能，因为两组种子数相同'],
 answer:1, explain:'同时改了两个变量，就无法判断结果差异来自哪一个。只改水分，温度等条件保持一致。', topic:'科学探究'
},
地理:{
 title:'读等高线：定位、看图例、再解释', skill:'会考专项 · 地图判读', intro:'这是原创示意图，不是真实地形。三条等高线之间的高度差相同，P、Q 所示水平线段分别覆盖相同的高差。',
 visual:`<svg class="study-map" viewBox="0 0 430 160" role="img" aria-label="原创等高线示意图。三条等高线分别标记100米、200米、300米；P一侧线更密，Q一侧线更疏。"><rect x="2" y="2" width="426" height="156" rx="15" fill="#fff9fb"/><g fill="none" stroke="#845159" stroke-width="2"><path d="M28,80C27,14 340,14 393,62S342,141 186,141 34,125 28,80Z"/><path d="M47,79C44,27 286,34 330,65S285,129 171,128 54,116 47,79Z"/><path d="M64,80C65,40 239,49 267,67S255,117 160,113 66,108 64,80Z"/></g><g font-size="13" font-family="system-ui" fill="#633443"><text x="21" y="76">P</text><text x="401" y="79">Q</text><text x="72" y="42">100 m</text><text x="125" y="43">200 m</text><text x="147" y="68">300 m</text></g><path stroke="#b15376" stroke-width="3" d="M30 90h44m185 0h133"/></svg>`,
 steps:['先读线上的高度：100、200、300 米，相邻两线高差都是 100 米。','再比较水平距离：通过相同的高差，P 一侧线更密，路程更短。','用证据写结论：P 侧较陡，因为相同高差对应较短水平距离。'],
 question:'若只凭图上的线距来判坡度，哪条信息应该先确认？',
 options:['地图上的颜色好不好看','相邻等高线的高差是否相同','原图的拍摄日期'],
 answer:1, explain:'线疏密表示水平距离差，但比较坡度还要控制高差。等高距相同，再判断密陡、疏缓。', topic:'等高线'
}};
function render(c){
 const d=content[c.params.subject];if(!d)return '';
 return `<section class="panel grade-lab"><p class="eyebrow">${c.esc(d.skill)}</p><h2>${c.esc(d.title)}</h2><p>${c.esc(d.intro)}</p>${d.visual}
 <details><summary>看一遍怎么分析</summary><ol>${d.steps.map(t=>`<li>${c.esc(t)}</li>`).join('')}</ol></details>
 <form id="grade-lab-form"><fieldset><legend>${c.esc(d.question)}</legend>${d.options.map((x,i)=>`<label><input required type="radio" name="pick" value="${i}"> ${c.esc(x)}</label>`).join('')}</fieldset><button class="btn primary" type="submit">检查我的判断</button> <button class="btn" type="button" data-nav="practice" data-subject="${c.esc(c.params.subject)}">去同科练习</button><div class="grade-result" role="status"></div></form></section>`;
}
function bind(c){const form=c.root.querySelector('#grade-lab-form');if(!form)return;const d=content[c.params.subject];form.addEventListener('submit',e=>{e.preventDefault();const ok=Number(new FormData(form).get('pick'))===d.answer;form.querySelector('.grade-result').textContent=(ok?'答对了。':'再想一遍。')+d.explain;});}
window.renderGradeEightLab=render;window.bindGradeEightLab=bind;
})();
