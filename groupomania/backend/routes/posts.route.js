//Création du routeur express
const express = require('express');
//On enregistre les routes dans le routeur puis dans l'appli
const postRouter = express.Router();
//importation du controller posts
const postCtrl = require('../controllers/posts.controller');
//importation des middleware d'autorisation et de gestion des telechargements
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Definition des routes
postRouter.post('/',auth, multer, postCtrl.createPost); //Creation nouveau post
postRouter.get('/',auth, postCtrl.getAllPosts); //affichage de tous les posts
postRouter.get('/:id',auth, postCtrl.getOnePost); //affichage d'un post ayant l'id id
postRouter.put('/:id',auth, multer, postCtrl.updatePost);  //mise à jour d'un post
postRouter.delete('/:id',auth, postCtrl.deletePost);  //suppression d'un post
postRouter.post("/:id/like", auth, postCtrl.likedislikePost); //like ou dislike d'un post
postRouter.post("/:id/comments", auth, postCtrl.createComment); //Creation nouveau commentaire pour le post id
postRouter.put("/:id/comments/:commentId", auth, postCtrl.updateComment); //mise à jour d'un commentaire
postRouter.delete("/:id/comments/:commentId", auth, postCtrl.deleteComment); //suppression d'un commentaire
postRouter.post("/:id/comments/:commentId/like", auth, postCtrl.likedislikeComment); //like ou dislike d'un commentaire

module.exports = postRouter;