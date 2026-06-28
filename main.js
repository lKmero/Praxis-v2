// Header scroll
const header=document.getElementById('header');
if(header)window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});

// Hamburger / mobile nav
const hamburger=document.getElementById('hamburger'),mobileNav=document.getElementById('mobile-nav');
if(hamburger&&mobileNav){
  hamburger.addEventListener('click',()=>{
    const open=mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open',open);
    hamburger.setAttribute('aria-expanded',open);
    document.body.style.overflow=open?'hidden':'';
  });
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileNav.classList.remove('open');hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');document.body.style.overflow='';
  }));
}

// Language toggle — persisted via URL param ?lang=en
(function(){
  var params=new URLSearchParams(location.search);
  var lang=params.get('lang')||'de';
  var btn=document.getElementById('lang-toggle');
  function apply(l){
    lang=l;
    document.documentElement.lang=l;
    document.querySelectorAll('[data-de]').forEach(function(el){
      var val=el.getAttribute('data-'+l);
      if(val!==null)el.textContent=val;
    });
    document.querySelectorAll('[data-de-placeholder]').forEach(function(el){
      var val=el.getAttribute('data-'+l+'-placeholder');
      if(val)el.placeholder=val;
    });
    if(btn)btn.textContent=l==='de'?'EN':'DE';
    document.querySelectorAll('a[href]').forEach(function(a){
      var href=a.getAttribute('href');
      if(!href||href.startsWith('http')||href.startsWith('mailto')||href.startsWith('tel')||href.startsWith('#'))return;
      var u=new URL(href,location.href);
      if(l==='en'){u.searchParams.set('lang','en');}else{u.searchParams.delete('lang');}
      a.setAttribute('href',u.pathname+(u.search||'')+(u.hash||''));
    });
  }
  if(btn)btn.addEventListener('click',function(){apply(lang==='de'?'en':'de');});
  apply(lang);
})();

// Termin/Kontakt tab switcher
document.querySelectorAll('.tc-tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target=btn.dataset.tc;
    document.querySelectorAll('.tc-tab').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
    document.querySelectorAll('.tc-panel').forEach(p=>{p.style.display='none';});
    btn.classList.add('active');btn.setAttribute('aria-selected','true');
    const panel=document.getElementById('tab-panel-'+target);
    if(panel)panel.style.display='block';
  });
});

// Leistungen tabs
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target=btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    const panel=document.getElementById('tab-'+target);
    if(panel)panel.classList.add('active');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const expanded=btn.getAttribute('aria-expanded')==='true';
    document.querySelectorAll('.faq-question').forEach(b=>{b.setAttribute('aria-expanded','false');b.nextElementSibling.classList.remove('open');});
    if(!expanded){btn.setAttribute('aria-expanded','true');btn.nextElementSibling.classList.add('open');}
  });
});

// Generic accordion (Berufserfahrung, Qualifikationen, Mitgliedschaften)
document.querySelectorAll('.accordion-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const expanded=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',expanded?'false':'true');
    const body=btn.nextElementSibling;
    if(body)body.classList.toggle('open',!expanded);
  });
});

// Scroll reveal
const ro=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// Selbstzahler sub-options
const ktCbs=document.querySelectorAll('input[name="kostentraeger"]');
const selfBox=document.getElementById('selbstzahler-optionen');
if(ktCbs.length&&selfBox){
  function toggleSelf(){
    const checked=[...ktCbs].filter(c=>c.checked).map(c=>c.value);
    selfBox.style.display=checked.includes('selbstzahler')?'block':'none';
  }
  ktCbs.forEach(c=>c.addEventListener('change',toggleSelf));
  toggleSelf();
}

// Form submit
document.querySelectorAll('form[data-form]').forEach(form=>{
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    let valid=true;
    const ktGroup=form.querySelector('#kt-group');
    const ktError=form.querySelector('#kt-error');
    if(ktGroup){
      const anyKt=[...ktGroup.querySelectorAll('input[type=checkbox]')].some(c=>c.checked);
      if(!anyKt){if(ktError)ktError.style.display='block';valid=false;}
      else{if(ktError)ktError.style.display='none';}
    }
    form.querySelectorAll('[required]').forEach(field=>{
      const g=field.closest('.form-group');
      const isEmpty=field.type==='checkbox'?!field.checked:!field.value.trim();
      if(isEmpty){if(g)g.classList.add('has-error');valid=false;}
      else{if(g)g.classList.remove('has-error');}
    });
    if(!valid)return;
    const btn=form.querySelector('.form-submit');
    btn.disabled=true;btn.textContent='Wird gesendet\u2026';
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(res.ok){
        form.style.display='none';
        const ss=document.getElementById('success-'+form.dataset.form);
        if(ss)ss.classList.add('visible');
      }else{btn.disabled=false;btn.textContent='Erneut versuchen';}
    }catch(err){btn.disabled=false;btn.textContent='Erneut versuchen';}
  });
});

// Init Lucide icons
if(typeof lucide!=='undefined')lucide.createIcons();
