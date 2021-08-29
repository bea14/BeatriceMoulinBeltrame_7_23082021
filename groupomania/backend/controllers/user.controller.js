require("dotenv").config();
//création des token d'identification pour la session
const jwt = require('jsonwebtoken');
//utilisation de bcrypt pour hachage du mot de passe
const bcrypt = require('bcrypt');
//Package crypto-js
const cryptoJS = require("crypto-js");
//connect to DB
const sql = require("../config/db.config");
//user model
const User = require("../models/user.model");

//Crypto-js
// Secret key pour l'email
var key = cryptoJS.enc.Hex.parse(process.env.EMAIL_SECRET_TOKEN);
// Initialisation vecteur
var iv = cryptoJS.enc.Hex.parse(process.env.iv);
//Encrypt email
const encryptEmail = (string) => {
  const enc = cryptoJS.AES.encrypt(string, key, { iv: iv }).toString();
  return enc;
//Decrypt email
const decryptEmail = (string) => {
    const dec = cryptoJS.AES.decrypt(string,key, { iv: iv }).toString();
    return dec
}
};

//creation nouvel utilisateur
exports.signup = (req, res, next) => {
    //hachage du mot de passe
    bcrypt
        .hash(req.body.password, 10) //appelle la fonction de hachage et "sale" le mdp 10 fois
        .then((hash)=> {
            //creation user et enregistrement dans la base de données
            const newUser = new User({    
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                pseudo: req.body.pseudo,
                email: encryptEmail(req.body.email),
                password: hash,
                avatar: req.body.avatar,
                creationdate: req.body.date,
                updatedate: req.body.date,
                role: req.body.role,
            });
            // Ajout de l'utilisateur à la table user de la db
            sql.query('INSERT INTO user SET ?', newUser, function (error, results, fields) {
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
        })
};

//Connexion utilisateur existant
exports.login = (req, res, next) => {
    //on initialise le pseudo et le password (récupérés du formulaire)
    let pseudo = req.body.pseudo;
    let password = req.body.password;
    sql.query("SELECT * FROM user WHERE pseudo = ? ", [pseudo], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.length === 0) {
            return res.status(401).json({
                error: true,
                message: 'Le pseudo ou le mdp est invalide'
            })
        }
        //if (results[0].password) 
        if (results.length > 0) {
            bcrypt.compare(req.body.password, results[0].password)
            .then((valid) => {
                //si le mot de passe ne correspond pas
                if (!valid) {
                  return res.status(401).json({ error: "Mot de passe incorrect !" });
                }
                const userId = results[0].id;
                    const pseudo = results[0].pseudo;
                    const role = results[0].role;
                //si le mot de passe correspond alors création d'un token d'identification
                res.status(200).json({
                    message: 'Vous êtes maintenant connecté',
                    userId: userId,
                    pseudo: pseudo,
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
    sql.query("SELECT * FROM user",(error, results, fields) => {
        if (error) {
          return res.status(400).json(error)
        }
        return res.status(200).json({ results })
      }
    )
}

//Affichage du profil d'un utilisateur
exports.getProfile = (req, res, next) => {
    const Id = req.params.id;
    console.log(req.params.id)
    console.log(Id)
    sql.query('SELECT lastname, firstname, pseudo, email, password, sexe, avatar, birthdate, bio, role FROM user WHERE id=?', [Id], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            return res.status(401).json({ message: 'utilisateur inexistant' });
        } else {
            return res.status(200).json({ user: results[0] });
            //decryptage email            
            //email: decryptEmail(user.email);           
        }
    });
}

//Mise à jour du profil d'un utilisateur
exports.updateProfile = (req, res, next) => {
    const userId = req.params.id;
    const updatedUser = new User({    
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        pseudo: req.body.pseudo,
        email: encryptEmail(req.body.email),
        password: req.body.password,
        sexe: req.body.sexe,
        avatar: req.body.avatar,
        birthdate: req.body.birthdate,
        bio: req.body.bio,
        role: req.body.role
    });
    sql.query('UPDATE user SET ? WHERE id=?', [updatedUser, userId], (error, results, fields) => {
        if (error) {
            console.log(req.body);
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            return res.status(401).json({ message: 'utilisateur inexistant' });
        } else {
            return res.status(200).json({ user: results[0], message: 'utilisateur modifié' });
        }
    });
};

//Suppression d'un utilisateur
exports.deleteProfile = (req, res, next) => {
    const userId = req.params.id;
    sql.query('DELETE FROM user WHERE id=?', userId, (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            return res.status(401).json({ message: 'utilisateur inexistant' });
        } else {
            return res.status(200).json({ user: results[0], message: 'utilisateur supprimé' });
        }
    });
};