'use strict';
// Illustrations par défaut : un bandeau dessiné par rubrique, utilisé quand un sujet n'a pas d'image d'article.
(function(){
 const W='#fff';
 const ICONS={
  politique:`<path d="M10 40L50 14L90 40Z" fill="${W}"/><g fill="${W}"><rect x="18" y="45" width="9" height="34" rx="2"/><rect x="38" y="45" width="9" height="34" rx="2"/><rect x="58" y="45" width="9" height="34" rx="2"/><rect x="78" y="45" width="9" height="34" rx="2"/><rect x="8" y="82" width="84" height="9" rx="3"/></g>`,
  economie:`<g fill="${W}"><rect x="10" y="62" width="15" height="28" rx="3"/><rect x="32" y="46" width="15" height="44" rx="3"/><rect x="54" y="30" width="15" height="60" rx="3"/><rect x="76" y="12" width="15" height="78" rx="3"/></g><path d="M10 40L40 24L60 14L88 4" stroke="${W}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`,
  societe:`<g fill="${W}"><circle cx="26" cy="34" r="10"/><circle cx="50" cy="26" r="13"/><circle cx="74" cy="34" r="10"/><path d="M8 84Q8 54 26 54Q44 54 44 84Z"/><path d="M32 86Q32 46 50 46Q68 46 68 86Z"/><path d="M56 84Q56 54 74 54Q92 54 92 84Z"/></g>`,
  justice:`<g stroke="${W}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M50 14V84M30 88H70M14 30H86"/><path d="M20 30L8 58H32Z M80 30L68 58H92Z"/><path d="M8 58Q20 70 32 58M68 58Q80 70 92 58"/></g><circle cx="50" cy="12" r="5" fill="${W}"/>`,
  sport:`<circle cx="50" cy="50" r="38" fill="none" stroke="${W}" stroke-width="5"/><g fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round"><path d="M50 12V88M12 50H88"/><path d="M22 22Q50 50 22 78M78 22Q50 50 78 78"/></g>`,
  culture:`<g fill="${W}"><rect x="10" y="38" width="80" height="48" rx="6"/><path d="M10 32L82 14L88 30L16 48Z"/></g><g fill="#000" opacity=".25"><path d="M24 30L36 27L40 38L28 41Z"/><path d="M48 24L60 21L64 32L52 35Z"/></g><circle cx="50" cy="62" r="13" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="5"/><path d="M46 56L58 62L46 68Z" fill="#000" opacity=".28"/>`,
  sciences_tech:`<g fill="none" stroke="${W}" stroke-width="5"><ellipse cx="50" cy="50" rx="40" ry="15"/><ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(120 50 50)"/></g><circle cx="50" cy="50" r="8" fill="${W}"/>`,
  sante:`<path d="M50 88C16 62 8 42 8 30A22 22 0 0 1 50 22A22 22 0 0 1 92 30C92 42 84 62 50 88Z" fill="${W}" opacity=".92"/><path d="M30 46H42L48 34L56 60L62 46H72" stroke="#000" stroke-opacity=".3" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  environnement:`<path d="M16 84C8 40 38 12 90 10C92 56 66 86 22 84Z" fill="${W}"/><path d="M16 86C34 62 54 42 78 24" stroke="#000" stroke-opacity=".28" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  international:`<circle cx="50" cy="50" r="38" fill="none" stroke="${W}" stroke-width="5"/><g fill="none" stroke="${W}" stroke-width="4"><ellipse cx="50" cy="50" rx="16" ry="38"/><path d="M12 50H88M18 30H82M18 70H82"/></g>`
 };
 const COLORS={politique:['#3b5b8c','#1f3a63'],economie:['#2a8f6a','#176144'],societe:['#8a5aa8','#5b3a78'],justice:['#7a5a40','#3e2d20'],sport:['#d96c2b','#a24412'],culture:['#b23a5e','#7a1f3d'],sciences_tech:['#2a86a8','#145a78'],sante:['#c0392b','#8a2018'],environnement:['#3f9d4a','#1f6b2a'],international:['#2c6e9b','#123f63']};
 window.LBI_ART={
  banner(topic,label){
   const icon=ICONS[topic],col=COLORS[topic];if(!icon||!col)return '';
   const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
   return `<figure class="cover art" aria-hidden="true"><svg viewBox="0 0 640 190" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,-apple-system,'Segoe UI',sans-serif"><defs><linearGradient id="art-${topic}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col[0]}"/><stop offset="1" stop-color="${col[1]}"/></linearGradient></defs><rect width="640" height="190" fill="url(#art-${topic})"/><circle cx="560" cy="20" r="120" fill="#fff" opacity=".07"/><circle cx="90" cy="190" r="90" fill="#fff" opacity=".06"/><g transform="translate(386 18) scale(1.5)">${icon}</g><text x="32" y="150" font-size="26" font-weight="800" fill="#fff" letter-spacing=".5">${esc(label)}</text></svg></figure>`;
  }
 };
})();
