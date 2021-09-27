require("dotenv").config();
//création des token d'identification pour la session
const jwt = require('jsonwebtoken');
//utilisation de bcrypt pour hachage du mot de passe
const bcrypt = require('bcrypt');
//Package crypto-js
const CryptoJS = require("crypto-js");
//connect to DB
const sql = require("../config/db.config");
//user model
const User = require("../models/user.model");
//Gestion des fichiers
const fs = require('fs');

//Crypto-js
//Password
var password = process.env.EMAIL_SECRET_TOKEN;
// Secret key pour l'email
var key = process.env.KEY;
// Initialisation vecteur
var iv = process.env.IV;
//Salt
var salt = process.env.IV;
//Encrypt email
const encryptEmail = (string) => {
  const encrypted = CryptoJS.AES.encrypt(string, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    })
  var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
  return transitmessage;
};
//Decrypt email
//Il faudra afficher ensuite decrypted.toString(CryptoJS.enc.Utf8)
const decryptEmail = (transitmessage) => {
    //var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
    var encrypted = transitmessage.substring(64);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
        iv: iv, 
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return decrypted
};

//creation nouvel utilisateur
exports.signup = (req, res, next) => {
    //on récupère le pseudo
    const pseudo = req.body.pseudo;
    //on regarde si le pseudo est déjà dans la DB
    sql.query('SELECT pseudo FROM user WHERE pseudo=?', [pseudo], (error, results, fields) => {
        //erreur lors de la selection
        if (error) {
            return res.status(500).json({ error });
        }
        // si on a un résultat, retourne un message d'erreur       
        if (results.length > 0) {
            return res.status(401).json({
                error: true,
                message: 'Ce pseudo est déjà utilisé, merci d\'en choisir un autre'
            })
        }
        //Si pas de résultat, insertion dans la DB       
        if (results.length === 0) {
            //hachage du mot de passe
            bcrypt
            .hash(req.body.password, 10) //appelle la fonction de hachage et "sale" le mdp 10 fois
            .then((hash)=> {
                //creation user
                const newUser = new User({    
                    lastname: req.body.lastname,
                    firstname: req.body.firstname,
                    pseudo: req.body.pseudo,
                    email: encryptEmail(req.body.email),
                    //email: req.body.email,
                    password: hash,
                    avatar: "http://localhost:3000/upload/default-avatar.jpg",
                    creationdate: req.body.creationdate,
                    updatedate: req.body.updatedate,
                    role: req.body.role,
                });
                // Ajout de l'utilisateur à la table user de la db
                sql.query('INSERT INTO user SET ?', newUser, (error, results, fields) => {
                    //erreur lors de l'insertion
                    if (error) {
                        return res.status(500).json({ error });
                    }
                    // insertion OK, on récupère l'id de l'insertion
                    const id = results.insertId;
                    newUser.id = id;
                    return res.status(201).json({
                        message: 'Votre compte a bien été créé. Vous pouvez maintenant vous connecter!',
                        user: newUser
                    });
                });
            });
        }
    });
};

//Connexion utilisateur existant
exports.login = (req, res, next) => {
    //on initialise le pseudo et le password (récupérés du formulaire)
    let pseudo = req.body.pseudo;
    let password = req.body.password;
    //on selectionne l'utilisateur ayant le pseudo entré
    sql.query("SELECT * FROM user WHERE pseudo = ? ", [pseudo], (error, results, fields) => {
        //Si erreur, retourne l'erreur
        if (error) {
            return res.status(500).json({ error });
        }
        //Si pas de résultat, retourne un message d'erreur
        if (results.length === 0) {
            return res.status(401).json({
                error: true,
                message: 'Le pseudo ou le mdp est invalide'
            })
        }
        // si on a un résultat, on compare le mot de passe haché de la DB avec le mot de passe entré et haché       
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password)
            .then((valid) => {
                //si le mot de passe ne correspond pas
                if (!valid) {
                  return res.status(401).json({ error: "Mot de passe incorrect !" });
                }
                //on récupère l'id, le pseudo, l'avatar et le rôle
                const userId = results[0].id;
                const pseudo = results[0].pseudo;                
                const avatar = results[0].avatar;
                const role = results[0].role;
                //si le mot de passe correspond alors création d'un token d'identification
                res.status(200).json({
                    message: 'Vous êtes maintenant connecté',
                    userId: userId,
                    pseudo: pseudo,
                    avatar: avatar,
                    role: role,
                    token: jwt.sign(
                    //id utilisateur et role
                    { userId: userId, role: role },
                    //chaîne secrète pour encoder le token
                    process.env.JWT_SECRET_TOKEN,
                    //durée de validité du token
                    { expiresIn: "24h" }
                  ),
                });
            })
            .catch((error) => res.status(500).json({ error }));
        }
    });
};

//Affichage de tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    //Selection de tous les utilisateurs de la DB
    sql.query("SELECT * FROM user",(error, results, fields) => {
        if (error) {
          return res.status(400).json(error)
        }
         // on decrypte l'email pour l'afficher en clair 
         //emailCrypted = results.email;
         //emailDecrypted = decryptEmail(emailCrypted).toString(CryptoJS.enc.Utf8);
         // on retourne la reponse
         //return res.status(200).json({ user: results, email : {emailCrypted, emailDecrypted} });
        return res.status(200).json({ results })
      }
    )
}

//Affichage du profil d'un utilisateur
exports.getProfile = (req, res, next) => {
    //on récupère l'id de l'utilisateur
    const Id = req.params.id;    
    //selection de l'utilisateur voulu
    sql.query('SELECT lastname, firstname, pseudo, email, password, sexe, avatar, birthdate, bio, DATE_FORMAT(creationdate, "%d/%m/%Y") AS user_creationdate_fr,role FROM user WHERE id=?', [Id], (error, results, fields) => {
        //si erreur, message
        if (error) {
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            // si resultat vide, message
            return res.status(401).json({ message: 'utilisateur inexistant' });
        } else {
            //sinon tableau avec la réponse
            // on decrypte l'email pour l'afficher en clair 
            emailCrypted = results[0].email;
            emailDecrypted = decryptEmail(emailCrypted).toString(CryptoJS.enc.Utf8);
            // on retourne la reponse
            return res.status(200).json({ user: results[0], email : {emailCrypted, emailDecrypted} });
        }
    });
}

//Mise à jour du profil d'un utilisateur
exports.updateProfile = (req, res, next) => {
    //on récupère l'id de l'utilisateur
    const userId = req.params.id;
    // on créé l'utilisateur d'après le modèle
    const updatedUser = req.body;
    // récupération de l'email pour le crypter
    updatedUser.email = encryptEmail(req.body.email);
    //on vérifie s'il y a un fichier multimedia, si oui on récupère et on crée le lien si non on enregistre null
    updatedUser.avatar = req.body.avatar ? `${req.protocol}://${req.get("host")}/upload/Avatars/${req.body.avatar}` : "";
    // Requête de mise à jour
    sql.query('UPDATE user SET ? WHERE id=?', [updatedUser, userId], (error, results, fields) => {
        //si erreur message
        if (error) {
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            //si resultat vide message
            return res.status(401).json({ message: 'utilisateur inexistant' });
        } else {
            //si Ok message
            return res.status(200).json({ user: results[0], message: 'utilisateur modifié' });
        }
    });
};

//Suppression d'un utilisateur
exports.deleteProfile = (req, res, next) => {
    //on récupère l'id de l'utilisateur à supprimer
    const userId = req.params.id;
    sql.query('DELETE FROM user WHERE id=?', [userId], (error, results, fields) => {
        //erreur donc message
        if (error) {
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            //resultat vide donc message
            return res.status(401).json({ message: 'utilisateur inexistant' });
        } else {
            //Ok donc message
            return res.status(200).json({ user: results[0], message: 'utilisateur supprimé' });
        }
    });
    //s'il y a un avatar, on le supprime aussi
    /*if(req.body.avatar) {
        fs.unlinkSync(`upload/${req.body.avatar}`);
    }*/
};