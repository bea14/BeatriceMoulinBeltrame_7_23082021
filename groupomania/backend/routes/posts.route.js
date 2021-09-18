//Création du routeur express
const express = require('express');
//On enregistre les routes dans le routeur puis dans l'appli
const postRouter = express.Router();
//importation du controller posts
const postCtrl = require('../controllers/posts.controller');
//importation des middleware d'autorisation et de gestion des telechargements
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Definition des routes pour les posts
postRouter.post('/', auth, multer, postCtrl.createPost); //Creation nouveau post
postRouter.get('/',auth, postCtrl.getAllPosts); //affichage de tous les posts
/*postRouter.get('/:id',postCtrl.getAllPostsForUser); //affichage de tous les posts d'un utilisateur*/
postRouter.get('/:id', auth, postCtrl.getOnePost); //affichage d'un post ayant l'id id
postRouter.patch('/:id',auth, multer, postCtrl.updatePost);  //mise à jour d'un post
postRouter.delete('/:id',auth, postCtrl.deletePost);  //suppression d'un post
postRouter.post('/:id/like',auth, postCtrl.likeDislikePost); //creation ou changement like ou dislike d'un post
postRouter.get('/:id/like/',auth, postCtrl.getLikeDislikePost); //affichage like ou dislike d'un post

module.exports = postRouter;