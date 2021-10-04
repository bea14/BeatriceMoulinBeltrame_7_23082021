<template>
  <div class="postpreview">   
    <div class="post-content">
      <div class="card">
        <div class="card-header">
          <div class="card-header-top">
            Proposé par 
            <span><strong> {{ postData.pseudo }}</strong></span>
            <img
              class=" card-header-top-img"
              :src="`${postData.avatar}`"
              alt="avatar de l'utilisateur"
              width="30px"
            />
          </div>
          <div class="card-header-bottom">
            <span>Le {{ postData.post_date_fr }}</span>
            <div class="card-header-buttons">
              <!--Bouton de suppression -->
              <button type="button" value="Supprimer le post" aria-label="Supprimer l'article" v-if="postData.pseudo == this.pseudo || userIsAdmin" class="card-button" @click.prevent="deletePost()">
                <i class="fa fa-trash-alt" aria-hidden="true">
                  &nbsp;&nbsp;
                </i>
                <span class="sr-only">
                  Supprimer l'article
                </span>
              </button>
              <!--Bouton de mise à jour-->
              <router-link :to="{ name: 'UpdatePost', params: { id: postData.id } }">
                <button v-if="postData.pseudo == this.pseudo" class="card-button" aria-label="Modifier l'article">
                <i class="fas fa-edit" aria-hidden="true">
                  &nbsp;&nbsp;
                </i>
                <span class="sr-only">
                  Modifier l'article
                </span>
                </button>
              </router-link>
              <!--Bouton de signalement -->
              <button class="card-button" @click.prevent="reportPost(postData.id)" aria-label="Signaler l'article">
                <i class="fa fa-exclamation-triangle" aria-hidden="true">
                  &nbsp;&nbsp;
                </i>                
                <span class="sr-only">
                  Signaler l'article
                </span>
              </button>
            </div>
            <div v-if="reportedValue()">                
              <i class="fa fa-flag fa-2x red-color" aria-hidden="true"></i> 
            </div>
          </div>
        </div>
        <div class="card-body">
          <!--Affichage Image/Media-->
          <!--Si Image-->
          <div class="card-body-image" v-if="thereIsImage">
            <img :src="`${postData.media_url}`" alt="image du post" />
          </div>
          <!--Si Video-->
          <div class="card-body-video" v-if="thereIsVideo">
            <video aria-label="vidéo partagée par l'utilisateur, cliquer ici pour la lire" controls>
              <source
                type="video/mp4"    
                :src="`${postData.media_url}`">
              Your browser does not support the video tag.
            </video>
          </div>
          <!-- Titre du post + catégorie -->
          <div class="card-body-title">        
            <h2>{{ postData.title }}</h2>
            <span v-if="postData.tag != null || postData.tag != ''" :class="{badge : postData.tag}"> {{ postData.tag }} </span>
          </div>        
          <!--Contenu du post-->
          <div class="card-body-text">
            <p v-if="checkLink(postData.content)" class="card-body-text-content">
              <a :href="`${postData.content}`" target="_blank">{{ postData.content }}</a>
            </p>
            <p v-else class="card-body-text-content">
              {{ postData.content }}
            </p>
          </div>          
        </div>
        <div class="card-footer">
          <div class="card-footer-items">
            <!--Compte les commentaires-->
            <div @click="switchCommentMode()">
              {{ commentCount(postData.id).length }}
              <i class="fas fa-comment" aria-hidden="true"></i>
            </div>            
            <!--Liens pour partager et enregistrer le post (pas fonctionnels pour l'instant-->
            <div class="inactive">
              <i class="fas fa-share" aria-hidden="true"></i>
              <span>Partager</span>
            </div>
            <div class="inactive">
              <i class="fas fa-bookmark" aria-hidden="true"></i>
              <span>Enregistrer</span>
            </div>
          </div>
          <!--Votes-->
          <div class="votes">
            <span @click="likeDislikeChange(true)">
              <i class="fas fa-thumbs-up" aria-hidden="true" :id="`like-${this.postData.id}`"></i>
              {{ likeCount(postData.id).length }}
            </span>
            <span @click="likeDislikeChange(false)">
              <i class="fas fa-thumbs-down" aria-hidden="true" :id="`dislike-${this.postData.id}`"></i>
              {{ dislikeCount(postData.id).length }}
            </span>
          </div>
        </div>
        <!--Affichage des commentaires si on a cliqué sur le nombre de commentaires-->        
        <div v-if="commentMode" class="comment-box" :key="commentMode">
          <div v-if="commentCount(postData.id).length != 0">
            <CommentsView v-for="comment in allComments" :key="comment.id" :commentData="comment" :postId="`${postData.id}`" />
          </div>
          <div class="FormTextInput">
            <img :src="`${this.avatar}`" width="40px">
            <input                   
              type="text"
              id="createCommentInput"
              name="create-comment"
              placeholder="Ecrivez un commentaire..."
              required="required"
              v-model="commentcontent"
              onfocus="if(value !== '') {value=''}"
              @keyup.enter="createComment(); getComments();"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
//import Modal from "../modal.vue";
import CommentsView from "../posts/postsComments.vue";

export default {
  components: {
    //Modal,
    CommentsView,
  },
  props: ["postData"],
  data() {
    const pseudo = sessionStorage.getItem("pseudo");
    const userId = sessionStorage.getItem("userId");
    const avatar = sessionStorage.getItem("avatar");
    let userIsAdmin = this.functionUserIsAdmin();
    return {
      commentMode: "",
      commentcontent: "",
      comments: [],
      thereIsImage: null,
      thereIsVideo: null,
      allComments: [],
      allLikes:[],
      avatar,
      pseudo,
      userId,
      userIsAdmin,
      postId: ""
    };
  },
  mounted() {
    this.getComments();
    this.isThereMedia();
    this.functionUserIsAdmin();
    this.getLikeDislikePost();
  },
  methods: {
    /*******Fonctions générales*******/
    //Permet de savoir si l'utilisateur est modérateur ou administrateur
    functionUserIsAdmin(){
      const role = sessionStorage.getItem('role') || 0;
      let userIsAdmin = false;
      if (role == 1 || role ==2) {
        userIsAdmin = true
        return userIsAdmin
      }
    },
    //On récupère le vote pour chaque post pour le user
    likedislikealreadyvoted(){
       //like status : default 0, -1 for dislike and +1 for like
      let userId = sessionStorage.getItem("userId");
      let Voted = 0;
      //Regarde si user a un like sur ce post
      const userLike = this.allLikes.filter((item) => item.user == userId && item.topic == this.postData.id && item.likedislike == 1);
      //Regarde si  un user a un dislike sur ce post
      const userDislike = this.allLikes.filter((item) => item.user == userId && item.topic == this.postData.id && item.likedislike == -1);
      //Regarde si vote neutre ou null sur ce post
      const userNeutral = this.allLikes.filter((item) => item.user == userId && item.topic == this.postData.id && item.likedislike == 0);
      if (userLike.length != 0) {
        Voted = 1;        
      }
      if (userDislike.length != 0) {
        Voted = -1;
      }
      if (userNeutral.length != 0) {
        Voted = 0;
      }
      return Voted
    },
    //Permet de récupérer le nouveau like ou dislike
    likeDislikeChange(like){   
      //like status : default 0, -1 for dislike and +1 for like
      //on récupère la valeur du likedislike déjà enregistrée dans la DB pour le user
      let Voted = this.likedislikealreadyvoted();
      //si clic sur like
      if (like) {
        //si like déjà validé, on annule
        if (Voted == "1") {      
          Voted = 0;
        }
        //sinon on ajoute
        else {      
          Voted = 1;
        }
      }
      //si clic sur dislike
      else {
        //si dislike déjà validé, on annule
        if (Voted == -1) {
          Voted = 0;;
        }
        //sinon on ajoute
        else {        
         Voted = -1;
        }
      }
      let vote = Voted;
      //mise à jour des like/dislike
      this.updateLikeDislikePost(vote)
    },
    //récupère les like/dislike d'un article
    getLikeDislikePost(){      
      const token = sessionStorage.getItem("token");
      const postId= this.postData.id;
      axios
      .get(`http://localhost:3000/api/topics/`+postId+`/like`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => { 
        this.allLikes = response.data.post;
        return (this.allLikes = response.data.post)
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
    },
    //met à jour les like/dislike d'un article
    updateLikeDislikePost(vote){      
      const token = sessionStorage.getItem("token");
      const postId = this.postData.id;
      const userId = sessionStorage.getItem("userId");
      const likedislikevote = {likedislike: vote, user: userId, topic: postId};
      axios
      .post(`http://localhost:3000/api/topics/`+postId+`/like`, likedislikevote,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {    
        console.log('les like dislikes ont été mis à jour')
        console.log(response);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
    },
    //Compte le nombre de like pour un article
    likeCount(id) {
      let selectedpost = "like-";
      selectedpost += id;
      let pseudo = sessionStorage.getItem("pseudo");
      const likeCount = this.allLikes.filter((like) => like.topic == id && like.likedislike == 1);
      const likeCountId = likeCount.findIndex((like) => like.pseudo === pseudo);
      likeCountId != -1 ? document.getElementById(selectedpost).style.color= 'blue' : '';
      return likeCount;
    },
    //compte le nombre de dislike pour un article 
    dislikeCount(id) {
      let selectedpost="dislike-" 
      selectedpost += id;      
      let pseudo = sessionStorage.getItem("pseudo");
      const dislikeCount = this.allLikes.filter((dislike) => dislike.topic == id && dislike.likedislike == -1);
      const dislikeCountId = dislikeCount.findIndex((dislike) => dislike.pseudo === pseudo);
      dislikeCountId != -1 ? document.getElementById(selectedpost).style.color= 'red' : '';
      return dislikeCount;
    },
    //Est-ce qu'il y a un media
    isThereMedia() {
      if (this.postData.media_url) {
        let extension = this.postData.media_url.split(".").pop();
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png"
        ) {
          this.thereIsImage = true;
        } else if (extension === "mp4") {
          this.thereIsVideo = true;
        }
      }
    },
    /*******Commentaires*******/
    //Permet de dire si on affiche les commentaires
    switchCommentMode(){
      let switched ="";
      let commentOnOff = this.commentMode;
      if (commentOnOff == true) {
        switched = false;
        }
      else if (commentOnOff == false || commentOnOff == "") {
        switched = true;
        }
        this.commentMode = switched
      return (this.commentMode)
    },
    //Récupère les commentaires
    getComments(){      
      const token = sessionStorage.getItem("token");
      const postId= this.postData.id;
      axios
      .get(`http://localhost:3000/api/topics/`+postId+`/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        return (this.allComments = response.data.comments)
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
    },
    //compte le nombre de commentaires pour chaque article    
    commentCount(id) {
      const count = this.allComments.filter((comment) => comment.topic == id);
      return count;
    },
    //création d'un commentaire
    createComment(){
      const token = sessionStorage.getItem("token");
      const postId= this.postData.id;
      let creationdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const newComment = {        
        author: this.userId,
        topic: this.postData.id,
        content: this.commentcontent,
        creationdate: creationdate,
        updatedate: creationdate,
      }
      axios
      .post(`http://localhost:3000/api/topics/`+postId+`/comments`, newComment, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {        
        return (this.newComment = response.data.comment)        
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
      document.getElementById('createCommentInput');
      console.log('ddddddddd',document.getElementById('createCommentInput'.value))
    },
    /*******Articles*******/
    //article signale
    reportedValue() {
      let reportedValue = false;
      if (this.postData.isreported == "O") {
        reportedValue = true
        return reportedValue;
      }
    },
    //Suppression d'un article
    deletePost() {      
      const postId = this.postData.id;
      const token = sessionStorage.getItem("token");
      //requête delete api/topics/:id
      axios
      .delete('http://localhost:3000/api/topics/'+postId,{
          headers: { "Authorization": "Bearer " + token },
      })
      //si OK, recharge la page
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch (function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
    },
    //Signalement d'un article
    reportPost(id){
      //alert("Ici vous pouvez signaler un post inconvenant n°"+id);
      const isReported = "O";
      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const postId = id;
      const token = sessionStorage.getItem("token");
      const dataForm = new FormData();
      dataForm.append("isreported", isReported);
      dataForm.append("isreporteddate", date);
      //requête update api/topics/:id
      axios
      .patch('http://localhost:3000/api/topics/'+postId,dataForm,{
          headers: { "Authorization": "Bearer " + token },
      })
      //si OK, message
      .then((response) => {
        console.log(response);
        alert("Ce message a bien été signalé, les modérateurs ont été avertis");
        window.location.reload();
      })
      .catch (function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
    },
    //on vérifie si le contenu du post est un lien
    checkLink(article){
      let isLink = false;
      let truncatedContent = article.substring(0,4);
      if (truncatedContent == "http") {
        isLink=true
      }
      return isLink
    },
    toggleVisibility(el) {
      var div = document.getElementById(el);
      div.style.display = div.style.display == "block" ? "none" : "block";
    },
  },
}
</script>