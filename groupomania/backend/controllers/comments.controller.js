//Connexion à la DB
const sql = require("../config/db.config");
//Modèle des commentaires
const Comment = require("../models/comments.model");
//Gestion des fichiers
const fs = require('fs');


//Creation nouveau commentaire pour le post id
exports.createComment = (req, res, next) => {    
    const postId = req.params.postId;
    // Creation du commentaire à partir du modele
    let newComment = new Comment(req.body);
    // Insertion du commentaire dans la DB
    sql.query('INSERT INTO comments SET ?', [newComment], (error, results, fields) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
        // DB ok
        const id = results.insertId;
        newComment.id = id;
        return res.status(200).json({
            message: 'commentaire créé',
            comment: newComment
        });
    });
}

//Affichage de tous les commentaires d'un post, on récupère le pseudo de l'auteur
exports.getAllComments = (req, res,) => {
    const postId = req.params.postId;
    sql.query('SELECT comments.id, comments.author, comments.topic, comments.content,DATE_FORMAT(comments.updatedate, "%d/%m/%Y") AS comment_date_fr, comments.isreported, DATE_FORMAT(comments.isreporteddate, "%d/%m/%Y") AS comment_reportingdate_fr, user.pseudo, user.avatar FROM comments INNER JOIN user ON comments.author = user.id  WHERE topic=? ORDER BY comments.id', [postId], function (error, results, fields) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error });
        } else {
            return res.status(200).json({ comments: results });
        }
    });
}

//Affichage d'un commentaire ayant l'id id 
exports.getOneComment = (req, res, next) => {
    //on récupère l'id du post
    const postId = req.params.postId;
    //on récupère l'id du commentaire à afficher
    const commentId = req.params.commentId;
    sql.query('SELECT * FROM comments WHERE topic=? AND id=? ORDER BY comments.id DESC ', [postId,commentId], (error, results, fields) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error });
        } else {
            return res.status(200).json({ comments: results });
        }
    });
}

//Affichage de tous les commentaires d'un user
exports.getAllCommentsForUser = (req, res,) => {
    const userId = req.params.userId;
    sql.query('SELECT comments.*, user.pseudo FROM comments INNER JOIN user ON comments.author = user.id  WHERE author=? ORDER BY comments.id DESC ', userId, function (error, results, fields) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error });
        } else {
            return res.status(200).json({ comments: results });
        }
    });
}

//Mise à jour d'un commentaire
exports.updateComment = (req, res,) => {
    //On récupère l'id du commentaire
    const commentId = req.params.commentId; 
    //on récupère les données envoyées par le front
    const updatedComment = req.body;
    //on met à jour dans la DB le commentaire
    sql.query('UPDATE comments SET ? WHERE id=?', [updatedComment, commentId], (error, results, fields) => {
        if (error) {
            console.log(req.body);
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            return res.status(401).json({ message: 'commentaire inexistant' });
        } else {
            return res.status(200).json({ user: results[0], message: 'commentaire modifié' });
        }
    });
}

//Suppression d'un commentaire
exports.deleteComment = (req, res,) => {
    //on recupère l'id du commentaire
    const commentId = req.params.commentId;
    //on recupère l'id de l'utilisateur
    const userId = req.body.userId;
    sql.query('DELETE FROM comments WHERE id=?', [commentId], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        }
        return res.status(200).json({ message: 'commentaire supprimé' });
    })
}
