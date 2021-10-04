//Création du routeur express
const express = require('express');
//On enregistre les routes dans le routeur puis dans l'appli
const commentRouter = express.Router();
//importation du controller posts
const commentCtrl = require('../controllers/comments.controller');
//importation des middleware d'autorisation et de gestion des telechargements
const auth = require('../middleware/auth');

//Definition des routes pour les commentaires
commentRouter.post("/:postId/comments", auth, commentCtrl.createComment); //Creation nouveau commentaire pour le post id
commentRouter.get('/:postId/comments',auth, commentCtrl.getAllComments); //affichage de tous les commentaires
/*commentRouter.get('/comments/:userId',commentCtrl.getAllCommentsForUser); //affichage de tous les posts d'un utilisateur*/
commentRouter.get('/:postId/comments/:commentId',auth, commentCtrl.getOneComment); //affichage d'un commentaire ayant l'id id
commentRouter.patch("/:postId/comments/:commentId", auth, commentCtrl.updateComment); //mise à jour d'un commentaire
commentRouter.delete("/:postId/comments/:commentId", auth, commentCtrl.deleteComment); //suppression d'un commentaire
//commentRouter.post("/:postId/comments/:commentId/like", auth, commentCtrl.likedislikeComment); //like ou dislike d'un commentaire

module.exports = commentRouter;