/* -------------------------------------------------
   0️⃣ UTILITAIRES – SAFER GETTER
   ------------------------------------------------- */
function getEl(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`⚠️ Élément "${id}" introuvable – le script ne s’appliquera pas sur cette page.`);
    return el;
}

/* -------------------------------------------------
   1️⃣ INITIALISATION CONDITIONNELLE
   ------------------------------------------------- */
function initPage(domain) {
    // 1️⃣ Filtres (type & artiste) – on ne crée les écouteurs que si le conteneur existe
    initVisibilityFilter(domain);
    initArtistFilter(domain);

    // 2️⃣ Chargement des événements – on ne poursuit que si les containers existent
    const upcoming = getEl(`cards-container-${domain}-upcoming`);
    const past     = getEl(`cards-container-${domain}-past`);
    if (upcoming && past) {
        loadEvents(window.currentLang, domain,
            window.currentVisibilityFilter[domain],
            window.currentArtistFilter[domain]);
    }
}

/* -------------------------------------------------
   2️⃣ DÉTECTION DU DOM (et du domaine)
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // on ne charge que les domaines réellement présents sur la page
    ['music', 'aero'].forEach(d => {
        const exists = !!document.getElementById(`visibility-filter-${d}`) ||
                       !!document.getElementById(`artist-filter-${d}`);
        if (exists) initPage(d);
    });
});/* ─────────────────────────────────────────────────────────────
   0️⃣ VARIABLES GLOBALES
   ───────────────────────────────────────────────────────────── */
window.currentVisibilityFilter = { music: 'all', aero: 'all' };   // type (all/live/tech/prod)
window.currentArtistFilter     = { music: 'all', aero: 'all' };   // artiste (all/houriaa/badpigeons/others)
window.currentLang   = null;   // initialisé plus bas
window.currentDomain = null;   // idem

/* ─────────────────────────────────────────────────────────────
   1️⃣ UTILITAIRES : langue & domaine
   ───────────────────────────────────────────────────────────── */
function getLangFromUrl() {
    const p = new URLSearchParams(window.location.search);
    return p.get('lang')?.trim().toLowerCase() ?? null;
}
function getDomainFromUrl() {
    const p = new URLSearchParams(window.location.search);
    return p.get('domain')?.trim().toLowerCase() ?? null;
}

/* ─────────────────────────────────────────────────────────────
   2️⃣ INITIALISATION LANGUE / DOMAINE (inchangée)
   ───────────────────────────────────────────────────────────── */
(function initLangDomain() {
    const urlLang   = getLangFromUrl()   || localStorage.getItem('preferredLang')   || 'fr';
    const urlDomain = getDomainFromUrl() || localStorage.getItem('preferredDomain') || 'music';

    window.currentLang   = urlLang;
    window.currentDomain = urlDomain;

    refreshLangButtons();
    refreshDomainButtons();
})();

/* ─────────────────────────────────────────────────────────────
   3️⃣ GESTION DU SÉLECTEUR DE VISIBILITÉ (TYPE)
   ───────────────────────────────────────────────────────────── */
const ALLOWED_FILTERS = ['all', 'live', 'tech', 'prod'];   // vous pouvez en ajouter d’autres

function initVisibilityFilter(domain) {
    const container = document.getElementById(`visibility-filter-${domain}`);
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get('visibility');

    if (urlFilter && ALLOWED_FILTERS.includes(urlFilter)) {
        window.currentVisibilityFilter[domain] = urlFilter;
    }

    // état « active » des boutons
    container.querySelectorAll('.filter-btn')
        .forEach(btn => btn.classList.toggle('active',
            btn.dataset.filter === window.currentVisibilityFilter[domain]));

    // écoute du clic
    container.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        const newFilter = btn.dataset.filter;
        if (newFilter === window.currentVisibilityFilter[domain]) return;

        window.currentVisibilityFilter[domain] = newFilter;

        container.querySelectorAll('.filter-btn')
            .forEach(b => b.classList.toggle('active', b === btn));

        // URL (sans rechargement)
        const url = new URL(window.location);
        url.searchParams.set('visibility', newFilter);
        window.history.replaceState({}, '', url);

        // re‑chargement des évènements
        loadEvents(window.currentLang, domain,
            window.currentVisibilityFilter[domain],
            window.currentArtistFilter[domain]);
    });
}

/* ─────────────────────────────────────────────────────────────
   4️⃣ GESTION DU SÉLECTEUR D'ARTISTE
   ───────────────────────────────────────────────────────────── */
const ALLOWED_ARTISTS = ['all', 'houriaa', 'badpigeons', 'jansi', 'loschicos', 'others'];

function initArtistFilter(domain) {
    const container = document.getElementById(`artist-filter-${domain}`);
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get('artist');

    if (urlFilter && ALLOWED_ARTISTS.includes(urlFilter)) {
        window.currentArtistFilter[domain] = urlFilter;
    }

    container.querySelectorAll('.filter-btn')
        .forEach(btn => btn.classList.toggle('active',
            btn.dataset.filter === window.currentArtistFilter[domain]));

    container.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        const newFilter = btn.dataset.filter;
        if (newFilter === window.currentArtistFilter[domain]) return;

        window.currentArtistFilter[domain] = newFilter;

        container.querySelectorAll('.filter-btn')
            .forEach(b => b.classList.toggle('active', b === btn));

        const url = new URL(window.location);
        url.searchParams.set('artist', newFilter);
        window.history.replaceState({}, '', url);

        loadEvents(window.currentLang, domain,
            window.currentVisibilityFilter[domain],
            window.currentArtistFilter[domain]);
    });
}

/* ─────────────────────────────────────────────────────────────
   5️⃣ CONSTRUCTION DES PARTIES DE DATE
   ───────────────────────────────────────────────────────────── */
function buildDatePartsFromRange(start, end, lang) {
    const optsDay   = { weekday: "short" };
    const optsMonth = { month: "short" };

    // ----- JOUR -----
    const startDayRaw = new Intl.DateTimeFormat(lang, optsDay).format(start);
    const startDay = lang === "fr"
        ? startDayRaw.replace(".", "").replace(/^./, c => c.toUpperCase())
        : startDayRaw;
    let dayTop = startDay;                // défaut (pas de fin)

    // ----- NUMÉRO -----
    const startNum = String(start.getDate()).padStart(2, "0");
    let numMid = startNum;                // défaut (pas de fin)

    // ----- MOIS‑ANNÉE -----
    const startMonthRaw = new Intl.DateTimeFormat(lang, optsMonth).format(start);
    const startMonth = lang === "fr"
        ? startMonthRaw.replace(".", "").replace(/^./, c => c.toUpperCase())
        : startMonthRaw;
    const startYear = start.getFullYear();
    let monthYearBot = `${startMonth} ${startYear}`; // défaut

    // -------------------------------------------------
    // Aucun endDate ou même jour → on garde les valeurs simples
    // -------------------------------------------------
    if (!end || end.getTime() === start.getTime()) {
        return { dayTop, numMid, monthYearBot, sortYear: startYear };
    }

    // -------------------------------------------------
    // Nous avons réellement une fin
    // -------------------------------------------------
    const endDayRaw = new Intl.DateTimeFormat(lang, optsDay).format(end);
    const endDay = lang === "fr"
        ? endDayRaw.replace(".", "").replace(/^./, c => c.toUpperCase())
        : endDayRaw;
    const endNum = String(end.getDate()).padStart(2, "0");
    const endMonthRaw = new Intl.DateTimeFormat(lang, optsMonth).format(end);
    const endMonth = lang === "fr"
        ? endMonthRaw.replace(".", "").replace(/^./, c => c.toUpperCase())
        : endMonthRaw;
    const endYear = end.getFullYear();

    // 1️⃣ JOUR (ex. Mer‑Ven)
    dayTop = `${startDay}-${endDay}`;

    // 2️⃣ NUMÉRO (ex. 24‑26)
    numMid = `${startNum}-${endNum}`;

    // 3️⃣ MOIS‑ANNÉE
    if (startMonth === endMonth && startYear === endYear) {
        monthYearBot = `${startMonth} ${startYear}`;                // même mois
    } else if (startYear === endYear) {
        monthYearBot = `${startMonth}-${endMonth} ${startYear}`;   // même année, mois différents
    } else {
        monthYearBot = `${startMonth} ${startYear}-${endMonth} ${endYear}`; // années différentes
    }

    return { dayTop, numMid, monthYearBot, sortYear: startYear };
}

/* ─────────────────────────────────────────────────────────────
   6️⃣ CHARGEMENT DES ÉVÉNEMENTS (type + artiste)
   ───────────────────────────────────────────────────────────── */
function loadEvents(lang, domain,
                    typeFilter   = window.currentVisibilityFilter[domain],
                    artistFilter = window.currentArtistFilter[domain]) {

    const prefix   = { music: '/events_music', aero: '/events_aero' }[domain] || '/events_music';
    const DATA_URL = `${prefix}_${lang}.json`;

    /* ---- création d’une carte ---- */
    function createCard(ev) {
        const moreBtn = ev.url && ev.url !== "#"
            ? `<a href="${ev.url}" class="event-more" aria-label="Voir plus d’infos">
                   <span class="plus-sign" data-i18n="Learn_more_events">En savoir +</span>
               </a>`
            : "";   // pas de bouton si l'URL est “#”

        return `
            <article class="event-card">
                <div class="event-main">
                    <div class="event-date-box">
                        <span class="day">${ev.dayTop}</span>
                        <span class="num">${ev.numMid}</span>
                        <span class="month-year">${ev.monthYearBot}</span>
                    </div>
                    <div class="event-info">
                        <h3 class="event-title">${ev.title}</h3>
                        <p class="event-fulldate">${ev.fulldate}</p>
                    </div>
                </div>
                ${moreBtn}
            </article>`;
    }

    /* ---- conteneurs ---- */
    const upcomingContainer = document.getElementById(`cards-container-${domain}-upcoming`);
    const pastContainer     = document.getElementById(`cards-container-${domain}-past`);
    const upcomingTitle     = document.getElementById(`upcoming-title-${domain}`);
    const pastTitle         = document.getElementById(`past-title-${domain}`);

    if (!upcomingContainer || !pastContainer) {
        console.warn(`Conteneurs introuvables pour le domaine "${domain}"`);
        return;
    }

    fetch(DATA_URL)
        .then(r => {
            if (!r.ok) throw new Error(`Impossible de charger ${DATA_URL} – ${r.status}`);
            return r.json();
        })
        .then(events => {
            const today = new Date();
            const future = [], past = [];

            events.forEach(ev => {
                /* ── FILTRE TYPE ── */
                const tags = ev.filter ?? [];
                if (typeFilter === 'live' && !tags.includes('live')) return;
                if (typeFilter === 'tech' && !tags.includes('type_tech')) return;
                if (typeFilter === 'prod' && !tags.includes('type_prod')) return;
                // typeFilter === 'all' → passe tout

                /* ── FILTRE ARTISTE ── */
                const isHouriaa    = tags.some(t => t.toLowerCase() === 'houriaa');
                const isBadPigeons = tags.some(t => t.toLowerCase() === 'bad pigeons' || t.toLowerCase() === 'bad pigeons');
                const isJansi      = tags.some(t => t.toLowerCase() === 'jansi');   // <-- ajouté
                const isLosChicos      = tags.some(t => t.toLowerCase() === 'los chicos');   // <-- ajouté

                if (artistFilter === 'houriaa' && !isHouriaa)        return;
                if (artistFilter === 'badpigeons' && !isBadPigeons) return;
                if (artistFilter === 'jansi' && !isJansi)          return;   // <-- nouveau
                if (artistFilter === 'loschicos' && !isLosChicos)          return;   // <-- nouveau
                if (artistFilter === 'others' && (isHouriaa || isBadPigeons)) return;
                // artistFilter === 'all' → passe tout

                /* ── DATES ── */
                const startDate = new Date(ev.startDate + "T00:00:00");
                const endDate   = ev.endDate ? new Date(ev.endDate + "T00:00:00") : null;

                const { dayTop, numMid, monthYearBot, sortYear } =
                    buildDatePartsFromRange(startDate, endDate, lang);

                ev.dayTop       = dayTop;
                ev.numMid       = numMid;
                ev.monthYearBot = monthYearBot;
                ev.sortYear     = sortYear;

                /* ── FUTUR / PASSÉ ── */
                if (startDate >= new Date(today.getFullYear(),
                                          today.getMonth(),
                                          today.getDate())) {
                    future.push(ev);
                } else {
                    past.push(ev);
                }
            });

            /* ── Rendu HTML ── */
            upcomingContainer.innerHTML = future.map(createCard).join('');
            pastContainer.innerHTML     = past.map(createCard).join('');

            upcomingTitle.style.display = future.length ? '' : 'none';
            pastTitle.style.display     = past.length   ? '' : 'none';

            if (typeof translatePage === 'function') translatePage();
        })
        .catch(err => {
            console.error('Erreur de chargement des évènements :', err);
            upcomingContainer.innerHTML = '<p class="error">Impossible de charger les évènements.</p>';
            pastContainer.innerHTML = '';
        });
}

/* ─────────────────────────────────────────────────────────────
   7️⃣ INITIALISATION DES FILTRES (musique + aero)
   ───────────────────────────────────────────────────────────── */
initVisibilityFilter('music');
initVisibilityFilter('aero');
initArtistFilter('music');
initArtistFilter('aero');

/* ─────────────────────────────────────────────────────────────
   8️⃣ CHARGEMENT INITIAL
   ───────────────────────────────────────────────────────────── */
loadEvents(window.currentLang, window.currentDomain,
          window.currentVisibilityFilter[window.currentDomain],
          window.currentArtistFilter[window.currentDomain]);

/* ─────────────────────────────────────────────────────────────
   9️⃣ BOUTONS LANGUE / DOMAINE (inchangés)
   ───────────────────────────────────────────────────────────── */
function refreshLangButtons() {
    document.querySelectorAll('#btn-fr, #btn-en')
        .forEach(btn => btn.classList.toggle('active',
            btn.id === `btn-${window.currentLang}`));
}
function refreshDomainButtons() {
    document.querySelectorAll('#btn-aero, #btn-music')
        .forEach(btn => btn.classList.toggle('active',
            btn.id === `btn-${window.currentDomain}`));
}

window.switchLang = function (lang) {
            if (!['fr', 'en'].includes(lang)) return;
            currentLang = lang;
            localStorage.setItem('preferredLang', currentLang);
            document.documentElement.lang = lang;

            // Met à jour l’URL (sans recharger)
            const url = new URL(window.location);
            url.searchParams.set('lang', lang);
            window.history.pushState({}, '', url);

            // Traduire la page
            translatePage(lang);

            // Mettre à jour affichage des boutons + liens
            updateActiveButtons(currentDomain, lang);
            updateExternalLinks();

            if (lang === window.currentLang) return;

            window.currentLang = lang;
            refreshLangButtons();

            // mise à jour de l’URL
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('lang', lang);
            history.replaceState(null, '', newUrl);

            // re‑charger les évènements avec le nouveau couple (langue, domaine)
            loadEvents(window.currentLang, window.currentDomain);
            if (typeof translatePage === 'function') translatePage();
        };

        // -------------------------------------------------
        // 7️⃣  Changer de domaine (fonction « officielle »)
        // -------------------------------------------------
        window.switchDomain = function (domain) {
            if (!['aero', 'music'].includes(domain)) return;
            currentDomain = domain;
            localStorage.setItem('preferredDomain', currentDomain);

            // Met à jour l’URL (sans recharger)
            const url = new URL(window.location);
            url.searchParams.set('domain', domain);
            window.history.pushState({}, '', url);

            // Thème CSS
            if (domain === 'music') {
                document.body.classList.add('theme-music');
            } else {
                document.body.classList.remove('theme-music');
            }

            // Gestion des sections (uniquement sur index.html)
            const secAero  = document.getElementById('section-aero');
            const secMusic = document.getElementById('section-music');
            if (secAero && secMusic) {
                secAero.classList.toggle('active', domain === 'aero');
                secMusic.classList.toggle('active', domain === 'music');
            }

            updateActiveButtons(domain, currentLang);
            updateExternalLinks();
            if (domain === window.currentDomain) return;

            window.currentDomain = domain;
            refreshDomainButtons();

            // mise à jour de l’URL
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('domain', domain);
            history.replaceState(null, '', newUrl);

            // re‑charger les évènements avec le nouveau domaine (langue inchangée)
            loadEvents(window.currentLang, window.currentDomain);
        };

/* ─────────────────────────────────────────────────────────────
   1️⃣3️⃣ STYLE RAPIDE POUR LE SPAN « month‑year »
   ───────────────────────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
    .event-date-box .month-year {
        display: block;               /* ou inline‑block selon votre design */
        font-size: 0.9em;
        margin-top: 2px;
    }
`;
document.head.appendChild(style);