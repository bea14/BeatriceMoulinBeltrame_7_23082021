# openclassrooms-dw-projet-7
Code source du Projet 7 de la formation Développeur Web d'OpenClassrooms, intitulé "Créez un réseau social d'entreprise"

## Compétences évaluées :
- Personnaliser le contenu envoyé à un client web
- Authentifier un utilisateur et maintenir sa session
- Gérer un stockage de données à l'aide de SQL
- Implémenter un stockage de données sécurisé en utilisant SQL

## Le projet
Vous êtes développeur depuis plus d'un an chez CONNECT-E, une petite agence web regroupant une douzaine d'employés.
Votre directrice, Stéphanie, invite toute l'agence à prendre un verre pour célébrer une bonne nouvelle ! Elle vient de signer un contrat pour un nouveau projet ambitieux ! 🥂
Le client en question est Groupomania, un groupe spécialisé dans la grande distribution et l'un des plus fidèles clients de l'agence.
Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues. Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et a imaginé plusieurs briques pour favoriser les échanges entre collègues.

## Modalités
- base de données relationnelles qui se manipule avec le langage SQL pour le stockage de données. 
- L’utilisateur doit pouvoir requêter les données requises depuis SQL et soumettre ces changements à la base de données SQL. 
- Les données de connexion doivent également être sécurisées. 
- La web app peut se connecter et se déconnecter à l’application et la session de l’utilisateur persiste pendant qu’il est connecté.
- Framework Front-End au choix (React, Vue, Angular, Ember, Meteor, Aurelia...). 
- Le projet doit être codé en Javascript.
- Les pages devront respecter les standards WCAG.

## Environnement
* framework : Vuejs et Express ;
* serveur : NodeJS ;
* base de données : SQL ;
* SASS

## Installation
* Cloner ce dossier ou télecharger le fichier zip du dossier
* Installer Node.js
* Installer Vue.js
* Installer MySQL
* Renommer le fichier backend\.env.exemple en backend\.env et le compléter avec vos données
* Importer la base de données : récupérer le fichier DB\ModeleGoupomaniaDB.sql et l'importer dans MySQL

## Lancement frontend
* se placer dans le dossier frontend
* npm install
* npm run serve
* Le serveur doit fonctionner sur [`http://localhost:8000/`](http://localhost:8080/)


## Lancement backend
* se placer dans le dossier backend
* npm install
* node server
* Le serveur doit fonctionner sur [`http://localhost:3000/`](http://localhost:3000/)

## Lancement appli
* Ouvrez votre navigateur et allez sur : [`http://localhost:8080`](http://localhost:8080)

#### Administrateur/Modérateur

* Pour administrer les posts, deux rôles administrateur et modérateur existent. Il faut les attribuer via la DB sql.
* Aller dans votre base groupomania, ouvrez la table users (cela suppose que vous avez déjà créé des utilisateurs sinon il faudra le faire).
* Modifier le role en 1 (modérateur) ou 2 (administrateur) ou utiliser le fichier DB/setAdmin.sql qui permet de donner un rôle d'administrateur au premier utilisateur créé
