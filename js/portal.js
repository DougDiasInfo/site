(function(){
  const BASE='config/portal.json';
  const OVERRIDE='dmPortalData';
  const fallback={site:{name:'DM Informática',eyebrow:'Portal de Tecnologia',headline:'Tecnologia que simplifica.',description:'Serviços, notícias, downloads, tutoriais e suporte técnico em um único lugar.',status:'Sistemas operacionais',whatsapp:'5531999291567'},news:[],downloads:[]};
  async function load(){
    try{
      const local=localStorage.getItem(OVERRIDE);
      if(local) return JSON.parse(local);
      const r=await fetch(BASE,{cache:'no-store'}); if(!r.ok) throw new Error(); return await r.json();
    }catch(e){return fallback;}
  }
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const date=d=>{try{return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(d+'T12:00:00')).replace('.','')}catch{return d}};
  const getVideos=()=>{try{return window.DM_VIDEOS||[]}catch{return[]}};
  async function boot(){
    const data=await load(); try{ const c=await fetch('config/catalog.json',{cache:'no-store'}); if(c.ok){const cat=await c.json(); data.services=cat.services||[];} }catch(e){} window.DM_PORTAL=data;
    document.querySelectorAll('[data-site-name]').forEach(e=>e.textContent=data.site.name);
    document.querySelectorAll('[data-headline]').forEach(e=>e.textContent=data.site.headline);
    document.querySelectorAll('[data-site-description]').forEach(e=>e.textContent=data.site.description);
    const hero=document.querySelector('#portalHero'); if(hero) hero.innerHTML=`<span class="portal-eyebrow"><i class="fa-solid fa-sparkles"></i>${esc(data.site.eyebrow)}</span><h1>${esc(data.site.headline)}</h1><p>${esc(data.site.description)}</p><div class="hero-actions"><a class="btn btn-primary" href="programas.html">Explorar soluções <i class="fa-solid fa-arrow-right"></i></a><a class="btn btn-secondary" href="https://wa.me/${esc(data.site.whatsapp)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Falar com a DM</a></div>`;
    renderNews(data.news); renderDownloads(data.downloads); renderStats(data); setupSearch(data); setupBackTop();
  }
  function renderNews(items){const el=document.querySelector('#portalNews');if(!el)return;el.innerHTML=items.length?items.map(n=>`<article class="portal-card news-card"><a href="${esc(n.link||'#')}"><div class="portal-thumb"><img src="${esc(n.image)}" alt="" loading="lazy"><span>${esc(n.category)}</span></div><div class="portal-content"><small>${date(n.date)}</small><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><strong>Leia mais <i class="fa-solid fa-arrow-right"></i></strong></div></a></article>`).join(''):`<div class="empty-state">Nenhuma notícia cadastrada.</div>`}
  function renderDownloads(items){const el=document.querySelector('#portalDownloads');if(!el)return;const featured=items.filter(x=>x.featured).slice(0,3);el.innerHTML=featured.length?featured.map(d=>`<article class="download-card"><div class="download-icon"><i class="fa-solid fa-box-archive"></i></div><div><span class="download-tag">${esc(d.category)}</span><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p><div class="download-meta"><b>v${esc(d.version)}</b><span>${esc(d.size||'')}</span><span>${date(d.date)}</span></div></div><a class="download-action" href="${esc(d.url||'#')}" ${d.url&&d.url!=='#'?'download':''} aria-label="Baixar ${esc(d.name)}"><i class="fa-solid fa-download"></i></a></article>`).join(''):`<div class="empty-state">Nenhum download em destaque.</div>`}
  function renderStats(data){const s=document.querySelector('#portalStats');if(!s)return;s.innerHTML=`<div><b>${data.news.length}</b><span>notícias</span></div><div><b>${data.downloads.length}</b><span>downloads</span></div><div><b>24/7</b><span>conteúdo online</span></div><div><b>1</b><span>central digital</span></div>`}
  function setupSearch(data){const input=document.querySelector('#globalSearch');const panel=document.querySelector('#searchResults');if(!input||!panel)return;const all=[...data.news.map(x=>({...x,type:'Notícia',target:x.link||'#'})),...data.downloads.map(x=>({...x,type:'Download',target:'downloads.html'})),...(data.services||[]).map(x=>({...x,type:'Serviço',target:'programas.html'})),...getVideos().map(x=>({...x,type:'Vídeo',target:'videos.html'}))];const run=()=>{const q=input.value.trim().toLowerCase();if(!q){panel.classList.remove('show');return}const found=all.filter(x=>[x.title,x.name,x.description,x.summary,x.category,x.tag].filter(Boolean).join(' ').toLowerCase().includes(q)).slice(0,8);panel.innerHTML=found.length?found.map(x=>`<a href="${esc(x.target)}"><i class="fa-solid ${x.type==='Download'?'fa-download':x.type==='Vídeo'?'fa-play':x.type==='Serviço'?'fa-server':'fa-newspaper'}"></i><span><b>${esc(x.title||x.name)}</b><small>${esc(x.type)}${x.category?' · '+esc(x.category):''}</small></span></a>`).join(''):`<div class="search-empty">Nenhum resultado encontrado.</div>`;panel.classList.add('show')};input.addEventListener('input',run);input.addEventListener('focus',run);document.addEventListener('click',e=>{if(!e.target.closest('.global-search'))panel.classList.remove('show')})}
  function setupBackTop(){const b=document.querySelector('#backTop');if(!b)return;addEventListener('scroll',()=>b.classList.toggle('visible',scrollY>500));b.onclick=()=>scrollTo({top:0,behavior:'smooth'})}
  boot();
})();
