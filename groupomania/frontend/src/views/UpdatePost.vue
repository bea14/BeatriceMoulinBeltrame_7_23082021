<template>
  <div class="updatePost">
    <h1>Modifier le post n°{{ (postId = $route.params.id) }}</h1>
    <div class="form">
      <ValidationObserver tag="form" class="formulaire" @submit.prevent="updatePost">
        <FormTextInput label="Titre" name="title" type="text" v-model="post.title" placeholder="Titre"/>
        <TextAreaInput label="Contenu" name="content" v-model="post.content" placeholder="Contenu "/>
        <span>Media : <img :src="`${post.media_url}`" alt="image du post"></span>
        <div id="image-upload">
          <!--@change="fileChanged($event.target.name, $event.target.files)"-->
          <label for="media">
            Cliquer pour choisir une nouvelle image :
            <input type="file" @change="fileChanged($event)" accept="image/*, audio/*, video/*">
          </label>
        </div>
        <label for="Categories">Choisissez une catégorie :</label>
        <select name="Categories" aria-label="Categories" v-model="selected" @change="changeTag($event)">          
          <option value="" selected disabled>--Choisir une catégorie--</option>
          <option v-for="tag in tags" :value="tag.text" :key="tag.value" :class="getCategorie(tag.name)">
            {{ tag.text }}
          </option>
        </select>
        <button class="submitButton" >Mettre à jour après modifications</button>
      </ValidationObserver>
      <div class="boutons">
      <Bouton @click="goToPage()" text="Annuler" class="submitButton" />
      <Bouton text="Supprimer le post" @click="$refs.modaleSuppression.openModal()" class="submitButton" />
      <Modal ref="modaleSuppression">
        <template v-slot:header>
          <h1>Suppression du post</h1>
        </template>
        <template v-slot:body>
          <p>Etes-vous sûr(e) de vouloir supprimer ce post?</p>
          <p>Cette opération est irréversible.</p>
          <p>Cliquez sur Confirmer pour confirmer la suppression et sur Annuler pour annuler la suppression</p>
        </template>
        <template v-slot:footer>
          <div>            
            <Bouton @click="deletePost()" text="Confirmer" />      
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
import FormTextInput from "../components/forms/FormTextInput.vue";
import TextAreaInput from "../components/forms/FormTextarea.vue";
import Bouton from "../components/Bouton.vue";
import Modal from "../components/modal.vue";
import router from "../router";
import { ValidationObserver } from "vee-validate";

export default {
  name: "UpdatePost",
  components: {
    ValidationObserver,
    FormTextInput,
    TextAreaInput,
    Bouton,
    Modal,
  },
  data () {     
    const pseudo = sessionStorage.getItem('pseudo') || 0;
    return {
      pseudo,
      post: {} ,
      file:"",
      selected: "--Choisir une catégorie--",
      tags: [
        {text:'Environnement', value: 'Environnement'},
        {text:'Science', value: 'Science'},
        {text:'Technologie', value: 'Technologie'},
        {text:'Actualités', value: 'Actualités'},
        {text:'Humour', value: 'Humour'},
        {text:'Au travail', value: 'Au travail'},
        {text:'Divers', value: 'Divers'},
      ],
    }
  },
  //Quand le DOM est monté, on lance getPost
  mounted() {
    this.getPost();
  },  
  methods: {
    //redirection vers la page d'articles
    goToPage() {
      router.push("/Posts");
    },
    getCategorie(val){
      const catactive = "cat_item cat_item_isactive"
      const catinactive = "cat_item"
      var categorie = val === this.selected ? catactive : catinactive;
      return categorie;
    },
    changeTag (event) {
      this.tag = event.target.value;      
      this.selectedTag = event.target.options[event.target.option];
    },
    //Charger le post à partir du backend
    getPost() {
      //on récupère l'userId et le token qui ont été enregistrés dans le sessionStorage au moment du login
      //const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      const postId = this.postId;
      console.log(postId)
      //requête get api/topics/:id
      axios
      .get("http://localhost:3000/api/topics/" + postId, {
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
      })
      // si OK, on récupère le post
      .then((response) => {
        this.post = response.data.post[0];          
        console.log('post', response.data);      
          console.log('DDDDDDDDDDDDDDDDD',response.data.post)
          console.log('FFFFFFFFFFFFFFFFFFFFFFF',JSON.stringify(response.data.post))
         return this.post
      })
    },
    fileChanged(event) {
      /*if (!files.length) {
      return files
      }
      console.log(filename, files)
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append(filename, files[i], files[i].name)
      }
      axios
      .post(`http://localhost:3000/upload`, formData).then(
        rsp => {
          console.log(rsp)
        }
      )
      .catch(err => {
        console.log(err)
      })*/
      
      this.file = event.target.files[0];
    },
    //Mise à jour post
    updatePost() {
      const postId = this.postId;
      //const userId = sessionStorage.getItem("userId");
      let updatedate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const dataForm = new FormData();
      dataForm.append("title", this.post.title);
      dataForm.append("content", this.post.content);
      if (this.file.name != "" || this.file.name != null || this.file.name != undefined) {dataForm.append("media_url", this.file.name)};
     /* if (this.file.name == "") {
        dataForm.append("media_url", this.post.media_url);
      }     */ 
      dataForm.append("updatedate", updatedate);
      dataForm.append("tag", this.tag);
      if (this.file != "") {dataForm.append("media", this.file)};
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',dataForm);
        //console.log('filename', this.file.name)
      const token = sessionStorage.getItem("token");      
      //requête patch api/users/topics/:id
      axios
      .patch('http://localhost:3000/api/topics/'+postId,dataForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      // si Ok, message
      .then((response) => {
        console.log(response);
        alert('Votre post a bien été mis à jour!');
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
    //Suppression post
    deletePost() {      
      const postId = this.postId;
      const token = sessionStorage.getItem("token");
      let media_url = this.post.media_url? this.post.media_url : null;
      /*const imageUrl=this.post.media_url;
      const media_url=imageUrl.split("/upload/")[1];*/
      //requête delete api/topics/:id
      axios
      .delete('http://localhost:3000/api/topics/'+postId,{
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
        data: { media_url },
      })
      //si OK, on efface le sessionStorage et on redirige versles articles
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
.updatePost{
  margin: 5rem auto;
  border-radius: $border-radius-m;
  box-shadow: $net-shadow;
  background-color: white;
  max-width: 48rem;
  width: 100%;
}
h2 {
  margin-top: 60px;
}
h3 {
  text-align: center;
}
</style>
