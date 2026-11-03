
(function(){
  var b=document.querySelector('.burger'),n=document.querySelector('nav.main');
  if(b&&n){b.addEventListener('click',function(){n.classList.toggle('open');b.setAttribute('aria-expanded',n.classList.contains('open'));});}
  var here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('nav.main a').forEach(function(a){if(a.getAttribute('href')===here)a.classList.add('on');});
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});els.forEach(function(e){io.observe(e);});}else{els.forEach(function(e){e.classList.add('in');});}
  var nums=document.querySelectorAll('[data-count]');
  function run(el){var end=parseInt(el.getAttribute('data-count'),10),suf=el.getAttribute('data-suffix')||'',t0=null;function step(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1400);var v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-US')+suf;if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
  if(nums.length&&'IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io2.unobserve(e.target);}});},{threshold:.5});nums.forEach(function(e){io2.observe(e);});}else{nums.forEach(run);}
  var hero=document.querySelector('.hero');
  if(hero){var slides=JSON.parse(hero.getAttribute('data-slides')||'[]'),i=0,dots=hero.querySelectorAll('.dots i'),h=hero.querySelector('h1'),k=hero.querySelector('.kicker');
    function show(j){i=j;hero.style.backgroundImage='url('+slides[j].img+')';h.innerHTML=slides[j].h;k.textContent=slides[j].k;dots.forEach(function(d,x){d.classList.toggle('on',x===j);});}
    if(slides.length>1){dots.forEach(function(d,x){d.addEventListener('click',function(){show(x);});});setInterval(function(){show((i+1)%slides.length);},6000);}}
  var f=document.querySelector('form.quote');
  if(f){f.addEventListener('submit',function(e){e.preventDefault();f.querySelector('.ok').style.display='block';f.querySelector('.ok').textContent='Thank you. Your request has been received, our team will reply within one business day.';f.reset();});}
})();
