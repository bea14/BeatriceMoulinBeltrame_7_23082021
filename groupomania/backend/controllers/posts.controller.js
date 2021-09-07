//Connexion à la DB
const sql = require("../config/db.config");
//Modèle des posts
const Post = require("../models/posts.model");
//Modèle des commentaires
const Comment = require("../models/comments.model");
//Gestion des fichiers
const fs = require('fs');

//Creation nouveau post
exports.createPost = (req, res,next) => {
    // on récupère les données envoyées par le front
    let postData = req.body;
    //on vérifie s'il y a un fichier multimedia, si oui on récupère le lien si non on enregistre null
    //postData.media_url = req.file ? req.file.filename : null;
    //postData.media_url = req.body.media_url ? `${req.protocol}://${req.get("host")}/upload/${req.file.filename}` : null;
    // Creation d'un post depuis le modèle
    let newPost = new Post(postData);
    // Insertion du post dans la DB
    sql.query('INSERT INTO topics SET ?', newPost, (error, results, fields) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
        // insertion OK
        const id = results.insertId;
        newPost.id = id;
        return res.status(200).json({
            message: 'post créé',
            post: newPost
        });
    });
};

//Affichage de tous les posts par odre décroissant d'id (en gros du plus récent au plus ancien)
exports.getAllPosts = (req, res, next) => {
    //Selection de tous les posts de la DB
    sql.query('SELECT topics.id,topics.title,topics.content, topics.media_url, DATE_FORMAT(topics.creationdate, "%d/%m/%Y") AS post_date_fr, topics.tag, user.pseudo FROM topics INNER JOIN user ON topics.author = user.id ORDER BY topics.id DESC', (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        }
        return res.status(200).json({ post: results });
    });
}

//Affichage de tous les posts par odre décroissant d'id (en gros du plus récent au plus ancien) par utilisateur
exports.getAllPostsForUser = (req, res, next) => {
    //on récupère l'id de l'utilisateur
    const userId = req.body.userId;    
    //Selection de tous les posts de la DB
    sql.query('SELECT topics.id,topics.title,topics.content, topics.media_url, DATE_FORMAT(topics.creationdate, "%d/%m/%Y") AS post_date_fr, user.pseudo FROM topics INNER JOIN user ON topics.author = user.id  WHERE topics.id=? ORDER BY topics.id DESC',[userId], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        }
        return res.status(200).json({ post: results });
    });
}

//Affichage d'un post ayant l'id Id
exports.getOnePost = (req, res, next) => {
    //On récupère l'id du post
    const Id = req.params.id;
    //selection du post voulu
    sql.query('SELECT id,title,content, media_url, author, DATE_FORMAT(updatedate, "%d/%m/%Y") AS post_date_fr,tag FROM topics WHERE id=?', [Id],(error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        }
        return res.status(200).json({ post: results });
    });
}

//Mise à jour d'un post ayant l'id postId
exports.updatePost = (req, res, next) => {
    //on récupère l'id du post à mettre à jour
    const postId = req.params.id;
     // on récupère les données envoyées par le front
     let updatedPost = req.body;
    //on met à jour dans la DB le post
    sql.query('UPDATE topics SET ? WHERE id=?', [updatedPost, postId], (error, results, fields) => {
        if (error) {
            console.log(req.body);
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            return res.status(401).json({ message: 'post inexistant' });
        } else {
            return res.status(200).json({ user: results[0], message: 'post modifié' });
        }
    });
}

//Suppression d'un post ayant l'id postId
exports.deletePost = (req, res, next) => {
    //on récupère l'id du post à supprimer
    const postId = req.params.id;
    //on recupère l'id de l'utilisateur
    const userId = req.body.userId;
    //if (userIsAdmin || userIsAuthorized) {
        sql.query('DELETE FROM topics WHERE id=?', [postId], (error, results, fields) => {
            if (error) {
                return res.status(500).json({ error });
            }
            return res.status(200).json({ message: 'post supprimé' });
        })
    //}
    if(req.body.media_url) {
        fs.unlinkSync(`upload/${req.body.media_url}`);
    }
};

//like ou dislike d'un post
exports.likedislikePost = (req, res,) => {
    sql.query('SELECt * FROM topicsvotes WHERE id=?', [postId], (error, results, fields) => {
        switch (req.body.like) {
          case -1: //clic sur dislike
            //on regarde si le userId est présent dans lla colonne dislike, si non on le push
            if (sauce.usersDisliked.indexOf(req.body.userId) === -1) {
              sauce.usersDisliked.push(req.body.userId);
            }
            break;
  
          case 1: //clic sur like
            //on regarde si le userId est présent dans la tableau usersLiked, si non on le push
            if (sauce.usersLiked.indexOf(req.body.userId) === -1) {
              sauce.usersLiked.push(req.body.userId);
            }
            break;
          case 0: //annule like ou dislike
            //on regarde si le userId est présent dans la tableau usersDisliked, si oui on le splice
            if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
              sauce.usersDisliked.splice(
                sauce.usersDisliked.indexOf(req.body.userId, 1)
              );
            }
            //on regarde si le userId est présent dans la tableau usersLiked, si oui on le splice
            if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
              sauce.usersLiked.splice(
                sauce.usersLiked.indexOf(req.body.userId, 1)
              );
            }
            break;
          default:
            return res.status(400).json({ error: "Valeur de like invalide !" });
        }
        //Affichage  du nombre de loke et de dislike
        sauce.likes = sauce.usersLiked.length;
        sauce.dislikes = sauce.usersDisliked.length;
        sauce
          .save()
          .then(() =>
            res.status(200).json({ message: "Compteurs de likes mis à jour !" })
          )
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(400).json({ error }));
}