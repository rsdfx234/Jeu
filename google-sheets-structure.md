# Structure Google Sheets pour Code Cuillère

## 📊 Table 1: Joueurs

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| ID | Auto | Identifiant unique | 1, 2, 3... |
| Nom | Texte | Nom complet du joueur | "Ahmed Traoré" |
| WhatsApp | Texte | Numéro WhatsApp obligatoire | "+223 70 12 34 56" |
| Email | Texte | Email optionnel | "ahmed@example.com" |
| ID_Joueur | Texte | Identifiant généré automatiquement | "CU001", "CU002"... |
| Enigme_Actuelle | Nombre | Numéro de l'énigme en cours | 1, 2, 3... 7 |
| Enigmes_Resolues | Nombre | Nombre total d'énigmes résolues | 0, 1, 2... 7 |
| Date_Inscription | Date/Heure | Moment de l'inscription | "2024-01-15 14:30:00" |
| Derniere_Activite | Date/Heure | Dernière réponse soumise | "2024-01-15 16:45:00" |
| Statut | Texte | État du joueur | "Actif", "Finaliste", "Gagnant" |
| Score_Total | Nombre | Points accumulés | 0-700 points |
| Paiements_Total | Nombre | Montant total payé en F CFA | 0, 100, 300... |
| Date_Completion | Date/Heure | Date de fin si toutes énigmes résolues | "2024-01-16 12:00:00" |

### Formules automatiques suggérées:
- **ID_Joueur**: `="CU" & TEXT(ROW()-1, "000")`
- **Statut**: `=IF(Enigmes_Resolues=7, "Finaliste", IF(Enigmes_Resolues>0, "Actif", "Nouveau"))`

---

## 🧩 Table 2: Enigmes

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| Numero | Nombre | Numéro de l'énigme | 1, 2, 3... 7 |
| Titre | Texte | Titre de l'énigme | "Le Premier Mystère" |
| Texte_Enigme | Texte long | Contenu de l'énigme | "Dans la ville où le temps s'arrête..." |
| Image_URL | URL | Lien vers image optionnelle | "https://..." |
| Indice_Gratuit_1 | Texte | Premier indice gratuit | "Cherchez près de la fontaine" |
| Indice_Gratuit_2 | Texte | Deuxième indice gratuit | "L'heure compte plus que vous ne pensez" |
| Indice_Bonus | Texte | Indice payant 100 F CFA | "La réponse est gravée dans le marbre" |
| Mega_Indice | Texte | Méga indice 200 F CFA | "Regardez l'horloge de la place centrale" |
| Reponse_Correcte | Texte | Réponse exacte (case insensitive) | "15H30" |
| Reponses_Alternatives | Texte | Autres réponses acceptées (séparées par |) | "15:30|15h30|trois heures trente" |
| Points_Base | Nombre | Points gagnés pour résolution | 100 |
| Statut | Texte | État de l'énigme | "Active", "Brouillon" |
| Date_Creation | Date | Date de création | "2024-01-10" |

---

## 💰 Table 3: Paiements

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| ID | Auto | Identifiant unique | 1, 2, 3... |
| ID_Joueur | Texte | Référence au joueur | "CU001" |
| Nom_Joueur | Texte | Nom pour faciliter | "Ahmed Traoré" |
| WhatsApp_Joueur | Texte | WhatsApp pour contact | "+223 70 12 34 56" |
| Numero_Enigme | Nombre | Énigme concernée | 1, 2, 3... 7 |
| Type_Demande | Texte | Type d'aide demandée | "Indice Bonus", "Méga Indice", "Réponse" |
| Montant | Nombre | Montant en F CFA | 100, 200, 500 |
| Date_Demande | Date/Heure | Moment de la demande | "2024-01-15 16:20:00" |
| Statut_Paiement | Texte | État du paiement | "En attente", "Reçu", "Validé" |
| Capture_Ecran | URL | Lien vers preuve de paiement | "https://..." |
| Date_Validation | Date/Heure | Moment de validation admin | "2024-01-15 16:30:00" |
| Admin_Validateur | Texte | Qui a validé | "Admin1" |
| Notes | Texte | Commentaires admin | "Paiement Orange Money confirmé" |

---

## 🏆 Table 4: Gagnants

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| ID | Auto | Identifiant unique | 1, 2, 3... |
| Type_Prix | Texte | Type de récompense | "Grand Prix", "2e Prix", "3e Prix" |
| Montant_Prix | Nombre | Montant en F CFA | 100000, 25000, 15000 |
| ID_Joueur_Gagnant | Texte | Référence au gagnant | "CU042" |
| Nom_Gagnant | Texte | Nom du gagnant | "Fatou Diallo" |
| WhatsApp_Gagnant | Texte | Contact du gagnant | "+223 75 98 76 54" |
| Date_Tirage | Date/Heure | Moment du tirage au sort | "2024-01-20 18:00:00" |
| Methode_Tirage | Texte | Comment le tirage a été fait | "Random.org", "Manuel" |
| Preuve_Tirage | URL | Lien vers preuve/vidéo | "https://..." |
| Statut_Remise | Texte | État de remise du prix | "En cours", "Remis", "Refusé" |
| Date_Remise | Date/Heure | Moment de remise effective | "2024-01-21 14:00:00" |
| Notes_Remise | Texte | Détails sur la remise | "Remis en espèces, reçu signé" |

---

## 📈 Table 5: Reponses_Joueurs (Log des tentatives)

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| ID | Auto | Identifiant unique | 1, 2, 3... |
| ID_Joueur | Texte | Référence au joueur | "CU001" |
| Numero_Enigme | Nombre | Énigme concernée | 1, 2, 3... 7 |
| Reponse_Soumise | Texte | Ce que le joueur a écrit | "15h30" |
| Est_Correcte | Booléen | Réponse juste ou fausse | VRAI, FAUX |
| Date_Soumission | Date/Heure | Moment de la soumission | "2024-01-15 16:45:00" |
| IP_Adresse | Texte | Adresse IP (si disponible) | "196.1.1.1" |
| Temps_Reponse | Nombre | Secondes depuis ouverture énigme | 1800 (30 min) |

---

## 🔧 Paramètres et Configuration

### Table 6: Config_Jeu

| Paramètre | Valeur | Description |
|-----------|--------|-------------|
| jeu_actif | VRAI | Le jeu accepte-t-il de nouveaux joueurs ? |
| inscriptions_ouvertes | VRAI | Peut-on encore s'inscrire ? |
| tirage_effectue | FAUX | Le tirage final a-t-il eu lieu ? |
| date_fin_jeu | "2024-01-31" | Date limite pour terminer |
| prix_grand_gagnant | 100000 | Montant du grand prix |
| whatsapp_admin | "22370446750" | Contact pour support |
| message_accueil | "Bienvenue..." | Message d'intro personnalisable |
| nombre_finalistes | 0 | Calcul auto du nombre de qualifiés |

### Formules suggérées pour Config_Jeu:
- **nombre_finalistes**: `=COUNTIF(Joueurs!Enigmes_Resolues,7)`

---

## 📱 Instructions pour Glide

### Connexions de données:
1. **Source principale**: Google Sheets avec les 6 tables ci-dessus
2. **Authentification**: Email + profil utilisateur basé sur WhatsApp
3. **Relations**:
   - Joueurs → Enigmes (par Enigme_Actuelle)
   - Joueurs → Paiements (par ID_Joueur)
   - Joueurs → Reponses_Joueurs (par ID_Joueur)
   - Gagnants → Joueurs (par ID_Joueur_Gagnant)

### Actions personnalisées nécessaires:
1. **Vérification réponse**: Script qui compare la réponse soumise avec Reponse_Correcte + Reponses_Alternatives
2. **Progression automatique**: Incrémenter Enigme_Actuelle quand réponse correcte
3. **Génération ID joueur**: Créer automatiquement l'identifiant unique
4. **Notification WhatsApp**: Envoyer message de félicitations (optionnel)
5. **Tirage au sort**: Sélection aléatoire parmi les finalistes

Cette structure permet une gestion complète du jeu avec suivi détaillé des performances et paiements.