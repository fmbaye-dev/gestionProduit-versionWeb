# Gestion des Produits – Application Web Node.js

## Description

Cette application web permet de gérer les produits d’un magasin :
- ajout, modification et suppression de produits
- gestion du stock
- vente de produits avec historique
- recherche multicritère
- affichage dynamique avec EJS

Le projet est développé avec **Node.js**, **Express**, **MySQL** et **EJS**.

---

## 🛠️ Technologies utilisées

- **Node.js**
- **Express.js**
- **MySQL**
- **EJS** (moteur de template)
- **HTML / CSS**
- **Nodemon** (développement)

---

## Structure du projet

tp-magasin/  
├── server.js  
├── package.json    
├── public/  
│ ├── style.css  
│ └── base.css  
└── views/  
├── index.ejs  
├── ajouter.ejs  
├── modifier.ejs  
├── recherche.ejs  
└── vente.ejs  

---

## Installer les dépendances

- **npm install**

### Lancer le serveur

- npm run start-dev
- L’application sera accessible sur :
http://localhost:3000

---

## Base de données

**Table produits** 

Champ	     | Type	          | Description
---------- |----------------|--------------------
id         | INT	          | Clé primaire
nom	       | VARCHAR(100)   | Nom du produit
prix	     | INT            |	Prix en FCFA
quantite   | INT	          | Quantité en stock
categorie  | VARCHAR(50)	  | Catégorie
date_ajout | TIMESTAMP	    | Date d’ajout

**Table ventes**

Champ	     | Type	     | Description
-----------|-----------|--------------------
id	       | INT	     | Clé primaire
idProduit	 | INT	     | Produit vendu
quantite	 | INT	     | Quantité vendue
prixTotal	 | INT    	 | Prix total
date_vente | TIMESTAMP | Date de vente

---

## Fonctionnalités

### Accueil

- Liste de tous les produits
- Indicateur visuel pour les produits en rupture
- Boutons **Modifier** , **Supprimer** et **Vendre**
- Suppression autorisée uniquement si quantité = 0
- Vente autorisée uniquement si quantité != 0

### Ajouter un produit

- Formulaire avec validations serveur :
- tous les champs obligatoires
- prix > 0
- quantité ≥ 0
- Message de confirmation

### Modifier un produit

- Formulaire pré-rempli
- Validations identiques à l’ajout
- Gestion du produit introuvable (404)

### Recherche multicritère

- Filtrer par :
- catégorie
- prix min / max
- produits en stock uniquement
- Combinaison des critères
- Bouton de réinitialisation

### Vente de produit

- Vente uniquement si stock suffisant
- Mise à jour automatique du stock
- Historique des ventes
- Affichage de la date et heure formatées

### Règles importantes

- Impossible de supprimer un produit avec stock > 0
- Impossible de vendre plus que le stock disponible
- Messages de succès et d’erreur affichés sur la même page

---

## Auteur

**Fatou Gaye Mbaye**  
Étudiante en développement backend
Projet académique Node.js / Express / MySQL

## Licence

Projet à but pédagogique  
Libre d’utilisation pour l’apprentissage  
