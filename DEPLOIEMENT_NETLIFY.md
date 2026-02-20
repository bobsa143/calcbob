# Guide de Déploiement sur Netlify

## Méthode 1 : Déploiement via Git (Recommandé)

### Étape 1 : Créer un dépôt Git
```bash
git init
git add .
git commit -m "Initial commit - Application rebobinage moteur"
```

### Étape 2 : Pousser sur GitHub/GitLab
1. Créez un nouveau dépôt sur GitHub ou GitLab
2. Ajoutez le remote et poussez :
```bash
git remote add origin <votre-url-repo>
git push -u origin main
```

### Étape 3 : Connecter à Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre compte GitHub/GitLab
4. Sélectionnez votre dépôt
5. Configurez les paramètres de build :
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Ajoutez les variables d'environnement :
   - `VITE_SUPABASE_URL` = `https://rlrbathhdxknlecqqmrz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscmJhdGhoZHhrbmxlY3FxbXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NDYzNzcsImV4cCI6MjA4NzEyMjM3N30.IqJbNA-iUAziRt8mdQdgl6wWWDQFW2wEccCs8S7BD6g`
7. Cliquez sur "Deploy site"

## Méthode 2 : Déploiement Direct via Netlify CLI

### Installation de Netlify CLI
```bash
npm install -g netlify-cli
```

### Déploiement
```bash
# Se connecter à Netlify
netlify login

# Déployer le site
netlify deploy --prod
```

Quand demandé :
- **Publish directory:** `dist`
- **Site name:** Choisissez un nom unique

### Configurer les variables d'environnement
```bash
netlify env:set VITE_SUPABASE_URL "https://rlrbathhdxknlecqqmrz.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscmJhdGhoZHhrbmxlY3FxbXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NDYzNzcsImV4cCI6MjA4NzEyMjM3N30.IqJbNA-iUAziRt8mdQdgl6wWWDQFW2wEccCs8S7BD6g"
```

## Méthode 3 : Drag & Drop (Simple mais manuel)

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Faites glisser le dossier `dist` dans la zone de drop
3. Une fois déployé, allez dans "Site settings" → "Environment variables"
4. Ajoutez les deux variables d'environnement mentionnées ci-dessus
5. Allez dans "Deploys" et cliquez sur "Trigger deploy" → "Clear cache and deploy site"

## Vérification Post-Déploiement

Une fois déployé, vérifiez que :
- ✓ L'application se charge correctement
- ✓ Les calculateurs fonctionnent
- ✓ La sauvegarde des projets fonctionne (connexion Supabase)
- ✓ L'historique affiche les projets sauvegardés
- ✓ Les tables techniques se chargent

## URL de l'Application

Votre application sera accessible à une URL du type :
- `https://votre-nom-site.netlify.app`

Vous pouvez configurer un domaine personnalisé dans les paramètres Netlify.

## Mises à Jour Automatiques

Si vous utilisez la Méthode 1 (Git), chaque push sur la branche `main` déclenchera automatiquement un nouveau déploiement.

## Support

Pour toute question ou problème de déploiement :
- Documentation Netlify : https://docs.netlify.com
- Support Netlify : https://answers.netlify.com
