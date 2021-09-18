<template>
  <div class="post">   
    <div class="post-content">
      <div class="card">
        <div class="card-header">
          <div class="card-header-top">
            Proposé par 
            <span><strong> {{ postData.pseudo }}</strong></span>
            <img
              class=" post__header__img picture-profile__img"
              :src="`${postData.avatar}`"
              alt="avatar de l'utilisateur"
              width="30px"
            />
          </div>
          <div class="card-header-bottom">
            <span>Le {{ postData.post_date_fr }}</span></div>
          <div class="card-header-buttons">
            <!--Bouton de suppression -->
            <button type="button" value="Supprimer le post" v-if="postData.pseudo == this.pseudo || userIsAdmin" class="card-button" @click.prevent="deletePost()">
              <i class="fas fa-trash-alt" aria-hidden="true" aria-label="Supprimer l'article">
                &nbsp;
                <!--<span class="sr-only">
                  Supprimer l'article
                </span>-->
              </i>
            </button>
            <!--Bouton de mise à jour-->
            <router-link :to="{ name: 'UpdatePost', params: { id: postData.id } }">
            <!--<button v-if="postData.author != this.userId || this.role == 1 || this.role == 2" class="button post__header__delete-button" @click.prevent="updatePost()">-->
              <button v-if="postData.pseudo == this.pseudo || userIsAdmin" class="card-button">
              <i class="fas fa-edit" aria-hidden="true">&nbsp;</i>
            </button>
            </router-link>
            <!--Bouton de signalement -->
            <button class="card-button" @click.prevent="reportPost(postData.id)">
              <i class="fa fa-exclamation-triangle" aria-hidden="true">&nbsp;</i>
            </button>
            <div v-if="reportedValue()">                
              <i class="fa fa-flag fa-2x red-color " aria-hidden="true"></i> 
            </div>
          </div>
        </div>
        <div class="card-body">
          <!--Image/Media-->
          <!--Image-->
          <div class="card-body-image" v-if="thereIsImage">
            <img :src="`${postData.media_url}`" alt="image du post" />
          </div>
          <!--Video-->
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
            <span v-if="postData.tag != null || postData.tag != ''" class="badge"> {{ postData.tag }} </span>
          </div>        
          <!--Contenu du post-->
          <div class="card-body-text">`
            {{ postData.content }}
          </div>          
        </div>
        <div class="card-footer">
          <!--Compte des ommentaires-->
          <div class="card-footer-items">
            <a @click="$refs.modaleComments.openModal()">
              {{ commentCount(postData.id).length }}
              <i class="fas fa-comment" aria-hidden="true"></i>              
            </a><!-- @click="displayComment" -->
            <Modal ref="modaleComments">
              <template v-slot:header>
              </template>
              <template v-slot:body>
                <div v-for="comment in allComments" :key="comment.id" >
                  <!--@refresh="getComments()" -->
                  <ul v-if="comment.length != 0">
                    <li>
                      <img :src="`${comment.avatar}`" alt="avatar utilisateur" />
                      {{ comment.pseudo }}, le {{ comment.comment_date_fr }}
                    </li>
                    <li>{{ comment.content }}</li>
                    <!--Bouton de suppression-->
                    <button v-if="comment.author == userId || userIsAdmin" @click.prevent="deleteComment(comment.id)" class="view">
                      <span>Supprimer</span>
                      <i class="fas fa-trash-alt" aria-hidden="true">&nbsp;&nbsp;</i>
                    </button>
                    <!--Bouton de mise à jour-->
                    <router-link :to="{ name: 'UpdateComment', params: { postId: postData.id, commentId: comment.id } }">
                      <button v-if="comment.author == userId || userIsAdmin" class="view">
                        <span>Modifier</span>
                        <i class="fas fa-edit" aria-hidden="true">&nbsp;&nbsp;</i>
                      </button>
                    </router-link>
                    <!--Bouton de signalement-->
                      <button @click.prevent="reportComment(comment.id)" class="view">
                        <span>Signaler</span>
                        <i class="fas fa-exclamation-triangle" aria-hidden="true">&nbsp;&nbsp;</i>
                      </button>                      
                      <!--<div v-if="reportedValueCom()">                
                        <i class="fa fa-flag fa-2x red-color " aria-hidden="true"></i> 
                      </div>-->
                  </ul>
                </div>
                <div>
                  <input
                    class="post__footer__create-comment__input"
                    type="text"
                    id="create-comment"
                    name="create-comment"
                    placeholder="Ajoutez un commentaire"
                    required="required"
                    v-model="commentcontent"
                    @focus="value = ''"
                    @change="createComment(); getComments()"
                  />
                  <!--<button
                    class="post__footer__create-comment__button"
                    text=""
                    @click="createComment(); getComments()"
                  >Envoyer</button>-->
                </div>
              </template>
              <template v-slot:footer>
                <!--<div>            
                  <Bouton @click="deleteUser()" text="Confirmer" />      
                  <Bouton @click="$refs.modaleSuppression.closeModal()" text="Annuler" />
                </div>-->
              </template>
            </Modal>
          </div>
          <div class="card-footer-items inactive">
            <i class="fas fa-share" aria-hidden="true"></i>
            <span>Partager</span>
          </div>
          <div class="card-footer-items inactive">
            <i class="fas fa-bookmark" aria-hidden="true"></i>
            <span>Enregistrer</span>
          </div>
          <!--Votes-->
            <div class="votes">
              <!--<i class="far fa-thumbs-up" aria-hidden="true"><span id="userlike">{{ allTopicsVotes.like }}</span></i>
              <i class="fas fa-thumbs-up ${upVoted ? 'red' : downVoted ? 'blue' : ''" @click="likeDislikeChange(true)" ></i>
              <span>votes</span>
              <i class="far fa-thumbs-down" aria-hidden="true"></i>
              <i class="fas fa-thumbs-down${upVoted ? 'red' : downVoted ? 'blue' : ''" @click="likeDislikeChange(false)" ></i>-->
              <!--<i class="far fa-thumbs-up" aria-hidden="true"></i>-->
              <span @click="likeDislikeChange(true)">
                <i class="fas fa-thumbs-up" id="fa-thumbs-up" aria-hidden="true"></i>
                {{ likeCount(postData.id).length }}
              </span>
              <!--<i class="far fa-thumbs-down" aria-hidden="true"></i>-->
              <span @click="likeDislikeChange(false)">
                <i class="fas fa-thumbs-down" id="fa-thumbs-down" aria-hidden="true"></i>
                {{ dislikeCount(postData.id).length }}
              </span>
              <div v-if="userLikeCount(userId).length != 0" id="userLikes1">1</div>              
              <div v-else-if="userDislikeCount(userId).length != 0" id="userLikes_1">-1</div>              
              <div v-else id="userLikes0">0</div>
              <div id="userLikes">0</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Modal from "../modal.vue";

export default {
  components: {
    Modal,
  },
  props: ["postData"],
  data() {
    const pseudo = sessionStorage.getItem("pseudo");
    const userId = sessionStorage.getItem("userId");
    let userIsAdmin = this.functionUserIsAdmin();
    let userIsAuthor = false;
    /*if (pseudo == this.postData.pseudo){
      userIsAuthor = true
      return userIsAuthor
    };*/
    /*let thereIsImage = null;
    if (this.postData.media_url != '' || this.postData.media_url != null){
      thereIsImage = true
      return thereIsImage
    };*/
    return {
      upVoted: false,
      downVoted: false,
      commentMode: false,
      commentcontent: "",
      comments: [],
      thereIsImage: null,
      thereIsVideo: null,
      allComments: [],
      allLikes:[],
      pseudo,
      userId,
      userIsAdmin,
      userIsAuthor ,
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
        console.log("userIsAdmin", userIsAdmin)
        return userIsAdmin
      }
    },
    //Permet de voir si on a cliqué sur like ou dislike
    likeDislikeChange(like){   
      //like status : default 0, -1 for dislike and +1 for like
      let current1 = "";
      let current_1 = "";
      let current0 = "";
      if(document.getElementById("userLikes1") != null)
      {current1 = document.getElementById("userLikes1").innerHTML};
      console.log("IIIIIIIIIII", current1);
      if(document.getElementById("userLikes_1") != null)
      {current_1 = document.getElementById("userLikes_1").innerHTML};
      console.log("IIIIIIIIIII", current_1);
      if(document.getElementById("userLikes0") != null)
      {current0 = document.getElementById("userLikes0").innerHTML};
      console.log("IIIIIIIIIII", current0);
      let current = "";
      if (current1 != "") {
        current = current1;
        console.log("current",current)
      }
      if (current_1 != "") {
        current = current_1;
        console.log("current",current)
      }
      if (current0 != "") {
        current = current0;
        console.log("current",current)
      }
      let upVoted = document.getElementById('fa-thumbs-up');
      let downVoted = document.getElementById('fa-thumbs-down');
      //si clic sur like
      if (like) {
        //si like déjà validé, on annule
        if (current == "1") {
          current = "0";
          upVoted.style.color="white";
          downVoted.style.color="white";
        }
        //sinon on ajoute
        else {
          current = "1";
          upVoted.style.color="blue";
          downVoted.style.color="white";
        }
        console.log('current', current)
      }
      //si dislike
      else {
        //si dislike déjà validé, on annule
        if (current == "-1") {
          current = "0";
          downVoted.style.color="white";
          upVoted.style.color="white";
        }
        //sinon on ajoute
        else {
          current = "-1";
          downVoted.style.color="red";
          upVoted.style.color="white";
        }
        console.log('current', current)
      }
      return current
    },
    //récupère les like//dislike d'un article
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
        console.log('VVVVVVDDDDDDDDDDD',response.data.post)
        this.allLikes = response.data.post
          console.log('GGGGGGGGGGGGFFFFFFFFF',this.allLikes)
        return (this.allLikes = response.data.post)
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
    },
    //
    userLikeCount(id){
      const userLike = this.allLikes.filter((like) => like.user == id && like.likedislike == 1);
     
      console.log('JJJJJJJJJJJJJJJJJj', userLike)
      return userLike
    },
    userDislikeCount(id){
      const userDislike = this.allLikes.filter((like) => like.user == id && like.likedislike == -1);
     
      console.log('JJJJJJJJJJJJJJJJJj', userDislike)
      return userDislike
    },
    //Compte le nombre de like pour un article
    likeCount(id) {
      const likeCount = this.allLikes.filter((like) => like.topic == id && like.likedislike == 1);
      return likeCount;
    },
    //compte le nombre de dislike pour un article 
    dislikeCount(id) {
      const dislikeCount = this.allLikes.filter((dislike) => dislike.topic == id && dislike.likedislike == -1);
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
        console.log('VVVVVVVVVVVVVVVVV',response.data.comments)
          console.log('GGGGGGGGGGGGFFFFFFFFF',JSON.stringify(response.data))
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
        console.log('CCCCCCCCCCCCCCCCCCoooooooooooooommmmmmmmmmmmmmm',response.data.comment)
          console.log('CCCCCCCCCCCCCCCCCCoooooooooooooommmmmmmmmmmmmmm',JSON.stringify(response.data))
        return (this.newComment = response.data.comment)        
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      }); 
    },
    //Suppression d'un commentaire
    deleteComment(commentId) {           
      const token = sessionStorage.getItem("token");
      const postId = this.postData.id;      
      //requête delete api/topics/:postId/comments/:commentId
      axios
      .delete(`http://localhost:3000/api/topics/`+postId+`/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(() => {
        console.log("Commentaire supprimé");
        window.location.reload();
      })
      .catch(() => {
        console.log("Erreur lors de la suppression");
      })
    },
    //Signalement d'un commentaire
    //commentaire signale
    reportedValueCom() {
      let reportedValueCom = false;
      if (this.commentId.isreported == "O") {
        reportedValueCom = true
        return reportedValueCom;
      }
    },
    reportComment(id){
      const isReported = "O";
      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const postId = this.postData.id;      
      const commentId = id;
      const token = sessionStorage.getItem("token");
      const dataForm = new FormData();
      dataForm.append("isreported", isReported);
      dataForm.append("isreporteddate", date);
      console.log('DFDFGVUZV', dataForm)
      //requête update api/topics/:postId/comments/:id
      axios
      .patch('http://localhost:3000/api/topics/'+postId+'/comments/'+commentId,dataForm,{
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
      let media_url = this.postData.media_url? this.postData.media_url : null;
      /*let mediaUrl = '';
      let  imageUrl = '';
      console.log('this.postData.media_url',this.postData.media_url)
      if (this.postData.media_url != '' || this.postData.media_url != undefined || this.postData.media_url != null) {
        imageUrl = this.postData.media_url;
        mediaUrl = imageUrl.split("/upload/")[1];}*/
      /*const dataForm = new FormData();
      dataForm.append("title", this.postData.title);
      dataForm.append("content", this.postData.content);
      dataForm.append("media_url", this.postData.media_url)      
      dataForm.append("tag", this.tag);*/
      //requête delete api/topics/:id
      axios
      .delete('http://localhost:3000/api/topics/'+postId,{
          headers: { "Authorization": "Bearer " + token },
        data: { media_url },
      })
      //si OK, on efface le sessionStorage et on redirige vers le signup
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
  },
  computed: {
    /*filteredPosts() {
      return this.postData.filter((post) => {
        return postData.title.match(this.searchTerm);
      });
    }*/
  },
}
</script>

<style lang="scss">
@import "../../assets/styles/utils/_variables.scss";
@import "../../assets/styles/utils/_extend.scss";
.post {
  margin-top: 20px;
  height: auto;
  background-color: white;
  display: flex;
  padding: 1px;
  width: 100%;
  overflow-y: scroll;
  border: 1px solid #d3d1d1;
  border-radius: $border-radius-m;
  &:hover {
  border: 1px solid rgb(153, 152, 152);
  }
}

.votes{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 0 0.5rem;
  width: 10%;
    i {
      width: 20px;
      //background-color: #f8f9fa;
      padding: 10px;
      font-size: 15px;
      opacity: 0.6;
      font-weight: bolder;
      }
    span {
      margin: 5px 0;
      font-size: 12px;
      font-weight: bold;
    }
    .red {
    color: red;
  }
  .blue {
    color: blue;
  }
}  

.post-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  .UpText {
    background-color: #FFF;
  }
  .card {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    max-width: 100%;
    .card-header{
      display: flex;
      flex-direction: column;
      background-color: lighten($secondary-color,5%);
      color: white;
      min-width: 100%;
      max-width: 100%;
      border-top-left-radius: $border-radius-s;
      border-top-right-radius: $border-radius-s;
      font-size: 12px;
      @media screen and (min-width: 768px) {
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;     
        }
      &-top {
        font-size: 12px;
        padding: 0.5rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          margin-left: 1rem;
        }
        img {
          height: 30px;
          border-radius: 50%;
          border: 1px solid white;
          object-fit: contain;
          margin-left: 1rem; 
        }        
      }
      &-bottom {          
        padding: 0.5rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &-buttons{
        display: flex;
        justify-content: center;
        margin: 0 0.4rem;
        .card-button{
          background-color: $tertiary-color;
          border-radius: $border-radius-s;
          color: white;
          margin: 0.5rem 0;
          @media screen and (min-width: 768px) {
            margin: 0 1rem;          
          }
        }
        .red-color {
            color:red;
          }
      }
    }
    .card-body {
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin: 1rem 0.5rem;
      &-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        h2 {
          margin: 0.5rem 0;
        }
        .badge {
          padding: 0.5rem 1rem;
          margin-left: 0.5rem;
          background-color: $primary-color;
          font-size: 12px;
          color: white;
          border-radius: 30px;
          font-weight: bold;
        }
      }
      &-image{
        img {
          width: 100%;
          @media screen and (min-width: 768px) {
            max-height: 15vh;
          }
        }
      }
      &-video {
        video {
          width: 100%;
          @media screen and (min-width: 768px) {
            max-height: 15vh;
          }
        }
      }
    }
    .card-footer{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      background-color: lighten($secondary-color,5%);
      color: white;
      padding: 0.5rem 0;
      border-bottom-left-radius: $border-radius-s;
      border-bottom-right-radius: $border-radius-s;
      min-width: 100%;
      max-width: 100%;
      width: 70vw;
      &-items {
        font-size: 11px;
        margin: 0.2rem 0.5rem;
        display: flex;
        align-items: center;
        .modal__body img {
          border-radius: 100%;
          border: solid 4px $tertiary-color;
          overflow: hidden;
          width:30px
        }
        .modal__body {
          color: black;
        }
      }
      .inactive {
         color: grey; 
      }      
    }
  }

}
#commentaires {
  display: none;
}

.button {
  cursor: pointer;
  background-color: $primary-color;
  height: 80px;
  border-radius: 20px;
  transition: background-color ease-in-out 0.25s;
  &:hover {
    background-color: darken($primary-color, 10%);
  }
  &__text {
    display: block;
    text-align: center;
    text-transform: uppercase;
    font-weight: $font-weight-bold;
    color: white;
  }
}

.view span {
  display: none;
  @media screen and (min-with:768px) {
    display: block;
  }
}

.sr-only {
  height: 1px;
  width: 1px;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  position: absolute;
}
</style>
