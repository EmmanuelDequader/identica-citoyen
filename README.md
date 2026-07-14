# 🇨🇲 IDENTICA Citoyen — Portail de Suivi des Actes d'État Civil

IDENTICA Citoyen est une application web moderne et épurée permettant aux citoyens camerounais de suivre en temps réel l'avancement de leurs demandes d'actes d'état civil (actes de naissance et de décès). Conçu en adéquation avec les directives du **BUNEC** (Bureau National de l'État Civil) et du **MINAT** (Ministère de l'Administration Territoriale), ce portail offre une interface fluide, accessible et sécurisée.

---

## 🚀 Fonctionnalités Clés

- **Recherche par Numéro d'Acte** : Saisie du numéro d'enregistrement (ex: `ACT-2026-00001`) pour consulter instantanément le statut d'impression, de signature ou de retrait.
- **Recherche par Nom** : Recherche sécurisée par nom et prénom de l'enfant/du défunt pour retrouver l'acte associé.
- **Guide Légal & FAQ** : Espace d'information basé sur l'Ordonnance 81/002 et la Loi 2011/011 régissant l'état civil au Cameroun (délais légaux de 90 jours, pièces à fournir, etc.).
- **Formulaire d'Assistance Intelligent** : Formulaire de contact permettant de remonter les anomalies directement à l'équipe support à l'adresse `emmanueljuniordequa2@gmail.com`.
  - Intègre **Web3Forms** pour une transmission directe en tâche de fond (sans ouvrir de client de messagerie).
  - Bascule automatiquement en mode `mailto:` si aucune clé API n'est configurée.

---

## 🛠️ Stack Technique

- **Framework** : React 19.x (avec Vite 8.x)
- **Routage** : React Router DOM 7.x
- **Styles** : Vanilla CSS & Tailwind CSS 4.x
- **Requêtes HTTP** : Axios (intégration avec l'API IDENTICA)
- **Icônes** : Lucide React

---

## 💻 Installation et Lancement Local

### Préréquis
- **Node.js** (version 18 ou supérieure recommandée)
- **npm** (inclus avec Node.js)

### Étapes d'installation

1. **Cloner le projet** et se positionner dans le dossier :
   ```bash
   cd identica-citoyen
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Créez ou modifiez le fichier `.env.local` à la racine du projet :
   ```env
   # Identifiants du compte de service en lecture seule
   VITE_SERVICE_EMAIL=citoyen.service@identica.cm
   VITE_SERVICE_PASSWORD=CitoyenR3ad0nly!

   # Clé d'accès Web3Forms (Optionnel pour l'envoi direct par formulaire)
   VITE_WEB3FORMS_ACCESS_KEY=votre_cle_web3forms_ici
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   Le site sera accessible à l'adresse `http://127.0.0.1:3001` par défaut.

5. **Compiler pour la production** :
   ```bash
   npm run build
   ```
   Les fichiers de production seront générés dans le dossier `dist/`.

---

## ✉️ Configuration du Formulaire de Contact (Web3Forms)

Pour garantir que les e-mails sont effectivement envoyés à `emmanueljuniordequa2@gmail.com` directement depuis l'interface utilisateur, le site utilise le service **Web3Forms**.

1. **Obtenir une clé gratuite** :
   - Visitez [Web3Forms](https://web3forms.com).
   - Saisissez votre adresse email `emmanueljuniordequa2@gmail.com`.
   - Vous recevrez immédiatement une clé d'accès par e-mail.
2. **Ajouter la clé au projet** :
   - Copiez la clé reçue.
   - Collez-la dans votre fichier `.env.local` pour le développement :
     ```env
     VITE_WEB3FORMS_ACCESS_KEY=votre_cle_recue
     ```
   - Pour la production, configurez cette clé comme variable d'environnement sur votre plateforme de déploiement (Render).

*Note: Si aucune clé n'est fournie, le formulaire utilise la méthode fallback `mailto:emmanueljuniordequa2@gmail.com` qui ouvre le logiciel de messagerie par défaut de l'utilisateur.*

---

## 🌐 Déploiement sur Render

Ce site est entièrement statique et a été optimisé pour être déployé sur **Render** en tant que **Static Site**.

### Option A : Déploiement Automatique via Infrastructure-as-Code (Recommandé)
Le fichier `render.yaml` est déjà présent à la racine du projet. 
1. Connectez-vous à votre tableau de bord [Render](https://dashboard.render.com).
2. Cliquez sur **New +** puis sélectionnez **Blueprint**.
3. Connectez votre dépôt Git contenant le projet.
4. Render détectera automatiquement le fichier `render.yaml` et configurera le service avec :
   - **Type** : Static Site
   - **Build Command** : `npm run build`
   - **Publish Directory** : `dist`
   - **Règles de redirection SPA** : Définies pour rediriger toutes les requêtes vers `/index.html` pour éviter les erreurs 404 lors des rafraîchissements de page.

### Option B : Déploiement Manuel sur Render
Si vous préférez configurer le site manuellement sur le dashboard Render :
1. Créez un nouveau service **Static Site**.
2. Liez votre dépôt Git.
3. Configurez les champs suivants :
   - **Build Command** : `npm run build`
   - **Publish Directory** : `dist`
4. **Important (Routage SPA)** : Dans l'onglet **Redirects/Rewrites** de votre service sur Render, ajoutez une règle :
   - **Source** : `/*`
   - **Destination** : `/index.html`
   - **Action** : `Rewrite`
5. **Variables d'environnement** : Dans l'onglet **Environment** de Render, ajoutez la clé suivante pour activer l'envoi d'e-mail par Web3Forms en production :
   - Clé : `VITE_WEB3FORMS_ACCESS_KEY`
   - Valeur : `votre_cle_web3forms`
