'use strict';
// Données locales en direct, depuis le navigateur, selon le lieu choisi par la personne :
// météo (Open-Meteo), carburants (data.economie.gouv.fr, France), recherche de ville (Open-Meteo),
// nom de la commune (geo.api.gouv.fr). La presse est collectée par scripts/build-edition.mjs.
// Le lieu reste dans le navigateur de la personne ; seules des coordonnées arrondies (~1 km)
// sont envoyées à ces services publics pour obtenir la météo et les prix.
(function(){
 const RADIUS_KM=30;
 const DEFAULT_PLACE={name:'Montaigu-Vendée',lat:46.9747,lon:-1.3135,country:'FR',mode:'default'};
 const r2=x=>Math.round(Number(x)*100)/100;
 function timeout(ms){const c=new AbortController();setTimeout(()=>c.abort(),ms);return c.signal;}
 async function getJson(url){const r=await fetch(url,{signal:timeout(12000)});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}

 async function meteo(p){
  const j=await getJson(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset&timezone=auto&forecast_days=1`);
  const d=j.daily; if(!d||!d.time||!d.time.length)throw Error('Météo vide');
  return {ok:true,city:p.name,source:'Open-Meteo',sourceUrl:'https://open-meteo.com/en/docs',fetchedAt:new Date().toISOString(),validForDate:d.time[0],code:d.weather_code[0],tmin:d.temperature_2m_min[0],tmax:d.temperature_2m_max[0],pluiePct:d.precipitation_probability_max[0],vent:d.wind_speed_10m_max[0],rafales:d.wind_gusts_10m_max[0],lever:d.sunrise[0],coucher:d.sunset[0]};
 }

 const FUELS=[['Gazole','gazole_prix','gazole_maj'],['SP95-E10','e10_prix','e10_maj'],['SP95','sp95_prix','sp95_maj'],['SP98','sp98_prix','sp98_maj'],['E85','e85_prix','e85_maj'],['GPL','gplc_prix','gplc_maj']];
 async function carburants(p){
  if(p.country!=='FR')return {ok:false,reason:'hors-france'};
  const base='https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records';
  const where=encodeURIComponent(`within_distance(geom, geom'POINT(${p.lon} ${p.lat})', ${RADIUS_KM}km)`);
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
  return {ok:true,prices,best,stationsVerifiees:fresh.size,radiusKm:RADIUS_KM,source:'prix-carburants.gouv.fr',sourceUrl:'https://www.prix-carburants.gouv.fr/rubrique/opendata/',fetchedAt:new Date().toISOString()};
 }

 // Remplace la météo et les carburants de l'édition par ceux du lieu choisi.
 window.enrichEdition=async function(ed,place){
  const p=place||DEFAULT_PLACE;
  const [m,f]=await Promise.allSettled([meteo(p),carburants(p)]);
  ed.checks=Object.assign({},ed.checks);
  ed.meteo=m.status==='fulfilled'?m.value:{ok:false,city:p.name,source:'Open-Meteo',sourceUrl:'https://open-meteo.com/en/docs'};
  ed.carburants=f.status==='fulfilled'?f.value:{ok:false,reason:f.reason&&f.reason.message==='Aucun prix récent'?'aucun-prix':'indisponible',source:'prix-carburants.gouv.fr',sourceUrl:'https://www.prix-carburants.gouv.fr/rubrique/opendata/'};
  ed.checks.meteo=ed.meteo.ok;ed.checks.carburants=ed.carburants.ok;
  return true;
 };

 window.LBI_PLACE={
  RADIUS_KM,DEFAULT_PLACE,
  // Position de l'appareil (demande l'autorisation à la personne), puis nom de la commune.
  async locate(){
   const pos=await new Promise((ok,ko)=>{if(!navigator.geolocation)return ko(Error('unsupported'));navigator.geolocation.getCurrentPosition(ok,ko,{enableHighAccuracy:false,timeout:15000,maximumAge:600000});});
   const lat=r2(pos.coords.latitude),lon=r2(pos.coords.longitude);
   let name='Ma position',country='XX';
   try{const j=await getJson(`https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom&format=json`);if(j&&j[0]){name=j[0].nom;country='FR';}}catch(_){}
   return {name,lat,lon,country,mode:'gps'};
  },
  async search(q){
   const j=await getJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=fr&format=json`);
   return (j.results||[]).map(x=>({name:x.name+(x.admin2?' ('+x.admin2+')':x.admin1?' ('+x.admin1+')':''),lat:r2(x.latitude),lon:r2(x.longitude),country:x.country_code==='FR'||['GP','MQ','GF','RE','YT'].includes(x.country_code)?'FR':(x.country_code||'XX'),label:x.country||'',mode:'manual'}));
  }
 };
})();
