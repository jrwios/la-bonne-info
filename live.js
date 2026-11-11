'use strict';
// Collecte en direct (depuis le navigateur) : météo et carburants.
// Sources : Open-Meteo et data.economie.gouv.fr (prix officiels).
// La presse est collectée par scripts/build-edition.mjs (GitHub Actions).
(function(){
 const LAT=46.9747, LON=-1.3135, RADIUS_KM=40;
 function timeout(ms){const c=new AbortController();setTimeout(()=>c.abort(),ms);return c.signal;}
 async function getJson(url){const r=await fetch(url,{signal:timeout(12000)});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}

 async function meteo(){
  const j=await getJson(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset&timezone=Europe%2FParis&forecast_days=1`);
  const d=j.daily; if(!d||!d.time||!d.time.length)throw Error('Météo vide');
  return {ok:true,city:'Montaigu-Vendée',source:'Open-Meteo',sourceUrl:'https://open-meteo.com/en/docs',fetchedAt:new Date().toISOString(),validForDate:d.time[0],code:d.weather_code[0],tmin:d.temperature_2m_min[0],tmax:d.temperature_2m_max[0],pluiePct:d.precipitation_probability_max[0],vent:d.wind_speed_10m_max[0],rafales:d.wind_gusts_10m_max[0],lever:d.sunrise[0],coucher:d.sunset[0]};
 }

 const FUELS=[['Gazole','gazole_prix','gazole_maj'],['SP95-E10','e10_prix','e10_maj'],['SP95','sp95_prix','sp95_maj'],['SP98','sp98_prix','sp98_maj'],['E85','e85_prix','e85_maj'],['GPL','gplc_prix','gplc_maj']];
 async function carburants(){
  const base='https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records';
  const where=encodeURIComponent(`within_distance(geom, geom'POINT(${LON} ${LAT})', ${RADIUS_KM}km)`);
  const select=encodeURIComponent('id,ville,adresse,gazole_prix,gazole_maj,e10_prix,e10_maj,sp95_prix,sp95_maj,sp98_prix,sp98_maj,e85_prix,e85_maj,gplc_prix,gplc_maj');
  let rows=[];
  for(let off=0;off<300;off+=100){
   const j=await getJson(`${base}?limit=100&offset=${off}&where=${where}&select=${select}`);
   rows=rows.concat(j.results||[]);
   if(!j.results||j.results.length<100)break;
  }
  const limit=Date.now()-14*86400000, prices=[], best={}, fresh=new Set();
  for(const [label,pk,mk] of FUELS){
   const list=rows.filter(r=>Number(r[pk])>0&&r[mk]&&new Date(r[mk]).getTime()>=limit).sort((a,b)=>a[pk]-b[pk]);
   list.forEach(r=>fresh.add(r.id));
   const mapped=list.slice(0,3).map(r=>({carburant:label,commune:r.ville,adresse:r.adresse,prix:Number(r[pk]),releve:r[mk]}));
   if(mapped.length){best[label]=mapped[0];prices.push(...mapped);}
  }
  if(!prices.length)throw Error('Aucun prix récent');
  return {ok:true,prices,best,stationsVerifiees:fresh.size,source:'prix-carburants.gouv.fr',sourceUrl:'https://www.prix-carburants.gouv.fr/rubrique/opendata/',fetchedAt:new Date().toISOString()};
 }

 // Complète l'édition avec la météo et les carburants quand le fichier ne les contient pas.
 window.enrichEdition=async function(ed){
  const needM=!ed.meteo?.ok, needF=!ed.carburants?.ok;
  if(!needM&&!needF)return false;
  const [m,f]=await Promise.allSettled([needM?meteo():null,needF?carburants():null]);
  let changed=false;
  ed.checks=Object.assign({},ed.checks);
  if(m.status==='fulfilled'&&m.value){ed.meteo=m.value;ed.checks.meteo=true;changed=true;}
  if(f.status==='fulfilled'&&f.value){ed.carburants=f.value;ed.checks.carburants=true;changed=true;}
  return changed;
 };
})();
