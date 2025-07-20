# 🚀 Guide de Déploiement - Code Cuillère

Guide complet pour déployer l'application Code Cuillère en production.

## ⚡ Déploiement Rapide (5 minutes)

### Option 1: Vercel (Recommandé)

1. **Fork/Clone du repository**
```bash
git clone <votre-repo>
cd code-cuillere
```

2. **Installer Vercel CLI**
```bash
npm i -g vercel
```

3. **Déployer**
```bash
vercel --prod
```

4. **Configurer les variables d'environnement**
   - Aller sur vercel.com → Project Settings → Environment Variables
   - Ajouter les variables ci-dessous

### Option 2: Railway

1. **Connecter à Railway**
   - Aller sur railway.app
   - Connecter GitHub repository
   - Déploiement automatique

### Option 3: Docker

```bash
# Build
docker build -t code-cuillere .

# Run
docker run -p 3000:3000 code-cuillere
```

---

## 🔧 Variables d'Environnement

### Production (.env.production)
```bash
# Database
DATABASE_URL="file:./prod.db"

# JWT Secret (CHANGEZ CETTE VALEUR !)
JWT_SECRET="votre-clé-secrète-très-longue-et-sécurisée-123456789"

# App URL
NEXTAUTH_URL="https://votre-domaine.com"

# Optional: WhatsApp Business API
WHATSAPP_API_TOKEN="votre-token-whatsapp"
WHATSAPP_PHONE_ID="votre-phone-id"
```

### Variables Importantes

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de la base de données | `file:./prod.db` |
| `JWT_SECRET` | Clé secrète pour les tokens | `my-super-secret-key-2024` |
| `NEXTAUTH_URL` | URL publique de l'app | `https://codecuillere.com` |

---

## 🗄️ Configuration Base de Données

### SQLite (Par défaut)
```bash
# Générer le client
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Peupler les données
npm run db:seed
```

### PostgreSQL (Recommandé pour production)
```bash
# 1. Changer le provider dans schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Mettre à jour DATABASE_URL
DATABASE_URL="postgresql://user:password@host:5432/codecuillere"

# 3. Regénérer et migrer
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

---

## 🔒 Sécurité Production

### 1. Changer le mot de passe admin
```bash
# Après déploiement, créer un nouvel admin
npm run create-admin
# Ou via l'interface web /admin/settings
```

### 2. Configurer HTTPS
- Vercel/Railway : Automatique
- Serveur personnel : Certbot + Nginx

### 3. Variables secrètes
```bash
# Générer une clé JWT sécurisée
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📱 Post-Déploiement

### 1. Tester l'application
- [ ] Page d'accueil accessible
- [ ] Inscription joueur
- [ ] Connexion admin (`/admin/login`)
- [ ] Génération QR codes
- [ ] Test de scan QR

### 2. Configuration admin
1. Se connecter : `/admin/login`
   - Username: `admin`
   - Password: `admin123`
2. Changer le mot de passe
3. Générer les QR codes
4. Configurer les paramètres

### 3. Préparer le lancement
- [ ] Imprimer les affiches
- [ ] Tester les paiements Orange Money/Wave
- [ ] Configurer les notifications WhatsApp
- [ ] Préparer la communication

---

## 🎯 Check-list de Lancement

### Technique
- [ ] ✅ Application déployée et accessible
- [ ] ✅ Base de données configurée et peuplée
- [ ] ✅ Variables d'environnement définies
- [ ] ✅ QR codes générés et testés
- [ ] ✅ Interface admin fonctionnelle
- [ ] ✅ Système de paiement configuré

### Marketing
- [ ] 📱 Affiches imprimées et prêtes
- [ ] 📍 Emplacements identifiés
- [ ] 💰 Compte Orange Money/Wave configuré
- [ ] 📢 Communication sur réseaux sociaux
- [ ] 🎯 Stratégie de lancement définie

### Support
- [ ] 📞 Numéro WhatsApp opérationnel
- [ ] 📧 Email de support configuré
- [ ] 📋 Procédures de support définies
- [ ] 🆘 Plan de gestion des incidents

---

## 🔧 Commandes Utiles

### Maintenance
```bash
# Voir les logs
vercel logs <deployment-url>

# Accéder à la DB
npx prisma studio

# Backup de la DB
cp prisma/dev.db backup/$(date +%Y%m%d).db

# Reset complet (ATTENTION !)
npx prisma migrate reset
npm run db:seed
```

### Monitoring
```bash
# Statistiques en temps réel
curl https://votre-app.com/api/admin/stats

# Export des données
curl -H "Authorization: Bearer <admin-token>" \
     https://votre-app.com/api/admin/export
```

---

## 🚨 Résolution de Problèmes

### Problèmes courants

#### 1. "Database connection failed"
```bash
# Vérifier la DB
npx prisma db pull

# Recréer la DB
npx prisma migrate reset
npm run db:seed
```

#### 2. "QR codes ne se génèrent pas"
```bash
# Vérifier les dépendances
npm install qrcode canvas

# Tester localement
npm run dev
```

#### 3. "Admin login failed"
```bash
# Reset du mot de passe admin
npx tsx prisma/reset-admin.ts
```

#### 4. "Build fails"
```bash
# Nettoyer et rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Monitoring et Analytics

### Métriques importantes
- Nombre d'inscriptions/jour
- Taux de conversion par énigme
- Revenus générés
- Taux d'abandon

### Outils recommandés
- **Vercel Analytics** : Performance
- **Google Analytics** : Comportement utilisateurs
- **Sentry** : Monitoring d'erreurs
- **Uptime Robot** : Disponibilité

---

## 🔄 Mises à jour

### Déploiement de nouvelles versions
```bash
# Avec Vercel
git push origin main  # Auto-deploy

# Manuel
vercel --prod
```

### Backup avant mise à jour
```bash
# Backup DB
cp prisma/prod.db backup/pre-update-$(date +%Y%m%d).db

# Export complet
curl -o backup/export-$(date +%Y%m%d).json \
     https://votre-app.com/api/admin/export
```

---

## 📞 Support Post-Déploiement

### Contact technique
- 📧 **Email** : tech@codecuillere.com
- 📱 **WhatsApp** : +223 70446750
- 🐛 **Issues** : GitHub Issues

### Documentation
- 📖 **API Docs** : `/docs`
- 🎮 **Guide Joueur** : `/guide`
- 👨‍💼 **Manuel Admin** : `/admin/help`

---

## 🎉 Félicitations !

Votre application Code Cuillère est maintenant déployée et prête à attirer l'attention du public !

**Prochaines étapes :**
1. 📱 Coller les affiches QR dans la ville
2. 📢 Annoncer le lancement sur les réseaux sociaux
3. 📊 Suivre les métriques en temps réel
4. 🏆 Gérer le tirage au sort final

**Que l'aventure commence ! 🚀**

---

*Besoin d'aide ? N'hésitez pas à nous contacter !*