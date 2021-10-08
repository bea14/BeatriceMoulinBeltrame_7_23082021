<template>
  <div class="maincontainer">
    <Header @gotohome="path = '/Posts'" />
    <div class="updatecomment">
      <h1>
        Modifier le commentaire n°{{ (commentId = $route.params.commentId) }} du
        post n°{{ (postId = $route.params.postId) }}
      </h1>
      <div class="form">
        <ValidationObserver
          tag="form"
          class="formulaire"
          @submit.prevent="updateComment"
        >
          <TextAreaInput
            label="Contenu"
            name="content"
            v-model="comment.content"
            placeholder="Contenu "
          />
          <button class="submitButton">Mettre à jour</button>
        </ValidationObserver>
        <div class="boutons">
          <Bouton @click="goToPage()" text="Annuler" class="submitButton" />
          <Bouton
            text="Supprimer le commentaire"
            @click="$refs.modaleSuppression.openModal()"
            class="submitButton"
          />
          <Modal ref="modaleSuppression">
            <template v-slot:header>
              <h1>Suppression du commentaire</h1>
            </template>
            <template v-slot:body>
              <p>Etes-vous sûr(e) de vouloir supprimer ce commentaire?</p>
              <p>Cette opération est irréversible.</p>
              <p>
                Cliquez sur Confirmer pour confirmer la suppression et sur
                Annuler pour annuler la suppression
              </p>
            </template>
            <template v-slot:footer>
              <div>
                <Bouton @click="deleteComment()" text="Confirmer" />
                <Bouton
                  @click="$refs.modaleSuppression.closeModal()"
                  text="Annuler"
                />
              </div>
            </template>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Header from "../components/layout/LayoutHeader.vue";
import TextAreaInput from "../components/forms/FormTextarea.vue";
import Bouton from "../components/Bouton.vue";
import Modal from "../components/modal.vue";
import router from "../router";
import { ValidationObserver } from "vee-validate";

export default {
  name: "UpdateComment",
  components: {
    Header,
    ValidationObserver,
    TextAreaInput,
    Bouton,
    Modal,
  },
  data() {
    const pseudo = sessionStorage.getItem("pseudo") || 0;
    let userIsAdmin = this.functionUserIsAdmin();
    return {
      pseudo,
      userIsAdmin,
      comment: {},
    };
  },
  //Quand le DOM est monté, on lance getComment
  mounted() {
    this.getComment();
  },
  methods: {
    //Permet de savoir si l'utilisateur est modérateur ou administrateur
    functionUserIsAdmin() {
      const role = sessionStorage.getItem("role") || 0;
      let userIsAdmin = false;
      if (role == 1 || role == 2) {
        userIsAdmin = true;
        return userIsAdmin;
      }
    },
    //redirection vers la page d'articles
    goToPage() {
      router.push("../../../Posts");
    },
    //Charger les commentaires d'un post à partir de son id
    getComment() {
      //on récupère le postId, le commentId et le token
      const token = sessionStorage.getItem("token");
      const postId = this.postId;
      const commentId = this.commentId;
      //requête get api/topics/:postId/comments/:commentId
      axios
        .get(
          "http://localhost:3000/api/topics/" +
            postId +
            "/comments/" +
            commentId,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // si OK, on récupère le post
        .then((response) => {
          this.comment = response.data.comments[0];
          return (this.comment = response.data.comments[0]);
        })
        .catch(function (error) {
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
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
    //Mise à jour commentaire
    updateComment() {
      const postId = this.postId;
      const commentId = this.commentId;
      //const userId = sessionStorage.getItem("userId");
      let updatedate = new Date().toISOString().slice(0, 19).replace("T", " ");
      const dataForm = {
        content: this.comment.content,
        updatedate: updatedate,
      };
      const token = sessionStorage.getItem("token");
      //requête patch api/topics/:postId/comments/:commentId
      axios
        .patch(
          "http://localhost:3000/api/topics/" +
            postId +
            "/comments/" +
            commentId,
          dataForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // si Ok, message
        .then((response) => {
          console.log(response);
          alert("Votre commentaire a bien été mis à jour!");
          router.push("../../../Posts");
        })
        .catch(function (error) {
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
            console.log("Error", error.message);
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
        .delete(
          "http://localhost:3000/api/topics/" +
            postId +
            "/comments/" +
            commentId,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        //si OK, on efface le sessionStorage et on redirige vers les articles
        .then((response) => {
          console.log("Post supprimé");
          console.log(response);
          router.push("/Posts");
        })
        .catch(function (error) {
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
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
  },
};
</script>
