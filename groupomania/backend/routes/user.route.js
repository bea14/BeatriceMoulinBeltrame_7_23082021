//Création du routeur express
const express = require('express');
//On enregistre les routes dans le routeur puis dans l'appli
const userRouter = express.Router();
//importation du controller user
const userCtrl = require('../controllers/user.controller');
//importation des middleware d'autorisation et de gestion des telechargements
const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");

//Definition des routes
userRouter.post('/signup', userCtrl.signup); //creation nouvel utilisateur
userRouter.post('/login', userCtrl.login); //connexion utilisateur existant
userRouter.get('/profile', userCtrl.getAllUsers); //affichage de tous les utilisateurs
userRouter.get('/profile/:id', userCtrl.getProfile); //affichage du profil d'un utilisateur
userRouter.patch('/profile/:id', multer, userCtrl.updateProfile); //mise à jour du profil d'un utilisateur
userRouter.delete('/profile/:id', userCtrl.deleteProfile); //suppression d'un utilisateur

module.exports = userRouter;