'use strict';
// Aucune actualité, aucun prix, aucun événement n'est codé en dur ici.
// L'interface ne publie que les données sourcées de data/*.json et les données locales en direct (live.js).
const $ = id => document.getElementById(id);

// ---------- Langues ----------
// Pour ajouter une langue : l'ajouter ici, dans chaque entrée de D (même ordre), et dans LANGS de scripts/build-edition.mjs.
const LANGS = {fr:['Français','fr-FR'], en:['English','en-GB'], es:['Español','es-ES']};
const ORDER = ['fr','en','es'];
const D = {
 topline:['L’information, sans l’agitation','News, without the noise','La información, sin agitación'],
 kicker:['Le quotidien qui prend le temps','The daily that takes its time','El diario que se toma su tiempo'],
 tagline:['Comprendre le monde. Cultiver sa curiosité.','Understand the world. Nurture your curiosity.','Comprender el mundo. Cultivar la curiosidad.'],
 nav_une:['La Une','Front page','Portada'], nav_journal:['Journal','News','Noticias'], nav_culture:['Culture','Culture','Cultura'], nav_reperes:['Repères','Guides','Datos'], nav_archives:['Archives','Archive','Archivo'],
 menu:['Rubriques du quotidien','Sections','Secciones'],
 edition_of:['Édition du {d}','Edition of {d}','Edición del {d}'],
 no_edition:['Pas d’édition','No edition','Sin edición'],
 no_edition_b:['<strong>Aucune édition vérifiée n’est disponible.</strong> Aucun article fictif ne sera affiché.','<strong>No verified edition is available.</strong> No fictional article will be shown.','<strong>No hay ninguna edición verificada.</strong> No se mostrará ningún artículo ficticio.'],
 archived:['<strong>Attention : édition archivée.</strong> Dernière date publiée : {d}. Il ne s’agit pas des informations du jour.','<strong>Warning: archived edition.</strong> Last published date: {d}. This is not today’s news.','<strong>Atención: edición archivada.</strong> Última fecha publicada: {d}. No son las noticias de hoy.'],
 offline:['<strong>Consultation hors ligne.</strong> Données enregistrées du {d}. La fraîcheur des prix n’est pas garantie.','<strong>Offline.</strong> Data saved on {d}. Price freshness is not guaranteed.','<strong>Sin conexión.</strong> Datos guardados del {d}. No se garantiza la actualidad de los precios.'],
 banner_ok:['<strong>Dernière analyse : {t}.</strong> {n} sujets croisant {m} articles de médias variés. Synthèses rédigées automatiquement : vérifiez auprès des sources.','<strong>Last analysis: {t}.</strong> {n} topics cross-checking {m} articles from varied outlets. Automatically written summaries: check the sources.','<strong>Último análisis: {t}.</strong> {n} temas que cruzan {m} artículos de medios variados. Resúmenes redactados automáticamente: compruebe las fuentes.'],
 banner_raw:['<strong>Synthèses indisponibles pour le moment.</strong> Seuls les titres publiés par les médias sont affichés.','<strong>Summaries currently unavailable.</strong> Only headlines published by the outlets are shown.','<strong>Resúmenes no disponibles por ahora.</strong> Solo se muestran los titulares publicados por los medios.'],
 hero_eyebrow:['À la une · synthèse croisée','Top story · cross-checked summary','Portada · resumen contrastado'],
 hero_none_h:['Pas encore d’analyse disponible.','No analysis available yet.','Aún no hay análisis disponible.'],
 hero_none_p:['Les synthèses sont publiées trois fois par jour. Nous ne remplaçons pas l’information par une simulation.','Summaries are published three times a day. We never replace news with a simulation.','Los resúmenes se publican tres veces al día. No sustituimos la información por una simulación.'],
 hero_more:['Lire l’analyse complète','Read the full analysis','Leer el análisis completo'],
 sources_lbl:['Sources : {s}','Sources: {s}','Fuentes: {s}'],
 raw_hero:['À la une · titre publié par une rédaction','Top story · headline published by a newsroom','Portada · titular publicado por una redacción'],
 read_source:['Lire à la source','Read at the source','Leer en la fuente'],
 s_context:['Contexte','Context','Contexto'], s_summary:['Synthèse','Summary','Síntesis'], s_stakes:['Enjeux','What is at stake','Lo que está en juego'], s_sources:['Sources','Sources','Fuentes'],
 s_single:['Sujet traité par une seule source : à recouper.','Covered by a single source only: cross-check it.','Tema tratado por una sola fuente: conviene contrastarlo.'],
 s_image:['Image : {s}','Image: {s}','Imagen: {s}'],
 s_ai:['Synthèse rédigée automatiquement à partir des titres et résumés publiés par les médias cités. Elle ne remplace pas la lecture des articles.','Summary written automatically from the headlines and abstracts published by the outlets cited. It does not replace reading the articles.','Resumen redactado automáticamente a partir de los titulares y extractos publicados por los medios citados. No sustituye la lectura de los artículos.'],
 s_notrans:['Traduction indisponible : texte en français.','Translation unavailable: text in French.','Traducción no disponible: texto en francés.'],
 save:['Enregistrer ce sujet','Save this topic','Guardar este tema'], unsave:['Retirer des favoris','Remove from favorites','Quitar de favoritos'],
 raw_from:['Titre provenant du média indiqué','Headline from the outlet shown','Titular del medio indicado'], raw_orig:['Consulter l’article original','Read the original article','Consultar el artículo original'],
 in_edition:['Dans l’édition','In this edition','En esta edición'], full_journal:['Le journal complet ›','Full news ›','Todas las noticias ›'],
 france:['France','France','Francia'], world:['International','World','Internacional'],
 none_topic:['Aucun sujet disponible.','No topic available.','Ningún tema disponible.'],
 practical:['Le quotidien pratique','Daily essentials','Lo cotidiano'], weather:['La météo','Weather','El tiempo'], fuel:['Prix à la pompe','Fuel prices','Precios de combustible'],
 culture_view:['Culture et regard','Culture and perspective','Cultura y mirada'], explore:['Explorer les découvertes','Explore discoveries','Explorar descubrimientos'],
 culture_n:['Expositions locales vérifiées : {n}.','Verified local exhibitions: {n}.','Exposiciones locales verificadas: {n}.'],
 journal_h:['Le journal','The news','Las noticias'], journal_k:['Actualité, synthèse croisée','News, cross-checked','Actualidad, contrastada'],
 journal_intro:['Chaque sujet croise plusieurs médias de sensibilités et de pays différents, sans en privilégier un. Vous trouverez le contexte, la synthèse, les enjeux, puis les sources.','Each topic cross-checks several outlets of different leanings and countries, favouring none. You will find the context, the summary, the stakes, then the sources.','Cada tema contrasta varios medios de distintas sensibilidades y países, sin privilegiar ninguno. Encontrará el contexto, la síntesis, lo que está en juego y las fuentes.'],
 raw_intro:['Titres attribués à leurs rédactions, sans vérification indépendante de leur contenu.','Headlines attributed to their newsrooms, without independent verification of their content.','Titulares atribuidos a sus redacciones, sin verificación independiente de su contenido.'],
 n_topics:['{n} sujets','{n} topics','{n} temas'],
 empty_news:['Aucun sujet récent vérifiable','No recent verifiable topic','Ningún tema reciente verificable'], empty_news_d:['Les flux ne sont pas disponibles ou leurs articles sont trop anciens.','Feeds are unavailable or their articles are too old.','Los flujos no están disponibles o sus artículos son demasiado antiguos.'],
 around:['Autour de {n}','Around {n}','Cerca de {n}'], m_gps:['votre position','your location','su ubicación'], m_manual:['ville choisie','chosen city','ciudad elegida'], m_default:['lieu par défaut','default place','lugar por defecto'],
 geo_btn:['Me géolocaliser','Locate me','Localizarme'], searching:['Recherche…','Searching…','Buscando…'], city_ph:['Ou chercher une ville…','Or search for a city…','O busque una ciudad…'], city_btn:['Chercher','Search','Buscar'], city_lbl:['Chercher une ville','Search for a city','Buscar una ciudad'],
 privacy:['Votre position reste sur votre appareil. Des coordonnées arrondies à environ 1 km sont envoyées aux services publics de météo et de prix pour obtenir les données locales.','Your location stays on your device. Coordinates rounded to about 1 km are sent to public weather and price services to get local data.','Su ubicación permanece en su dispositivo. Se envían coordenadas redondeadas a unos 1 km a los servicios públicos de tiempo y precios para obtener datos locales.'],
 allow:['Autorisez la localisation dans votre navigateur…','Allow location access in your browser…','Autorice la ubicación en su navegador…'],
 denied:['Localisation refusée. Vous pouvez chercher une ville à la place.','Location denied. You can search for a city instead.','Ubicación denegada. Puede buscar una ciudad.'],
 notfound:['Position introuvable. Cherchez une ville à la place.','Position not found. Search for a city instead.','Posición no encontrada. Busque una ciudad.'],
 nocity:['Aucune ville trouvée.','No city found.','No se encontró ninguna ciudad.'], searchko:['Recherche indisponible pour le moment.','Search currently unavailable.','Búsqueda no disponible por ahora.'],
 w_na:['Météo non disponible','Weather unavailable','Tiempo no disponible'], w_na_d:['Prévisions pour {p} en attente de la source Open-Meteo.','Forecast for {p} awaiting the Open-Meteo source.','Previsión para {p} pendiente de la fuente Open-Meteo.'],
 w_rain:['Risque maximal de pluie : {p} %.','Maximum chance of rain: {p}%.','Probabilidad máxima de lluvia: {p} %.'], w_wind:['Vent maximal : {v} km/h ; rafales : {g} km/h.','Maximum wind: {v} km/h; gusts: {g} km/h.','Viento máximo: {v} km/h; rachas: {g} km/h.'],
 w_sun:['Lever du soleil : {a} · coucher : {b}.','Sunrise: {a} · sunset: {b}.','Salida del sol: {a} · puesta: {b}.'], w_for:['Prévision pour le {d}','Forecast for {d}','Previsión para el {d}'], consulted:['consultée le {t}','retrieved {t}','consultada el {t}'], na:['non disponible','not available','no disponible'],
 w0:['Ciel dégagé','Clear sky','Cielo despejado'], w3:['Nuages variables','Partly cloudy','Nubosidad variable'], w48:['Brouillard','Fog','Niebla'], w57:['Bruine','Drizzle','Llovizna'], w67:['Pluie','Rain','Lluvia'], w77:['Neige','Snow','Nieve'], w82:['Averses','Showers','Chubascos'], w95:['Orages','Thunderstorms','Tormentas'], wx:['Conditions variables','Variable conditions','Condiciones variables'],
 f_na:['Carburants non disponibles','Fuel prices unavailable','Precios de combustible no disponibles'], f_foreign:['Les prix officiels ne sont publiés que pour la France.','Official prices are only published for France.','Los precios oficiales solo se publican para Francia.'],
 f_none:['Aucun relevé récent dans un rayon de {r} km autour de {p}.','No recent price within {r} km of {p}.','Ningún precio reciente en un radio de {r} km alrededor de {p}.'], f_down:['Le service des prix officiels ne répond pas pour le moment.','The official price service is not responding right now.','El servicio de precios oficiales no responde por ahora.'],
 f_scope:['Stations à {r} km maximum de {p}. Prix déclarés, datés de 14 jours au plus ; ils peuvent différer du prix à la pompe.','Stations within {r} km of {p}. Declared prices, at most 14 days old; they may differ from the pump price.','Estaciones a un máximo de {r} km de {p}. Precios declarados, de 14 días como máximo; pueden diferir del precio en surtidor.'],
 th_fuel:['Carburant','Fuel','Combustible'], th_station:['Commune / station','Town / station','Municipio / estación'], th_price:['Prix','Price','Precio'], th_date:['Relevé','Reading','Registro'],
 f_note:['{n} stations avec relevé récent · source : {s} · collecte : {t}. {x}','{n} stations with a recent reading · source: {s} · collected: {t}. {x}','{n} estaciones con registro reciente · fuente: {s} · recogida: {t}. {x}'],
 f_best:['Le plus bas relevé par type de carburant dans le périmètre indiqué.','Lowest reading per fuel type in the area shown.','El precio más bajo por tipo de combustible en la zona indicada.'], f_top:['Sélection des trois prix les plus bas pour chaque carburant, dans le périmètre indiqué.','The three lowest prices for each fuel in the area shown.','Los tres precios más bajos de cada combustible en la zona indicada.'],
 culture_h:['Culture et découvertes','Culture and discoveries','Cultura y descubrimientos'], culture_k:['Art · Histoire','Art · History','Arte · Historia'],
 culture_fr:['Cette rubrique est publiée en français uniquement.','This section is published in French only.','Esta sección se publica solo en francés.'],
 culture_s:['Rendez-vous artistiques près de chez nous','Art events nearby','Citas artísticas cercanas'], culture_none:['Aucune exposition validée pour cette édition','No validated exhibition for this edition','Ninguna exposición validada para esta edición'], culture_none_d:['Les dates et les lieux doivent être confirmés auprès des organisateurs.','Dates and venues must be confirmed with the organisers.','Las fechas y los lugares deben confirmarse con los organizadores.'],
 from_to:['Du {a} au {b}','From {a} to {b}','Del {a} al {b}'], official:['Informations officielles — {s}','Official information — {s}','Información oficial — {s}'],
 hist_h:['Ce jour-là, dans l’histoire','On this day in history','Un día como hoy en la historia'], hist_none:['Éphéméride en cours de documentation','Almanac being documented','Efeméride en preparación'], hist_none_d:['Aucun événement historique du jour n’a été validé pour cette édition.','No historical event of the day has been validated for this edition.','Ningún hecho histórico del día ha sido validado para esta edición.'],
 reperes_h:['Les repères','Guides','Datos útiles'], reperes_k:['Données publiques et méthode','Public data and method','Datos públicos y método'],
 weather_h:['Météo · {p}','Weather · {p}','El tiempo · {p}'], fuel_h:['Carburants · autour de {p}','Fuel · around {p}','Combustible · cerca de {p}'],
 transp:['Transparence éditoriale','Editorial transparency','Transparencia editorial'], last_ed:['Dernière édition enregistrée : {d}','Last saved edition: {d}','Última edición guardada: {d}'], coll:['collecte du {t}','collected {t}','recogida el {t}'], none_w:['aucune','none','ninguna'],
 reliab:['La fiabilité d’une source signifie que son origine est connue ; elle ne garantit pas que toute affirmation publiée est exacte.','A source being reliable means its origin is known; it does not guarantee every published claim is accurate.','La fiabilidad de una fuente significa que se conoce su origen; no garantiza que toda afirmación publicada sea exacta.'],
 c_news:['Actualités','News','Noticias'], c_weather:['Météo','Weather','Tiempo'], c_fuel:['Carburants','Fuel','Combustible'], c_lit:['Liturgie','Liturgy','Liturgia'], avail:['Données disponibles','Data available','Datos disponibles'], unavail:['Indisponible','Unavailable','No disponible'],
 feeds_h:['Flux de presse contrôlés','Monitored press feeds','Flujos de prensa controlados'], feed_ok:['{n} titres récents','{n} recent headlines','{n} titulares recientes'], feed_ko:['Non exploitable','Not usable','No utilizable'], no_feed:['Aucun flux contrôlé pour le moment','No monitored feed for now','Ningún flujo controlado por ahora'],
 arch_h:['Mes archives','My archive','Mi archivo'], arch_k:['Relecture et réglages','Reading back and settings','Relectura y ajustes'], old_h:['Les anciennes éditions','Past editions','Ediciones anteriores'],
 old_note:['Choisissez une date publiée. Les anciens prix et titres restent datés : ils ne sont pas présentés comme actuels.','Choose a published date. Old prices and headlines stay dated: they are not shown as current.','Elija una fecha publicada. Los precios y titulares antiguos siguen fechados: no se presentan como actuales.'],
 ed_lbl:['Édition','Edition','Edición'], latest_opt:['Édition la plus récente','Most recent edition','Edición más reciente'], refresh:['Actualiser','Refresh','Actualizar'], no_arch:['Aucune archive publiée','No archive published','Ningún archivo publicado'], ed_sel:['Édition sélectionnée : {d}','Selected edition: {d}','Edición seleccionada: {d}'],
 fav_h:['Mes articles favoris','My saved items','Mis favoritos'], fav_search:['Rechercher dans les favoris','Search saved items','Buscar en favoritos'], fav_ph:['Rechercher par titre ou rédaction','Search by title or newsroom','Buscar por título o redacción'], fav_none:['Aucun sujet enregistré','Nothing saved','Nada guardado'], fav_none_d:['Ouvrez Le journal, puis touchez l’étoile d’un sujet à conserver.','Open the news, then tap the star of a topic to keep.','Abra las noticias y toque la estrella de un tema para guardarlo.'],
 prefs:['Préférences de lecture','Reading preferences','Preferencias de lectura'], typo:['Typographie','Typography','Tipografía'], smaller:['Réduire la taille du texte','Decrease text size','Reducir el tamaño del texto'], bigger:['Augmenter la taille du texte','Increase text size','Aumentar el tamaño del texto'],
 look:['Apparence','Appearance','Apariencia'], th_auto:['Automatique','Automatic','Automático'], th_light:['Claire','Light','Claro'], th_dark:['Sombre','Dark','Oscuro'], ink:['Couleur de l’encre secondaire','Secondary ink colour','Color de tinta secundario'], lang_h:['Langue','Language','Idioma'],
 col0:['Kaki','Khaki','Caqui'], col1:['Anthracite','Charcoal','Antracita'], col2:['Sépia','Sepia','Sepia'], col3:['Prune grise','Grey plum','Ciruela gris'],
 charter_h:['Charte de LA BONNE INFO','LA BONNE INFO charter','Carta de LA BONNE INFO'],
 charter:['Les synthèses croisent plusieurs médias de sensibilités et de pays différents et attribuent chaque affirmation contestée à sa source. Elles sont rédigées automatiquement à partir des titres et résumés publiés ; les sources sont toujours indiquées. Les chiffres sont horodatés. Une information absente n’est pas remplacée par une invention.','The summaries cross-check several outlets of different leanings and countries and attribute each contested claim to its source. They are written automatically from published headlines and abstracts; sources are always shown. Figures are timestamped. Missing information is never replaced by invention.','Los resúmenes contrastan varios medios de distintas sensibilidades y países y atribuyen cada afirmación discutida a su fuente. Se redactan automáticamente a partir de titulares y extractos publicados; las fuentes siempre se indican. Las cifras llevan fecha y hora. Una información ausente no se sustituye por una invención.'],
 tp_politique:['Politique','Politics','Política'], tp_economie:['Économie','Economy','Economía'], tp_societe:['Société','Society','Sociedad'], tp_justice:['Justice et faits divers','Justice and crime','Justicia y sucesos'], tp_sport:['Sport','Sport','Deportes'], tp_culture:['Culture et médias','Culture and media','Cultura y medios'], tp_sciences_tech:['Sciences et technologies','Science and technology','Ciencia y tecnología'], tp_sante:['Santé','Health','Salud'], tp_environnement:['Environnement et climat','Environment and climate','Medio ambiente y clima'], tp_international:['International','World affairs','Internacional'],
 flt_all:['Tous','All','Todos'], flt_mine:['Pour vous','For you','Para usted'], for_you:['Pour vous','For you','Para usted'], other_fr:['Autres sujets · France','Other topics · France','Otros temas · Francia'], other_world:['Autres sujets · International','Other topics · World','Otros temas · Internacional'], hello:['Bonjour {n}','Hello {n}','Hola {n}'],
 empty_filter:['Aucun sujet dans cette catégorie pour le moment.','No topic in this category right now.','Ningún tema en esta categoría por ahora.'], topics_lbl:['Rubriques','Categories','Categorías'],
 loading:['Chargement du journal…','Loading…','Cargando…'], date_na:['Date non indiquée','Date not given','Fecha no indicada'], badge_arch:['Édition archivée','Archived edition','Edición archivada'],
 alert_load:['Cette édition ne peut pas être chargée pour le moment.','This edition cannot be loaded right now.','Esta edición no se puede cargar ahora.']
};
function detectLang(){const n=(navigator.language||'fr').slice(0,2).toLowerCase();return LANGS[n]?n:'fr';}
let state = {tab:'une',theme:'auto',size:17,accent:'#58634A',saved:{},q:'',selectedDate:'',place:null,lang:null,profile:null,topic:'all'};
let placeUi = {msg:'',results:[],busy:false};
const DEFAULT_PLACE = {name:'Montaigu-Vendée',lat:46.9747,lon:-1.3135,country:'FR',mode:'default'};
const PALETTE = ['#58634A','#3F4A48','#755C4A','#665466'];
const NAV = [
 ['une','nav_une','<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/>'],
 ['journal','nav_journal','<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>'],
 ['culture','nav_culture','<path d="M4 19V5l5-2 6 3 5-2v14l-5 2-6-3z"/><path d="M9 3v14M15 6v14"/>'],
 ['reperes','nav_reperes','<circle cx="12" cy="12" r="9"/><path d="m12 7 2.5 5-5 4 2.5-9z"/>'],
 ['archives','nav_archives','<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16M11 9h6M11 13h6"/>']
];
try { const stored = JSON.parse(localStorage.getItem('lbi-v5') || '{}'); Object.assign(state, stored); } catch (_) {}
if (!LANGS[state.lang]) state.lang = detectLang();
state.tab = 'une';
let data = null, latest = null, archiveIndex = [], loadStatus = 'loading', networkFailure = false;

function t(k, v){
 const row = D[k]; let s = row ? (row[ORDER.indexOf(state.lang)] ?? row[0]) : k;
 if (v) for (const x in v) s = s.split('{'+x+'}').join(v[x]);
 return s;
}
const LOC = () => LANGS[state.lang][1];
const fmt = o => new Intl.DateTimeFormat(LOC(), Object.assign({timeZone:'Europe/Paris'}, o));
function place(){const p=state.place;return p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&p.name?p:DEFAULT_PLACE;}
function persist(){try {localStorage.setItem('lbi-v5', JSON.stringify({theme:state.theme,size:state.size,accent:state.accent,saved:state.saved,place:state.place,lang:state.lang,profile:state.profile}));}catch(_){}}
function esc(x){return String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safeUrl(u){try{const p=new URL(String(u));return p.protocol==='https:'?p.href:null}catch(_){return null}}
function link(u,label,cl='link'){const valid=safeUrl(u);return valid?`<a href="${esc(valid)}" target="_blank" rel="noopener noreferrer" class="${cl}">${esc(label)}</a>`:'';}
function parseISO(value){const x=new Date(value);return Number.isFinite(x.getTime())?x:null;}
function fmtDatetime(v){const d=parseISO(v);return d?fmt({day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(d):t('date_na');}
function fmtDate(v){if(!/^\d{4}-\d\d-\d\d$/.test(v||''))return t('date_na');return fmt({timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}).format(new Date(v+'T12:00:00Z'));}
function currentDay(){return new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function mix(hex,other,fraction){const a=hex.match(/.{2}/g),b=other.match(/.{2}/g);if(!a||!b)return hex;return '#'+a.map((x,i)=>Math.round(parseInt(x,16)*(1-fraction)+parseInt(b[i],16)*fraction).toString(16).padStart(2,'0')).join('');}
function setTheme(){let accent=/^#[A-Fa-f0-9]{6}$/.test(state.accent)?state.accent:'#58634A';document.documentElement.dataset.theme=state.theme==='auto'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):state.theme;const dark=document.documentElement.dataset.theme==='dark';document.documentElement.style.setProperty('--olive',dark?mix(accent.slice(1),'F6F5EF',.55):accent);document.documentElement.style.setProperty('--fs',Math.max(15,Math.min(23,Number(state.size)||17))+'px');}
function isCurrent(){return data && data.date===currentDay();}

// ---------- Sujets synthétisés ----------
function storiesOf(d){const s=d?.stories;return s&&((s.france||[]).length+(s.monde||[]).length)>0?s:null;}
function allStories(d){const s=storiesOf(d);return s?[...(s.france||[]),...(s.monde||[])]:[];}
function sx(s){return (state.lang!=='fr'&&s.i18n&&s.i18n[state.lang])||s;}
function sourceNames(s){return [...new Set((s.sources||[]).map(a=>a.name))].join(', ');}
function cover(s){
 const im=s.image;if(!im||!safeUrl(im.url))return '';
 return `<figure class="cover"><img data-cover="1" src="${esc(safeUrl(im.url))}" alt="" loading="lazy" referrerpolicy="no-referrer"><figcaption>${link(im.link,t('s_image',{s:im.credit}),'micro')}</figcaption></figure>`;
}
function starBtn(id){const fav=state.saved?.[id];return `<button class="star" data-save="${esc(id)}" aria-pressed="${!!fav}" title="${esc(fav?t('unsave'):t('save'))}" aria-label="${esc(fav?t('unsave'):t('save'))}">${fav?'★':'☆'}</button>`;}
function storyCard(s){
 const x=sx(s);
 const miss=state.lang!=='fr'&&x===s;
 return `<article class="story">${starBtn(s.id)}${cover(s)}${s.topic&&D['tp_'+s.topic]?`<span class="eyebrow">${t('tp_'+s.topic)}</span>`:''}<h3>${esc(x.title)}</h3>
 ${x.context?`<h4>${t('s_context')}</h4><p>${esc(x.context)}</p>`:''}
 <h4>${t('s_summary')}</h4><p>${esc(x.summary)}</p>
 ${x.stakes&&x.stakes.length?`<h4>${t('s_stakes')}</h4><ul class="stakes">${x.stakes.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`:''}
 <h4>${t('s_sources')}</h4><ul class="srclist">${(s.sources||[]).map(a=>`<li>${link(a.link,a.name+' — '+a.title,'srclink')}<span class="micro"> · ${esc(fmtDatetime(a.publishedAt))}${a.lang&&a.lang!==state.lang?' · '+esc(String(a.lang).toUpperCase()):''}</span></li>`).join('')}</ul>
 ${(s.sources||[]).length<2?`<p class="micro">${t('s_single')}</p>`:''}${miss?`<p class="micro">${t('s_notrans')}</p>`:''}</article>`;
}
function mediaCard(article){
 if(!article||!article.title||!safeUrl(article.link)||!article.source||!article.publishedAt)return '';
 return `<article class="article">${starBtn(article.id)}<div class="micro">${esc(article.source)} · ${esc(fmtDatetime(article.publishedAt))}</div><h3>${link(article.link,article.title,'article-headline')}</h3><div class="micro">${t('raw_from')} · ${link(article.link,t('raw_orig'))}</div></article>`;
}

function banner(){
 const bar=$('info-banner'), chip=$('edition-chip');
 if(!data){chip.textContent=t('no_edition');bar.innerHTML=t('no_edition_b');return;}
 chip.textContent=t('edition_of',{d:fmtDate(data.date)});
 const st=storiesOf(data);
 if(!isCurrent())bar.innerHTML=t('archived',{d:esc(fmtDate(data.date))});
 else if(networkFailure)bar.innerHTML=t('offline',{d:esc(fmtDate(data.date))});
 else if(st){const n=allStories(data).length,m=allStories(data).reduce((a,s)=>a+(s.sources||[]).length,0);bar.innerHTML=t('banner_ok',{t:esc(fmtDatetime(data.storiesAt||data.generatedAt)),n,m});}
 else bar.innerHTML=t('banner_raw');
}
function footer(){return `<footer><strong>${t('charter_h')}</strong><br>${esc(t('charter'))}</footer>`;}
function infoEmpty(what,detail=''){return `<div class="empty"><strong>${esc(what)}</strong>${detail?'<br>'+esc(detail):''}</div>`;}
function header(title,kicker){return `<div class="kicker-row"><span class="eyebrow">${esc(kicker)}</span><span class="date-chip">${data?esc(fmtDate(data.date)):'—'}</span></div><h2 class="section-title">${esc(title)}</h2>`;}

function interests(){return state.profile&&Array.isArray(state.profile.interests)?state.profile.interests:[];}
function isMine(s){const i=interests();return i.length>0&&i.includes(s.topic);}
function heroStory(st){const all=[...(st.france||[]),...(st.monde||[])];return (interests().length&&all.find(isMine))||(st.france||[])[0]||(st.monde||[])[0];}
function prefFirst(list){return [...list.filter(isMine),...list.filter(s=>!isMine(s))];}
function greeting(){const n=state.profile&&state.profile.name;return n?`<p class="micro greeting">${esc(t('hello',{n}))}</p>`:'';}
function headline(){
 if(!data)return `<section class="hero"><span class="eyebrow">${t('hero_eyebrow')}</span><h2>${t('hero_none_h')}</h2><p class="intro">${t('hero_none_p')}</p></section>`;
 const st=storiesOf(data);
 if(st){
  const s=heroStory(st),x=sx(s);
  return `<section class="hero"><span class="eyebrow">${t('hero_eyebrow')}</span><h2>${esc(x.title)}</h2>${cover(s)}<p class="intro">${esc(x.summary)}</p><div class="micro">${esc(t('sources_lbl',{s:sourceNames(s)}))}</div><p><button class="mbtn" data-tab="journal">${t('hero_more')}</button></p></section>`;
 }
 const item=data.news?.france?.[0]||data.news?.monde?.[0];
 return `<section class="hero"><span class="eyebrow">${t('raw_hero')}</span>${item?`<h2>${link(item.link,item.title)}</h2><div class="micro">${esc(item.source)} · ${esc(fmtDatetime(item.publishedAt))}</div>${link(item.link,t('read_source'),'mbtn')}`:`<h2>${t('hero_none_h')}</h2><p class="intro">${t('hero_none_p')}</p>`}</section>`;
}

function weatherCode(c){c=Number(c);if(c===0)return t('w0');if(c<=3)return t('w3');if(c<=48)return t('w48');if(c<=57)return t('w57');if(c<=67)return t('w67');if(c<=77)return t('w77');if(c<=82)return t('w82');if(c>=95)return t('w95');return t('wx');}
function hm(iso){return /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(iso||'')?iso.slice(11,16):t('na');}
function num(value,digits){return Number.isFinite(Number(value))&&value!==null&&value!==''?Number(value).toLocaleString(LOC(),{minimumFractionDigits:digits,maximumFractionDigits:digits}):'—';}
function weatherCard(full=false){
 const m=data?.meteo;
 if(!m?.ok)return infoEmpty(t('w_na'),t('w_na_d',{p:place().name}));
 const sub=`<p class="micro">${esc(t('w_for',{d:fmtDate(m.validForDate||data.date)}))} · ${link(m.sourceUrl,m.source||'Open-Meteo')} · ${esc(t('consulted',{t:fmtDatetime(m.fetchedAt)}))}</p>`;
 return `<div><div class="eyebrow">${esc(m.city||place().name)}</div><div class="metric">${num(m.tmin,0)}° / ${num(m.tmax,0)}°C</div><p>${esc(weatherCode(m.code))} · ${esc(t('w_rain',{p:num(m.pluiePct,0)}))}</p>${full?`<p>${esc(t('w_wind',{v:num(m.vent,0),g:num(m.rafales,0)}))}</p><p>${esc(t('w_sun',{a:hm(m.lever),b:hm(m.coucher)}))}</p>`:''}${sub}</div>`;
}
function fuelCard(full=false){
 const f=data?.carburants;
 if(!f?.ok){const R=window.LBI_PLACE?window.LBI_PLACE.RADIUS_KM:30;return infoEmpty(t('f_na'),f?.reason==='hors-france'||place().country!=='FR'?t('f_foreign'):f?.reason==='aucun-prix'?t('f_none',{r:R,p:place().name}):t('f_down'));}
 const keys=['Gazole','SP95-E10','SP95','SP98','E85','GPL'];
 const entries=keys.map(x=>f.best?.[x]).filter(Boolean);
 return `<div><p class="micro">${esc(t('f_scope',{r:f.radiusKm||30,p:place().name}))}</p><div class="fuel-scroll"><table><thead><tr><th>${t('th_fuel')}</th><th>${t('th_station')}</th><th>${t('th_price')}</th><th>${t('th_date')}</th></tr></thead><tbody>${(full?(f.prices||[]):entries).map(e=>`<tr><td>${esc(e.carburant)}</td><td>${esc(e.commune)}<div class="micro">${esc(e.adresse)}</div></td><td class="price">${num(e.prix,3)} €</td><td>${esc(fmtDatetime(e.releve))}</td></tr>`).join('')}</tbody></table></div><div class="micro fuel-note">${esc(t('f_note',{n:f.stationsVerifiees,s:f.source||'',t:fmtDatetime(f.fetchedAt),x:full?t('f_top'):t('f_best')}))} ${link(f.sourceUrl,f.source||'')}</div></div>`;
}
function placeBar(){
 const p=place();
 const mode=t(p.mode==='gps'?'m_gps':p.mode==='manual'?'m_manual':'m_default');
 return `<div class="placebar"><div class="placeline"><span>📍 ${esc(t('around',{n:p.name}))} <span class="micro">(${esc(mode)})</span></span><button type="button" class="mbtn" data-geo="1"${placeUi.busy?' disabled':''}>${placeUi.busy?t('searching'):t('geo_btn')}</button></div><form id="city-form" class="cityform"><label class="sr-only" for="city-q">${t('city_lbl')}</label><input type="search" id="city-q" placeholder="${esc(t('city_ph'))}" autocomplete="off"><button type="submit" class="mbtn ghost">${t('city_btn')}</button></form>${placeUi.results.length?`<div class="cityresults">${placeUi.results.map((r,i)=>`<button type="button" class="link" data-pick="${i}">${esc(r.name)}${r.label?' · '+esc(r.label):''}</button>`).join('')}</div>`:''}${placeUi.msg?`<p class="micro">${esc(placeUi.msg)}</p>`:''}<p class="micro">${t('privacy')}</p></div>`;
}

function home(){
 const st=storiesOf(data);
 const hero=st?heroStory(st):null;const tile=(list,fallback,skip)=>{
  if(st){const l=prefFirst(list.filter(s=>s!==hero)).slice(0,3);return l.length?l.map(s=>`<p><button class="link" data-tab="journal">${esc(sx(s).title)}</button></p>`).join(''):`<p class="micro">${t('none_topic')}</p>`;}
  return fallback.slice(skip,skip+3).map(a=>`<p>${link(a.link,a.title)}</p>`).join('')||`<p class="micro">${t('none_topic')}</p>`;
 };
 const nCult=(data?.culture||[]).length;
 return `${greeting()}${headline()}<div class="subsection"><div class="kicker-row"><h2 class="section-heading">${t('in_edition')}</h2><button class="link" data-tab="journal">${t('full_journal')}</button></div><div class="grid"><div class="tile"><h2>${t('france')}</h2>${tile(st?.france||[],data?.news?.france||[],st?1:1)}</div><div class="tile"><h2>${t('world')}</h2>${tile(st?.monde||[],data?.news?.monde||[],0)}</div></div></div><div class="subsection"><h2 class="section-heading">${t('practical')}</h2>${placeBar()}<div class="grid"><div class="tile"><h2>${t('weather')}</h2>${weatherCard(false)}</div><div class="tile"><h2>${t('fuel')}</h2>${fuelCard(false)}</div></div></div><div class="subsection"><h2 class="section-heading">${t('culture_view')}</h2><p>${esc(t('culture_n',{n:nCult}))}</p><button class="mbtn ghost" data-tab="culture">${t('explore')}</button></div>`;
}
function journal(){
 const st=storiesOf(data);
 const section=(title,list,raw)=>`<section class="subsection"><h2 class="section-heading">${title} <span class="micro">${esc(t('n_topics',{n:(st?list:raw).length}))}</span></h2>${(st?list:raw).length?(st?list.map(storyCard):raw.map(mediaCard)).join(''):infoEmpty(t('empty_news'),t('empty_news_d'))}</section>`;
 if(!st)return `${header(t('journal_h'),t('journal_k'))}<p class="intro">${t('raw_intro')}</p>${section(t('france'),[],data?.news?.france||[])}${section(t('world'),[],data?.news?.monde||[])}`;
 const fr=st.france||[],mo=st.monde||[],all=[...fr,...mo],mine=interests().length>0;
 const present=Object.keys(D).filter(k=>k.startsWith('tp_')).map(k=>k.slice(3)).filter(k=>all.some(s=>s.topic===k));
 let topic=state.topic||'all';if(topic==='mine'&&!mine)topic='all';
 const chip=(v,label)=>`<button type="button" class="chip" data-topic="${esc(v)}" aria-pressed="${topic===v}">${esc(label)}</button>`;
 const bar=`<div class="chips" role="group" aria-label="${esc(t('topics_lbl'))}">${chip('all',t('flt_all'))}${mine?chip('mine',t('flt_mine')):''}${present.map(k=>chip(k,t('tp_'+k))).join('')}</div>`;
 let body='';
 if(topic==='all'){
  if(mine){const m=all.filter(isMine);body+=section(t('for_you'),m,[]);body+=section(t('other_fr'),fr.filter(s=>!isMine(s)),[]);body+=section(t('other_world'),mo.filter(s=>!isMine(s)),[]);}
  else{body+=section(t('france'),fr,[]);body+=section(t('world'),mo,[]);}
 }else{
  const l=topic==='mine'?all.filter(isMine):all.filter(s=>s.topic===topic);
  body=`<section class="subsection">${l.length?l.map(storyCard).join(''):infoEmpty(t('empty_filter'))}</section>`;
 }
 return `${header(t('journal_h'),t('journal_k'))}<p class="intro">${t('journal_intro')}</p><p class="micro">${t('s_ai')}</p>${bar}${body}`;
}
function culture(){
 const events=data?.culture||[], hist=data?.history||[];
 return `${header(t('culture_h'),t('culture_k'))}${state.lang!=='fr'?`<p class="micro">${t('culture_fr')}</p>`:''}<section class="subsection"><h2 class="section-heading">${t('culture_s')}</h2>${events.length?events.map(e=>`<article class="event"><span class="eyebrow">${esc(e.discipline)} · ${esc(e.city)}</span><h3>${esc(e.title)}</h3><p>${esc(e.artist)}</p><p class="micro">${esc(e.venue)} · ${esc(t('from_to',{a:fmtDate(e.start),b:fmtDate(e.end)}))}</p><p>${esc(e.details)}</p>${link(e.sourceUrl,t('official',{s:e.source}))}</article>`).join(''):infoEmpty(t('culture_none'),t('culture_none_d'))}</section><section class="subsection"><h2 class="section-heading">${t('hist_h')}</h2>${hist.length?`<ol class="timeline">${hist.map(h=>`<li><span class="year">${esc(h.year)}</span><div><h3>${esc(h.title)}</h3><p>${esc(h.description)}</p><div class="micro">${link(h.sourceUrl,h.source)}</div></div></li>`).join('')}</ol>`:infoEmpty(t('hist_none'),t('hist_none_d'))}</section></section>`;
}
function reperes(){
 const checks=data?.checks||{};const src=data?.sources||[];
 return `${header(t('reperes_h'),t('reperes_k'))}<section class="subsection"><h2 class="section-heading">${esc(t('weather_h',{p:place().name}))}</h2>${placeBar()}${weatherCard(true)}</section><section class="subsection"><h2 class="section-heading">${esc(t('fuel_h',{p:place().name}))}</h2>${fuelCard(true)}</section><section class="subsection"><h2 class="section-heading">${t('transp')}</h2><p>${esc(t('last_ed',{d:data?fmtDate(data.date):t('none_w')}))}${data?' · '+esc(t('coll',{t:fmtDatetime(data.generatedAt)})):''}.</p><p class="micro">${t('reliab')}</p><ul class="state-log">${[['c_news','actualites'],['c_weather','meteo'],['c_fuel','carburants']].map(([label,key])=>`<li><span>${t(label)}</span><span class="${checks[key]?'good':'bad'}">${checks[key]?t('avail'):t('unavail')}</span></li>`).join('')}</ul><h3 class="section-heading" style="margin-top:26px">${t('feeds_h')}</h3>${src.length?`<ul class="state-log">${src.map(s=>`<li><span>${link(s.url,s.name)}</span><span class="${s.ok?'good':'bad'}">${s.ok?esc(t('feed_ok',{n:s.count})):t('feed_ko')}</span></li>`).join('')}</ul>`:infoEmpty(t('no_feed'))}</section>`;
}
function favoriteCards(){const q=state.q.toLocaleLowerCase(LOC()),items=Object.values(state.saved||{}).filter(a=>(a.title+' '+a.source).toLocaleLowerCase(LOC()).includes(q)).sort((a,b)=>String(b.publishedAt||'').localeCompare(a.publishedAt||''));return items.length?items.map(mediaCard).join(''):infoEmpty(t('fav_none'),t('fav_none_d'));}
function archives(){
 return `${header(t('arch_h'),t('arch_k'))}<section class="subsection"><h2 class="section-heading">${t('old_h')}</h2><p class="micro">${t('old_note')}</p><div class="controls"><label for="edition-select">${t('ed_lbl')}</label><select id="edition-select" aria-label="${esc(t('old_h'))}"><option value="">${t('latest_opt')}</option>${archiveIndex.map(x=>`<option value="${esc(x.date)}" ${x.date===state.selectedDate?'selected':''}>${esc(fmtDate(x.date))}</option>`).join('')}</select><button id="refresh" data-refresh="1">${t('refresh')}</button></div>${archiveIndex.length?'':infoEmpty(t('no_arch'))}${state.selectedDate?`<p class="micro">${esc(t('ed_sel',{d:fmtDate(state.selectedDate)}))}</p>`:''}</section><section class="subsection"><h2 class="section-heading">${t('fav_h')}</h2><label class="sr-only" for="search">${t('fav_search')}</label><input type="search" id="search" value="${esc(state.q)}" placeholder="${esc(t('fav_ph'))}"><div id="favorite-list">${favoriteCards()}</div></section><section class="subsection"><h2 class="section-heading">${t('prefs')}</h2><p class="micro">${t('lang_h')}</p><div class="controls">${ORDER.map(l=>`<button data-lang="${l}" aria-pressed="${state.lang===l}">${LANGS[l][0]}</button>`).join('')}</div><p class="micro">${t('typo')}</p><div class="controls"><button data-size="-1" aria-label="${esc(t('smaller'))}">A−</button><button data-size="1" aria-label="${esc(t('bigger'))}">A+</button></div><p class="micro">${t('look')}</p><div class="controls">${[['auto','th_auto'],['light','th_light'],['dark','th_dark']].map(x=>`<button data-theme="${x[0]}" aria-pressed="${state.theme===x[0]}">${t(x[1])}</button>`).join('')}</div><p class="micro">${t('ink')}</p><div class="controls">${PALETTE.map((c,i)=>`<button data-accent="${c}" aria-pressed="${state.accent===c}"><span style="color:${c}">●</span> ${t('col'+i)}</button>`).join('')}</div></section>`;
}
const PAGES={une:home,journal,culture,reperes,archives};
function render(){
 setTheme();
 document.documentElement.lang=state.lang;
 $('topline').textContent=t('topline');$('kicker').textContent=t('kicker');$('tagline').textContent=t('tagline');
 $('today').textContent=fmt({weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 const sel=$('lang');sel.innerHTML=ORDER.map(l=>`<option value="${l}"${l===state.lang?' selected':''}>${LANGS[l][0]}</option>`).join('');
 banner();
 const content=PAGES[state.tab]||home;
 $('app').innerHTML=`<div class="page">${content()}${footer()}</div>`;
 $('nav').setAttribute('aria-label',t('menu'));
 $('nav').innerHTML=NAV.map(([id,key,svg])=>`<button type="button" data-tab="${id}" aria-current="${state.tab===id?'page':'false'}"><svg viewBox="0 0 24 24" aria-hidden="true">${svg}</svg>${t(key)}</button>`).join('');
 document.title=t(NAV.find(x=>x[0]===state.tab)?.[1]||'nav_une')+' — LA BONNE INFO';
}

// ---------- Données ----------
async function requestJson(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
function validateEdition(j){return j&&j.schemaVersion===2&&/^\d{4}-\d\d-\d\d$/.test(j.date)&&j.news&&typeof j.news==='object'&&Array.isArray(j.news.france)&&Array.isArray(j.news.monde);}
async function loadLatest(){try{const j=await requestJson('./data/latest.json');if(!validateEdition(j))throw Error('Format inattendu');latest=j;data=j;state.selectedDate='';loadStatus='ready';networkFailure=!navigator.onLine;render();await refreshLocal();}catch(_){loadStatus='unavailable';if(!data)data=null;networkFailure=true;}render();}
// Météo et carburants du lieu choisi (position de l'appareil, ville saisie, ou lieu par défaut).
async function refreshLocal(){
 if(!latest||!window.enrichEdition)return;
 try{await window.enrichEdition(latest,place());}catch(_){}
 render();
}
async function useGeolocation(silent){
 if(!window.LBI_PLACE)return;
 placeUi.busy=true;placeUi.msg=silent?'':t('allow');placeUi.results=[];if(!silent)render();
 try{state.place=await window.LBI_PLACE.locate();persist();placeUi.msg='';}
 catch(e){placeUi.msg=e&&e.code===1?t('denied'):t('notfound');}
 placeUi.busy=false;render();await refreshLocal();
}
async function searchCity(q){
 q=String(q||'').trim();if(q.length<2)return;
 placeUi.msg=t('searching');placeUi.results=[];render();
 try{placeUi.results=await window.LBI_PLACE.search(q);placeUi.msg=placeUi.results.length?'':t('nocity');}
 catch(_){placeUi.msg=t('searchko');}
 render();
}
async function pickCity(i){
 const r=placeUi.results[i];if(!r)return;
 state.place={name:r.name,lat:r.lat,lon:r.lon,country:r.country,mode:'manual'};persist();placeUi.results=[];placeUi.msg='';render();await refreshLocal();
}
async function loadArchiveIndex(){try{const result=await requestJson('./data/index.json');archiveIndex=Array.isArray(result)?result.filter(v=>/^\d{4}-\d\d-\d\d$/.test(v.date)&&v.path===`data/editions/${v.date}.json`):[];}catch(_){archiveIndex=[];}if(state.tab==='archives')render();}
async function selectArchive(value){if(!value){data=latest;state.selectedDate='';render();return;}if(!archiveIndex.some(x=>x.date===value))return;try{const archive=await requestJson('./data/editions/'+value+'.json');if(!validateEdition(archive)||archive.date!==value)throw Error('Archive invalide');data=archive;state.selectedDate=value;state.tab='une';render();window.scrollTo(0,0);}catch(_){alert(t('alert_load'));}}
function toggleSaved(id){
 if(!data)return;
 if(state.saved[id]){delete state.saved[id];persist();render();return;}
 const s=allStories(data).find(a=>a.id===id);
 if(s){const first=(s.sources||[])[0];if(!first)return;state.saved[id]={id,title:sx(s).title,link:first.link,source:sourceNames(s),publishedAt:first.publishedAt};}
 else{const item=[...(data.news?.france||[]),...(data.news?.monde||[])].find(a=>a.id===id);if(!item)return;state.saved[id]={id:item.id,title:item.title,link:item.link,source:item.source,publishedAt:item.publishedAt};}
 persist();render();
}
document.addEventListener('click',event=>{const el=event.target.closest('button');if(!el)return;if(el.dataset.topic){state.topic=el.dataset.topic;render();}else if(el.dataset.geo){useGeolocation(false);}else if(el.dataset.pick){pickCity(Number(el.dataset.pick));}else if(el.dataset.lang){if(LANGS[el.dataset.lang]){state.lang=el.dataset.lang;persist();render();}}else if(el.dataset.tab){state.tab=el.dataset.tab;render();window.scrollTo(0,0);}else if(el.dataset.save){toggleSaved(el.dataset.save);}else if(el.dataset.size){state.size=Math.max(15,Math.min(23,state.size+Number(el.dataset.size)));persist();render();}else if(el.dataset.theme){state.theme=el.dataset.theme;persist();render();}else if(el.dataset.accent){state.accent=el.dataset.accent;persist();render();}else if(el.dataset.refresh){Promise.all([loadLatest(),loadArchiveIndex()]);}});
document.addEventListener('submit',event=>{if(event.target.id==='city-form'){event.preventDefault();searchCity(event.target.querySelector('input')?.value);}});
document.addEventListener('change',event=>{if(event.target.id==='edition-select')selectArchive(event.target.value);else if(event.target.id==='lang'&&LANGS[event.target.value]){state.lang=event.target.value;persist();render();}});
document.addEventListener('input',event=>{if(event.target.id==='search'){state.q=event.target.value;const area=$('favorite-list');if(area)area.innerHTML=favoriteCards();}});
// Une image de couverture qui ne charge pas est simplement retirée.
document.addEventListener('error',event=>{const el=event.target;if(el&&el.tagName==='IMG'&&el.dataset.cover)el.closest('figure')?.remove();},true);
window.addEventListener('online',()=>{networkFailure=false;if(!state.selectedDate)loadLatest();});
if(window.matchMedia)matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change',()=>{if(state.theme==='auto')setTheme();});
render();Promise.all([loadLatest(),loadArchiveIndex()]);
// Si la position a déjà été autorisée, on la met à jour discrètement (sans nouvelle fenêtre de permission).
if(state.place?.mode==='gps'&&navigator.permissions?.query)navigator.permissions.query({name:'geolocation'}).then(s=>{if(s.state==='granted')useGeolocation(true);}).catch(()=>{});
if('serviceWorker' in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
