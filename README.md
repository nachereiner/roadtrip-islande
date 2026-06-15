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

Tout le contenu de l'itinéraire vit dans **`assets/data.js`** (un seul fichier) :
- `JOURS` : une entrée par journée (titre, trajet, distance, nuit, activités).
- `ETAPES` / `TOTAL_KM_ROADTRIP` : calculés automatiquement depuis `JOURS`.
- `BAGAGES_DEFAUT`, `RESERVATIONS_DEFAUT`, `CATEGORIES_DEPENSES` : listes par défaut.

Modifiez ce fichier puis rechargez la page — pas de compilation.

## Où sont stockées mes données ?

Les **dépenses**, **réservations** et l'état de la **checklist** sont enregistrés dans le `localStorage` du navigateur (sur cet appareil, ce navigateur). Ils persistent après fermeture.

- Boutons **Exporter** (dépenses / réservations) → téléchargent une sauvegarde `.json`.
- Bouton **Importer** → recharge une sauvegarde (utile pour changer d'appareil).

> ⚠️ Vider les données de navigation / changer de navigateur efface le `localStorage`. Pensez à **Exporter** pour garder une sauvegarde.

## Héberger en ligne (optionnel)

Tout est en chemins relatifs → compatible hébergement statique. Pour AWS S3 :
1. Créer un bucket, activer « Static website hosting ».
2. Uploader tous les fichiers (en conservant le dossier `assets/`).
3. (Optionnel) CloudFront + HTTPS devant le bucket.

Le `localStorage` étant lié à l'origine (domaine), les données saisies en local et celles saisies sur le site hébergé sont distinctes — utilisez Export/Import pour transférer.

## Sources de l'itinéraire

Base : **Hey Iceland — « Around Iceland in 11 days »**, adaptée aux dates réelles et enrichie (randonnées, glaciers du sud, baleines au nord) à partir de North Sailing (Húsavík), Guide to Iceland / AllTrails (Skaftafell, Stórurð, etc.).
