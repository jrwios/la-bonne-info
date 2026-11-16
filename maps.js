'use strict';
// Cartes (carburants, météo) et graphique de tendance des prix.
// Leaflet est hébergé avec le site (vendor/leaflet). Les fonds de carte et le radar ne sont chargés qu'après un clic.
(function(){
 Object.assign(D,{
  map_show:['Afficher la carte','Show the map','Mostrar el mapa'], map_hide:['Masquer la carte','Hide the map','Ocultar el mapa'],
  map_priv_w:['Affiche une carte OpenStreetMap et le radar de pluie RainViewer : ces services voient votre adresse IP et la zone regardée. Rien n’est chargé avant votre clic.','Shows an OpenStreetMap map and the RainViewer rain radar: these services can see your IP address and the area you look at. Nothing is loaded before you click.','Muestra un mapa de OpenStreetMap y el radar de lluvia de RainViewer: estos servicios ven su dirección IP y la zona que mira. No se carga nada antes de hacer clic.'],
  map_priv_f:['Affiche une carte OpenStreetMap : ce service voit votre adresse IP et la zone regardée. Rien n’est chargé avant votre clic.','Shows an OpenStreetMap map: this service can see your IP address and the area you look at. Nothing is loaded before you click.','Muestra un mapa de OpenStreetMap: este servicio ve su dirección IP y la zona que mira. No se carga nada antes de hacer clic.'],
  map_fail:['La carte n’a pas pu se charger.','The map could not be loaded.','No se pudo cargar el mapa.'],
  map_w_h:['Carte météo : radar de pluie','Weather map: rain radar','Mapa del tiempo: radar de lluvia'], map_f_h:['Carte des stations','Station map','Mapa de estaciones'],
  map_fuel_lbl:['Carburant affiché','Fuel shown','Combustible mostrado'],
  map_cheapest:['Le moins cher : {p} € à {v} ({a})','Cheapest: €{p} in {v} ({a})','El más barato: {p} € en {v} ({a})'],
  map_legend_f:['Repère vert : la station la moins chère. Points gris : les autres stations du rayon (touchez un point pour le prix).','Green pin: the cheapest station. Grey dots: other stations in range (tap a dot for its price).','Marcador verde: la estación más barata. Puntos grises: las demás estaciones (toque un punto para ver el precio).'],
  map_radar:['Radar de pluie : {t}','Rain radar: {t}','Radar de lluvia: {t}'], map_radar_ko:['Radar de pluie indisponible.','Rain radar unavailable.','Radar de lluvia no disponible.'],
  map_no_st:['Aucune station avec un prix récent pour ce carburant dans ce rayon.','No station with a recent price for this fuel in range.','Ninguna estación con precio reciente para este combustible en el radio.'],
  map_you:['Vous êtes ici','You are here','Usted está aquí'], map_no_data:['Aucune donnée de stations pour ce lieu.','No station data for this place.','Sin datos de estaciones para este lugar.'],
  hist_h:['Tendance sur 12 semaines','12-week trend','Tendencia de 12 semanas'],
  hist_note:['France entière · moyenne des stations · relevé chaque lundi. La semaine la plus ancienne disparaît quand une nouvelle s’ajoute (12 semaines glissantes).','Whole of France · station average · recorded every Monday. The oldest week drops off when a new one is added (rolling 12 weeks).','Toda Francia · media de las estaciones · cada lunes. La semana más antigua desaparece al añadir una nueva (12 semanas móviles).'],
  hist_build:['Courbe en construction : {n} semaine(s) sur 12. Un nouveau point s’ajoute chaque lundi.','Chart in progress: {n} week(s) out of 12. A new point is added every Monday.','Gráfico en construcción: {n} semana(s) de 12. Cada lunes se añade un punto.'],
  hist_delta:['Variation sur la dernière semaine : {g} (gazole), {e} (SP95-E10).','Change over the last week: {g} (diesel), {e} (SP95-E10).','Variación en la última semana: {g} (gasóleo), {e} (SP95-E10).'],
  hist_ko:['Historique indisponible pour le moment.','History unavailable right now.','Historial no disponible por ahora.'], hist_loading:['Chargement de l’historique…','Loading history…','Cargando el historial…'],
  week_of:['Semaine du {d}','Week of {d}','Semana del {d}'], fuel_diesel:['Gazole','Diesel','Gasóleo']
 });

 const FUEL_KEYS=['Gazole','SP95-E10','SP95','SP98','E85','GPL'];
 const open={weather:false,fuel:false};
 let fuelSel='Gazole';
 const maps={};
 let leafletPromise=null, hist={state:'idle',data:null};

 function loadLeaflet(){
  if(window.L)return Promise.resolve();
  if(leafletPromise)return leafletPromise;
  leafletPromise=new Promise((ok,ko)=>{
   const l=document.createElement('link');l.rel='stylesheet';l.href='./vendor/leaflet/leaflet.css';document.head.appendChild(l);
   const s=document.createElement('script');s.src='./vendor/leaflet/leaflet.js';s.onload=ok;s.onerror=()=>{leafletPromise=null;ko(new Error('leaflet'));};document.head.appendChild(s);
  });
  return leafletPromise;
 }
 const eur=(v,d=3)=>Number(v).toLocaleString(LOC(),{minimumFractionDigits:d,maximumFractionDigits:d});

 // ---------- Emplacements dans la page ----------
 function slot(k){
  if(k==='history')return historyBlock();
  const isW=k==='weather';
  const title=t(isW?'map_w_h':'map_f_h');
  if(!open[k])return `<div class="mapslot"><h3 class="section-heading small">${esc(title)}</h3><p class="micro">${t(isW?'map_priv_w':'map_priv_f')}</p><button type="button" class="mbtn" data-mapopen="${k}">${t('map_show')}</button></div>`;
  let extra='';
  if(!isW){
   const f=data&&data.carburants;
   const opts=FUEL_KEYS.filter(x=>f&&Array.isArray(f.stations)&&f.stations.some(s=>s.p[x]));
   if(opts.length&&!opts.includes(fuelSel))fuelSel=opts[0];
   extra=`<div class="controls"><label for="map-fuel-sel">${t('map_fuel_lbl')}</label><select id="map-fuel-sel">${opts.map(x=>`<option value="${esc(x)}"${x===fuelSel?' selected':''}>${esc(x)}</option>`).join('')}</select></div><p class="micro" id="map-cheapest"></p>`;
  }
  return `<div class="mapslot open"><h3 class="section-heading small">${esc(title)}</h3>${extra}<div class="mapbox" id="map-${k}" role="application" aria-label="${esc(title)}"><p class="micro maploading">…</p></div><p class="micro" id="map-note-${k}">${isW?'':t('map_legend_f')}</p><button type="button" class="link" data-mapclose="${k}">${t('map_hide')}</button></div>`;
 }

 // ---------- Montage des cartes (après chaque affichage de la page) ----------
 function destroy(k){if(maps[k]){try{maps[k].remove();}catch(_){}delete maps[k];}}
 function setupMap(el,lat,lon,zoom){
  const map=L.map(el,{scrollWheelZoom:false,dragging:!L.Browser.mobile,tap:false}).setView([lat,lon],zoom);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  return map;
 }
 async function mountWeather(){
  const el=document.getElementById('map-weather');if(!el)return;
  destroy('weather');el.innerHTML='';
  const p=place(),map=setupMap(el,p.lat,p.lon,7);maps.weather=map;
  const m=data&&data.meteo;
  const label=m&&m.ok?`${num(m.tmin,0)}° / ${num(m.tmax,0)}°C`:'';
  L.marker([p.lat,p.lon],{icon:L.divIcon({className:'wxpin',html:`<span>${esc(label||p.name)}</span>`,iconSize:[90,26],iconAnchor:[45,13]})}).addTo(map).bindTooltip(esc(p.name));
  const note=document.getElementById('map-note-weather');
  try{
   const j=await (await fetch('https://api.rainviewer.com/public/weather-maps.json')).json();
   const last=j&&j.radar&&j.radar.past&&j.radar.past[j.radar.past.length-1];
   if(!last)throw Error('no radar');
   L.tileLayer(`${j.host}${last.path}/256/{z}/{x}/{y}/2/1_1.png`,{opacity:.65,maxNativeZoom:7,maxZoom:18,attribution:'Radar © <a href="https://www.rainviewer.com">RainViewer</a>'}).addTo(map);
   if(note)note.textContent=t('map_radar',{t:fmtDatetime(new Date(last.time*1000).toISOString())});
  }catch(_){if(note)note.textContent=t('map_radar_ko');}
 }
 function mountFuelBox(){
  const el=document.getElementById('map-fuel');if(!el)return;
  destroy('fuel');el.innerHTML='';
  const f=data&&data.carburants,p=place();
  const note=document.getElementById('map-cheapest');
  const all=f&&Array.isArray(f.stations)?f.stations.filter(s=>s.p[fuelSel]):[];
  const map=setupMap(el,p.lat,p.lon,10);maps.fuel=map;
  L.circle([p.lat,p.lon],{radius:(f&&f.radiusKm||30)*1000,color:'#58634A',weight:1.5,dashArray:'4 6',fillOpacity:.03}).addTo(map);
  L.circleMarker([p.lat,p.lon],{radius:7,color:'#fff',weight:2,fillColor:'#2a6f97',fillOpacity:1}).addTo(map).bindTooltip(esc(t('map_you')));
  if(!all.length){if(note)note.textContent=f&&f.ok?t('map_no_st'):t('map_no_data');return;}
  const min=Math.min(...all.map(s=>s.p[fuelSel].v)),pts=[[p.lat,p.lon]];
  for(const s of all){
   const v=s.p[fuelSel].v,cheapest=v===min;pts.push([s.lat,s.lon]);
   const info=`<strong>${esc(eur(v))} €</strong> · ${esc(fuelSel)}<br>${esc(s.ville||'')}<br><span class="micro">${esc(s.adresse||'')}<br>${esc(fmtDatetime(s.p[fuelSel].d))}</span>`;
   if(cheapest){L.marker([s.lat,s.lon],{zIndexOffset:1000,icon:L.divIcon({className:'pricepin cheapest',html:`<span>${esc(eur(v))}</span>`,iconSize:[64,24],iconAnchor:[32,12]})}).addTo(map).bindPopup(info);}
   else L.circleMarker([s.lat,s.lon],{radius:5.5,color:'#fff',weight:1.5,fillColor:'#7a8794',fillOpacity:.95}).addTo(map).bindPopup(info);
  }
  try{map.fitBounds(pts,{padding:[30,30],maxZoom:12});}catch(_){}
  const best=all.find(s=>s.p[fuelSel].v===min);
  if(note&&best)note.innerHTML=`<strong>${esc(t('map_cheapest',{p:eur(min),v:best.ville||'',a:best.adresse||''}))}</strong>`;
 }
 async function mountAll(){
  const need=['weather','fuel'].filter(k=>open[k]&&document.getElementById('map-'+k));
  if(!need.length){for(const k of Object.keys(maps))destroy(k);return;}
  try{await loadLeaflet();}catch(_){need.forEach(k=>{const el=document.getElementById('map-'+k);if(el)el.innerHTML=`<p class="micro">${esc(t('map_fail'))}</p>`;});return;}
  if(need.includes('weather'))await mountWeather();
  if(need.includes('fuel'))mountFuelBox();
  for(const k of ['weather','fuel'])if(!need.includes(k))destroy(k);
 }

 // ---------- Graphique de tendance : 12 semaines glissantes ----------
 function loadHistory(){
  if(hist.state!=='idle')return;hist.state='loading';
  fetch('./data/carburants-history.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();})
   .then(j=>{if(!j||!Array.isArray(j.weeks)||!j.weeks.length)throw Error('vide');hist.data=j;hist.state='ready';})
   .catch(()=>{hist.state='error';}).then(()=>{if(state.tab==='reperes')render();});
 }
 const SERIES=[['gazole','Gazole','#2a6f97'],['e10','SP95-E10','#e4572e'],['sp98','SP98','#8a5aa8']];
 function historyBlock(){
  loadHistory();
  const head=`<h3 class="section-heading small">${t('hist_h')}</h3>`;
  if(hist.state==='error')return `<div class="histslot">${head}${infoEmpty(t('hist_ko'))}</div>`;
  if(!hist.data)return `<div class="histslot">${head}<p class="micro">${t('hist_loading')}</p></div>`;
  const weeks=hist.data.weeks.slice(-12),n=weeks.length;
  const W=640,H=270,L0=58,R0=18,T0=16,B0=44,iw=W-L0-R0,ih=H-T0-B0;
  const vals=weeks.flatMap(w=>SERIES.map(s=>w[s[0]]).filter(v=>v>0));
  let lo=Math.min(...vals),hi=Math.max(...vals);if(hi-lo<0.06){const c=(hi+lo)/2;lo=c-.05;hi=c+.05;}
  const pad=(hi-lo)*.12;lo-=pad;hi+=pad;
  const X=i=>L0+iw*(i/11),Y=v=>T0+ih-((v-lo)/(hi-lo))*ih;
  let grid='';for(let g=0;g<=4;g++){const v=lo+(hi-lo)*g/4,y=Y(v);grid+=`<line x1="${L0}" y1="${y.toFixed(1)}" x2="${W-R0}" y2="${y.toFixed(1)}" stroke="currentColor" opacity=".12"/><text x="${L0-8}" y="${(y+4).toFixed(1)}" text-anchor="end" font-size="11" fill="currentColor" opacity=".7">${esc(eur(v,2))}</text>`;}
  let xl='';weeks.forEach((w,i)=>{if(n<=6||i%2===0||i===n-1)xl+=`<text x="${X(i).toFixed(1)}" y="${H-22}" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">${esc(fmt({timeZone:'UTC',day:'2-digit',month:'2-digit'}).format(new Date(w.week+'T12:00:00Z')))}</text>`;});
  let future='';for(let i=n;i<12;i++)future+=`<circle cx="${X(i).toFixed(1)}" cy="${(T0+ih).toFixed(1)}" r="2" fill="currentColor" opacity=".2"/>`;
  let lines='';
  for(const [key,label,color] of SERIES){
   const pts=weeks.map((w,i)=>w[key]>0?[X(i),Y(w[key]),w[key],w.week]:null).filter(Boolean);
   if(!pts.length)continue;
   if(pts.length>1)lines+=`<polyline points="${pts.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
   lines+=pts.map(q=>`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="4.5" fill="${color}" stroke="#fff" stroke-width="1.5"><title>${esc(label)} · ${esc(t('week_of',{d:fmtDate(q[3])}))} : ${esc(eur(q[2]))} €</title></circle>`).join('');
  }
  const legend=SERIES.map(s=>`<span class="lg"><i style="background:${s[2]}"></i>${esc(s[1])}</span>`).join('');
  const last=weeks[n-1],prev=n>1?weeks[n-2]:null;
  const d=(a,b)=>{if(!(a>0&&b>0))return '—';const x=a-b;return (x>0?'+':'')+eur(x,3)+' €';};
  const delta=prev?`<p class="micro"><strong>${esc(t('hist_delta',{g:d(last.gazole,prev.gazole),e:d(last.e10,prev.e10)}))}</strong></p>`:'';
  const aria=SERIES.map(s=>s[1]+' : '+weeks.map(w=>w[s[0]]>0?eur(w[s[0]],2):'—').join(', ')).join(' ; ');
  return `<div class="histslot">${head}<div class="legend">${legend}</div><svg class="histsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('hist_h')+' — '+aria)}" font-family="system-ui,sans-serif">${grid}${xl}${future}${lines}</svg>${n<12?`<p class="micro">${esc(t('hist_build',{n}))}</p>`:''}${delta}<p class="micro">${esc(t('hist_note'))} ${link(hist.data.sourceUrl,hist.data.source||'')}</p></div>`;
 }

 // ---------- Événements et branchement sur l'affichage ----------
 document.addEventListener('click',e=>{
  const el=e.target.closest('button');if(!el)return;
  if(el.dataset.mapopen){open[el.dataset.mapopen]=true;render();}
  else if(el.dataset.mapclose){open[el.dataset.mapclose]=false;render();}
 });
 document.addEventListener('change',e=>{if(e.target.id==='map-fuel-sel'){fuelSel=e.target.value;if(maps.fuel)mountFuelBox();}});
 const baseRender=render;
 render=function(){baseRender.apply(this,arguments);mountAll();};
 window.LBI_MAPS={slot};
 render();
})();
