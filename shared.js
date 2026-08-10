/* ==============================================================
   0️⃣  Traductions (à garder exactement comme vous les avez)
=================================================================*/
const translations = {
    fr: {
        /* ── Header & Footer ───────────────────────────── */
        head_button_aero: "Aérospatial",
        head_button_music: "Musique",

        aero_title: "Spécialiste en mécanique dynamique : ingénierie et recherche aérospatiale",
        aero_tagline: "Soutien aux projets et à la recherche pour la mécanique dynamique dans le spatial.",

        music_title: "Musicien & Compositeur",
        music_tagline: "Développement et accompagnement de projets musicaux par la composition, l'interprétation et la technique son.",

        btn_explore: "Explorer",

        /* ── Aérospatial ──────────────────────────────── */
        cnes_engineering_title: "Ingénierie et recherche au CNES",
        cnes_engineering_desc: "Support en analyses mécaniques et recherche appliquée aux environnements dynamiques.",

        shocks_research_title: "Recherche : dynamique des chocs mécaniques",
        shocks_research_desc: "Modélisation, simulation et expérimentation. Amélioration des méthodes d'analyse.",

        conferences_title: "Conférences & communications",
        conferences_desc: "Communications scientifiques lors de conférences et congrès nationaux et internationaux.",

        articles_title: "Articles et communications écrites",
        articles_desc: "Publications scientifiques dans des revues spécialisées et articles de conférence.",

        programming_title: "Programmation, conseil et formation",
        programming_desc: "Développement d’outils et d’applications, support technique et ateliers d’apprentissage.",


        /* ── Musique ─────────────────────────────────── */
        music_skill1_title: "Compositeur & Interprète",
        music_skill1_desc: "Guitariste, bassiste et pianiste. Groupes, concerts et expériences marquantes. Contribution à la production musicale à travers la composition pour différents artistes et groupes.",

        music_skill3_title: "Technique son & sonorisation",
        music_skill3_desc: "Accompagnement de projets musicaux par la production sonore et l'ingenierie du son pour le Live.",

        music_skill4_title: "Coordinateur de production artistique",
        music_skill4_desc: "Participation à la création musicale, direction artistique et coordination de projets musicaux.",


        /* ── Footer ──────────────────────────────────── */
        footer_legal: "Mentions légales",
        footer_privacy: "Politique de confidentialité",
        footer_contact: "Contact"
    },


    en: {
        /* ── Header & Footer ───────────────────────────── */
        head_button_aero: "Aerospace",
        head_button_music: "Music",

        aero_title: "Specialist in Structural Dynamics: Aerospace Engineering and Research",
        aero_tagline: "Supporting projects and research in mechanical dynamics for space systems.",

        music_title: "Musician & Composer",
        music_tagline: "Developing and supporting musical projects through composition, performance and sound production.",

        btn_explore: "Explore",


        /* ── Aerospace ────────────────────────────────── */
        cnes_engineering_title: "Engineering & Research at CNES",
        cnes_engineering_desc: "Mechanical analysis support and applied research on dynamic environments.",

        shocks_research_title: "Research: Mechanical Shock Dynamics",
        shocks_research_desc: "Modeling, simulation and experimental testing. Improving analysis methods.",

        conferences_title: "Conferences & Presentations",
        conferences_desc: "Scientific communications at national and international conferences.",

        articles_title: "Articles & Written Communications",
        articles_desc: "Scientific publications in specialized journals and conference papers.",

        programming_title: "Programming, Consulting & Training",
        programming_desc: "Development of tools and applications, technical support and training workshops.",


        /* ── Music ────────────────────────────────────── */
        music_skill1_title: "Composer & Performer",
        music_skill1_desc: "Guitarist, bassist and pianist. Bands, live performances and key experiences. Contribution to music production through composition for various artists and bands.",

        music_skill3_title: "Sound Engineering & Live Sound",
        music_skill3_desc: "Supporting musical projects through sound production and live audio engineering.",

        music_skill4_title: "Artistic Production Coordinator",
        music_skill4_desc: "Participation in musical creation, artistic direction and coordination of music projects.",

        back_to_home: "← Retour",
        back_to_home: "← Back",

        /* ── Footer ──────────────────────────────────── */
        footer_legal: "Legal Notice",
        footer_privacy: "Privacy Policy",
        footer_contact: "Contact"
        
    }
};

/* ==============================================================
   1️⃣  Variables globales (initialisées dès le chargement)
=================================================================*/
let currentLang   = localStorage.getItem('preferredLang')   || 'fr';
let currentDomain = localStorage.getItem('preferredDomain') || 'aero';

/* ==============================================================
   2️⃣  Fonction utilitaire – construire une URL propre
=================================================================*/
function buildUrl(baseUrl) {
    const url = new URL(baseUrl, window.location.origin);
    // on garantit toujours des valeurs valides
    const domain = currentDomain || 'aero';
    const lang   = currentLang   || 'fr';
    url.searchParams.set('domain', domain);
    url.searchParams.set('lang',   lang);
    return url.toString();   // ex. http://…/audio.html?domain=music&lang=en
}

/* ==============================================================
   3️⃣  Met à jour **tous** les liens qui doivent porter les deux params
=================================================================*/
function updatePageLinks() {
    // On cible tout lien qui mène à audio.html, index.html, ou d’autres pages que vous ajouterez.
    document.querySelectorAll(
        'a[href*="audio.html"], a[href*="index.html"]'   // ajoutez d’autres sélecteurs ici si besoin
    ).forEach(link => {
        const clean = link.getAttribute('href').split('?')[0]; // enlève d’éventuels vieux paramètres
        link.setAttribute('href', buildUrl(clean));
    });
}

/* ==============================================================
   4️⃣  Fonction unique qui rafraîchit les URLs (tout le monde l’appelle)
=================================================================*/
function updateExternalLinks() {
    // le travail est entièrement centralisé dans updatePageLinks()
    updatePageLinks();
}

/* ==============================================================
   5️⃣  Fonction de traduction générique (partagée)
=================================================================*/
function translatePage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

/* ==============================================================
   6️⃣  Met à jour les classes "active" du header
=================================================================*/
function updateActiveButtons(domainParam, langParam) {
    const btnAero  = document.getElementById('btn-aero');
    const btnMusic = document.getElementById('btn-music');
    if (btnAero && btnMusic) {
        const d = domainParam || currentDomain;
        btnAero.classList.toggle('active', d === 'aero');
        btnMusic.classList.toggle('active', d === 'music');
    }

    const btnFr = document.getElementById('btn-fr');
    const btnEn = document.getElementById('btn-en');
    if (btnFr && btnEn) {
        const l = langParam || currentLang;
        btnFr.classList.toggle('active', l === 'fr');
        btnEn.classList.toggle('active', l === 'en');
    }
}

/**
 * Active la bonne section (aéro ou musique) en fonction de `currentDomain`.
 * Doit être appelée après que `currentDomain` a été défini.
 */
function applyDomainSection() {
    const secAero  = document.getElementById('section-aero');
    const secMusic = document.getElementById('section-music');

    if (!secAero || !secMusic) return;   // sécurité – si les éléments n’existent pas

    if (currentDomain === 'music') {
        secMusic.classList.add('active');
        secAero.classList.remove('active');
    } else {
        secAero.classList.add('active');
        secMusic.classList.remove('active');
    }
}

/* --------------------------------------------------------------
   Chargement du header dynamique (commune à toutes les pages)
----------------------------------------------------------------*/
function loadHeader() {
    /* -------- 1️⃣ Lecture des paramètres -------- */
    const urlParams = new URLSearchParams(window.location.search);
    const domainUrl = urlParams.get('domain');
    const langUrl   = urlParams.get('lang');

    /* -------- 2️⃣ Langue ------------------------ */
    if (langUrl && (langUrl === 'fr' || langUrl === 'en')) {
        currentLang = langUrl;
        localStorage.setItem('preferredLang', currentLang);
    } else {
        currentLang = localStorage.getItem('preferredLang') || 'fr';
    }
    document.documentElement.lang = currentLang;   // <‑‑ on garde la langue sur <html>

    /* -------- 3️⃣ Domaine ----------------------- */
    if (domainUrl && (domainUrl === 'aero' || domainUrl === 'music')) {
        currentDomain = domainUrl;
        localStorage.setItem('preferredDomain', currentDomain);
    } else {
        currentDomain = localStorage.getItem('preferredDomain') || 'aero';
    }

    /* -------- 4️⃣ Thème CSS -------------------- */
    document.documentElement.classList.remove('theme-aero', 'theme-music');
    document.body.classList.remove('theme-aero', 'theme-music');

    if (currentDomain === 'music') {
        document.documentElement.classList.add('theme-music');
        document.body.classList.add('theme-music');
    } else {
        // Si vous avez un thème « aéro », vous pouvez le déclarer ici
        // document.documentElement.classList.add('theme-aero');
        // document.body.classList.add('theme-aero');
    }

    /* -------- 5️⃣ Affichage de la bonne section (aero / music) -------- */
    applyDomainSection();   // active la bonne section du corps de la page

    /* -------- 6️⃣ Chargement du header ------------- */
    fetch('/header.html')
        .then(r => r.text())
        .then(data => {
            const container = document.getElementById('dynamic-header');
            if (container) {
                container.innerHTML = data;               // ← le header est injecté

                /* ---- 6a️⃣ Traduire le header fraîchement inséré ---- */
                translatePage(currentLang);               // <‑‑ **ESSENTIEL**

                /* ---- 6b️⃣ Mettre à jour les liens du header -------- */
                updateExternalLinks();

                /* ---- 6c️⃣ Boutons « active » ---------------------- */
                updateActiveButtons(domainUrl, langUrl);

                /* ---- 6d️⃣ Attacher les écouteurs ------------------- */
                container.querySelectorAll('button').forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.id === 'btn-aero')   handleDomainClick('aero');
                        if (btn.id === 'btn-music')  handleDomainClick('music');
                        if (btn.id === 'btn-fr')     switchLang('fr');
                        if (btn.id === 'btn-en')     switchLang('en');
                    });
                });
            }
        })
        .catch(err => console.error('Erreur chargement header :', err));
}
/* ==============================================================
   8️⃣  Changement de langue (clic sur le header)
=================================================================*/
function switchLang(lang) {
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
}

/* ==============================================================
   9️⃣  Changement de domaine / thème (clic sur le header)
=================================================================*/
function switchDomain(domain) {
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
}

/* ==============================================================
   10️⃣  Gestion du clic sur le domaine (redirection si besoin)
=================================================================*/
function handleDomainClick(domain) {
    const isIndex = window.location.pathname.endsWith('index.html') ||
                    window.location.pathname === '/' ||
                    window.location.pathname === '';

    if (isIndex) {
        // Même page → on ne fait qu’appeler switchDomain (tout est mis à jour en‑page)
        switchDomain(domain);
    } else {
        /* ---------------------------------------------------------
           1️⃣  On met à jour le localStorage **avant** la redirection
               (ainsi, même si la page d’index ne reçoit pas le paramètre
               `lang=` on pourra le récupérer depuis le storage)
        ----------------------------------------------------------*/
        localStorage.setItem('preferredDomain', domain);
        localStorage.setItem('preferredLang',   currentLang);   // <-- important

        /* ---------------------------------------------------------
           2️⃣  On construit l’URL de destination avec les deux params
        ----------------------------------------------------------*/
        const dest = new URL('index.html', window.location.origin);
        dest.searchParams.set('domain', domain);   // le thème demandé
        dest.searchParams.set('lang',   currentLang); // la langue courante

        // 3️⃣  Redirection
        window.location.href = dest.toString();
    }
}

/* ==============================================================
   11️⃣  Initialisation spécifique à audio.html
=================================================================*/
function initAudioPage() {
    // ----- Récupérer les paramètres de l’URL (ou LS) ---------------
    const urlParams = new URLSearchParams(window.location.search);
    const domainUrl = urlParams.get('domain');
    const langUrl   = urlParams.get('lang');

    if (langUrl && (langUrl === 'fr' || langUrl === 'en')) {
        currentLang = langUrl;
    } else {
        currentLang = localStorage.getItem('preferredLang') || 'fr';
    }
    localStorage.setItem('preferredLang', currentLang);
    document.documentElement.lang = currentLang;

    if (domainUrl && (domainUrl === 'aero' || domainUrl === 'music')) {
        currentDomain = domainUrl;
    } else {
        currentDomain = localStorage.getItem('preferredDomain') || 'aero';
    }
    localStorage.setItem('preferredDomain', currentDomain);

    // ----- Thème ----------------------------------------------------
    if (currentDomain === 'music') {
        document.body.classList.add('theme-music');
    } else {
        document.body.classList.remove('theme-music');
    }

    // ----- Header (utilise déjà currentLang/currentDomain) ----------
    loadHeader();

    // ----- Traduire le contenu de la page audio --------------------
    translatePage(currentLang);

    // ----- Mettre à jour les liens internes de la page audio -------
    // (ex. bouton retour à index.html, liens vers d’autres pages)
    updateExternalLinks();
}


/* --------------------------------------------------------------
   5️⃣  Chargement du footer dynamique (similaire à loadHeader)
----------------------------------------------------------------*/
function loadFooter() {
    // Le footer ne dépend d’aucun paramètre spécial, on le charge tel‑quel
    fetch('footer.html')
        .then(r => r.text())
        .then(data => {
            const footerContainer = document.getElementById('dynamic-footer');
            if (footerContainer) {
                footerContainer.innerHTML = data;

                // Le footer contient du texte traduisible → on le met à jour
                translatePage(currentLang);

                // Si le footer contenait des liens vers d’autres pages,
                // on les met à jour (ex. réseaux sociaux avec "?domain=…")
                updateExternalLinks();
            }
        })
        .catch(err => console.error('Erreur chargement footer :', err));
}


/* ==============================================================
   12️⃣  Démarrage – quel script lancer selon la page ?
=================================================================*/
document.addEventListener('DOMContentLoaded', () => {
    // 1️⃣  Header commun à toutes les pages
    loadHeader();

    // 2️⃣  Si on est sur audio.html, on lance son init spécial
    if (window.location.pathname.endsWith('audio.html')) {
        initAudioPage();
    }

    // 3️⃣  Enfin, on assure que tous les liens déjà présents dans le DOM
    //     (ex. le bouton “Explorer” qui n’est pas dans le header) sont à jour.
    updateExternalLinks();
});