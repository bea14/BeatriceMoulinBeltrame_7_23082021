//vérification de l'authentification du user avant l'autorisation de l'envoi des requêtes
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res, next) => {  
    try {
        const token = req.headers.authorization.split(' ')[1]; //extrait le token de l'authorisation de la requete entrante
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); //décode le token, si invalide, une erreur sera générée
        const id = decodedToken.userId; //extrait l'id utilisateur du token
        const role = decodedToken.role;
        //comparaison entre l'ID du token et l'ID de la demande
        if (req.body.userId && req.body.userId !== id) {
            //si invalide génère une erreur
            throw "Invalid user ID";
            //si valide alors la suite du code peut s'executer
        } else {
            let userIsAdmin = false;
            if (role == 1 || role == 2) {
                userIsAdmin = true;
            }
            userIsAuthorized = true;
            next(); //utilisateur authentifié, on passe à la suite
        }
    } catch {
        res.status(401).json({
        error: new Error("Invalid request!"),
        });
    }
};
