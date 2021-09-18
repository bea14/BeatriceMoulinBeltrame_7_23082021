<template>
  <div class="updatecomment">
    <h1>Modifier le commentaire n°{{ (commentId = $route.params.commentId) }} du post n°{{ (postId = $route.params.postId) }}</h1>
    <div class="form">
      <ValidationObserver tag="form" class="formulaire" @submit.prevent="updateComment">
        <TextAreaInput label="Contenu" name="content" v-model="comment.content" placeholder="Contenu "/>
        <button  class="submitButton" >Mettre à jour après modifications</button>
      </ValidationObserver>
      <div class="boutons">
      <Bouton @click="goToPage()" text="Valider et aller à la page principale" class="submitButton" />
      <Bouton text="Supprimer le commentaire" @click="$refs.modaleSuppression.openModal()" class="submitButton" />
      <Modal ref="modaleSuppression">
        <template v-slot:header>
          <h1>Suppression du commentaire</h1>
        </template>
        <template v-slot:body>
          <p>Etes-vous sûr(e) de vouloir supprimer ce commentaire?</p>
          <p>Cette opération est irréversible.</p>
          <p>Cliquez sur Confirmer pour confirmer la suppression et sur Annuler pour annuler la suppression</p>
        </template>
        <template v-slot:footer>
          <div>            
            <Bouton @click="deleteComment()" text="Confirmer" />      
            <Bouton @click="$refs.modaleSuppression.closeModal()" text="Annuler" />
          </div>
        </template>
      </Modal>
      </div>
    </div>
  </div>
</template>
    
<script>
const axios = require("axios").default;
import TextAreaInput from "../components/forms/FormTextarea.vue";
import Bouton from "../components/Bouton.vue";
import Modal from "../components/modal.vue";
import router from "../router";
import { ValidationObserver } from "vee-validate";

export default {
  name: "UpdateComment",
  components: {
    ValidationObserver,
    TextAreaInput,
    Bouton,
    Modal,
  },
  data () {     
    const pseudo = sessionStorage.getItem('pseudo') || 0;
    const role = sessionStorage.getItem('role') || 0;
    let userRole ="";
    if (role == 0) {
    userRole = "membre";
    console.log('role',userRole)
    } 
    else if (role == 1) {
    userRole = "modérateur";
    console.log('role',userRole)
    }      
    else if (role == 2) {
    userRole = "administrateur"
    console.log('role',userRole)
    }
    return {
      pseudo,
      userRole,
      comment: {} ,
    }
  },
  //Quand le DOM est monté, on lance getComment
  mounted() {
    this.getComment();
  },  
  methods: {
    //redirection vers la page d'articles
    goToPage() {
      router.push("../../../Posts");
    },
    //charger l'Avatar quand il a été fourni
    chargerAvatar(input, placeToInsertImagePreview) {
      if (input.files) {
        let fichier = input.files[0];
        let reader = new FileReader();
        reader.onload = ((event) => {
            (event.parseHTML("<img>"))
              .attr("src", event.target.result)
              .appendTo(placeToInsertImagePreview);
          });
          reader.readAsDataURL(fichier);
      }; 
    },
    //Charger les données d'un utilisateur à partir du backend
    getComment() {
      //on récupère l'userId et le token qui ont été enregistrés dans le sessionStorage au moment du login
      //const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      const postId = this.postId;
      const commentId = this.commentId;
      console.log(postId)
      console.log(commentId)
      //requête get api/topics/:postId/comments/:commentId
      axios
      .get("http://localhost:3000/api/topics/" + postId + "/comments/"+commentId, {
        headers: { 
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      // si OK, on récupère le post
      .then((response) => {
        this.comment = response.data.comments[0];          
        console.log('post', response.data);      
          console.log('DDDDDDDDDDDDDDDDD',response.data.comments[0])
          console.log('FFFFFFFFFFFFFFFFFFFFFFF',JSON.stringify(response.data.comments))
         return  this.comment = response.data.comments[0];
      })
    },
    //Mise à jour profil utilisateur
    updateComment() {
      const postId = this.postId;
      const commentId = this.commentId;
      //const userId = sessionStorage.getItem("userId");
      let updatedate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const dataForm = {
        content: this.comment.content,
        updatedate: updatedate,
      }
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',dataForm);
      const token = sessionStorage.getItem("token");      
      //requête patch api/topics/:postId/comments/:commentId
      axios
      .patch('http://localhost:3000/api/topics/'+postId+'/comments/'+commentId,dataForm, {
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
      })
      // si Ok, message
      .then((response) => {
        console.log(response);
        alert('Votre commentaire a bien été mis à jour!');
        router.push("../../../Posts");
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
    //Suppression commentaire
    deleteComment() {      
      const postId = this.postId;
      const commentId = this.commentId;
      const token = sessionStorage.getItem("token");
      //requête delete api/topics/:postId/comments/:commentId
      axios
      .delete('http://localhost:3000/api/topics/'+postId+'/comments/'+commentId,{
        headers: { 
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      //si OK, on efface le sessionStorage et on redirige vers les articles
      .then((response) => {
        console.log('Post supprimé')
        console.log(response);
        router.push("/Posts");
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
  }
};
</script>

<style lang="scss">
@import "../assets/styles/utils/_variables.scss";
@import "../assets/styles/utils/_extend.scss";
h2 {
  margin-top: 60px;
  text-align: center;
}
h3 {
  text-align: center;
}
.form {
  padding: 1rem 2rem;
  .form-group {
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
    label {
      padding-bottom: 0.5rem;
    }
    .form-control {
      border-radius: $border-radius-s;
      margin-top: 0.25rem;
      line-height: 1.5rem;
      border-width: 1px;
      font-size: 1rem;
      padding: 0.5rem 0.75rem;
      background-color: $bg-body;
    }
    .invalid-feedback {
      @extend .alert-msg;
      position: relative;
      margin-top: -15px;
      margin-bottom: 20px;
    }
    a {
      text-decoration: none;
    }
  }
}
.formulaire img {
  width: 100px;
}
.boutons {
    display: flex;
    flex-direction: row;
    justify-content: center;
  .submitButton {
    border-radius: $border-radius-m;      
    border: 1px solid $primary-color;
    margin-top: 0.25rem;
    line-height: 1.5rem;
    border-width: 1px;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0 1rem;
    background: $primary-color;
    color: white;
    text-align: center;
  }
}

.text {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
