//Création du routeur express
const express = require('express');
//On enregistre les routes dans le routeur puis dans l'appli
const postRouter = express.Router();
//importation du controller posts
const postCtrl = require('../controllers/comments.controller');
//importation des middleware d'autorisation et de gestion des telechargements
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Definition des routes pour les commentaires
postRouter.post("/comments", postCtrl.createComment); //Creation nouveau commentaire pour le post id
postRouter.get('/comments',postCtrl.getAllComments); //affichage de tous les commentaires
postRouter.get('/comments/:userId',postCtrl.getAllCommentsForUser); //affichage de tous les posts d'un utilisateur
postRouter.get('/comments/:id',postCtrl.getOneComment); //affichage d'un commentaire ayant l'id id
postRouter.put("/comments/:id", postCtrl.updateComment); //mise à jour d'un commentaire
postRouter.delete("/comments/:id", postCtrl.deleteComment); //suppression d'un commentaire
postRouter.post("/comments/:id/like", postCtrl.likedislikeComment); //like ou dislike d'un commentaire

module.exports = postRouter;