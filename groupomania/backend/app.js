//Permet de créer un environnement de variables
require("dotenv").config(); 
// Ajout du framework express au projet
const express = require("express");
//Ajout de Helmet pour sécuriser les entêtes
const helmet = require("helmet");
// Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier.
const path = require("path");

//importation des fichiers routes
const postRoutes = require("./routes/posts.route");
const userRoutes = require("./routes/user.route");

const app = express();

// ajout d'un middleware, qui sera le premier à être executé par le server, il sera appliqué à toutes les routes, toutes les requêtes envoyées à notre server.
// correction des erreurs de CORS
app.use((req, res, next) => {
  // Permet l'accès à l'API depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    // Authorisation d'utiliser certains en-tête dans l'objet requête
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    //Permet l'utilisation des méthodes définies ci-dessous
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  //res.setHeader("Content-Security-Policy", "default-src 'self'");
  next(); // pour passer au middleware qui suit
});

//Applique les sous-plugins de helmet
app.use(helmet());

//Permet de récupérer le corps de la requête au format json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));

//routes
//express doit gérer la ressource telechargée de manière statique
app.use("/upload", express.static(path.join(__dirname, "upload")));
//Sert les routes concernant les sauces pour toute demande vers le endpoint /api/users
app.use("/api/users", userRoutes);
//Sert les routes concernant les utilisateurs pour toute demande vers le endpoint /api/topics
app.use("/api/topics", postRoutes);

module.exports = app;
