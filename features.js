'use strict';
// Fonctions ajoutées : rubrique « Code de la route » (règle du jour, image, quiz), profil et centres d'intérêt.
// Ce fichier est chargé après app.js et s'appuie sur ses fonctions (state, t, esc, render, PAGES, NAV, D…).
(function(){
 const TOPIC_KEYS=['politique','economie','societe','justice','sport','culture','sciences_tech','sante','environnement','international'];

 // ---------- Textes ----------
 Object.assign(D,{
  nav_route:['Route','Road','Vial'], rt_title:['Code de la route','Road rules','Código vial'],
  rt_kicker:['Une règle, ce qu’on risque, un quiz','One rule, what you risk, a quiz','Una norma, lo que se arriesga, un quiz'],
  rt_disc:['Rubrique informative sur le Code de la route français. Les montants et les points peuvent évoluer : référez-vous toujours aux sources officielles.','Informational section on the French road code. Amounts and points can change: always check the official sources.','Sección informativa sobre el código de circulación francés. Los importes y puntos pueden cambiar: consulte siempre las fuentes oficiales.'],
  rt_ref:['Barème : {r}','Scale: {r}','Baremo: {r}'],
  rt_official:['Sources officielles : securite-routiere.gouv.fr','Official sources: securite-routiere.gouv.fr','Fuentes oficiales: securite-routiere.gouv.fr'],
  rt_today:['Règle du jour','Rule of the day','Norma del día'], rt_rule:['Règle','Rule','Norma'],
  rt_prev:['‹ Précédente','‹ Previous','‹ Anterior'], rt_next:['Suivante ›','Next ›','Siguiente ›'], rt_back_today:['Revenir à la règle du jour','Back to today’s rule','Volver a la norma del día'],
  rt_ticket:['AVIS DE CONTRAVENTION','PENALTY NOTICE','AVISO DE SANCIÓN'], rt_fine:['Amende forfaitaire','Fixed fine','Multa fija'], rt_lost:['Points retirés','Points lost','Puntos perdidos'],
  rt_risk:['Ce que vous risquez','What you risk','Lo que se arriesga'], rt_question:['Testez-vous','Test yourself','Ponga a prueba sus conocimientos'],
  rt_ok:['Bonne réponse !','Correct!','¡Correcto!'], rt_ko:['Pas tout à fait.','Not quite.','No exactamente.'],
  rt_quiz_h:['Quiz : 5 questions','Quiz: 5 questions','Quiz: 5 preguntas'], rt_quiz_intro:['Cinq questions tirées au hasard parmi toutes les règles.','Five questions picked at random from all the rules.','Cinco preguntas al azar entre todas las normas.'],
  rt_quiz_start:['Lancer le quiz','Start the quiz','Empezar el quiz'], rt_quiz_q:['Question {i} sur {n}','Question {i} of {n}','Pregunta {i} de {n}'], rt_quiz_next:['Question suivante ›','Next question ›','Siguiente pregunta ›'], rt_quiz_see:['Voir mon score','See my score','Ver mi puntuación'],
  rt_quiz_end:['Votre score : {s} sur {n}','Your score: {s} out of {n}','Su puntuación: {s} de {n}'], rt_quiz_best:['Meilleur score : {b} sur {n}','Best score: {b} out of {n}','Mejor puntuación: {b} de {n}'], rt_quiz_again:['Rejouer','Play again','Jugar de nuevo'],
  rt_points_q:['Combien de points sont retirés pour : « {x} » ?','How many points are lost for: “{x}”?','¿Cuántos puntos se pierden por: «{x}»?'], rt_points_e:['Cette infraction retire {n} point(s) du permis.','This offence removes {n} point(s) from the licence.','Esta infracción quita {n} punto(s) del permiso.'],
  rt_loading:['Chargement de la rubrique…','Loading…','Cargando…'], rt_error:['Rubrique indisponible pour le moment.','Section unavailable right now.','Sección no disponible por ahora.'], rt_pts:['−{n} pts','−{n} pts','−{n} pts'], rt_n_pts:['{n} pt(s)','{n} pt(s)','{n} pt(s)'],
  rt_hist_h:['Ma progression','My progress','Mi progreso'],
  rt_hist_none:['Aucun quiz terminé pour l’instant : vos scores apparaîtront ici.','No quiz completed yet: your scores will appear here.','Aún no ha terminado ningún quiz: sus puntuaciones aparecerán aquí.'],
  rt_hist_stats:['{n} quiz joués · moyenne {a} % · meilleur score {b} sur {m}','{n} quizzes played · average {a}% · best score {b} out of {m}','{n} quizzes jugados · media {a} % · mejor puntuación {b} de {m}'],
  rt_hist_trend:['Tendance : {d} points par rapport aux quiz précédents.','Trend: {d} points compared with earlier quizzes.','Tendencia: {d} puntos respecto a los quizzes anteriores.'],
  rt_hist_clear:['Effacer mon historique','Clear my history','Borrar mi historial'],
  rt_hist_note:['Historique enregistré sur cet appareil uniquement ; il est inclus dans le code de profil.','History is saved on this device only; it is included in the profile code.','El historial se guarda solo en este dispositivo; se incluye en el código de perfil.'],
  rt_hist_bar:['{s} sur {n} · {d}','{s} out of {n} · {d}','{s} de {n} · {d}'],
  ob_title:['Bienvenue sur LA BONNE INFO','Welcome to LA BONNE INFO','Bienvenido a LA BONNE INFO'], ob_sub:['Créez votre profil en quelques secondes pour personnaliser votre journal.','Create your profile in a few seconds to personalise your news.','Cree su perfil en unos segundos para personalizar sus noticias.'],
  ob_lang:['Langue','Language','Idioma'], ob_name:['Prénom ou pseudo (facultatif)','First name or nickname (optional)','Nombre o apodo (opcional)'], ob_name_ph:['Votre prénom','Your first name','Su nombre'],
  ob_interests:['Vos centres d’intérêt','Your interests','Sus intereses'], ob_hint:['Choisissez-en autant que vous voulez. Sans choix, tous les sujets sont affichés.','Pick as many as you like. With no choice, all topics are shown.','Elija los que quiera. Sin elección, se muestran todos los temas.'],
  ob_start:['Commencer','Get started','Empezar'], ob_skip:['Passer pour le moment','Skip for now','Omitir por ahora'], ob_note:['Votre profil reste enregistré sur cet appareil : pas de compte, pas de mot de passe, rien n’est envoyé à un serveur.','Your profile is saved on this device only: no account, no password, nothing is sent to a server.','Su perfil se guarda solo en este dispositivo: sin cuenta, sin contraseña, nada se envía a un servidor.'],
  prof_h:['Mon profil','My profile','Mi perfil'], prof_name:['Prénom ou pseudo','First name or nickname','Nombre o apodo'], prof_interests:['Centres d’intérêt','Interests','Intereses'],
  prof_note:['Enregistré sur cet appareil uniquement. Pour le retrouver ailleurs, exportez-le puis importez-le sur l’autre appareil.','Saved on this device only. To use it elsewhere, export it and import it on the other device.','Guardado solo en este dispositivo. Para usarlo en otro, expórtelo e impórtelo allí.'],
  prof_export:['Copier mon code de profil','Copy my profile code','Copiar mi código de perfil'], prof_copied:['Code copié. Collez-le sur l’autre appareil.','Code copied. Paste it on the other device.','Código copiado. Péguelo en el otro dispositivo.'], prof_copy_ko:['Copie impossible : sélectionnez le code ci-dessous.','Copy failed: select the code below.','No se pudo copiar: seleccione el código de abajo.'],
  prof_import:['Importer un code de profil','Import a profile code','Importar un código de perfil'], prof_code_ph:['Collez un code LBI1.…','Paste an LBI1.… code','Pegue un código LBI1.…'], prof_import_btn:['Importer','Import','Importar'], prof_import_ok:['Profil importé.','Profile imported.','Perfil importado.'], prof_import_ko:['Code invalide.','Invalid code.','Código no válido.'],
  prof_reset:['Réinitialiser mon profil','Reset my profile','Restablecer mi perfil'], prof_none:['Aucun centre d’intérêt choisi : tous les sujets sont affichés.','No interest chosen: all topics are shown.','Ningún interés elegido: se muestran todos los temas.']
 });
 NAV.splice(3,0,['route','nav_route','<path d="M7 21 10 3M17 21 14 3M12 5v3M12 11v3M12 17v3"/>']);

 // ---------- Stockage local ----------
 const KEY='lbi-route';
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch(_){return {};}}
 function save(o){try{localStorage.setItem(KEY,JSON.stringify(o));}catch(_){}}
 const L=()=>state.lang;
 const tx=o=>(o&&(o[L()]||o.fr))||'';

 // ---------- Rubrique Code de la route ----------
 let ROUTE=null, routeState='idle', offset=0;
 const answered={}, perms={};
 let Q=null; // quiz en cours
 function loadRoute(){
  if(routeState!=='idle')return;routeState='loading';
  fetch('./data/code-route.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
   .then(j=>{if(!j||!Array.isArray(j.rules)||!j.rules.length)throw Error('format');ROUTE=j;routeState='ready';})
   .catch(()=>{routeState='error';}).then(()=>{if(state.tab==='route')render();});
 }
 function dayNumber(){const d=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris'}).format(new Date());return Math.floor(Date.parse(d+'T00:00:00Z')/86400000);}
 function ruleIndex(){const n=ROUTE.rules.length;return (((dayNumber()+offset)%n)+n)%n;}
 function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}

 // Les illustrations sont dessinées dans scenes.js
 function sceneSvg(rule){
  const label=`${tx(rule.title)} : ${rule.fine}, ${t('rt_pts',{n:rule.points})}`;
  return window.LBI_SCENES?window.LBI_SCENES.render(rule,label,t,esc):'';
 }
 function dailyQuestion(rule){
  const q=rule.q;if(!perms[rule.id])perms[rule.id]=shuffle(q.options.map((_,i)=>i));
  return {id:rule.id,text:tx(q.text),explain:tx(q.explain),opts:perms[rule.id].map(i=>({label:tx(q.options[i]),correct:i===q.answer}))};
 }
 function pointsQuestion(rule,ri){
  const pool=[1,2,3,4,6].filter(x=>x!==rule.points);const wrong=[pool[ri%pool.length],pool[(ri+2)%pool.length]];
  if(wrong[0]===wrong[1])wrong[1]=pool[(ri+1)%pool.length];
  const opts=shuffle([rule.points,...wrong].map(n=>({label:t('rt_n_pts',{n}),correct:n===rule.points})));
  return {id:rule.id+'-pts',text:t('rt_points_q',{x:tx(rule.title)}),explain:t('rt_points_e',{n:rule.points}),opts};
 }
 function newQuiz(){
  const all=[];ROUTE.rules.forEach((r,i)=>{all.push({rule:r,kind:'q',i});all.push({rule:r,kind:'p',i});});
  const pick=shuffle(all).slice(0,5);
  Q={i:0,score:0,answered:null,done:false,items:pick.map(p=>p.kind==='q'?(()=>{const q=p.rule.q;const order=shuffle(q.options.map((_,i)=>i));return {rid:p.rule.id,kind:'q',order,rule:p.rule};})():{rid:p.rule.id,kind:'p',rule:p.rule,i:p.i,perm:shuffle([0,1,2])})};
 }
 function quizQuestion(item){
  if(item.kind==='q'){const q=item.rule.q;return {text:tx(q.text),explain:tx(q.explain),opts:item.order.map(i=>({label:tx(q.options[i]),correct:i===q.answer}))};}
  if(!item.built)item.built=pointsQuestion(item.rule,item.i);
  return item.built;
 }
 function optionsHtml(q,attr,chosen){
  return `<div class="qopts">${q.opts.map((o,i)=>{const cls=chosen==null?'':(o.correct?' good':(i===chosen?' bad':''));return `<button type="button" class="qopt${cls}" ${attr}="${i}"${chosen!=null?' disabled':''}>${esc(o.label)}</button>`;}).join('')}</div>`;
 }
 function feedback(q,chosen){
  if(chosen==null)return '';
  const ok=q.opts[chosen]?.correct;
  return `<p class="qfeed ${ok?'good':'bad'}" role="status"><strong>${t(ok?'rt_ok':'rt_ko')}</strong> ${esc(q.explain)}</p>`;
 }
 function quizHistory(){
  const h=(load().hist||[]).filter(x=>x&&Number.isFinite(x.s)&&Number.isFinite(x.n)&&x.n>0);
  if(!h.length)return `<p class="micro">${t('rt_hist_none')}</p>`;
  const pct=x=>Math.round(100*x.s/x.n),avg=a=>a.length?a.reduce((s,x)=>s+pct(x),0)/a.length:0;
  const best=h.reduce((m,x)=>pct(x)>pct(m)?x:m,h[0]);
  let trend='';
  if(h.length>=2){const recent=h.slice(-5),before=h.slice(-10,-5);if(before.length){const d=Math.round(avg(recent)-avg(before));trend=`<p class="micro"><strong>${esc(t('rt_hist_trend',{d:(d>0?'+':'')+d}))}</strong></p>`;}}
  const last=h.slice(-12),W=640,H=170,bw=Math.min(40,(W-40)/last.length-8),gap=((W-40)-bw*last.length)/Math.max(1,last.length-1);
  const bars=last.map((x,i)=>{const bh=Math.max(4,(x.s/x.n)*100),xx=20+i*(bw+gap),y=120-bh,d=fmt({day:'2-digit',month:'2-digit'}).format(new Date(x.t));return `<rect x="${xx.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="4" fill="var(--olive)"><title>${esc(t('rt_hist_bar',{s:x.s,n:x.n,d}))}</title></rect><text x="${(xx+bw/2).toFixed(1)}" y="${(y-5).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">${x.s}</text><text x="${(xx+bw/2).toFixed(1)}" y="140" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">${d}</text>`;}).join('');
  const aria=last.map(x=>x.s+'/'+x.n).join(', ');
  return `<p>${esc(t('rt_hist_stats',{n:h.length,a:Math.round(avg(h)),b:best.s,m:best.n}))}</p>${trend}<svg class="histsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('rt_hist_h')+' : '+aria)}" font-family="system-ui,sans-serif"><line x1="20" y1="120" x2="${W-20}" y2="120" stroke="currentColor" opacity=".25"/>${bars}</svg><p class="micro">${t('rt_hist_note')}</p><button type="button" class="link" data-qclear="1">${t('rt_hist_clear')}</button>`;
 }
 function routePage(){
  loadRoute();
  const head=header(t('rt_title'),t('rt_kicker'));
  if(routeState==='error')return `${head}${infoEmpty(t('rt_error'))}`;
  if(!ROUTE)return `${head}<p>${t('rt_loading')}</p>`;
  const rule=ROUTE.rules[ruleIndex()];
  const dq=dailyQuestion(rule);const ans=answered[rule.id];
  const best=load().best;
  let quiz='';
  if(!Q)quiz=`<p>${t('rt_quiz_intro')}</p>${best!=null?`<p class="micro">${esc(t('rt_quiz_best',{b:best,n:5}))}</p>`:''}<button type="button" class="mbtn" data-qs="1">${t('rt_quiz_start')}</button>`;
  else if(Q.done)quiz=`<p class="qscore">${esc(t('rt_quiz_end',{s:Q.score,n:Q.items.length}))}</p><p class="micro">${esc(t('rt_quiz_best',{b:Math.max(best||0,Q.score),n:Q.items.length}))}</p><button type="button" class="mbtn" data-qs="1">${t('rt_quiz_again')}</button>`;
  else{const it=Q.items[Q.i],qq=quizQuestion(it);quiz=`<p class="micro">${esc(t('rt_quiz_q',{i:Q.i+1,n:Q.items.length}))}</p><p class="qtext">${esc(qq.text)}</p>${optionsHtml(qq,'data-qa',Q.answered)}${feedback(qq,Q.answered)}${Q.answered!=null?`<p><button type="button" class="mbtn" data-qn="1">${t(Q.i+1>=Q.items.length?'rt_quiz_see':'rt_quiz_next')}</button></p>`:''}`;}
  return `${head}<p class="micro">${t('rt_disc')} ${link(ROUTE.officialUrl,t('rt_official'))}</p>
  <section class="subsection"><div class="kicker-row"><span class="eyebrow">${t(offset===0?'rt_today':'rt_rule')}</span></div>
  <article class="rulecard"><figure class="scenefig">${sceneSvg(rule)}</figure><h3>${esc(tx(rule.title))}</h3><p class="ruletext">${esc(tx(rule.rule))}</p>
  <h4>${t('rt_risk')}</h4><p class="penalty"><span class="pchip">${esc(rule.fine)}</span><span class="pchip">${esc(t('rt_pts',{n:rule.points}))}</span></p>${rule.note?`<p class="micro">${esc(tx(rule.note))}</p>`:''}
  <div class="rulenav"><button type="button" class="link" data-rn="-1">${t('rt_prev')}</button>${offset!==0?`<button type="button" class="link" data-rn="0">${t('rt_back_today')}</button>`:''}<button type="button" class="link" data-rn="1">${t('rt_next')}</button></div></article></section>
  <section class="subsection"><h2 class="section-heading">${t('rt_question')}</h2><p class="qtext">${esc(dq.text)}</p>${optionsHtml(dq,'data-ra',ans)}${feedback(dq,ans)}</section>
  <section class="subsection"><h2 class="section-heading">${t('rt_quiz_h')}</h2>${quiz}</section>
  <section class="subsection"><h2 class="section-heading">${t('rt_hist_h')}</h2>${quizHistory()}</section>
  <p class="micro">${esc(t('rt_ref',{r:ROUTE.reference||''}))}</p>`;
 }
 PAGES.route=routePage;

 // ---------- Profil ----------
 function ensureProfile(){if(!state.profile||typeof state.profile!=='object')state.profile={onboarded:true,name:'',interests:[]};if(!Array.isArray(state.profile.interests))state.profile.interests=[];return state.profile;}
 const topicChips=(sel,attr)=>`<div class="chips">${TOPIC_KEYS.map(k=>`<button type="button" class="chip" ${attr}="${k}" aria-pressed="${sel.includes(k)}">${esc(t('tp_'+k))}</button>`).join('')}</div>`;
 function profileSection(){
  const p=ensureProfile();
  return `<section class="subsection" id="profile"><h2 class="section-heading">${t('prof_h')}</h2><div class="controls"><label for="prof-name">${t('prof_name')}</label><input type="text" id="prof-name" maxlength="40" value="${esc(p.name||'')}" placeholder="${esc(t('ob_name_ph'))}" autocomplete="off"></div>
  <p class="micro">${t('prof_interests')}</p>${topicChips(p.interests,'data-pi')}${p.interests.length?'':`<p class="micro">${t('prof_none')}</p>`}
  <p class="micro">${t('prof_note')}</p><div class="controls"><button type="button" class="mbtn ghost" data-prof="export">${t('prof_export')}</button><button type="button" class="mbtn ghost" data-prof="reset">${t('prof_reset')}</button></div>
  <textarea id="prof-code" class="codebox" rows="2" readonly placeholder="LBI1.…" aria-label="${esc(t('prof_export'))}"></textarea>
  <p class="micro">${t('prof_import')}</p><div class="controls"><input type="text" id="prof-in" placeholder="${esc(t('prof_code_ph'))}" autocomplete="off"><button type="button" class="mbtn ghost" data-prof="import">${t('prof_import_btn')}</button></div><p class="micro" id="prof-msg" role="status"></p></section>`;
 }
 const archivesBase=PAGES.archives;
 PAGES.archives=()=>{const html=archivesBase();const i=html.indexOf('<section class="subsection"><h2 class="section-heading">'+t('old_h'));return i>0?html.slice(0,i)+profileSection()+html.slice(i):profileSection()+html;};

 const KNOWN=new Set(TOPIC_KEYS);
 function exportCode(){
  const o={v:1,profile:ensureProfile(),lang:state.lang,place:state.place,theme:state.theme,size:state.size,accent:state.accent,quiz:(load().hist||[]).slice(-100)};
  return 'LBI1.'+btoa(unescape(encodeURIComponent(JSON.stringify(o))));
 }
 function importCode(code){
  const m=String(code||'').trim().match(/^LBI1\.([A-Za-z0-9+/=]+)$/);if(!m)throw Error('format');
  const o=JSON.parse(decodeURIComponent(escape(atob(m[1]))));
  if(!o||o.v!==1||!o.profile)throw Error('format');
  const name=String(o.profile.name||'').slice(0,40);
  const interests=(Array.isArray(o.profile.interests)?o.profile.interests:[]).filter(k=>KNOWN.has(k));
  state.profile={onboarded:true,name,interests};
  if(LANGS[o.lang])state.lang=o.lang;
  if(o.place&&Number.isFinite(o.place.lat)&&Number.isFinite(o.place.lon)&&typeof o.place.name==='string')state.place={name:o.place.name.slice(0,80),lat:Math.round(o.place.lat*100)/100,lon:Math.round(o.place.lon*100)/100,country:String(o.place.country||'XX').slice(0,2),mode:o.place.mode==='gps'?'gps':'manual'};
  if(['auto','light','dark'].includes(o.theme))state.theme=o.theme;
  if(Number.isFinite(o.size))state.size=Math.max(15,Math.min(23,o.size));
  if(/^#[0-9A-Fa-f]{6}$/.test(String(o.accent||'')))state.accent=o.accent;
  if(Array.isArray(o.quiz)){const hist=o.quiz.filter(x=>x&&typeof x.t==='string'&&Number.isInteger(x.s)&&Number.isInteger(x.n)&&x.n>=1&&x.n<=20&&x.s>=0&&x.s<=x.n&&!isNaN(Date.parse(x.t))).slice(-100).map(x=>({t:x.t,s:x.s,n:x.n}));const s=load();s.hist=hist;s.best=hist.reduce((m,x)=>Math.max(m,x.s),0);if(!hist.length)delete s.best;save(s);}
  persist();
 }

 // ---------- Première connexion ----------
 let onb=null;
 function onbHtml(){
  return `<div class="modal" role="document"><h2 id="onb-title">${t('ob_title')}</h2><p>${t('ob_sub')}</p>
  <p class="micro">${t('ob_lang')}</p><div class="controls">${ORDER.map(l=>`<button type="button" data-ol="${l}" aria-pressed="${state.lang===l}">${LANGS[l][0]}</button>`).join('')}</div>
  <label class="micro" for="onb-name">${t('ob_name')}</label><input type="text" id="onb-name" maxlength="40" value="${esc(onb.name)}" placeholder="${esc(t('ob_name_ph'))}" autocomplete="off">
  <p class="micro">${t('ob_interests')}</p>${topicChips(onb.interests,'data-oi')}<p class="micro">${t('ob_hint')}</p>
  <div class="controls"><button type="button" class="mbtn" data-onb="start">${t('ob_start')}</button><button type="button" class="mbtn ghost" data-onb="skip">${t('ob_skip')}</button></div><p class="micro">${t('ob_note')}</p></div>`;
 }
 function showOnboarding(){
  onb={name:(state.profile&&state.profile.name)||'',interests:[...(state.profile&&state.profile.interests||[])]};
  let el=document.getElementById('onb');
  if(!el){el=document.createElement('div');el.id='onb';el.className='overlay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','onb-title');document.body.appendChild(el);}
  el.innerHTML=onbHtml();document.body.classList.add('noscroll');
  const f=el.querySelector('button');if(f)f.focus();
 }
 function closeOnboarding(save){
  if(save){state.profile={onboarded:true,name:onb.name.trim().slice(0,40),interests:onb.interests.filter(k=>KNOWN.has(k)),created:new Date().toISOString()};}
  else if(!state.profile||!state.profile.onboarded){state.profile={onboarded:true,name:'',interests:[]};}
  persist();onb=null;const el=document.getElementById('onb');if(el)el.remove();document.body.classList.remove('noscroll');render();
 }

 // ---------- Événements ----------
 document.addEventListener('click',e=>{
  const el=e.target.closest('button');if(!el)return;const d=el.dataset;
  if(d.lang)Q=null;
  if(d.qclear!==undefined){const s=load();s.hist=[];delete s.best;save(s);render();return;}
  if(d.rn!==undefined){offset=d.rn==='0'?0:offset+Number(d.rn);render();return;}
  if(d.ra!==undefined&&ROUTE){const rule=ROUTE.rules[ruleIndex()];if(answered[rule.id]==null){answered[rule.id]=Number(d.ra);render();}return;}
  if(d.qs!==undefined&&ROUTE){newQuiz();render();return;}
  if(d.qa!==undefined&&Q&&Q.answered==null){const qq=quizQuestion(Q.items[Q.i]),c=Number(d.qa);Q.answered=c;if(qq.opts[c]&&qq.opts[c].correct)Q.score++;render();return;}
  if(d.qn!==undefined&&Q){if(Q.i+1>=Q.items.length){Q.done=true;const s=load();s.hist=Array.isArray(s.hist)?s.hist:[];s.hist.push({t:new Date().toISOString(),s:Q.score,n:Q.items.length});s.hist=s.hist.slice(-100);if(s.best==null||Q.score>s.best)s.best=Q.score;save(s);}else{Q.i++;Q.answered=null;}render();return;}
  if(d.pi){const p=ensureProfile();const i=p.interests.indexOf(d.pi);if(i>=0)p.interests.splice(i,1);else p.interests.push(d.pi);persist();render();return;}
  if(d.prof==='export'){const code=exportCode();const box=document.getElementById('prof-code');if(box){box.value=code;box.select();}const msg=document.getElementById('prof-msg');const done=ok=>{if(msg)msg.textContent=t(ok?'prof_copied':'prof_copy_ko');};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(code).then(()=>done(true),()=>done(false));else done(false);return;}
  if(d.prof==='import'){const msg=document.getElementById('prof-msg');try{importCode(document.getElementById('prof-in').value);render();const m2=document.getElementById('prof-msg');if(m2)m2.textContent=t('prof_import_ok');}catch(_){if(msg)msg.textContent=t('prof_import_ko');}return;}
  if(d.prof==='reset'){state.profile=null;persist();showOnboarding();return;}
  if(onb){
   if(d.ol&&LANGS[d.ol]){state.lang=d.ol;persist();render();const nm=document.getElementById('onb-name');if(nm)onb.name=nm.value;document.getElementById('onb').innerHTML=onbHtml();return;}
   if(d.oi){const i=onb.interests.indexOf(d.oi);if(i>=0)onb.interests.splice(i,1);else onb.interests.push(d.oi);const nm=document.getElementById('onb-name');if(nm)onb.name=nm.value;document.getElementById('onb').innerHTML=onbHtml();const f=document.querySelector('#onb [data-oi="'+d.oi+'"]');if(f)f.focus();return;}
   if(d.onb==='start'){const nm=document.getElementById('onb-name');if(nm)onb.name=nm.value;closeOnboarding(true);return;}
   if(d.onb==='skip'){closeOnboarding(false);return;}
  }
 });
 document.addEventListener('input',e=>{
  if(e.target.id==='prof-name'){ensureProfile().name=e.target.value.slice(0,40);persist();}
  else if(e.target.id==='onb-name'&&onb)onb.name=e.target.value;
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&onb)closeOnboarding(false);});
 // Une nouvelle langue ou un nouveau lieu ne doit pas laisser une question de quiz dans une autre langue.
 document.addEventListener('change',e=>{if(e.target.id==='lang'){Q=null;}});

 render();
 if(!(state.profile&&state.profile.onboarded))showOnboarding();
})();
