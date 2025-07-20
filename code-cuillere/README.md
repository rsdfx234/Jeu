# 🔍 Code Cuillère - Jeu d'Énigmes QR

Une application web interactive de chasse au trésor urbaine utilisant des QR codes pour un jeu d'énigmes progressif avec un prix de 100 000 F CFA.

![Code Cuillère](https://img.shields.io/badge/Code-Cuillère-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)

## 🎯 Concept du Jeu

**Code Cuillère** est un jeu d'énigmes urbain innovant qui combine :
- 🏙️ **Exploration urbaine** : QR codes collés dans la ville
- 🧩 **Énigmes progressives** : 7 niveaux de difficulté croissante
- 💰 **Monétisation** : Vente d'indices (100F, 200F, 500F)
- 🏆 **Récompense finale** : 100 000 F CFA pour le gagnant
- 📱 **Collecte de données** : Base WhatsApp pour marketing

## 🚀 Fonctionnalités Principales

### Pour les Joueurs
- ✅ **Inscription simple** : Prénom + WhatsApp obligatoire
- 🔐 **Progression verrouillée** : Déblocage séquentiel des énigmes
- 💡 **Système d'indices** : 2 gratuits + 3 payants par énigme
- 🎮 **Interface immersive** : Design mystérieux et mobile-first
- 🏅 **Classement des finalistes** : Tableau des scores en temps réel

### Pour les Administrateurs
- 📊 **Dashboard complet** : Statistiques en temps réel
- 👥 **Gestion utilisateurs** : Liste, progression, scores
- 💳 **Validation paiements** : Approbation manuelle des indices
- 📱 **Générateur QR** : Création automatique des affiches
- 📥 **Export données** : Sauvegarde complète (JSON)

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité du code
- **Tailwind CSS** pour le design responsive
- **React Hooks** pour la gestion d'état

### Backend
- **Next.js API Routes** pour l'API REST
- **Prisma ORM** avec base SQLite
- **JWT** pour l'authentification admin
- **bcryptjs** pour le hachage des mots de passe

### Utilitaires
- **QRCode.js** pour la génération de QR codes
- **Canvas** pour la création d'affiches
- **React Query** pour la gestion du cache

## 🏗️ Structure du Projet

```
code-cuillere/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── riddle/[number]/   # Pages d'énigmes dynamiques
│   │   ├── finalists/         # Page des finalistes
│   │   ├── admin/             # Interface d'administration
│   │   └── api/               # Routes API
│   ├── lib/                   # Utilitaires
│   │   ├── prisma.ts         # Client Prisma
│   │   └── auth.ts           # Authentification admin
│   └── types/                 # Types TypeScript
├── prisma/                    # Configuration base de données
│   ├── schema.prisma         # Schéma de la DB
│   └── seed.ts               # Données initiales
└── public/                    # Assets statiques
```

## 📋 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <repo-url>
cd code-cuillere
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev --name init

# Peupler avec les données initiales
npm run db:seed
```

4. **Variables d'environnement**
```bash
# Créer .env.local
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

5. **Démarrer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🎮 Guide d'Utilisation

### Pour les Joueurs

1. **Scan du QR Code** → Redirection vers l'énigme
2. **Inscription** → Saisie prénom + WhatsApp
3. **Résolution** → 2 indices gratuits + champ réponse
4. **Achat d'indices** (optionnel) :
   - Indice bonus : 100 F CFA
   - Méga indice : 200 F CFA  
   - Réponse directe : 500 F CFA
5. **Progression** → Déblocage énigme suivante
6. **Finaliste** → Inscription au tirage (après énigme #7)

### Pour les Administrateurs

1. **Connexion Admin** → `/admin/login`
   - Username: `admin`
   - Password: `admin123`

2. **Dashboard** → Vue d'ensemble des statistiques

3. **Gestion Utilisateurs** → Liste, niveaux, scores

4. **Validation Paiements** → 
   - Approuver/Rejeter les demandes
   - Déblocage automatique des indices

5. **Génération QR** → `/admin/qr-generator`
   - Création des 7 QR codes
   - Téléchargement des affiches

6. **Export Données** → Sauvegarde complète JSON

## 💰 Système de Monétisation

### Tarification
- **Indice bonus** : 100 F CFA
- **Méga indice** : 200 F CFA
- **Réponse complète** : 500 F CFA

### Processus de Paiement
1. Joueur clique sur "Acheter indice"
2. Instructions de paiement affichées
3. Paiement Orange Money/Wave → 00223 70446750
4. Envoi capture WhatsApp
5. Validation manuelle admin
6. Déblocage automatique de l'indice

## 🏆 Gestion du Concours

### Critères de Victoire
1. **Finalistes** : Tous ceux qui terminent les 7 énigmes
2. **Classement** : Score (rapidité + tentatives)
3. **Tirage au sort** : Parmi tous les finalistes
4. **Prix** : 100 000 F CFA

### Suivi des Performances
- Score basé sur rapidité et nombre de tentatives
- Système de bonus pour les réponses rapides
- Historique complet des réponses

## 📱 Génération des Affiches QR

### Format des Affiches
- **Titre** : CODE CUILLÈRE #XXX
- **Accroche** : "Résous cette énigme pour 100 000 F CFA"
- **Énigme** : Texte de l'énigme
- **Instructions** : Paiement et contact
- **QR Code** : Lien vers l'énigme

### Stratégie de Placement
- Lieux de passage fréquent
- Hauteur accessible smartphone
- Protection contre intempéries
- Espacement géographique

## 🔧 API Endpoints

### Public
- `POST /api/auth/register` - Inscription joueur
- `GET /api/riddle/[number]` - Récupérer énigme
- `POST /api/riddle/submit` - Soumettre réponse
- `POST /api/payment/request` - Demander indice
- `GET /api/finalists` - Liste finalistes

### Admin (Authentifié)
- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/users` - Liste utilisateurs
- `GET /api/admin/payments` - Liste paiements
- `PATCH /api/admin/payments/[id]` - Valider paiement
- `POST /api/admin/generate-qr` - Générer QR codes
- `GET /api/admin/export` - Export données

## 🗄️ Base de Données

### Tables Principales
- **Users** : Joueurs et progression
- **Riddles** : Énigmes et indices
- **UserProgress** : Avancement individuel
- **PaymentRequests** : Demandes d'achat
- **AdminUsers** : Comptes administrateurs

### Schéma Complet
Voir `prisma/schema.prisma` pour le schéma détaillé.

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déploiement automatique

### Variables de Production
```bash
DATABASE_URL="file:./prod.db"
JWT_SECRET="production-secret-key"
NEXTAUTH_URL="https://votre-domaine.com"
```

## 📊 Metrics et Analytics

### KPIs Suivis
- Nombre d'inscriptions
- Taux de conversion par énigme
- Revenus par type d'indice
- Temps moyen de résolution
- Taux de finalistes

### Export de Données
- Format JSON complet
- Numéros WhatsApp pour marketing
- Historique des paiements
- Statistiques de performance

## 🔒 Sécurité

### Mesures Implémentées
- Authentification JWT pour admins
- Validation des entrées utilisateur
- Protection contre les injections SQL
- Limitation du taux de requêtes
- Hachage des mots de passe

## 🎨 Design et UX

### Thème Mystérieux
- Couleurs sombres (gris, violet, noir)
- Animations subtiles
- Icons et émojis thématiques
- Effets glassmorphism

### Mobile-First
- Interface optimisée smartphone
- Boutons larges et accessibles
- Navigation intuitive
- Chargement rapide

## 🤝 Support et Contact

### Support Technique
- WhatsApp : 00223 70446750
- Email : support@codecuillere.com

### Documentation
- API Documentation : `/docs`
- Admin Guide : `/admin/guide`

---

## 🚀 Prêt à Lancer ?

1. ✅ **Installation** → `npm install && npm run db:seed`
2. ✅ **Test Local** → `npm run dev`
3. ✅ **Génération QR** → Admin dashboard
4. ✅ **Impression Affiches** → Format A4 recommandé
5. ✅ **Placement Urbain** → Stratégie définie
6. ✅ **Lancement** → Communication sur réseaux sociaux

**Que le jeu commence ! 🎯**

---

*Développé avec ❤️ pour créer de l'engagement urbain et récompenser la curiosité.*
