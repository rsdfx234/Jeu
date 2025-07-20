# Guide d'Installation - Code Cuillère sur Glide Apps

## 🚀 Étape 1: Préparation Google Sheets

### 1.1 Créer le Google Sheets
1. Accédez à [Google Sheets](https://sheets.google.com)
2. Créez un nouveau document nommé "Code Cuillère - Base de données"
3. Créez 6 onglets avec les noms suivants :
   - `Joueurs`
   - `Enigmes`
   - `Paiements`
   - `Gagnants`
   - `Reponses_Joueurs`
   - `Config_Jeu`

### 1.2 Configuration de l'onglet "Joueurs"
Ajoutez les colonnes suivantes dans la première ligne :
```
A1: ID
B1: Nom
C1: WhatsApp
D1: Email
E1: ID_Joueur
F1: Enigme_Actuelle
G1: Enigmes_Resolues
H1: Date_Inscription
I1: Derniere_Activite
J1: Statut
K1: Score_Total
L1: Paiements_Total
M1: Date_Completion
```

**Formules à ajouter** (à partir de la ligne 2) :
- **E2**: `="CU" & TEXT(ROW()-1, "000")`
- **F2**: `=IF(G2=0, 1, MIN(G2+1, 7))`
- **J2**: `=IF(G2=7, "Finaliste", IF(G2>0, "Actif", "Nouveau"))`

### 1.3 Configuration de l'onglet "Enigmes"
Ajoutez les colonnes suivantes :
```
A1: Numero
B1: Titre
C1: Texte_Enigme
D1: Image_URL
E1: Indice_Gratuit_1
F1: Indice_Gratuit_2
G1: Indice_Bonus
H1: Mega_Indice
I1: Reponse_Correcte
J1: Reponses_Alternatives
K1: Points_Base
L1: Statut
M1: Date_Creation
```

Copiez-collez les données du fichier `enigmes-exemple.csv` dans cet onglet.

### 1.4 Configuration des autres onglets
Suivez la structure détaillée dans `google-sheets-structure.md` pour :
- **Paiements** : Suivi des transactions
- **Gagnants** : Résultats du tirage
- **Reponses_Joueurs** : Log des tentatives
- **Config_Jeu** : Paramètres globaux

---

## 🎯 Étape 2: Création de l'App Glide

### 2.1 Nouveau projet Glide
1. Accédez à [Glide Apps](https://www.glideapps.com)
2. Cliquez sur "New App"
3. Sélectionnez "From Google Sheets"
4. Connectez votre Google Sheets "Code Cuillère"
5. Choisissez le template "Custom" ou "Blank"

### 2.2 Configuration générale
- **Nom de l'app** : Code Cuillère
- **Description** : Jeu urbain à énigmes - 100 000 F CFA à gagner
- **Icône** : Utiliser l'emoji 🥄 ou télécharger une icône personnalisée
- **Couleurs** : Thème sombre (voir `glide-structure.json`)

---

## 🎨 Étape 3: Design et Interface

### 3.1 Configuration du thème
1. Allez dans **Settings > Appearance**
2. Configurez les couleurs :
   - **Primary Color** : #1a1a1a (Noir)
   - **Accent Color** : #ffb800 (Or)
   - **Background** : #0d0d0d (Noir profond)
   - **Text Color** : #ffffff (Blanc)

### 3.2 Navigation
Créez 4 onglets principaux :
1. **Accueil** (🏠) - Écran d'inscription
2. **Mon Jeu** (🎮) - Interface de jeu (visible après connexion)
3. **Classement** (🏆) - Leaderboard public
4. **Finalistes** (⭐) - Page des qualifiés

---

## 🔧 Étape 4: Configuration des Écrans

### 4.1 Écran d'Accueil
1. **Type** : Form Screen
2. **Source** : Table "Joueurs"
3. **Composants** :
   - Rich Text avec message d'intro mystérieux
   - Form avec champs : Nom (requis), WhatsApp (requis), Email (optionnel)
   - Action : "Add Row" vers table Joueurs

**Message d'intro** :
```
🔍 **Un mystère vous attend dans les rues de la ville...**

7 énigmes à résoudre. 1 seul gagnant. 100 000 F CFA à la clé.

*Êtes-vous prêt à relever le défi ?*
```

### 4.2 Écran "Mon Jeu"
1. **Type** : Details Screen
2. **Source** : Table "Joueurs" (filtrée par utilisateur connecté)
3. **Composants** :
   - Progress Bar (Progression : Enigmes_Resolues / 7)
   - Relation vers table "Enigmes" (par Enigme_Actuelle)
   - Bouton vers l'énigme en cours

### 4.3 Écran Énigme
1. **Type** : Details Screen
2. **Source** : Table "Enigmes"
3. **Composants** :
   - Title (Titre de l'énigme)
   - Rich Text (Texte_Enigme)
   - Image (Image_URL, si disponible)
   - Text (Indice_Gratuit_1 et Indice_Gratuit_2)
   - Button Group (3 boutons pour acheter indices/réponse)
   - Form pour saisir la réponse

### 4.4 Écran Classement
1. **Type** : List Screen
2. **Source** : Table "Joueurs"
3. **Tri** : Par Enigmes_Resolues (décroissant)
4. **Composants** :
   - Card avec Nom, Enigmes_Resolues, Derniere_Activite

### 4.5 Écran Finalistes
1. **Type** : List Screen
2. **Source** : Table "Joueurs"
3. **Filtre** : Enigmes_Resolues = 7
4. **Composants** :
   - Title "🏆 Les Finalistes"
   - Rich Text avec info sur le grand prix
   - Liste des finalistes

---

## ⚙️ Étape 5: Actions Personnalisées

### 5.1 Action "Vérifier Réponse"
1. Allez dans **Data > Actions**
2. Créez une nouvelle action "Check Answer"
3. **Type** : Custom Action
4. **Code** : Utilisez la fonction `checkAnswer` du fichier `glide-actions.js`

### 5.2 Action "Demander Paiement"
1. Créez une action "Request Payment"
2. **Destination** : Table "Paiements"
3. **Code** : Fonction `requestPayment`

### 5.3 Action "Progression Joueur"
1. Créez une action "Update Progress"
2. **Destination** : Table "Joueurs"
3. **Code** : Fonction `updatePlayerProgress`

---

## 🔐 Étape 6: Sécurité et Permissions

### 6.1 Authentification
1. **Settings > Privacy & Security**
2. Activez "Email Sign-In"
3. Configuration : "Public with Email"
4. **Important** : Les utilisateurs devront s'identifier par email

### 6.2 Permissions par rôle
- **Public** : Accès à Accueil et Classement
- **Utilisateur connecté** : Accès à Mon Jeu et Finalistes
- **Admin** : Accès complet + tableau de bord admin

### 6.3 Filtres de sécurité
1. **Table Joueurs** : Filtre par Email utilisateur
2. **Table Énigmes** : Publique (lecture seule)
3. **Table Paiements** : Visible par créateur uniquement

---

## 📱 Étape 7: Optimisation Mobile

### 7.1 Responsive Design
1. Testez sur différentes tailles d'écran
2. Vérifiez la lisibilité des textes
3. Optimisez les tailles des boutons

### 7.2 Performance
1. Optimisez les images (max 1MB)
2. Limitez les relations complexes
3. Utilisez la mise en cache Glide

---

## 🚀 Étape 8: Tests et Déploiement

### 8.1 Tests fonctionnels
- [ ] Inscription de nouveaux joueurs
- [ ] Vérification des réponses
- [ ] Progression entre énigmes
- [ ] Demandes de paiement
- [ ] Affichage du classement
- [ ] Page finalistes

### 8.2 Tests d'intégration
- [ ] Synchronisation Google Sheets
- [ ] Actions personnalisées
- [ ] Liens WhatsApp
- [ ] Responsive design

### 8.3 Déploiement
1. **Settings > Publish**
2. Choisissez le plan approprié (Pro recommandé)
3. Configurez l'URL personnalisée
4. Activez les notifications push (optionnel)

---

## 🎯 Étape 9: Configuration QR Codes

### 9.1 Génération des QR Codes
1. Utilisez l'URL de votre app Glide
2. Générez 7 QR codes différents (un par énigme)
3. **Format recommandé** : `https://votre-app.glideapp.io?start=1`

### 9.2 Placement physique
1. **QR Code #001** : Point de départ du jeu
2. **QR Codes #002-007** : Emplacements correspondant aux énigmes
3. **Matériel** : Stickers résistants aux intempéries

---

## 📊 Étape 10: Suivi et Analytics

### 10.1 Métriques importantes
- Nombre d'inscriptions par jour
- Taux de complétion par énigme
- Revenus générés par les indices
- Temps moyen par énigme

### 10.2 Google Analytics (optionnel)
1. Créez un compte Google Analytics
2. Ajoutez le code de suivi dans Glide
3. Configurez les objectifs de conversion

---

## 🛠️ Maintenance et Support

### 10.1 Support joueurs
- **WhatsApp** : 00223 70 44 67 50
- **Temps de réponse** : Max 2h pendant les heures d'ouverture
- **FAQ** : Intégrée dans l'app

### 10.2 Mises à jour
- Énigmes bonus (optionnel)
- Corrections de bugs
- Nouvelles fonctionnalités

---

## 💰 Monétisation

### 10.1 Revenus directs
- **Indices bonus** : 100 F CFA
- **Méga indices** : 200 F CFA
- **Réponses directes** : 500 F CFA

### 10.2 Estimation budgétaire
- **Prix grand gagnant** : 100 000 F CFA
- **Revenus estimés** : 50-100 joueurs × 200-500 F = 10 000-50 000 F
- **Marge** : Variable selon la participation

### 10.3 Options d'extension
- Partenariats avec commerces locaux
- Sponsoring d'énigmes
- Éditions saisonnières

---

## 📋 Checklist finale

### Avant le lancement :
- [ ] Toutes les énigmes testées
- [ ] QR codes générés et collés
- [ ] Paiements mobiles configurés
- [ ] Équipe support formée
- [ ] Communication marketing prête

### Jour J :
- [ ] App Glide active
- [ ] Monitoring en temps réel
- [ ] Support WhatsApp disponible
- [ ] Réseaux sociaux activés

**🎯 Votre jeu urbain Code Cuillère est maintenant prêt à conquérir la ville !**