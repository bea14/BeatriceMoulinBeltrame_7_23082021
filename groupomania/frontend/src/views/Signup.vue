<!--Page d'inscription pour un nouvel utilisateur, demande pseudo, email et mot de passe-->
<template>
  <div class="maincontainer">
    <Header @gotohome="path = '/Posts'" />
    <div class="signup">
      <h1>Inscription</h1>
      <div class="form">
        <ValidationObserver
          v-slot="{ invalid }"
          tag="form"
          class="formulaire"
          @submit.prevent="onSubmit"
        >
          <FormTextInput
            rules="required"
            label="Pseudo :"
            name="pseudo"
            type="text"
            v-model="pseudo"
            placeholder="Votre pseudo "
          />
          <FormTextInput
            rules="required|email"
            label="Email :"
            name="email"
            type="email"
            v-model="email"
            placeholder="Votre email "
          />
          <FormTextInput
            rules="required|min:6|confirmed:pass"
            label="Mot de passe :"
            name="password"
            type="password"
            v-model="password"
            placeholder="Votre mot de passe "
          />
          <FormTextInput
            rules="required"
            vid="pass"
            label="Confirmation du mot de passe :"
            type="password"
            placeholder="Répétez votre mot de passe"
          />
          <button :disabled="invalid" class="submitButton">S'inscrire</button>
        </ValidationObserver>
        <router-link to="/Login" class="text">Déjà inscrit ?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Header from "../components/layout/LayoutHeaderHome.vue";
import FormTextInput from "../components/forms/FormTextInput.vue";
import router from "../router";
import { ValidationObserver } from "vee-validate";

export default {
  name: "signup",
  components: {
    ValidationObserver,
    Header,
    FormTextInput,
  },
  data() {
    let creationdate = new Date().toISOString().slice(0, 19).replace("T", " ");
    return {
      lastname: "",
      firstname: "",
      pseudo: "",
      email: "",
      password: "",
      sexe: "",
      avatar: "default-avatar.png",
      birthdate: null,
      bio: "",
      creationdate: creationdate,
      updatedate: creationdate,
      role: "0",
    };
  },
  methods: {
    onSubmit() {
      //Création de l'utilisateur, on récupère les données du formulaire
      const user = {
        lastname: this.lastname,
        firstname: this.firstname,
        pseudo: this.pseudo,
        email: this.email,
        password: this.password,
        sexe: this.sexe,
        birthdate: this.birthdate,
        bio: this.bio,
        creationdate: this.creationdate,
        updatedate: this.updatedate,
        role: this.role,
      };
      //Appel à l'api POST /api/users/signup
      axios
        .post("http://localhost:3000/api/users/signup", user)
        .then(function (response) {
          console.log(response);
          alert(
            "Vous êtes maintenant inscrit, merci de vous connecter pour accéder au forum!)\n\n"
          );
          //redirection vers le login
          router.push("/Login");
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
          if (error.response.status == 401) {
            alert("Ce pseudo est déjà utilisé, merci d'en choisir un autre");
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
};
</script>
