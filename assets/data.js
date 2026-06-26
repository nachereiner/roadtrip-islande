/* =====================================================================
   data.js — SOURCE UNIQUE DE DONNÉES du road trip Islande
   Modifier ce fichier suffit à mettre à jour tout le site.
   (index.html, jours.html, itineraire.html lisent tous JOURS / ETAPES)
   ===================================================================== */

const VOYAGE = {
  titre: "Road Trip Islande",
  sousTitre: "Tour de l'île — du 3 au 17 juillet 2026",
  dateDebut: "2026-07-03",
  dateFin: "2026-07-17",
  devise: "EUR",
  // Infos voiture (rappel pratique)
  voiture: {
    prise: "3 juillet — Aéroport de Keflavík (~15h)",
    rendue: "15 juillet — Reykjavík (fin du road trip)"
  }
};

/* Types d'activité → emoji + libellé (pastilles).
   Utilisés tels quels dans JOURS via le champ "type". */
const TYPES = {
  bains:      { emoji: "♨️", label: "Bains" },
  cascade:    { emoji: "💧", label: "Cascade" },
  rando:      { emoji: "🥾", label: "Randonnée" },
  glacier:    { emoji: "🧊", label: "Glacier" },
  baleine:    { emoji: "🐋", label: "Baleines" },
  volcan:     { emoji: "🌋", label: "Volcanique" },
  village:    { emoji: "🏘️", label: "Village" },
  vue:        { emoji: "📷", label: "Point de vue" },
  faune:      { emoji: "🐦", label: "Faune" },
  histoire:   { emoji: "🏛️", label: "Histoire" },
  plage:      { emoji: "🏖️", label: "Plage" },
  route:      { emoji: "🚗", label: "Route" },
  ville:      { emoji: "🏙️", label: "Ville" }
};

/* ---------------------------------------------------------------------
   JOURS — un objet par journée.
   activites[].maps = requête envoyée à Google Maps (lien construit en JS).
   --------------------------------------------------------------------- */
const JOURS = [
  {
    date: "2026-07-03", jour: "Ven", etiquette: "Jour 1",
    titre: "Arrivée & Blue Lagoon → Borgarnes",
    region: "Reykjanes → Ouest",
    trajet: { de: "Aéroport de Keflavík", a: "Borgarnes" },
    geo: { de: "Keflavík Airport", a: "Borgarnes" },
    distanceKm: 150,
    nuit: "Bjarg Borgarnes (nuit 1/3)",
    note: "Arrivée vers 15h, récupération de la voiture à l'aéroport. Installation à la guesthouse Bjarg, base des 3 premières nuits.",
    activites: [
      { nom: "Blue Lagoon", type: "bains", maps: "Blue Lagoon Iceland",
        desc: "À 20 min de l'aéroport. Visite rapide en arrivant pour profiter du lieu (baignade optionnelle, à réserver à l'avance si on veut entrer)." },
      { nom: "Route vers Borgarnes (guesthouse Bjarg)", type: "route", maps: "Bjarg Borgarnes",
        desc: "On contourne Reykjavík par le tunnel de Hvalfjörður pour rejoindre Borgarnes le soir. Guesthouse Bjarg (Bjarg, 310 Borgarnes), point de chute des 3 premières nuits." }
    ]
  },
  {
    date: "2026-07-04", jour: "Sam", etiquette: "Jour 2",
    titre: "Snæfellsnes (en étoile depuis Borgarnes)",
    region: "Ouest",
    trajet: { de: "Borgarnes", a: "Péninsule de Snæfellsnes (aller-retour)" },
    geo: { de: "Borgarnes", a: "Grundarfjörður" },
    distanceKm: 290,
    nuit: "Bjarg Borgarnes (nuit 2/3)",
    note: "Journée en étoile sur la péninsule à l'ouest — « l'Islande en miniature ». Retour le soir à Borgarnes.",
    activites: [
      { nom: "Kirkjufell & Kirkjufellsfoss", type: "vue", maps: "Kirkjufell",
        desc: "La montagne la plus photographiée d'Islande, avec sa cascade au premier plan." },
      { nom: "Balade côtière Arnarstapi → Hellnar", type: "rando", maps: "Arnarstapi Hellnar coastal walk",
        desc: "Sentier facile (~2,5 km aller) le long de falaises basaltiques et d'arches marines." },
      { nom: "Djúpalónssandur", type: "plage", maps: "Djupalonssandur black beach",
        desc: "Plage de galets noirs et vestiges d'un chalutier échoué." },
      { nom: "Snæfellsjökull", type: "glacier", maps: "Snaefellsjokull",
        desc: "Le volcan-glacier emblématique (le « Voyage au centre de la Terre » de Jules Verne)." },
      { nom: "Église noire de Búðir", type: "village", maps: "Budir black church",
        desc: "Petite église noire isolée dans un champ de lave, photogénique." }
    ]
  },
  {
    date: "2026-07-05", jour: "Dim", etiquette: "Jour 3",
    titre: "Borgarfjörður (en étoile depuis Borgarnes)",
    region: "Ouest",
    trajet: { de: "Borgarnes", a: "Borgarfjörður / terres à l'est (aller-retour)" },
    geo: { de: "Borgarnes", a: "Hraunfossar" },
    distanceKm: 130,
    nuit: "Bjarg Borgarnes (nuit 3/3)",
    note: "Les terres à l'est de Borgarnes : cascades, sources chaudes, histoire. Dernière nuit à Bjarg.",
    activites: [
      { nom: "Hraunfossar & Barnafoss", type: "cascade", maps: "Hraunfossar",
        desc: "Cascades qui jaillissent d'un champ de lave sur des centaines de mètres, juste à côté des rapides de Barnafoss." },
      { nom: "Deildartunguhver", type: "volcan", maps: "Deildartunguhver hot spring",
        desc: "La source d'eau chaude la plus puissante d'Europe (180 L/s à 97°C)." },
      { nom: "Reykholt", type: "histoire", maps: "Reykholt Iceland",
        desc: "Haut lieu historique, demeure du chroniqueur Snorri Sturluson." },
      { nom: "Rando de Glymur (option)", type: "rando", maps: "Glymur waterfall trail",
        desc: "Une des plus hautes cascades d'Islande (~198 m). Boucle ~7 km, 3–4 h, traversée de rivière à gué — belle rando si le temps le permet. Accès en voiture normale (route 47, pas de piste F)." }
    ]
  },
  {
    date: "2026-07-06", jour: "Lun", etiquette: "Jour 4",
    titre: "Transfert Borgarnes → Húsavík (Hôtel Laugar)",
    region: "Ouest → Nord",
    trajet: { de: "Borgarnes", a: "Hôtel Laugar (région Húsavík / Mývatn)" },
    geo: { de: "Borgarnes", a: "Laugar 650 Iceland" },
    distanceKm: 430,
    nuit: "Hôtel Laugar (nuit 1/3)",
    note: "Grande journée de route vers le nord, ponctuée d'arrêts. Installation à l'Hôtel Laugar pour 3 nuits (base idéale pour Mývatn et Húsavík).",
    activites: [
      { nom: "Hvítserkur (rocher éléphant / dragon)", type: "vue", maps: "Hvitserkur rock",
        desc: "Rocher de 15 m en forme de dragon/éléphant qui boit dans la mer, sur la péninsule de Vatnsnes." },
      { nom: "Phoques de Vatnsnes", type: "faune", maps: "Illugastadir seal watching Vatnsnes",
        desc: "Péninsule réputée pour l'observation des phoques depuis la côte." },
      { nom: "Akureyri (arrêt)", type: "ville", maps: "Akureyri",
        desc: "« Capitale du Nord », jolie ville au fond d'un fjord — pause déjeuner / balade avant de filer vers Laugar." },
      { nom: "Goðafoss", type: "cascade", maps: "Godafoss",
        desc: "« La cascade des dieux », large arc d'eau spectaculaire juste avant d'arriver à Laugar." }
    ]
  },
  {
    date: "2026-07-07", jour: "Mar", etiquette: "Jour 5",
    titre: "Lac Mývatn (depuis Laugar)",
    region: "Nord",
    trajet: { de: "Hôtel Laugar", a: "Lac Mývatn (aller-retour)" },
    geo: { de: "Laugar 650 Iceland", a: "Mývatn" },
    distanceKm: 150,
    nuit: "Hôtel Laugar (nuit 2/3)",
    note: "Journée autour du lac Mývatn, zone volcanique parmi les plus spectaculaires d'Islande.",
    activites: [
      { nom: "Dimmuborgir", type: "volcan", maps: "Dimmuborgir",
        desc: "Champ de lave aux formations spectaculaires, plusieurs sentiers de 0,6 à 2,2 km." },
      { nom: "Rando du cratère Hverfjall", type: "rando", maps: "Hverfjall crater",
        desc: "Tour du rim d'un cratère volcanique (~3 km), vue panoramique sur le lac Mývatn. Accès en voiture normale (route 860, pas de 4×4)." },
      { nom: "Námafjall / Hverir", type: "volcan", maps: "Hverir Namafjall",
        desc: "Zone géothermale lunaire : solfatares, marmites de boue bouillonnantes, fumerolles." },
      { nom: "Mývatn Nature Baths", type: "bains", maps: "Myvatn Nature Baths",
        desc: "Les « bains bleus du Nord », moins fréquentés que le Blue Lagoon — détente en fin de journée." }
    ]
  },
  {
    date: "2026-07-08", jour: "Mer", etiquette: "Jour 6",
    titre: "Baleines à Húsavík & Diamond Circle",
    region: "Nord",
    trajet: { de: "Hôtel Laugar", a: "Húsavík (aller-retour)" },
    geo: { de: "Laugar 650 Iceland", a: "Húsavík" },
    distanceKm: 250,
    nuit: "Hôtel Laugar (nuit 3/3)",
    note: "Le grand jour baleines au nord, complété par les curiosités du Diamond Circle.",
    activites: [
      { nom: "Baleines à Húsavík (North Sailing)", type: "baleine", maps: "North Sailing Husavik",
        desc: "Capitale européenne de l'observation des baleines. Sortie ~3 h dans la baie de Skjálfandi (petits rorquals quasi garantis, parfois baleines à bosse/bleues, macareux). À réserver à l'avance en été." },
      { nom: "Dettifoss", type: "cascade", maps: "Dettifoss",
        desc: "La cascade la plus puissante d'Europe par le débit." },
      { nom: "Ásbyrgi", type: "rando", maps: "Asbyrgi canyon",
        desc: "Canyon en fer à cheval boisé, sentiers faciles vers l'étang et les falaises." }
    ]
  },
  {
    date: "2026-07-09", jour: "Jeu", etiquette: "Jour 7",
    titre: "Húsavík / Laugar → Egilsstaðir",
    region: "Nord → Est",
    trajet: { de: "Hôtel Laugar", a: "Egilsstaðir" },
    geo: { de: "Laugar 650 Iceland", a: "Egilsstaðir" },
    distanceKm: 250,
    nuit: "Hotel 1001 Nótt, Egilsstaðir — réservé (nuit 1/2)",
    note: "Reprise du tour de l'île vers l'est, via les hauts plateaux désertiques.",
    activites: [
      { nom: "Désert de Möðrudalur", type: "route", maps: "Modrudalur",
        desc: "Traversée des hauts plateaux désertiques de l'intérieur, paysages bruts." },
      { nom: "Canyon de Stuðlagil", type: "vue", maps: "Studlagil canyon",
        desc: "Spectaculaire canyon aux orgues basaltiques bordant une rivière glaciaire turquoise." },
      { nom: "Egilsstaðir & lac Lagarfljót", type: "ville", maps: "Egilsstadir",
        desc: "Principale ville de l'Est, au bord d'un long lac qui aurait son propre « monstre »." }
    ]
  },
  {
    date: "2026-07-10", jour: "Ven", etiquette: "Jour 8",
    titre: "Vallée de Fljótsdalur & randos",
    region: "Est",
    trajet: { de: "Egilsstaðir", a: "Egilsstaðir (boucle)" },
    geo: { de: "Egilsstaðir", a: "Egilsstaðir" },
    distanceKm: 120,
    nuit: "Hotel 1001 Nótt, Egilsstaðir — réservé (nuit 2/2)",
    note: "Journée nature/rando autour d'Egilsstaðir.",
    activites: [
      { nom: "Rando de Hengifoss", type: "rando", maps: "Hengifoss trail",
        desc: "Montée (~5 km A/R, 2–3 h) vers une cascade de 128 m striée de couches rouges, en passant par Litlanesfoss et ses orgues basaltiques." },
      { nom: "Rando de Stórurð (option sportive)", type: "rando", maps: "Storurd hiking trail",
        desc: "Blocs géants et lacs turquoise. ~12 km A/R, 5–6 h, niveau modéré — accessible seulement en été. Départ depuis la route 94 (goudron/gravier), sans 4×4." },
      { nom: "Forêt de Hallormsstaður", type: "vue", maps: "Hallormsstadur forest",
        desc: "La plus grande forêt d'Islande, sentiers ombragés au bord du lac." }
    ]
  },
  {
    date: "2026-07-11", jour: "Sam", etiquette: "Jour 9",
    titre: "Fjords de l'Est → Höfn",
    region: "Sud-Est",
    trajet: { de: "Egilsstaðir", a: "Höfn" },
    geo: { de: "Egilsstaðir", a: "Höfn" },
    distanceKm: 250,
    nuit: "Sefdalur (région Höfn) — réservé",
    note: "Route des fjords de l'Est jusqu'à la région de Höfn, aux portes du Vatnajökull. Nuit à Sefdalur.",
    activites: [
      { nom: "Seyðisfjörður", type: "village", maps: "Seydisfjordur",
        desc: "Village d'artistes au fond d'un fjord, sa rue arc-en-ciel et son église bleue (détour depuis Egilsstaðir)." },
      { nom: "Djúpivogur", type: "village", maps: "Djupivogur",
        desc: "Paisible port de pêche, escale charmante sur la route des fjords." },
      { nom: "Vestrahorn / Stokksnes", type: "vue", maps: "Stokksnes Vestrahorn",
        desc: "Montagne dentelée se reflétant dans une plage de sable noir — l'un des plus beaux panoramas d'Islande." },
      { nom: "Höfn", type: "ville", maps: "Hofn Iceland",
        desc: "Port réputé pour la langoustine, aux portes du Vatnajökull." }
    ]
  },
  {
    date: "2026-07-12", jour: "Dim", etiquette: "Jour 10",
    titre: "Glaciers du Sud — Jökulsárlón & Skaftafell",
    region: "Sud",
    trajet: { de: "Höfn (Sefdalur)", a: "Kirkjubæjarklaustur" },
    geo: { de: "Höfn", a: "Kirkjubæjarklaustur" },
    distanceKm: 210,
    nuit: "Adventure Hotel Geirland, Kirkjubæjarklaustur — réservé",
    note: "LA journée glaciers du sud, d'est en ouest : lagunes le matin, excursion sur glacier l'après-midi. Partir tôt pour tout caser. Nuit à Geirland (Kirkjubæjarklaustur).",
    activites: [
      { nom: "Lagune glaciaire de Jökulsárlón", type: "glacier", maps: "Jokulsarlon glacier lagoon",
        desc: "Icebergs bleus dérivant sur un lac glaciaire. Croisière en bateau amphibie/zodiac possible (à réserver)." },
      { nom: "Diamond Beach", type: "plage", maps: "Diamond Beach Iceland",
        desc: "Blocs de glace échoués scintillant sur le sable noir, juste en face de la lagune." },
      { nom: "Excursion rando sur glacier (Skaftafellsjökull)", type: "glacier", maps: "Skaftafell glacier hike tour",
        desc: "Marche guidée avec crampons sur la langue glaciaire (~3 h, encadrée). À réserver — l'incontournable pour fouler un glacier en sécurité." },
      { nom: "Rando de Svartifoss", type: "rando", maps: "Svartifoss trail Skaftafell",
        desc: "Si le temps le permet : sentier vers la cascade encadrée d'orgues basaltiques noires (~5,5 km A/R)." }
    ]
  },
  {
    date: "2026-07-13", jour: "Lun", etiquette: "Jour 11",
    titre: "Côte sud → Hella",
    region: "Sud",
    trajet: { de: "Kirkjubæjarklaustur", a: "Hella" },
    geo: { de: "Kirkjubæjarklaustur", a: "Hella" },
    distanceKm: 190,
    nuit: "Riverfront Lodge Hella — réservé (nuit 1/2)",
    note: "Les incontournables de la côte sud d'est en ouest, jusqu'à la base de Hella pour 2 nuits.",
    activites: [
      { nom: "Fjaðrárgljúfur", type: "vue", maps: "Fjadrargljufur canyon",
        desc: "Canyon sinueux et verdoyant aux parois vertigineuses, sentier le long du bord (juste à côté de Kirkjubæjarklaustur)." },
      { nom: "Reynisfjara", type: "plage", maps: "Reynisfjara black sand beach",
        desc: "Célèbre plage de sable noir, orgues basaltiques et aiguilles de Reynisdrangar. ⚠️ Vagues sournoises, rester loin de l'eau." },
      { nom: "Dyrhólaey", type: "vue", maps: "Dyrholaey",
        desc: "Promontoire avec arche rocheuse, phare et macareux en été." },
      { nom: "Skógafoss", type: "cascade", maps: "Skogafoss",
        desc: "Cascade de 60 m que l'on peut approcher au plus près ; escalier vers le belvédère." },
      { nom: "Seljalandsfoss & Gljúfrabúi", type: "cascade", maps: "Seljalandsfoss",
        desc: "Cascade derrière laquelle on peut marcher, et sa voisine cachée dans une grotte." }
    ]
  },
  {
    date: "2026-07-14", jour: "Mar", etiquette: "Jour 12",
    titre: "Journée libre (base Hella)",
    region: "Sud",
    trajet: { de: "Hella", a: "Hella (au choix)" },
    geo: { de: "Hella", a: "Hella" },
    distanceKm: 100,
    nuit: "Riverfront Lodge Hella — réservé (nuit 2/2)",
    note: "Journée souple depuis Hella : au choix selon la météo et l'envie. Sert aussi de tampon si une visite a été reportée.",
    activites: [
      { nom: "Îles Westman (Vestmannaeyjar)", type: "faune", maps: "Landeyjahofn ferry Vestmannaeyjar",
        desc: "Ferry depuis Landeyjahöfn (~30 min de Hella, traversée ~35 min) : macareux, volcan Eldfell, falaises. Une belle excursion à la journée." },
      { nom: "Vallée de Þórsmörk (point de vue)", type: "rando", maps: "Thorsmork",
        desc: "Vallée glaciaire splendide — accès uniquement en bus 4×4 organisé (gués de rivière, route F interdite en voiture normale)." },
      { nom: "Seljavallalaug", type: "bains", maps: "Seljavallalaug pool",
        desc: "Piscine géothermale nichée dans la montagne, ~20 min de marche — ambiance hors du temps." },
      { nom: "Repos / météo", type: "route", maps: "Hella Iceland",
        desc: "Ou simplement souffler avant la dernière ligne droite, ou rattraper une visite reportée de la côte sud." }
    ]
  },
  {
    date: "2026-07-15", jour: "Mer", etiquette: "Jour 13",
    titre: "Retour à Reykjavík",
    region: "Capitale",
    trajet: { de: "Hella", a: "Reykjavík" },
    geo: { de: "Hella", a: "Reykjavík" },
    distanceKm: 95,
    nuit: "Reykjavík",
    note: "Fin du road trip : restitution de la voiture à Reykjavík. Après-midi/soirée pour visiter la capitale.",
    activites: [
      { nom: "Hallgrímskirkja", type: "ville", maps: "Hallgrimskirkja",
        desc: "L'église emblématique ; montée au clocher pour la vue sur la ville colorée." },
      { nom: "Sun Voyager & front de mer", type: "ville", maps: "Sun Voyager Reykjavik",
        desc: "Sculpture du « navire solaire » le long de la promenade, avec le Harpa à proximité." },
      { nom: "Vieux port & centre", type: "ville", maps: "Reykjavik old harbour",
        desc: "Rues commerçantes (Laugavegur), street art, cafés et restaurants." }
    ]
  },
  {
    date: "2026-07-16", jour: "Jeu", etiquette: "Jour 14",
    titre: "Cercle d'Or (excursion guidée)",
    region: "Sud-Ouest",
    trajet: { de: "Reykjavík", a: "Reykjavík (excursion)" },
    geo: { de: "Reykjavík", a: "Reykjavík" },
    distanceKm: 0,
    nuit: "Reykjavík",
    note: "Voiture déjà rendue → excursion organisée à la journée depuis Reykjavík.",
    activites: [
      { nom: "Parc national de Þingvellir", type: "histoire", maps: "Thingvellir National Park",
        desc: "Faille entre les plaques tectoniques et berceau du plus vieux parlement du monde (UNESCO)." },
      { nom: "Geysir & Strokkur", type: "volcan", maps: "Geysir Strokkur",
        desc: "Zone géothermale où Strokkur jaillit toutes les ~5–10 min." },
      { nom: "Gullfoss", type: "cascade", maps: "Gullfoss",
        desc: "« La chute d'or », double cascade majestueuse dans un canyon." }
    ]
  },
  {
    date: "2026-07-17", jour: "Ven", etiquette: "Jour 15",
    titre: "Départ",
    region: "Capitale → Aéroport",
    trajet: { de: "Reykjavík", a: "Aéroport de Keflavík" },
    geo: { de: "Reykjavík", a: "Keflavík Airport" },
    distanceKm: 50,
    nuit: "—",
    note: "Voiture rendue : prévoir une navette (Flybus, ~45–50 min) ou un taxi vers l'aéroport.",
    activites: [
      { nom: "Navette vers Keflavík", type: "route", maps: "Flybus Reykjavik airport",
        desc: "Réserver la navette aéroport à l'avance ; départ ~3 h avant le vol." }
    ]
  }
];

/* ---------------------------------------------------------------------
   ETAPES — itinéraire à plat (vue séquentielle de bout en bout).
   Généré depuis JOURS pour rester synchronisé (pas de saisie en double).
   --------------------------------------------------------------------- */
const ETAPES = JOURS.map((j, i) => ({
  ordre: i + 1,
  date: j.date,
  jour: j.jour,
  etiquette: j.etiquette,
  de: j.trajet.de,
  a: j.trajet.a,
  region: j.region,
  distanceKm: j.distanceKm,
  nuit: j.nuit,
  geoDe: j.geo.de,
  geoA: j.geo.a,
  maps: j.trajet.a
}));

/* Grandes étapes (hubs) pour le lien « itinéraire complet » Google Maps.
   Liste resserrée (≤ 10 points) pour rester dans la limite de Maps. */
const ITINERAIRE_HUBS = [
  "Keflavík Airport", "Borgarnes", "Akureyri", "Mývatn",
  "Egilsstaðir", "Höfn", "Vík", "Reykjavík", "Keflavík Airport"
];

/* Total des kilomètres du road trip (jusqu'à la restitution de la voiture le 15/07). */
const TOTAL_KM_ROADTRIP = JOURS
  .filter(j => j.date <= "2026-07-15")
  .reduce((s, j) => s + (j.distanceKm || 0), 0);

/* ---------------------------------------------------------------------
   BAGAGES — checklist par défaut (l'état coché est gardé en localStorage).
   --------------------------------------------------------------------- */
const BAGAGES_DEFAUT = [
  { categorie: "Vêtements", items: [
    "Veste imperméable et coupe-vent",
    "Polaire / couche chaude",
    "Sous-couches thermiques (le système 3 couches)",
    "Pantalon de randonnée",
    "Bonnet et gants (oui, même en juillet)",
    "Chaussettes de randonnée (paires de rechange)"
  ]},
  { categorie: "Chaussures", items: [
    "Chaussures de randonnée imperméables",
    "Baskets / chaussures confort pour la voiture",
    "Sandales (bains géothermaux)"
  ]},
  { categorie: "Bains géothermaux", items: [
    "Maillot de bain",
    "Serviette microfibre",
    "Tongs"
  ]},
  { categorie: "Électronique", items: [
    "Adaptateur prise européenne (type F)",
    "Batterie externe",
    "Chargeurs (téléphone, appareil photo)",
    "Support téléphone voiture / GPS",
    "Appareil photo"
  ]},
  { categorie: "Santé & divers", items: [
    "Crème solaire & lunettes (jour quasi permanent)",
    "Masque de sommeil (soleil de minuit)",
    "Gourde réutilisable (eau du robinet excellente)",
    "Trousse de premiers soins",
    "Lessive de voyage"
  ]},
  { categorie: "Papiers & réservations", items: [
    "Passeport / carte d'identité",
    "Permis de conduire",
    "Contrat de location voiture + assurances",
    "Confirmations d'hôtels et d'excursions",
    "Carte bancaire (paiement par carte partout)"
  ]}
];

/* ---------------------------------------------------------------------
   RESERVATIONS — liste de départ (modifiable, gardée en localStorage).
   statut ∈ { "à faire", "réservé", "payé" }
   --------------------------------------------------------------------- */
const RESERVATIONS_DEFAUT = [
  { type: "Vol", libelle: "Vol aller-retour", date: "2026-07-03", confirmation: "", statut: "réservé" },
  { type: "Voiture", libelle: "Location voiture (Keflavík → Reykjavík)", date: "2026-07-03", confirmation: "", statut: "réservé" },
  { type: "Activité", libelle: "Blue Lagoon (si baignade)", date: "2026-07-03", confirmation: "", statut: "à faire" },
  { type: "Hôtel", libelle: "Bjarg Borgarnes — guesthouse, 3 nuits (Bjarg, 310 Borgarnes)", date: "2026-07-03", confirmation: "", statut: "réservé" },
  { type: "Hôtel", libelle: "Hótel Laugar — 3 nuits, 655,65 € (région Húsavík)", date: "2026-07-06", confirmation: "", statut: "payé" },
  { type: "Activité", libelle: "Baleines Húsavík (North Sailing)", date: "2026-07-08", confirmation: "", statut: "à faire" },
  { type: "Hôtel", libelle: "Hotel 1001 Nótt — 2 nuits, 575 € (Álfaás 1, 701 Egilsstaðir)", date: "2026-07-09", confirmation: "", statut: "payé" },
  { type: "Hôtel", libelle: "Sefdalur — 1 nuit, 214,20 € (Hagi 2, 781 Höfn)", date: "2026-07-11", confirmation: "", statut: "payé" },
  { type: "Activité", libelle: "Croisière Jökulsárlón", date: "2026-07-12", confirmation: "", statut: "à faire" },
  { type: "Activité", libelle: "Rando sur glacier Skaftafell", date: "2026-07-12", confirmation: "", statut: "à faire" },
  { type: "Hôtel", libelle: "Adventure Hotel Geirland — 1 nuit, 295,10 € (Kirkjubæjarklaustur)", date: "2026-07-12", confirmation: "", statut: "payé" },
  { type: "Hôtel", libelle: "Riverfront Lodge Hella — 2 nuits, 450,50 €", date: "2026-07-13", confirmation: "", statut: "payé" },
  { type: "Hôtel", libelle: "Reykjavík (2 nuits)", date: "2026-07-15", confirmation: "", statut: "à faire" },
  { type: "Activité", libelle: "Excursion Cercle d'Or", date: "2026-07-16", confirmation: "", statut: "à faire" },
  { type: "Transport", libelle: "Navette aéroport (Flybus)", date: "2026-07-17", confirmation: "", statut: "à faire" }
];

/* Catégories suggérées pour la page Dépenses. */
const CATEGORIES_DEPENSES = [
  "Vol", "Voiture", "Carburant", "Hébergement", "Restaurant",
  "Courses", "Activités", "Bains", "Souvenirs", "Autre"
];

/* ---------------------------------------------------------------------
   DEPENSES — dépenses déjà engagées (pré-remplies au 1er chargement).
   Les hébergements confirmés/payés. À compléter dans la page Dépenses.
   --------------------------------------------------------------------- */
const DEPENSES_DEFAUT = [
  { date: "2026-07-03", categorie: "Vol", libelle: "Vol aller-retour (≈ 1000 $, à ajuster)", montant: 920 },
  { date: "2026-07-03", categorie: "Voiture", libelle: "Location voiture (≈ 1500 $, à ajuster)", montant: 1380 },
  { date: "2026-07-06", categorie: "Hébergement", libelle: "Hótel Laugar (3 nuits)", montant: 655.65 },
  { date: "2026-07-09", categorie: "Hébergement", libelle: "Hotel 1001 Nótt (2 nuits)", montant: 575 },
  { date: "2026-07-11", categorie: "Hébergement", libelle: "Sefdalur (1 nuit)", montant: 214.20 },
  { date: "2026-07-12", categorie: "Hébergement", libelle: "Adventure Hotel Geirland (1 nuit)", montant: 295.10 },
  { date: "2026-07-13", categorie: "Hébergement", libelle: "Riverfront Lodge Hella (2 nuits)", montant: 450.50 }
];
