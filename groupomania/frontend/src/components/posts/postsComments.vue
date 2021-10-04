<template>
    <div>
      <div class="commentdisplay">
        <div>
            <img :src="`${commentData.avatar}`" width="30px" alt="avatar utilisateur" />
            {{ commentData.pseudo }}, 
            le {{ commentData.comment_date_fr }}
        </div>
        <div class="commentbox">
            <p>{{ commentData.content }}</p>
            <div class="commentbox-buttons">
              <!--Bouton de suppression-->
              <button v-if="commentData.author == userId || userIsAdmin" @click.prevent="deleteComment(commentData.id)">
                  <span class="sr-only">Supprimer</span>
                  <i class="fas fa-trash-alt" aria-hidden="true">&nbsp;&nbsp;</i>
              </button>
              <!--Bouton de mise à jour-->
              <router-link :to="{ name: 'UpdateComment', params: { postId: postId, commentId: commentData.id } }">
                  <button v-if="commentData.author == userId">
                  <span class="sr-only">Modifier</span>
                  <i class="fas fa-edit" aria-hidden="true">&nbsp;&nbsp;</i>
                  </button>
              </router-link>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
const axios = require("axios").default;

export default {
  props: ["commentData", "postId"],
  data() {
    const pseudo = sessionStorage.getItem("pseudo");
    const userId = sessionStorage.getItem("userId");
    let userIsAdmin = this.functionUserIsAdmin();
    return {
        pseudo,
        userId,
        userIsAdmin,
    };
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
    //Suppression d'un commentaire
    deleteComment(commentId) {           
      const token = sessionStorage.getItem("token");
      const postId = this.postId;      
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
  },
}
</script>