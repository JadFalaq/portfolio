# AI Engineer Portfolio - Jad Falaq

Portfolio personnel construit avec Next.js 15 (App Router), TypeScript et TailwindCSS. Bilingue (FR/EN), avec un formulaire de contact fonctionnel et un contenu entièrement piloté par un fichier de données central.

## ✨ Fonctionnalités

- 🌐 **Bilingue FR/EN** — bascule de langue persistante (`localStorage`), tout le contenu vit dans `data/content.ts`
- 📄 **CV téléchargeable** en FR et EN (`public/CV_JadFalaq.pdf`, `public/Resume_JadFalaq.pdf`)
- 📬 **Formulaire de contact fonctionnel** via [Web3Forms](https://web3forms.com) (voir "Variables d'environnement" ci-dessous)
- 🖼️ **Images optimisées automatiquement** par Next.js (redimensionnement, WebP/AVIF) — voir `next.config.js`
- 🤖 Effets visuels : particules IA, pluie de code, réseau de neurones, terminal animé, cartes holographiques

## Sections

1. **Hero** — introduction, CTA
2. **À propos** — présentation, stats animées
3. **Compétences** — barres de compétences + "Boîte à outils" catégorisée
4. **Expérience** — expériences professionnelles (stages) avec logos d'entreprise
5. **Projets** — projets personnels/académiques avec liens GitHub et captures
6. **CV** — résumé complet (expérience, projets, formation, compétences)
7. **Contact** — formulaire fonctionnel + coordonnées

## Stack technique

- **Framework** : Next.js 15 (App Router), React 18, TypeScript (strict)
- **Style** : TailwindCSS
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Formulaire de contact** : Web3Forms (aucun backend à héberger)
- **Déploiement cible** : Vercel

## Architecture du contenu

Tout le texte (FR/EN), les projets, expériences, formation et compétences sont centralisés dans **`data/content.ts`** (objet `siteContent.fr` / `siteContent.en`). C'est le seul endroit à modifier pour :
- Ajouter/modifier un projet (`projects[]`) — titre, description, technologies, lien GitHub, image (`public/...`)
- Ajouter/modifier une expérience (`experiencePro[]`) — inclut un `logo?: string` optionnel
- Ajouter/modifier une formation (`education[]`)
- Modifier les compétences (`skills[]`) et la "Boîte à outils" (`cv.skillGroups[]`)

La langue active vient de `contexts/LanguageContext.tsx` (hook `useLanguage()`), consommé directement par `app/page.tsx` et `components/CVSection.tsx`.

⚠️ **Important** : dans les tableaux `.map()`, les clés React (`key=`) doivent rester basées sur l'**index**, jamais sur du texte traduit — sinon React démonte/remonte le composant à chaque changement de langue et casse les animations `whileInView` de Framer Motion.

## Getting Started (développement local)

### Prérequis
- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Variables d'environnement

Copie `.env.example` en `.env.local` et remplis les valeurs :

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Clé d'accès [Web3Forms](https://web3forms.com) pour le formulaire de contact. Sans elle, le formulaire affiche un message d'erreur propre (pas de crash) mais n'envoie rien. |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site déployé (utilisée pour le SEO, `sitemap.xml`, `robots.txt`, les balises Open Graph). |

Redémarre le serveur dev après toute modification de `.env.local`.

### Lancer en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### Build de production (local)

```bash
npm run build
npm run start
```

## Déploiement sur Vercel

### 1. Pousser le code sur GitHub

Ce dossier `Portfolio/` doit être son **propre dépôt Git**, séparé du reste de tes projets sur ta machine. Si ce n'est pas déjà fait :

```bash
cd Portfolio
git init
git add .
git commit -m "Initial commit"
```

Crée un nouveau dépôt sur GitHub (vide, sans README) puis :

```bash
git remote add origin https://github.com/JadFalaq/<nom-du-repo>.git
git branch -M main
git push -u origin main
```

### 2. Importer le projet sur Vercel

1. Va sur [vercel.com/new](https://vercel.com/new) et importe le dépôt GitHub créé à l'étape 1
2. Vercel détecte automatiquement Next.js — aucune configuration de build à changer
3. Dans **Environment Variables**, ajoute :
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` = ta clé Web3Forms
   - `NEXT_PUBLIC_SITE_URL` = l'URL que Vercel va attribuer (ex: `https://ton-projet.vercel.app`) — tu peux la mettre à jour après le premier déploiement une fois l'URL connue, puis redéployer
4. Clique **Deploy**

### 3. Après le premier déploiement

- Mets à jour `NEXT_PUBLIC_SITE_URL` avec l'URL réelle (ou ton domaine personnalisé si tu en configures un dans Vercel → Settings → Domains), puis redéploie pour que le SEO/Open Graph pointent au bon endroit
- Chaque `git push` sur la branche `main` redéploie automatiquement

## Sécurité

- Headers de sécurité (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) appliqués via `next.config.js`
- Aucun secret ni clé privée dans le code — tout passe par des variables d'environnement (`NEXT_PUBLIC_*`, exposées côté client par design pour Web3Forms, qui est conçu pour ça)
- Next.js maintenu à jour (voir `npm audit` régulièrement)

## Contact

Pour toute question, utilise le formulaire de contact sur le site ou écris à jadfalaq@gmail.com.
