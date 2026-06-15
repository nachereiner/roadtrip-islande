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
function eur(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n || 0);
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
  { href: "index.html",        label: "Accueil",       ico: "🏠" },
  { href: "jours.html",        label: "Jour par jour", ico: "🗓️" },
  { href: "itineraire.html",   label: "Itinéraire",    ico: "🧭" },
  { href: "depenses.html",     label: "Dépenses",      ico: "💶" },
  { href: "reservations.html", label: "Réservations",  ico: "📋" },
  { href: "bagages.html",      label: "Bagages",       ico: "🎒" },
  { href: "infos.html",        label: "Infos",         ico: "ℹ️" }
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
        PAGES.map(p => el("a", { href: p.href, class: here === p.href ? "active" : "" }, p.label)))
    )
  );
  document.body.insertBefore(header, document.body.firstChild);

  const footer = el("footer", { class: "site-footer" },
    "Road trip Islande · données dans assets/data.js · dépenses & checklist enregistrées dans ce navigateur."
  );
  document.body.appendChild(footer);
}

/* ===========================================================
   PAGE : Accueil
   =========================================================== */
function initAccueil() {
  const today = new Date();
  const start = new Date(VOYAGE.dateDebut + "T00:00:00");
  const msDay = 86400000;
  const diff = Math.ceil((start - today) / msDay);
  let cd;
  if (diff > 1)       cd = `Plus que <b>${diff}</b> jours avant le départ !`;
  else if (diff === 1) cd = `C'est demain ! <b>1</b> jour avant le départ.`;
  else if (diff === 0) cd = `<b>Aujourd'hui</b>, c'est le départ ! ✈️`;
  else if (start <= today && today <= new Date(VOYAGE.dateFin + "T23:59:59"))
                       cd = `Bon voyage — vous êtes en Islande ! 🌋`;
  else                 cd = `Voyage terminé. J'espère qu'il était magique ✨`;
  $("#countdown").innerHTML = cd;

  // faits clés
  const regions = [...new Set(JOURS.map(j => j.region))];
  $("#facts").append(
    fact("Dates", "3 → 17 juil. 2026"),
    fact("Durée", "15 jours"),
    fact("Road trip", `${TOTAL_KM_ROADTRIP.toLocaleString("fr-FR")} km env.`),
    fact("Voiture", "Keflavík → Reykjavík")
  );

  // tuiles de navigation
  const tiles = $("#tiles");
  const descs = {
    "jours.html": "Le détail de chaque journée",
    "itineraire.html": "Toutes les étapes, de bout en bout",
    "depenses.html": "Saisir les dépenses & voir le total",
    "reservations.html": "Hôtels, excursions, vol",
    "bagages.html": "Checklist à cocher",
    "infos.html": "Urgences, météo, conduite"
  };
  PAGES.filter(p => p.href !== "index.html").forEach(p => {
    tiles.appendChild(el("a", { class: "tile", href: p.href },
      el("span", { class: "ico" }, p.ico),
      el("span", { class: "t" }, p.label),
      el("span", { class: "d" }, descs[p.href] || "")));
  });

  // régions traversées
  const chips = $("#regions");
  regions.forEach(r => chips.appendChild(el("span", { class: "chip" }, r)));
}
function fact(k, v) {
  return el("div", { class: "fact" }, el("div", { class: "k" }, k), el("div", { class: "v" }, v));
}

/* ===========================================================
   PAGE : Jour par jour
   =========================================================== */
function initJours() {
  const root = $("#jours");
  JOURS.forEach(j => {
    const head = el("div", { class: "day-head" },
      el("div", { class: "day-date" },
        el("div", { class: "d" }, String(dayNum(j.date))),
        el("div", { class: "m" }, monthShort(j.date))),
      el("div", { class: "day-titles" },
        el("h2", {}, j.titre),
        el("div", { class: "meta" }, `${JOURS_SEM[j.jour]} · ${j.region}`)),
      el("span", { class: "day-tag" }, j.etiquette)
    );

    const body = el("div", { class: "day-body" });
    body.appendChild(el("div", { class: "route-line" },
      `🚗 ${j.trajet.de} → ${j.trajet.a} `,
      j.distanceKm ? el("span", { class: "km" }, `(~${j.distanceKm} km)`) : null));
    if (j.note) body.appendChild(el("div", { class: "day-note" }, j.note));
    body.appendChild(el("div", { class: "sleep" }, "🛏️ Nuit : ", el("b", {}, j.nuit)));

    const acts = el("ul", { class: "acts" });
    j.activites.forEach(a => {
      const t = TYPES[a.type] || { emoji: "📍", label: a.type };
      acts.appendChild(el("li", { class: "act" },
        el("span", { class: "em" }, t.emoji),
        el("div", { class: "body" },
          el("div", {}, el("span", { class: "name" }, a.nom), el("span", { class: "pill" }, t.label)),
          el("div", { class: "desc" }, a.desc),
          el("a", { class: "maps-btn", href: mapsUrl(a.maps), target: "_blank", rel: "noopener" }, "📍 Google Maps")
        )));
    });
    body.appendChild(acts);

    root.appendChild(el("div", { class: "day", id: j.date }, head, body));
  });

  // sommaire de navigation rapide
  const nav = $("#day-nav");
  JOURS.forEach(j => nav.appendChild(
    el("a", { class: "chip", href: "#" + j.date }, `${dayNum(j.date)}/07`)));
}

/* ===========================================================
   PAGE : Itinéraire (tableau à plat)
   =========================================================== */
function initItineraire() {
  const tb = $("#itin-body");
  ETAPES.forEach(s => {
    tb.appendChild(el("tr", {},
      el("td", {}, String(s.ordre)),
      el("td", {}, `${fmtDate(s.date)} (${s.jour})`),
      el("td", {}, `${s.de} → ${s.a}`),
      el("td", {}, s.region),
      el("td", { class: "num" }, s.distanceKm ? `${s.distanceKm} km` : "—"),
      el("td", {}, s.nuit),
      el("td", {}, el("a", { class: "maps-btn", href: mapsUrl(s.maps), target: "_blank", rel: "noopener" }, "📍"))
    ));
  });
  $("#itin-total").textContent = `${TOTAL_KM_ROADTRIP.toLocaleString("fr-FR")} km`;
}

/* ===========================================================
   PAGE : Dépenses
   =========================================================== */
function initDepenses() {
  let rows = store.get(KEYS.depenses, []);
  const tbody = $("#dep-body");

  function persist() { store.set(KEYS.depenses, rows); }

  function render() {
    tbody.innerHTML = "";
    rows.forEach((r, i) => {
      const tr = el("tr", {},
        el("td", {}, input("date", r.date, v => { r.date = v; persist(); })),
        el("td", {}, selectCat(r.categorie, v => { r.categorie = v; persist(); })),
        el("td", {}, input("text", r.libelle, v => { r.libelle = v; persist(); }, "Libellé")),
        el("td", { class: "num" }, input("number", r.montant, v => { r.montant = parseFloat(v) || 0; persist(); renderTotals(); }, "0", "0.01")),
        el("td", {}, el("button", { class: "icon-del", title: "Supprimer",
          onclick: () => { rows.splice(i, 1); persist(); render(); renderTotals(); } }, "🗑"))
      );
      tbody.appendChild(tr);
    });
    if (!rows.length) {
      tbody.appendChild(el("tr", {}, el("td", { colspan: "5", class: "muted" }, "Aucune dépense pour l'instant. Cliquez sur « Ajouter une dépense ».")));
    }
  }

  function renderTotals() {
    const total = rows.reduce((s, r) => s + (Number(r.montant) || 0), 0);
    const byCat = {};
    rows.forEach(r => { const c = r.categorie || "Autre"; byCat[c] = (byCat[c] || 0) + (Number(r.montant) || 0); });
    const box = $("#dep-totaux");
    box.innerHTML = "";
    box.appendChild(el("div", { class: "tot-card grand-total" },
      el("div", { class: "k" }, "Total dépensé"), el("div", { class: "v" }, eur(total))));
    Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([c, v]) =>
      box.appendChild(el("div", { class: "tot-card" }, el("div", { class: "k" }, c), el("div", { class: "v" }, eur(v)))));
  }

  function input(type, value, onchange, placeholder, step) {
    const props = { type, value: value ?? "" };
    if (placeholder) props.placeholder = placeholder;
    if (step) props.step = step;
    if (type === "number") props.min = "0";
    const n = el("input", props);
    n.addEventListener("input", e => onchange(e.target.value));
    return n;
  }
  function selectCat(value, onchange) {
    const s = el("select", {});
    CATEGORIES_DEPENSES.forEach(c => s.appendChild(el("option", { value: c }, c)));
    s.value = value || CATEGORIES_DEPENSES[CATEGORIES_DEPENSES.length - 1];
    s.addEventListener("change", e => onchange(e.target.value));
    return s;
  }

  $("#dep-add").addEventListener("click", () => {
    rows.push({ date: VOYAGE.dateDebut, categorie: "Autre", libelle: "", montant: 0 });
    persist(); render(); renderTotals();
  });
  $("#dep-export").addEventListener("click", () => exportJSON("depenses-islande.json", rows));
  $("#dep-import").addEventListener("change", e => importJSON(e, data => {
    if (Array.isArray(data)) { rows = data; persist(); render(); renderTotals(); }
    else alert("Fichier invalide : un tableau de dépenses était attendu.");
  }));

  render(); renderTotals();
}

/* ===========================================================
   PAGE : Réservations
   =========================================================== */
function initReservations() {
  let rows = store.get(KEYS.reservations, null);
  if (!rows) { rows = JSON.parse(JSON.stringify(RESERVATIONS_DEFAUT)); store.set(KEYS.reservations, rows); }
  const tbody = $("#resa-body");
  const STATUTS = ["à faire", "réservé", "payé"];
  const statusClass = s => s === "payé" ? "paye" : s === "réservé" ? "resa" : "todo";

  function persist() { store.set(KEYS.reservations, rows); }
  function render() {
    tbody.innerHTML = "";
    rows.forEach((r, i) => {
      const sel = el("select", {});
      STATUTS.forEach(s => sel.appendChild(el("option", { value: s }, s)));
      sel.value = r.statut;
      sel.addEventListener("change", e => { r.statut = e.target.value; persist(); paint(); });
      const tr = el("tr", {},
        el("td", {}, txt(r.type, v => r.type = v)),
        el("td", {}, txt(r.libelle, v => r.libelle = v)),
        el("td", {}, txt(r.date, v => r.date = v, "date")),
        el("td", {}, txt(r.confirmation, v => r.confirmation = v, "text", "N°")),
        el("td", {}, sel),
        el("td", {}, el("button", { class: "icon-del", title: "Supprimer",
          onclick: () => { rows.splice(i, 1); persist(); render(); } }, "🗑"))
      );
      tr.dataset.idx = i;
      tbody.appendChild(tr);
    });
    paint();
  }
  function paint() {
    $$("#resa-body select").forEach(s => { s.className = "status " + statusClass(s.value); });
    const done = rows.filter(r => r.statut !== "à faire").length;
    $("#resa-count").textContent = `${done} / ${rows.length} traitées`;
  }
  function txt(value, onchange, type = "text", ph = "") {
    const n = el("input", { type, value: value ?? "", placeholder: ph });
    n.addEventListener("input", e => { onchange(e.target.value); persist(); });
    return n;
  }

  $("#resa-add").addEventListener("click", () => {
    rows.push({ type: "Autre", libelle: "", date: "", confirmation: "", statut: "à faire" });
    persist(); render();
  });
  $("#resa-reset").addEventListener("click", () => {
    if (confirm("Réinitialiser la liste de réservations par défaut ? Vos modifications seront perdues.")) {
      rows = JSON.parse(JSON.stringify(RESERVATIONS_DEFAUT)); persist(); render();
    }
  });
  $("#resa-export").addEventListener("click", () => exportJSON("reservations-islande.json", rows));
  $("#resa-import").addEventListener("change", e => importJSON(e, data => {
    if (Array.isArray(data)) { rows = data; persist(); render(); }
    else alert("Fichier invalide.");
  }));

  render();
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
