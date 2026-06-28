
// Header scroll
const header=document.getElementById('header');
if(header)window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});

// Hamburger
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

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const expanded=btn.getAttribute('aria-expanded')==='true';
    document.querySelectorAll('.faq-question').forEach(b=>{b.setAttribute('aria-expanded','false');b.nextElementSibling.classList.remove('open');});
    if(!expanded){btn.setAttribute('aria-expanded','true');btn.nextElementSibling.classList.add('open');}
  });
});

// Generic accordion
document.querySelectorAll('.accordion-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const expanded=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',expanded?'false':'true');
    btn.nextElementSibling.classList.toggle('open',!expanded);
  });
});

// Leistungen Tabs
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

// Form submit (Formspree)
document.querySelectorAll('form[data-form]').forEach(form=>{
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    let valid=true;
    form.querySelectorAll('[required]').forEach(field=>{
      const g=field.closest('.form-group');
      if(!field.value.trim()&&field.type!=='checkbox'){if(g)g.classList.add('has-error');valid=false;}
      else if(field.type==='checkbox'&&!field.checked){if(g)g.classList.add('has-error');valid=false;}
      else{if(g)g.classList.remove('has-error');}
    });
    if(!valid)return;
    const btn=form.querySelector('.form-submit');
    btn.disabled=true;btn.textContent='Wird gesendet…';
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(res.ok){
        form.style.display='none';
        const box=form.closest('.booking-form-box')||form.closest('.kontakt-form');
        const ss=box&&box.querySelector('.success-state');
        if(ss)ss.classList.add('visible');
      }else{btn.disabled=false;btn.textContent='Erneut versuchen';}
    }catch(err){btn.disabled=false;btn.textContent='Erneut versuchen';}
  });
});

// Init Lucide icons - called after all DOM is ready
if(typeof lucide!=='undefined') lucide.createIcons();

// Language toggle
(function(){
  var lang='de';
  var btn=document.getElementById('lang-toggle');
  function apply(l){
    lang=l;document.documentElement.lang=l;
    document.querySelectorAll('[data-de][data-en]').forEach(function(el){el.textContent=el.getAttribute('data-'+l);});
    if(btn)btn.textContent=l==='de'?'EN':'DE';
  }
  if(btn)btn.addEventListener('click',function(){apply(lang==='de'?'en':'de');});
})();
