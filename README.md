# Road Trip Islande — site de planification

Site statique (HTML/CSS/JS, sans build ni dépendance) pour planifier et suivre le road trip Islande du **3 au 17 juillet 2026**.

## Ouvrir le site

Double-cliquez sur **`index.html`** (s'ouvre dans le navigateur). Fonctionne **hors-ligne** : seuls les boutons « Google Maps » et les liens externes (météo, routes) nécessitent une connexion.

## Pages

| Page | Contenu |
|------|---------|
| `index.html` | Accueil : résumé, compte à rebours, accès aux sections |
| `jours.html` | Jour par jour : trajet, activités, où dormir |
| `itineraire.html` | Itinéraire complet à plat (tableau, total des km) |
| `depenses.html` | Saisie des dépenses + total (EUR) |
| `reservations.html` | Suivi hôtels / excursions / vol |
| `bagages.html` | Checklist à cocher |
| `infos.html` | Urgences, météo, conduite, conseils |

## Modifier le voyage

Tout le contenu vit dans **`assets/data.js`** (un seul fichier) :
- `JOURS` : une entrée par journée (titre, trajet, distance, nuit, activités).
- `ETAPES` / `TOTAL_KM_ROADTRIP` / `ITINERAIRE_HUBS` / `CARTE` : itinéraire et carte.
- `DEPENSES_DEFAUT` : les dépenses (page Dépenses, **statique**).
- `RESERVATIONS_DEFAUT` : l'état des réservations (page Réservations, **statique**).
- `BAGAGES_DEFAUT` : la checklist bagages.

Modifiez ce fichier puis rechargez la page — pas de compilation.

## Données & stockage

- **Dépenses** et **Réservations** sont **statiques** : elles s'affichent directement depuis `data.js` (aucune saisie dans la page). Pour les mettre à jour, éditez `data.js`.
- Seule la **checklist bagages** est interactive : les cases cochées sont enregistrées dans le `localStorage` du navigateur (par appareil).
- Le **thème clair/sombre** choisi via le bouton ☾/☀ est aussi mémorisé en `localStorage`.

## Héberger en ligne (optionnel)

Tout est en chemins relatifs → compatible hébergement statique. Pour AWS S3 :
1. Créer un bucket, activer « Static website hosting ».
2. Uploader tous les fichiers (en conservant le dossier `assets/`, dont `assets/fonts/`).
3. (Optionnel) CloudFront + HTTPS devant le bucket.

## Sources de l'itinéraire

Base : **Hey Iceland — « Around Iceland in 11 days »**, adaptée aux dates réelles et enrichie (randonnées, glaciers du sud, baleines au nord) à partir de North Sailing (Húsavík), Guide to Iceland / AllTrails (Skaftafell, Stórurð, etc.).
