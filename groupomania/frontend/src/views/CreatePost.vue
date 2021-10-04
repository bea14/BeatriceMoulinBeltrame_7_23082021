<!--Page qui permet de créer un article. Prend titre, contenu, image et catégorie-->
<template>
  <div class="maincontainer">
    <Header @gotohome="path = '/Posts'"/>
    <div class="postcreate">
      <div class="container">
        <div class="create-container">
          <div class="body-left">
            <h1>Création d'un nouvel article</h1>
            <div class="postcreate-box">
            <p>Vous avez plusieurs possibilités pour votre article :
              <ul>
                <li @click="toggleVisibility('post-create-textmedia')">Du texte avec ou sans image/video : cliquer ici</li>
                <li @click="toggleVisibility('post-create-link')">Un lien internet : cliquer ici</li>
                <li @click="toggleVisibility('post-create-media')">Une image seule ou une vidéo seule : cliquer ici</li>
                <li>Un sondage (pas encore disponible)</li>
              </ul>
            </p>
            <Bouton text="Annuler et retourner aux articles" @click="goToPage" class="submitButton" />
            </div>
            <div class="form" id="post-create-textmedia">
              <ValidationObserver tag="form" class="formulaire" @submit.prevent="create">
                <FormTextInput label="Titre : " name="titletextmedia" type="text" v-model="title" placeholder="Le titre de votre article "/>
                <label for="tag">Choisissez une catégorie :</label>
                <select v-model="selected" @change="changeTag($event)">          
                  <option value="" selected disabled>--Choisir une catégorie--</option>
                  <option v-for="tag in tags" :value="tag.text" :key="tag.value" :class="getCategorie(tag.name)">
                    {{ tag.text }}
                  </option>
                </select>
                <div class="image-upload">
                  <p>
                    <span v-if="!image">Cliquer pour choisir une image :</span>
                    <span v-else>{{ image.name }}</span>
                  </p>
                  <!--@change="fileChanged($event.target.name, $event.target.files)"-->
                  <input type="file" @change="this.fileChanged" accept="image/*,video/*,audio/*">               
                  <img :src="`${media_url}`">
                </div>
                <TextAreaInput label="Contenu : " name="contenttextmedia" v-model="content" placeholder="Votre contenu "/>
                <button class="submitButton" >Créer le nouvel article</button>
              </ValidationObserver>
            </div>
            <div class="form" id="post-create-link">
              <ValidationObserver tag="form" class="formulaire" @submit.prevent="create">
                <FormTextInput label="Titre (optionnel): " name="titlelink" type="text" v-model="title" placeholder="Le titre de votre article "/>
                <label for="tag">Choisissez une catégorie :</label>
                <select v-model="selected" @change="changeTag($event)">          
                  <option value="" selected disabled>--Choisir une catégorie--</option>
                  <option v-for="tag in tags" :value="tag.text" :key="tag.value" :class="getCategorie(tag.name)">
                    {{ tag.text }}
                  </option>
                </select>
                <FormTextInput label="Votre lien : " name="content" type="text" v-model="content" placeholder="Votre lien "/>
                <button class="submitButton" >Créer le nouvel article</button>
              </ValidationObserver>
            </div>
            <div class="form" id="post-create-media">
              <ValidationObserver tag="form" class="formulaire" @submit.prevent="create">
                <FormTextInput label="Titre (facultatif) : " name="titlemedia" type="text" v-model="title" placeholder="Le titre de votre article "/>
                <label for="tag">Choisissez une catégorie (facultatif) :</label>
                <select v-model="selected" @change="changeTag($event)">          
                  <option value="" selected disabled>--Choisir une catégorie--</option>
                  <option v-for="tag in tags" :value="tag.text" :key="tag.value" :class="getCategorie(tag.name)">
                    {{ tag.text }}
                  </option>
                </select>
                <div class="image-upload">
                  <p>
                    <span v-if="!image">Cliquer pour choisir une image :</span>
                    <span v-else>{{ image.name }}</span>
                  </p>
                  <!--@change="fileChanged($event.target.name, $event.target.files)"-->
                  <input type="file" @change="this.fileChanged" accept="image/*,video/*,audio/*">               
                  <img :src="`${media_url}`">
                </div>
                <button class="submitButton" >Créer le nouvel article</button>
              </ValidationObserver>
            </div>
          </div>
          <!--Aside qui permet d'afficher quelques règles et les membres du forum-->
          <div class="body-right">
            <Aside />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Header from "../components/layout/LayoutHeader.vue";
import FormTextInput from "../components/forms/FormTextInput.vue";
import TextAreaInput from "../components/forms/FormTextarea.vue";
import Bouton from "../components/Bouton.vue";
import Aside from "../components/posts/postsAside.vue";
import { ValidationObserver } from "vee-validate";
import router from "../router";

export default {
  name: "Createpost",
  components: {
    Header,
    FormTextInput,
    TextAreaInput,
    Bouton,
    Aside,
    ValidationObserver
  },
  data() {
    return {
      title: '',
      content: '',
      tag: '',
      media_url: '',
      isreported:'N',
      error: null,
      image: null,
      imagePreview: null,
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
  methods: { 
    goToPage() {
      router.push("/Posts")
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
    create() {
      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      //On crée le modèle avec les données à créer
      const dataForm = new FormData(); 
      dataForm.append("title", this.title);
      dataForm.append("content", this.content);
      dataForm.append("media_url", this.media_url);
      dataForm.append("author", sessionStorage.getItem("userId"));
      dataForm.append("creationdate", date);      
      dataForm.append("updatedate", date);
      dataForm.append("tag", this.tag);
      dataForm.append("isreported", this.isreported);      
      dataForm.append("isreporteddate", date);
      if (this.file != "") {dataForm.append("media", this.file)};
      if (this.file != "") console.log('file', this.file)
      //On récupère le token
      const token = sessionStorage.getItem("token");
      //Requête POST api/topics     
      axios
      .post(`http://localhost:3000/api/topics/`, dataForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {        
        console.log(response.data)
        router.push("/Posts");
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
    },
    fileChanged(event) {
      this.file = event.target.files[0];
    },    
    toggleVisibility(el) {
      var div = document.getElementById(el);
      div.style.display = div.style.display == "block" ? "none" : "block";
    },
  },
}
</script>