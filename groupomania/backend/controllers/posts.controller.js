//Connexion à la DB
const sql = require("../config/db.config");
//Modèle des posts
const Post = require("../models/posts.model");
//Modèle des commentaires
const Vote = require("../models/votes.model");
//Gestion des fichiers
const fs = require('fs');

//Creation nouveau post
exports.createPost = (req, res,next) => {
    // on récupère les données envoyées par le front
    let postData = req.body;
    //on vérifie s'il y a un fichier multimedia, si oui on récupère le lien si non on enregistre null
    postDatamedia_url = req.file ? `${req.protocol}://${req.get("host")}/upload/${req.file.filename}` : null;
    // Creation d'un post depuis le modèle
    const newPost = new Post({
        //Utilise l'opérateur spread pour copier les infos du corps de la requête
        ...postData,
        //On génère l'url de l'image par rapport à son nom de fichier
        media_url:postDatamedia_url
      });
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
            //post: newPost
        });
    });
};

//Affichage de tous les posts par odre décroissant d'id (en gros du plus récent au plus ancien)
exports.getAllPosts = (req, res, next) => {
    //Selection de tous les posts de la DB
    sql.query('SELECT topics.id,topics.title,topics.content,topics.media_url, topics.creationdate, DATE_FORMAT(topics.creationdate, "%d/%m/%Y") AS post_date_fr, topics.tag, topics.isreported, DATE_FORMAT(topics.isreporteddate, "%d/%m/%Y") AS post_reportingdate_fr, user.pseudo, user.avatar FROM topics INNER JOIN user ON topics.author = user.id ORDER BY topics.creationdate DESC', (error, results, fields) => {
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
    sql.query('SELECT topics.id,topics.title,topics.content, topics.media_url, DATE_FORMAT(topics.creationdate, "%d/%m/%Y") AS post_date_fr, topics.tag, topics.isreported, user.pseudo FROM topics INNER JOIN user ON topics.author = user.id  WHERE topics.id=? ORDER BY topics.id DESC',[userId], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ error });
        }
        return res.status(200).json({ post: results[0] });
    });
}

//Affichage d'un post ayant l'id Id
exports.getOnePost = (req, res, next) => {
    //On récupère l'id du post
    const Id = req.params.id;
    //selection du post voulu
    sql.query('SELECT id,title,content, media_url, author, DATE_FORMAT(updatedate, "%d/%m/%Y") AS post_date_fr,tag,isreported FROM topics WHERE id=?', [Id],(error, results, fields) => {
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
    //on vérifie s'il y a un fichier multimedia, si oui on récupère le lien si non on recupère juste la requête
    const updatedPost = req.file ? {...req.body, media_url:`${req.protocol}://${req.get("host")}/upload/${req.file.filename}`}:{...req.body};
    //on met à jour dans la DB le post
    sql.query('UPDATE topics SET ? WHERE id=?', [updatedPost, postId], (error, results, fields) => {
        if (error) {
            console.log(req.body);
            return res.status(500).json({ error });
        } else if (results.length === 0) {
            return res.status(401).json({ message: 'post inexistant' });
        } else {
            //return res.status(200).json({ posts: results[0], message: 'post modifié' });
            return res.status(200).json({ message: 'post modifié' });
        }
    });
}

//Suppression d'un post ayant l'id postId
exports.deletePost = (req, res, next) => {
    //on récupère l'id du post à supprimer
    const postId = req.params.id;
    let filename = "";
    //Selection de l'image du post à supprimer
    sql.query('SELECT media_url FROM topics WHERE id=?',[postId], (error, results, fields) => {
        if (results.length > 0) {
            results[0].media_url != null ? filename = results[0].media_url.split("/upload/")[1] : "";
            //supression du fichier du dossier images
            fs.unlink(`upload/${filename}`, () => { 
                //requete DELETE
                sql.query('DELETE FROM topics WHERE id=?', [postId], (error, results, fields) => {
                    if (error) {
                        return res.status(500).json(error.message);
                    }
                    res.status(200).json({ message: "Post supprimé !" });
                });
            });
        } else {
            //requete DELETE
            sql.query('DELETE FROM topics WHERE id=?', [postId], (error, results, fields) => {
                if (error) {
                    return res.status(500).json({ error });
                }
                return res.status(200).json({ message: 'post supprimé' });
            });
        }
        if (error) {
            return res.status(500).json(error.message);
        }  
    }); 
};

//creation ou modification like ou dislike d'un post
exports.likeDislikePost = (req, res,next) => {
    //on récupère l'id du post à supprimer
    const postId = req.params.id;
    // on récupère les données envoyées par le front    
    let voteData = req.body;
    let vote = voteData.likedislike;
    const userId = req.body.user;
    sql.query('INSERT INTO topicsvotes (likedislike, user, topic) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `likedislike`=?', [vote,userId,postId,vote], (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error });
      }
      return res.status(200).json({ message: 'Compteurs de likes mis à jour !' });
    }); 
}

//get like ou dislike d'un post
exports.getLikeDislikePost = (req, res,next) => {
    //on récupère l'id du post à récupérer
    const postId = req.params.id;
    sql.query('SELECT topicsvotes.id,topicsvotes.likedislike,topicsvotes.user, topicsvotes.topic, user.pseudo FROM topicsvotes INNER JOIN user ON topicsvotes.user = user.id WHERE topic=?',[postId],(error, results, fields) => {
      if (error) {
        return res.status(500).json({ error });
      }
      return res.status(200).json({ like: results });
    }); 
}