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

 const car=(x,y,c)=>`<g transform="translate(${x} ${y})"><rect y="22" width="110" height="30" rx="8" fill="${c}"/><path d="M18 22 34 2H76L94 22Z" fill="${c}"/><path d="M26 22 38 8H54V22ZM58 22V8H72L84 22Z" fill="#cfe8f5"/><circle cx="26" cy="54" r="10" fill="#222"/><circle cx="26" cy="54" r="4" fill="#999"/><circle cx="86" cy="54" r="10" fill="#222"/><circle cx="86" cy="54" r="4" fill="#999"/></g>`;
 const forbid=(cx,cy,r)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c0392b" stroke-width="9"/><path d="M${cx-r*.7} ${cy+r*.7}L${cx+r*.7} ${cy-r*.7}" stroke="#c0392b" stroke-width="9"/>`;
 const SCENES={
  phone:()=>`${car(150,170,'#2e7d9a')}<rect x="70" y="40" width="64" height="112" rx="10" fill="#333" transform="rotate(-12 100 96)"/><rect x="78" y="52" width="48" height="80" rx="4" fill="#9ed0e6" transform="rotate(-12 100 96)"/>${forbid(105,96,66)}`,
  redlight:()=>`<rect x="300" y="40" width="44" height="116" rx="8" fill="#222"/><circle cx="322" cy="66" r="14" fill="#e53935"/><circle cx="322" cy="98" r="14" fill="#5d4a1c"/><circle cx="322" cy="130" r="14" fill="#1d4a2a"/><rect x="319" y="156" width="6" height="50" fill="#555"/><rect x="262" y="212" width="10" height="70" fill="#fff"/>${car(150,178,'#c0392b')}<path d="M232 96l10 14 14-6-8 16 14 8-18 2-2 18-10-14-14 6 8-16-14-8z" fill="#f4d03f"/>`,
  seatbelt:()=>`<rect x="110" y="120" width="170" height="130" rx="20" fill="#8a96a0"/><circle cx="195" cy="80" r="34" fill="#e8b88a"/><rect x="150" y="116" width="90" height="110" rx="26" fill="#2e7d9a"/><path d="M158 118 240 226" stroke="#c0392b" stroke-width="10" stroke-dasharray="14 10"/><rect x="232" y="214" width="22" height="18" rx="3" fill="#c0392b"/>`,
  distance:()=>`${car(40,170,'#2e7d9a')}${car(260,170,'#c0392b')}<path d="M160 168H255M160 168l12-8m-12 8 12 8M255 168l-12-8m12 8-12 8" stroke="#222" stroke-width="4" fill="none"/><rect x="178" y="118" width="60" height="30" rx="15" fill="#fff" stroke="#222" stroke-width="3"/><text x="208" y="139" text-anchor="middle" font-size="20" font-weight="700" fill="#222">2 s</text>`,
  pedestrian:()=>`<g fill="#fff"><rect x="190" y="205" width="100" height="14"/><rect x="190" y="228" width="100" height="14"/><rect x="190" y="251" width="100" height="14"/></g>${car(40,170,'#2e7d9a')}<circle cx="338" cy="126" r="14" fill="#e8b88a"/><path d="M338 140V190M338 154 316 176M338 154 360 176M338 190 322 232M338 190 356 232" stroke="#c0392b" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M96 70 130 130H62Z" fill="#fff" stroke="#c0392b" stroke-width="8" stroke-linejoin="round"/><text x="96" y="122" text-anchor="middle" font-size="40" font-weight="800" fill="#222">!</text>`,
  stop:()=>`<rect x="326" y="120" width="8" height="90" fill="#777"/><polygon points="305,32 355,32 391,68 391,118 355,154 305,154 269,118 269,68" fill="#c0392b" stroke="#fff" stroke-width="6" transform="translate(-30 -10) scale(1.05)"/><text x="330" y="104" text-anchor="middle" font-size="30" font-weight="800" fill="#fff">STOP</text><rect x="228" y="214" width="10" height="64" fill="#fff"/>${car(70,178,'#2e7d9a')}`,
  helmet:()=>`<circle cx="130" cy="120" r="64" fill="#f39c12"/><path d="M70 130H190V150Q190 170 170 170H90Q70 170 70 150Z" fill="#222"/><rect x="82" y="104" width="96" height="30" rx="14" fill="#9ed0e6"/><path d="M98 170 90 200M162 170 170 200" stroke="#555" stroke-width="6"/><circle cx="260" cy="236" r="26" fill="#222"/><circle cx="360" cy="236" r="26" fill="#222"/><path d="M260 236 300 190H350L360 236M300 190 285 168H318" stroke="#2e7d9a" stroke-width="10" fill="none" stroke-linecap="round"/>`,
  earbuds:()=>`<path d="M90 160V130Q90 60 190 60T290 130V160" fill="none" stroke="#333" stroke-width="14" stroke-linecap="round"/><rect x="62" y="140" width="48" height="76" rx="22" fill="#333"/><rect x="270" y="140" width="48" height="76" rx="22" fill="#333"/>${forbid(190,140,74)}`,
  speedtown:()=>`${car(60,176,'#2e7d9a')}<path d="M24 196H50M16 214H46M26 232H52" stroke="#666" stroke-width="5" stroke-linecap="round"/><rect x="300" y="170" width="8" height="40" fill="#777"/><circle cx="304" cy="100" r="54" fill="#fff" stroke="#c0392b" stroke-width="12"/><text x="304" y="116" text-anchor="middle" font-size="46" font-weight="800" fill="#222">50</text><rect x="372" y="130" width="48" height="36" rx="6" fill="#444"/><circle cx="396" cy="148" r="10" fill="#f4d03f"/><rect x="394" y="166" width="6" height="46" fill="#777"/>`,
  alcohol:()=>`<path d="M110 40H250L242 120Q232 160 180 164Q128 160 118 120Z" fill="#c0392b" opacity=".85" stroke="#333" stroke-width="6"/><path d="M180 164V230M140 236H220" stroke="#333" stroke-width="10" stroke-linecap="round"/>${forbid(180,130,100)}`,
  rightpriority:()=>`<rect x="0" y="150" width="440" height="100" fill="#6b747b"/><rect x="170" y="20" width="100" height="230" fill="#6b747b"/><path d="M0 200H170M270 200H440M220 20V150" stroke="#fff" stroke-width="4" stroke-dasharray="14 12" opacity=".8"/><g><rect x="198" y="206" width="44" height="74" rx="10" fill="#2e7d9a"/><rect x="206" y="214" width="28" height="22" rx="4" fill="#cfe8f5"/><path d="M220 196V170M220 170l-10 12m10-12 10 12" stroke="#2e7d9a" stroke-width="6" fill="none" stroke-linecap="round"/></g><g><rect x="316" y="178" width="74" height="44" rx="10" fill="#c0392b"/><rect x="322" y="186" width="22" height="28" rx="4" fill="#cfe8f5"/><path d="M308 200H282M282 200l12-10m-12 10 12 10" stroke="#c0392b" stroke-width="6" fill="none" stroke-linecap="round"/></g>`,
  cyclist:()=>`${car(40,176,'#2e7d9a')}<circle cx="300" cy="240" r="28" fill="none" stroke="#222" stroke-width="7"/><circle cx="392" cy="240" r="28" fill="none" stroke="#222" stroke-width="7"/><path d="M300 240 340 190H372L392 240M340 190 330 160H356" stroke="#c0392b" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="352" cy="136" r="14" fill="#e8b88a"/><path d="M158 220H280M158 220l12-8m-12 8 12 8M280 220l-12-8m12 8-12 8" stroke="#222" stroke-width="4" fill="none"/><rect x="190" y="170" width="62" height="30" rx="15" fill="#fff" stroke="#222" stroke-width="3"/><text x="221" y="191" text-anchor="middle" font-size="18" font-weight="700" fill="#222">1,5 m</text>`
 };
 function sceneSvg(rule){
  const draw=SCENES[rule.scene]||(()=>'');
  const title=tx(rule.title);
  const label=`${title} : ${rule.fine}, ${t('rt_pts',{n:rule.points})}`;
  return `<svg class="scene" viewBox="0 0 640 300" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="300" fill="#dce9ef"/><rect y="200" width="640" height="100" fill="#6b747b"/><path d="M0 250H640" stroke="#fff" stroke-width="4" stroke-dasharray="26 18" opacity=".7"/><g>${draw()}</g><g transform="translate(442 22)"><rect width="184" height="256" rx="10" fill="#fffdf5" stroke="#b8a27a" stroke-width="3"/><rect width="184" height="40" rx="10" fill="#2f4f7f"/><text x="92" y="25" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff" letter-spacing=".3">${esc(t('rt_ticket'))}</text><path d="M18 62H166M18 78H130" stroke="#d9cfb7" stroke-width="5"/><text x="92" y="108" text-anchor="middle" font-size="11" fill="#555">${esc(t('rt_fine'))}</text><text x="92" y="150" text-anchor="middle" font-size="38" font-weight="800" fill="#c0392b">${esc(rule.fine)}</text><path d="M18 168H166" stroke="#d9cfb7" stroke-width="3"/><text x="92" y="192" text-anchor="middle" font-size="11" fill="#555">${esc(t('rt_lost'))}</text><text x="92" y="236" text-anchor="middle" font-size="34" font-weight="800" fill="#c0392b">${esc(t('rt_pts',{n:rule.points}))}</text></g></svg>`;
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
  const o={v:1,profile:ensureProfile(),lang:state.lang,place:state.place,theme:state.theme,size:state.size,accent:state.accent};
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
  if(d.rn!==undefined){offset=d.rn==='0'?0:offset+Number(d.rn);render();return;}
  if(d.ra!==undefined&&ROUTE){const rule=ROUTE.rules[ruleIndex()];if(answered[rule.id]==null){answered[rule.id]=Number(d.ra);render();}return;}
  if(d.qs!==undefined&&ROUTE){newQuiz();render();return;}
  if(d.qa!==undefined&&Q&&Q.answered==null){const qq=quizQuestion(Q.items[Q.i]),c=Number(d.qa);Q.answered=c;if(qq.opts[c]&&qq.opts[c].correct)Q.score++;render();return;}
  if(d.qn!==undefined&&Q){if(Q.i+1>=Q.items.length){Q.done=true;const s=load();if(s.best==null||Q.score>s.best){s.best=Q.score;save(s);}}else{Q.i++;Q.answered=null;}render();return;}
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
