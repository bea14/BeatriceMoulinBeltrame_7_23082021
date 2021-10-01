//vérification de l'authentification du user avant l'autorisation de l'envoi des requêtes
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res, next) => {  
    try {
        const token = req.headers.authorization.split(' ')[1]; //extrait le token de l'authorisation de la requete entrante
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN); //décode le token, si invalide, une erreur sera générée
        const id = decodedToken.userId; //extrait l'id utilisateur du token
        //comparaison entre l'ID du token et l'ID de la demande
        /*if (req.body.userId && req.body.userId !== id) {
            //si invalide génère une erreur
            throw "Invalid user ID";
            //si valide alors la suite du code peut s'executer
        } else {
            next(); //utilisateur authentifié, on passe à la suite
        }*/
        next();
    } catch {
        res.status(401).json({
        error: new Error("Invalid request!"),
        });
    }
};
