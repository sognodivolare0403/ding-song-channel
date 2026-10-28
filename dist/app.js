(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const posts = window.DING_POSTS;
  const escapeHtml = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let filter = '全部';
  function renderPosts() {
    const query = $('#search').value.trim().toLowerCase();
    const filtered = posts.filter(p => (filter === '全部' || p.category === filter) && [p.title,p.originalTitle||'',p.summary,p.author,p.category,p.date,p.replies].join(' ').toLowerCase().includes(query));
    $('#post-list').innerHTML = [...filtered].reverse().map(p => `<details class="post"><summary><span class="post-date">${p.date.replaceAll('-','.')}</span><span class="post-category">${p.category}</span><span class="post-title">${escapeHtml(p.title)}${p.featured?'<span class="post-badge">精华</span>':''}${p.pinned?'<span class="post-badge">置顶</span>':''}</span><span class="post-arrow" aria-hidden="true">↗</span></summary><div class="post-content"><p class="post-author">原帖发布者：${escapeHtml(p.author)} · ${p.date}</p><p>${escapeHtml(p.summary)}</p><p>回复切片：${escapeHtml(p.replies)}</p><a class="post-source" href="https://tieba.baidu.com/p/${p.id}" target="_blank" rel="noopener">回到原帖 · ${p.id} ↗</a></div></details>`).join('');
    $('#results-count').textContent = `${String(filtered.length).padStart(2,'0')} / 21 FRAGMENTS`;
    $('#no-results').hidden = filtered.length > 0;
  }
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => {const selected = b === btn;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
    renderPosts();
  }));
  $('#search').addEventListener('input',renderPosts);
  renderPosts();
  const channels = [
    {category:'换台频道',quote:'谁来帮我<br>换个台',caption:'节目还在播，遥控器先失踪了。',date:'2016.05.11',id:'4540854568'},
    {category:'少儿频道',quote:'少儿频道<br>也行',caption:'成年人看了，也得说一句：行。',date:'2016.05.23',id:'4566231721'},
    {category:'挑战频道',quote:'今天我要挑战<br>通宵看电视',caption:'挑战很大。建议先把明天请好假。',date:'2016.05.29',id:'4579082865'},
    {category:'优秀频道',quote:'优秀，<br>非常优秀。',caption:'节目获得一条来自 2016 年的认可。',date:'2016.07.10',id:'4659643001'}
  ];
  let current = 0, on = true, switchTimer;
  const screen = $('#screen');screen.tabIndex=0;screen.setAttribute('role','region');screen.setAttribute('aria-label','互动电视，左右方向键换台，空格开关');
  function setPower(state) {
    on=state;screen.classList.toggle('off',!on);$('#power').setAttribute('aria-pressed',String(on));$('#power b').textContent=on?'关电视':'开电视';
    $('#power').setAttribute('aria-label',on?'关闭电视':'打开电视');
    document.querySelector('.screen-content').setAttribute('aria-hidden',String(!on));
    $('#channel-source').tabIndex=on?0:-1;
  }
  function setChannel(index) {
    current=(index+channels.length)%channels.length;
    const channel=channels[current];setPower(true);
    $('#channel-id').textContent=`CH. ${String(current+1).padStart(2,'0')}`;
    $('#channel-category').textContent=channel.category;$('#channel-quote').innerHTML=channel.quote;$('#channel-caption').textContent=channel.caption;
    $('#channel-date').textContent=`${channel.date} / 原帖切片`;$('#channel-source').href=`https://tieba.baidu.com/p/${channel.id}`;
    document.querySelectorAll('[data-channel]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.channel)===current)));
    clearTimeout(switchTimer);screen.classList.remove('switching');requestAnimationFrame(()=>screen.classList.add('switching'));switchTimer=setTimeout(()=>screen.classList.remove('switching'),250);
  }
  document.querySelectorAll('[data-channel]').forEach(b=>b.addEventListener('click',()=>setChannel(Number(b.dataset.channel))));
  $('#next-channel').addEventListener('click',()=>setChannel(current+1));$('#power').addEventListener('click',()=>setPower(!on));
  screen.addEventListener('keydown',e=>{if(e.target!==screen)return;if(e.code==='Space'){e.preventDefault();setPower(!on);}else if(e.key==='ArrowRight'){e.preventDefault();setChannel(current+1);}else if(e.key==='ArrowLeft'){e.preventDefault();setChannel(current-1);}});
  const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');let reduced=motionQuery.matches;
  const motionButton=$('#motion');
  function applyMotion(){document.documentElement.classList.toggle('reduced-motion',reduced);motionButton.setAttribute('aria-pressed',String(reduced));motionButton.setAttribute('aria-label',reduced?'启用动画':'暂停动画');motionButton.lastElementChild.textContent=reduced?'动态 OFF':'动态 ON';}
  motionButton.addEventListener('click',()=>{reduced=!reduced;applyMotion();});applyMotion();
  motionQuery.addEventListener('change',e=>{reduced=e.matches;applyMotion();});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));}else document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));
  const hero=$('.hero');hero.addEventListener('pointermove',e=>{if(reduced||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();hero.style.setProperty('--px',`${(e.clientX-r.left-r.width/2)*.012}px`);hero.style.setProperty('--py',`${(e.clientY-r.top-r.height/2)*.01}px`);});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--px','0px');hero.style.setProperty('--py','0px');});
  let scheduled=false;
  function progress(){const length=document.documentElement.scrollHeight-innerHeight;$('#scroll-progress').style.width=`${length>0?scrollY/length*100:0}%`;scheduled=false;}
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();
})();
