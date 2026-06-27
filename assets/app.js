/* ===========================================================
   app.js — logique partagée (rendu, localStorage, maps, export)
   Dépend de data.js (chargé avant).
   Chaque page appelle la fonction d'init correspondante en bas.
   =========================================================== */

/* ---------- Helpers généraux ---------- */
const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) n.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null) continue;
    n.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
  }
  return n;
};

/* ---------- Thème clair/sombre (préférence mémorisée) ---------- */
const THEME_KEY = "roadtrip.theme";
(function () {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
function currentTheme() { return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
function toggleTheme(btn) {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  if (btn) {
    btn.innerHTML = "";
    btn.appendChild(iconSvg(next === "dark" ? "sun" : "moon", 18));
    btn.setAttribute("aria-label", next === "dark" ? "Passer en thème clair" : "Passer en thème sombre");
  }
}

const MOIS = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const JOURS_SEM = { Lun:"Lundi", Mar:"Mardi", Mer:"Mercredi", Jeu:"Jeudi", Ven:"Vendredi", Sam:"Samedi", Dim:"Dimanche" };

function fmtDate(iso) {           // "2026-07-03" -> "3 juil."
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MOIS[m - 1]}`;
}
function dayNum(iso) { return Number(iso.split("-")[2]); }
function monthShort(iso) { return MOIS[Number(iso.split("-")[1]) - 1]; }

function mapsUrl(query) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
}
/* Lien Google Maps « itinéraire » entre plusieurs points (départ → … → arrivée). */
function mapsDir(...points) {
  const segs = points.filter(Boolean).map(encodeURIComponent).join("/");
  return "https://www.google.com/maps/dir/" + segs;
}
function eur(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n || 0);
}

/* date du jour locale au format ISO (YYYY-MM-DD) */
function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function daysBetween(aIso, bIso) {
  const a = new Date(aIso + "T00:00:00"), b = new Date(bIso + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

/* ---------- SVG : helper + icônes ligne + carte ---------- */
const SVGNS = "http://www.w3.org/2000/svg";
function svgEl(tag, props = {}, ...kids) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(props)) if (v !== null && v !== undefined) n.setAttribute(k, v);
  for (const kid of kids.flat()) if (kid != null) n.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
  return n;
}
/* Icônes ligne 24×24 (stroke = currentColor). Une entrée = liste de tracés. */
const ICONS = {
  bains:    ["M3 15c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0", "M3 10c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0", "M8 6c0-1.4 1-2 1-3", "M15 6c0-1.4 1-2 1-3"],
  cascade:  ["M5 4h14", "M8 4v15", "M12 4v17", "M16 4v15"],
  rando:    ["M3 20l6-11 4 6 2-3 5 8z", "M14 7l2-3 2 3"],
  glacier:  ["M12 3l8 8-8 10-8-10z", "M12 3v18", "M4 11h16"],
  baleine:  ["M3 13c1 3 4 5 8 5s9-3 9-9c-2 1-4 1-5 0", "M11 18v3", "M11 21l-3-1", "M11 21l3-1", "M16 8c0-1 1-2 2-1"],
  volcan:   ["M2 21l6-9h8l6 9z", "M9 12c0-2 1-3 1-5", "M14 12c0-1 1-2 1-3", "M8 21h8"],
  village:  ["M4 11l8-6 8 6", "M6 10v10h12V10", "M10 20v-5h4v5"],
  vue:      ["M3 8h4l1.5-2h7L17 8h4v11H3z", "M12 17a4 4 0 100-8 4 4 0 000 8z"],
  faune:    ["M4 13c3-5 8-5 11-1l4-3-1 4 2 1-4 1c-3 4-9 3-12-3z", "M8 11h.01"],
  histoire: ["M12 3l8 6H4z", "M4 9h16", "M6 9v9", "M10 9v9", "M14 9v9", "M18 9v9", "M4 20h16"],
  plage:    ["M3 19c3 2 6 2 9 0s6-2 9 0", "M16 8a3 3 0 11-6 0 3 3 0 016 0", "M13 5V3", "M18 8l1.5-1.5", "M8 8 6.5 6.5"],
  route:    ["M8 21l1.5-18", "M16 21l-1.5-18", "M12 5v3", "M12 11v3", "M12 17v2"],
  ville:    ["M4 20V9h6v11", "M14 20V4h6v16", "M6 12h2", "M6 15h2", "M16 8h2", "M16 11h2", "M16 14h2", "M3 20h18"],
  /* sections / navigation */
  home:     ["M4 11l8-6 8 6", "M6 10v10h12V10", "M10 20v-6h4v6"],
  calendar: ["M5 5h14v15H5z", "M5 9h14", "M9 3v4", "M15 3v4"],
  compass:  ["M12 3a9 9 0 100 18 9 9 0 000-18z", "M15 9l-2.5 5.5L7 17l2.5-5.5z"],
  euro:     ["M16.5 7.5a6 6 0 100 9", "M5 11h8", "M5 14h7"],
  clipboard:["M9 4h6v3H9z", "M8 5H6v15h12V5h-2", "M9 11h6", "M9 15h6"],
  backpack: ["M7 9a5 5 0 0110 0v11H7z", "M9.5 9V7a2.5 2.5 0 015 0v2", "M9 13h6"],
  info:     ["M12 3a9 9 0 100 18 9 9 0 000-18z", "M12 11v5", "M12 7.5h.01"],
  sun:      ["M12 8a4 4 0 100 8 4 4 0 000-8z", "M12 3v2", "M12 19v2", "M5 5l1.5 1.5", "M17.5 17.5 19 19", "M3 12h2", "M19 12h2", "M5 19l1.5-1.5", "M17.5 6.5 19 5"],
  moon:     ["M20 14a8 8 0 11-9-11 6 6 0 009 11z"],
  _default: ["M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z", "M12 9a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"]
};
function iconSvg(name, size = 20, cls = "ic") {
  const paths = ICONS[name] || ICONS._default;
  const svg = svgEl("svg", { class: cls, width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", "stroke-width": "1.7", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" });
  paths.forEach(d => svg.appendChild(svgEl("path", { d })));
  return svg;
}

/* Carte de l'Islande + étapes.
   opts.mini = mini-locator (silhouette + point « ici »).
   opts.hereDate = surligne l'étape correspondant à cette date. */
function buildCarte(opts = {}) {
  const { mini = false, hereDate = null } = opts;
  const stops = CARTE.stops;
  const byKey = {}; stops.forEach(s => byKey[s.n] = s);
  let hereN = null;
  if (hereDate) { const s = stops.find(x => (x.dates || []).includes(hereDate)); if (s) hereN = s.n; }

  const svg = svgEl("svg", { class: mini ? "loc" : "carte", viewBox: CARTE.viewBox,
    role: "img", "aria-label": "Carte de l'itinéraire en Islande" });
  svg.appendChild(svgEl("path", { class: "sil", d: CARTE.silhouette }));

  const pts = CARTE.routeOrder.map(k => byKey[k]).filter(Boolean);
  const d = "M" + pts.map(s => `${s.x},${s.y}`).join(" L");
  const route = svgEl("path", { class: "route", d });
  svg.appendChild(route);

  if (mini) {
    const here = byKey[hereN];
    if (here) svg.appendChild(svgEl("circle", { class: "here", cx: here.x, cy: here.y, r: 16 }));
    return svg;
  }

  // route draw-on : longueur approx pour l'animation
  let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
  route.setAttribute("style", `--len:${Math.ceil(len)}`);

  stops.forEach(s => {
    const here = s.n === hereN;
    if (here) svg.appendChild(svgEl("circle", { class: "pulse", cx: s.x, cy: s.y, r: 30 }));
    svg.appendChild(svgEl("circle", { class: "stop" + (s.air ? " air" : "") + (here ? " here" : ""), cx: s.x, cy: s.y, r: 15 }));
    svg.appendChild(svgEl("text", { class: "stop-n", x: s.x, y: s.y, fill: here ? "#fff" : null }, String(s.n)));
  });
  return svg;
}

/* Carte « Aujourd'hui / prochaine étape » pour l'accueil. */
function buildToday() {
  const t = isoToday();
  const start = JOURS[0].date, end = JOURS[JOURS.length - 1].date;
  const card = el("div", { class: "today" });

  if (t < start) {
    const n = daysBetween(t, start);
    const j0 = JOURS[0];
    card.append(
      el("div", { class: "lead" },
        el("span", { class: "badge" }, "Compte à rebours"),
        el("span", { class: "mono" }, n === 1 ? "demain" : `J-${n}`)),
      el("h2", {}, n === 0 ? "C'est le grand jour ✈️" : `Plus que ${n} jour${n > 1 ? "s" : ""} avant l'Islande`),
      el("div", { class: "next" }, "Première étape : ", el("b", {}, j0.titre), ` — ${fmtDate(j0.date)}`)
    );
    return card;
  }
  if (t > end) {
    card.append(
      el("div", { class: "lead" }, el("span", { class: "badge" }, "Terminé")),
      el("h2", {}, "Voyage terminé ✨"),
      el("div", { class: "next" }, "J'espère qu'il était magique. Bon retour !"));
    return card;
  }
  const idx = JOURS.findIndex(j => j.date === t);
  const j = idx >= 0 ? JOURS[idx] : JOURS[0];
  const next = JOURS[idx + 1];
  card.append(
    el("div", { class: "lead" },
      el("span", { class: "badge" }, "Aujourd'hui"),
      el("span", { class: "mono" }, `${JOURS_SEM[j.jour]} ${fmtDate(j.date)} · ${j.etiquette}`)),
    el("h2", {}, j.titre),
    el("div", { class: "day-route" }, `${j.trajet.de} → ${j.trajet.a}${j.distanceKm ? ` · ${j.distanceKm} km` : ""}`),
    actsMini(j),
    el("div", { class: "next" }, "🛏️ Nuit : ", el("b", {}, j.nuit), next ? ` · Demain : ${next.titre}` : "")
  );
  return card;
}
function actsMini(j) {
  const box = el("div", { class: "acts-mini" });
  j.activites.slice(0, 4).forEach(a => box.appendChild(el("span", {}, a.nom)));
  return box;
}

/* ---------- localStorage (sécurisé) ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn("localStorage indisponible", e); }
  }
};
const KEYS = { depenses: "roadtrip.depenses", reservations: "roadtrip.reservations", bagages: "roadtrip.bagages" };

/* ---------- Navigation commune ---------- */
const PAGES = [
  { href: "index.html",        label: "Accueil",       icon: "home" },
  { href: "jours.html",        label: "Jour par jour", icon: "calendar" },
  { href: "itineraire.html",   label: "Itinéraire",    icon: "compass" },
  { href: "depenses.html",     label: "Dépenses",      icon: "euro" },
  { href: "reservations.html", label: "Réservations",  icon: "clipboard" },
  { href: "bagages.html",      label: "Bagages",       icon: "backpack" },
  { href: "infos.html",        label: "Infos",         icon: "info" }
];

function buildChrome() {
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const header = el("header", { class: "site-header" },
    el("div", { class: "inner" },
      el("a", { class: "brand", href: "index.html" },
        el("span", { class: "flag" }, "🇮🇸"),
        el("span", {}, VOYAGE.titre),
        el("small", {}, "3–17 juil. 2026")),
      el("nav", { class: "tabs" },
        PAGES.map(p => el("a", { href: p.href, class: here === p.href ? "active" : "" }, p.label))),
      themeToggle()
    )
  );
  document.body.insertBefore(header, document.body.firstChild);

  const footer = el("footer", { class: "site-footer" },
    "Road trip Islande · données dans assets/data.js · checklist bagages enregistrée dans ce navigateur."
  );
  document.body.appendChild(footer);
}
function themeToggle() {
  const btn = el("button", { class: "theme-toggle", type: "button",
    "aria-label": currentTheme() === "dark" ? "Passer en thème clair" : "Passer en thème sombre" });
  btn.appendChild(iconSvg(currentTheme() === "dark" ? "sun" : "moon", 18));
  btn.addEventListener("click", () => toggleTheme(btn));
  return btn;
}

/* ===========================================================
   PAGE : Accueil
   =========================================================== */
function initAccueil() {
  // Méta du hero
  const meta = $("#hero-meta");
  if (meta) meta.append(
    metaItem(`${TOTAL_KM_ROADTRIP.toLocaleString("fr-FR")} km`, "Tour de l'île"),
    metaItem("15", "Jours"),
    metaItem("7", "Étapes")
  );

  // Carte de l'Islande + légende des étapes
  const mapBox = $("#hero-map");
  if (mapBox) {
    mapBox.appendChild(buildCarte({ hereDate: isoToday() }));
    const legend = el("div", { class: "map-legend" });
    CARTE.stops.filter(s => !s.air).forEach(s =>
      legend.appendChild(el("span", { class: "leg-item" }, el("b", {}, String(s.n)), " " + s.nom)));
    mapBox.appendChild(legend);
  }

  // Carte « Aujourd'hui »
  const today = $("#today");
  if (today) today.appendChild(buildToday());

  // Tuiles de navigation
  const tiles = $("#tiles");
  const descs = {
    "jours.html": "Le détail de chaque journée",
    "itineraire.html": "Toutes les étapes, de bout en bout",
    "depenses.html": "Saisir les dépenses & voir le total",
    "reservations.html": "Hôtels, excursions, vol",
    "bagages.html": "Checklist à cocher",
    "infos.html": "Urgences, météo, conduite"
  };
  if (tiles) PAGES.filter(p => p.href !== "index.html").forEach(p => {
    tiles.appendChild(el("a", { class: "tile", href: p.href },
      el("span", { class: "ico" }, iconSvg(p.icon, 26)),
      el("span", { class: "t" }, p.label),
      el("span", { class: "d" }, descs[p.href] || "")));
  });

  // Régions traversées
  const chips = $("#regions");
  if (chips) [...new Set(JOURS.map(j => j.region))].forEach(r => chips.appendChild(el("span", { class: "chip" }, r)));
}
function metaItem(v, k) {
  return el("div", { class: "m" }, el("span", { class: "v" }, v), el("span", { class: "k" }, k));
}

/* ===========================================================
   PAGE : Jour par jour
   =========================================================== */
function initJours() {
  const root = $("#jours");
  root.classList.add("route-spine");
  const t = isoToday();

  JOURS.forEach((j, i) => {
    const head = el("div", { class: "day-head" },
      el("div", { class: "day-date" },
        el("div", { class: "d" }, String(dayNum(j.date))),
        el("div", { class: "m" }, monthShort(j.date))),
      el("div", { class: "day-titles" },
        el("h2", {}, j.titre),
        el("div", { class: "meta" }, `${JOURS_SEM[j.jour]} · ${j.region}`)),
      buildCarte({ mini: true, hereDate: j.date }),
      el("span", { class: "day-tag" }, j.etiquette)
    );

    const body = el("div", { class: "day-body" });
    const route = el("div", { class: "route-line" },
      `${j.trajet.de} → ${j.trajet.a}`,
      j.distanceKm ? el("span", { class: "km" }, `· ${j.distanceKm} km`) : null);
    if (j.geo && j.geo.de !== j.geo.a) {
      route.appendChild(el("a", { class: "maps-btn", href: mapsDir(j.geo.de, j.geo.a),
        target: "_blank", rel: "noopener" }, iconSvg("compass", 14), "Itinéraire"));
    }
    body.appendChild(route);
    if (j.note) body.appendChild(el("div", { class: "day-note" }, j.note));
    body.appendChild(el("div", { class: "sleep" }, "Nuit : ", el("b", {}, j.nuit)));

    const acts = el("ul", { class: "acts" });
    j.activites.forEach(a => {
      const tInfo = TYPES[a.type] || { label: a.type };
      acts.appendChild(el("li", { class: "act" },
        el("span", { class: "ic" }, iconSvg(a.type, 22)),
        el("div", { class: "body" },
          el("div", {}, el("span", { class: "name" }, a.nom), el("span", { class: "pill" }, tInfo.label)),
          el("div", { class: "desc" }, a.desc),
          el("a", { class: "maps-btn", href: mapsUrl(a.maps), target: "_blank", rel: "noopener" }, iconSvg("pin", 14, "ic") , "Google Maps")
        )));
    });
    body.appendChild(acts);

    const dayEl = el("article", { class: "day" + (j.date === t ? " is-today" : ""), id: j.date }, head, body);
    root.appendChild(dayEl);

    // connecteur « km » vers l'étape suivante
    const next = JOURS[i + 1];
    if (next) root.appendChild(el("div", { class: "leg" }, next.distanceKm ? `${next.distanceKm} km` : "étape suivante"));
  });

  // sommaire de navigation rapide
  const nav = $("#day-nav");
  if (nav) JOURS.forEach(j => nav.appendChild(
    el("a", { class: "chip", href: "#" + j.date }, `${dayNum(j.date)}/07`)));
}

/* ===========================================================
   PAGE : Itinéraire (tableau à plat)
   =========================================================== */
function initItineraire() {
  const mb = $("#itin-map");
  if (mb) {
    mb.appendChild(buildCarte({ hereDate: isoToday() }));
    const legend = el("div", { class: "map-legend" });
    CARTE.stops.filter(s => !s.air).forEach(s =>
      legend.appendChild(el("span", { class: "leg-item" }, el("b", {}, String(s.n)), " " + s.nom)));
    mb.appendChild(legend);
  }
  const tb = $("#itin-body");
  ETAPES.forEach(s => {
    const carte = (s.geoDe && s.geoA && s.geoDe !== s.geoA)
      ? el("a", { class: "maps-btn", href: mapsDir(s.geoDe, s.geoA), target: "_blank", rel: "noopener" }, "🧭 Trajet")
      : el("a", { class: "maps-btn", href: mapsUrl(s.geoA || s.maps), target: "_blank", rel: "noopener" }, "📍 Lieu");
    tb.appendChild(el("tr", {},
      el("td", {}, String(s.ordre)),
      el("td", {}, `${fmtDate(s.date)} (${s.jour})`),
      el("td", {}, `${s.de} → ${s.a}`),
      el("td", {}, s.region),
      el("td", { class: "num" }, s.distanceKm ? `${s.distanceKm} km` : "—"),
      el("td", {}, s.nuit),
      el("td", {}, carte)
    ));
  });
  $("#itin-total").textContent = `${TOTAL_KM_ROADTRIP.toLocaleString("fr-FR")} km`;

  // Lien « itinéraire complet » (tous les hubs sur une seule carte)
  const fr = $("#full-route");
  if (fr) fr.href = mapsDir(...ITINERAIRE_HUBS);
}

/* ===========================================================
   PAGE : Dépenses
   =========================================================== */
const DONUT_COLORS = ["#2f6e84", "#5e7444", "#e0922b", "#b8432a", "#22566a", "#8a9b6a", "#c9803a", "#6b7b82"];

function buildDonut(cats, total) {
  const r = 60, C = 2 * Math.PI * r, cx = 80, cy = 80;
  const svg = svgEl("svg", { class: "donut", viewBox: "0 0 160 160", width: 160, height: 160,
    role: "img", "aria-label": "Répartition des dépenses par poste" });
  svg.appendChild(svgEl("circle", { cx, cy, r, fill: "none", stroke: "var(--ice-2)", "stroke-width": 26 }));
  let off = 0;
  cats.forEach(([c, v], i) => {
    const f = total ? v / total : 0;
    svg.appendChild(svgEl("circle", { cx, cy, r, fill: "none",
      stroke: DONUT_COLORS[i % DONUT_COLORS.length], "stroke-width": 26,
      "stroke-dasharray": `${f * C} ${C}`, "stroke-dashoffset": `${-off * C}`,
      transform: `rotate(-90 ${cx} ${cy})` }));
    off += f;
  });
  svg.appendChild(svgEl("text", { x: cx, y: cy - 3, class: "donut-c1" }, Math.round(total).toLocaleString("fr-FR") + " €"));
  svg.appendChild(svgEl("text", { x: cx, y: cy + 14, class: "donut-c2" }, "total"));
  return svg;
}

/* Page Dépenses — statique (lecture seule depuis DEPENSES_DEFAUT). */
function initDepenses() {
  const rows = DEPENSES_DEFAUT;
  const total = rows.reduce((s, r) => s + (Number(r.montant) || 0), 0);
  const byCat = {};
  rows.forEach(r => { const c = r.categorie || "Autre"; byCat[c] = (byCat[c] || 0) + (Number(r.montant) || 0); });
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  // Donut + légende
  const chart = $("#dep-chart");
  if (chart && total) {
    chart.appendChild(el("h2", {}, "Répartition par poste"));
    const legend = el("div", { class: "donut-legend" });
    cats.forEach(([c, v], i) => legend.appendChild(el("div", { class: "dl-row" },
      el("span", { class: "dot", style: `background:${DONUT_COLORS[i % DONUT_COLORS.length]}` }),
      el("span", { class: "dl-cat" }, c),
      el("span", { class: "dl-amt" }, eur(v)),
      el("span", { class: "dl-pct" }, Math.round((v / total) * 100) + "%"))));
    chart.appendChild(el("div", { class: "donut-wrap" }, buildDonut(cats, total), legend));
  }

  // Tableau (lecture seule, trié par date)
  const tb = $("#dep-body");
  if (tb) rows.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(r => {
    tb.appendChild(el("tr", {},
      el("td", { class: "mono" }, fmtDate(r.date)),
      el("td", {}, el("span", { class: "tag-cat" }, r.categorie)),
      el("td", {}, r.libelle),
      el("td", { class: "num" }, eur(r.montant))));
  });
  const totEl = $("#dep-total");
  if (totEl) totEl.textContent = eur(total);
}

/* ===========================================================
   PAGE : Réservations
   =========================================================== */
/* Page Réservations — statique (lecture seule depuis RESERVATIONS_DEFAUT). */
function initReservations() {
  const rows = RESERVATIONS_DEFAUT;
  const tbody = $("#resa-body");
  const statusClass = s => s === "payé" ? "paye" : s === "réservé" ? "resa" : "todo";

  if (tbody) rows.forEach(r => {
    tbody.appendChild(el("tr", {},
      el("td", {}, r.type),
      el("td", {}, r.libelle),
      el("td", { class: "mono" }, r.date ? fmtDate(r.date) : "—"),
      el("td", { class: "mono" }, r.confirmation || "—"),
      el("td", {}, el("span", { class: "status " + statusClass(r.statut) }, r.statut))));
  });

  const c = $("#resa-count");
  if (c) {
    const done = rows.filter(r => r.statut !== "à faire").length;
    c.textContent = `${done} / ${rows.length} traitées`;
  }
}

/* ===========================================================
   PAGE : Bagages (checklist)
   =========================================================== */
function initBagages() {
  const checked = store.get(KEYS.bagages, {});
  const root = $("#bagages");
  let total = 0, done = 0;

  BAGAGES_DEFAUT.forEach((cat, ci) => {
    const list = el("div", { class: "check-cat" });
    cat.items.forEach((item, ii) => {
      const id = `b-${ci}-${ii}`;
      total++;
      const isDone = !!checked[id];
      if (isDone) done++;
      const cb = el("input", { type: "checkbox", id });
      cb.checked = isDone;
      const wrap = el("div", { class: "check-item" + (isDone ? " done" : "") },
        cb, el("label", { for: id }, item));
      cb.addEventListener("change", () => {
        checked[id] = cb.checked;
        store.set(KEYS.bagages, checked);
        wrap.classList.toggle("done", cb.checked);
        refreshProgress();
      });
      list.appendChild(wrap);
    });
    root.appendChild(el("div", { class: "card" }, el("h2", {}, cat.categorie), list));
  });

  function refreshProgress() {
    const d = Object.values(checked).filter(Boolean).length;
    const pct = total ? Math.round((d / total) * 100) : 0;
    $("#bag-bar").style.width = pct + "%";
    $("#bag-count").textContent = `${d} / ${total} cochés (${pct}%)`;
  }
  $("#bag-reset").addEventListener("click", () => {
    if (confirm("Tout décocher ?")) {
      Object.keys(checked).forEach(k => delete checked[k]);
      store.set(KEYS.bagages, checked);
      $$("#bagages input[type=checkbox]").forEach(c => { c.checked = false; c.closest(".check-item").classList.remove("done"); });
      refreshProgress();
    }
  });
  refreshProgress();
}

/* ---------- Export / import JSON ---------- */
function exportJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: filename });
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function importJSON(event, onload) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { onload(JSON.parse(reader.result)); }
    catch (e) { alert("Impossible de lire le fichier JSON."); }
    event.target.value = "";
  };
  reader.readAsText(file);
}

/* ---------- Bootstrap : construit la nav puis lance la page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildChrome();
  const page = document.body.dataset.page;
  ({
    accueil: initAccueil,
    jours: initJours,
    itineraire: initItineraire,
    depenses: initDepenses,
    reservations: initReservations,
    bagages: initBagages
  }[page] || function () {})();
});
