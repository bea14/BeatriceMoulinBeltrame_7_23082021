<!--Page de connexion pour un utilisateur déjà inscrit, demande pseudo et mot de passe-->
<template>
  <div class="maincontainer">
    <Header @gotohome="path = '/Posts'"/>
    <div class="login">
      <h1>Connexion</h1>
      <div class="form">
        <ValidationObserver v-slot="{ invalid }" tag="form" class="formulaire" @submit.prevent="onSubmit">
          <FormTextInput rules="required" label="Pseudo :" name="pseudo" type="text" v-model="pseudo" placeholder="Votre pseudo "/>
          <FormTextInput rules="required" label="Mot de passe :" name="password" type="password" v-model="password" placeholder="Votre nom "/>
          <button :disabled="invalid" class="submitButton" >Se connecter</button>
        </ValidationObserver>
        <router-link to="/Signup" class="text" >Pas encore inscrit ?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Header from "../components/layout/LayoutHeaderHome.vue";
import FormTextInput from "../components/forms/FormTextInput.vue"
import router from "../router";
import { ValidationObserver } from "vee-validate";

export default {
  name: "login",
  components: {
    Header,
    ValidationObserver,
    FormTextInput
  },
  data() {
    return {        
        pseudo: "",
        password: "",
    };
  },
  methods: {
    //on récupère les données de l'utilisaeur depuis le backend
    onSubmit() {
      const user = { pseudo: this.pseudo, password: this.password };
      const pseudo = this.pseudo;
      //Appel à l'api POST /api/users/login
      axios
      .post("http://localhost:3000/api/users/login", user)
      .then(function (response) {
        //on enregistre dans le storage le token, l'userId, le pseudo, l'avatar et le role
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("avatar", response.data.avatar);
        sessionStorage.setItem("pseudo", pseudo);
        //redirection vers la page principale
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
  },
  //si l'utilisateur est déjà connecté, on redirige vers la page des articles
  beforeMount() {
    if (sessionStorage.getItem("userId") && sessionStorage.getItem("token")) {
      console.log("l'utilisateur est déjà connecté");
      router.push("/Posts");
    }
  },
}
</script>