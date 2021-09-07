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
postRouter.post('/', multer, postCtrl.createPost); //Creation nouveau post
postRouter.get('/',postCtrl.getAllPosts); //affichage de tous les posts
/*postRouter.get('/:id',postCtrl.getAllPostsForUser); //affichage de tous les posts d'un utilisateur*/
postRouter.get('/:id', postCtrl.getOnePost); //affichage d'un post ayant l'id id
postRouter.patch('/:id',multer, postCtrl.updatePost);  //mise à jour d'un post
postRouter.delete('/:id',postCtrl.deletePost);  //suppression d'un post
postRouter.post('/:id/like',postCtrl.likedislikePost); //like ou dislike d'un post

module.exports = postRouter;