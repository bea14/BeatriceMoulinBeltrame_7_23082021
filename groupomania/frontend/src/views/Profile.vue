<template>
  <div class="maincontainer">
    <Header @gotohome="path = '/Posts'" />
    <div class="profile">
      <h1>Profil {{ userRole() }} de {{ pseudo }}</h1>
      <h2>Compte créé le {{ user.user_creationdate_fr }}</h2>
      <div class="form">
        <!-- @submit.prevent="avatarChanged(user.avatar);updateUser"-->
        <ValidationObserver
          v-slot="{ invalid }"
          tag="form"
          class="formulaire"
          @submit.prevent="updateUser"
        >
          <FormTextInput
            label="Nom :"
            name="lastname"
            type="text"
            v-model="user.lastname"
            placeholder="Votre nom "
          />
          <FormTextInput
            label="Prénom :"
            name="firstname"
            type="text"
            v-model="user.firstname"
            placeholder="Votre prénom "
          />
          <FormTextInput
            label="Pseudo :"
            name="pseudo"
            type="text"
            v-model="user.pseudo"
            placeholder="Votre pseudo"
          />
          <FormTextInput
            label="Email : "
            name="email"
            v-model="user.email"
            placeholder="Votre email"
          /><!--
          <FormTextInput rules="min:6" label="Mot de passe :" name="password" v-model="user.password" placeholder="Votre mot de passe"/>-->
          <div class="form-radio">
            <span>Votre sexe :</span>
            <FormRadio
              label="Masculin"
              name="sexe"
              type="radio"
              v-model="user.sexe"
              :value="selectedValue"
              @change="changeValue"
            />
            <!--
            <FormRadio label="Feminin" name="Feminin" type="radio" v-model="user.sexe" v_value="F "/>-->
            <FormRadio
              label="Feminin"
              name="sexe"
              type="radio"
              v-model="user.sexe"
              :value="selectedValue"
              @change="changeValue"
            />
            <FormRadio
              label="Autre"
              name="sexe"
              type="radio"
              v-model="user.sexe"
              :value="selectedValue"
              @change="changeValue"
            />
          </div>
          <span
            >Avatar : <img :src="`${avatar}`" alt="Avatar utilisateur"
          /></span>
          <p>
            <span>Cliquer pour choisir un autre avatar :</span>
          </p>
          <div id="image-upload">
            <input
              type="file"
              @change="fileChanged"
              accept="image/*,video/*,audio/*"
            />
          </div>
          <!--Container pour le drag and drop-->
          <div
            id="drop-region"
            class="container"
            v-cloak
            @drop.prevent="addFile"
            @dragover.prevent
          >
            <h4 style="width: 250px; height: 150px; border: 2px dotted gray">
              ou placez votre avatar ici
              <li
                v-for="(file, id) in files"
                :key="id"
                class="list-group-item mb-3 border-top"
              >
                {{ file.name }}
                <button @click="removeFile(file)">Remove</button>
              </li>
            </h4>
          </div>
          <label for="birthdate">Date de naissance :</label>
          <div v-if="user.birthdate">
            {{ user.birthdate.substr(8, 2) }}/{{
              user.birthdate.substr(5, 2)
            }}/{{ user.birthdate.substr(0, 4) }}
          </div>
          <div v-else>
            <DateInput
              label="Date de naissance"
              name="birthdate"
              v-model="user.birthdate"
            />
          </div>
          <TextAreaInput
            label="Ce que vous avez envie de raconter sur vous :"
            name="bio"
            v-model="user.bio"
            placeholder="Ce que vous avez envie de raconter sur vous "
          />
          <button :disabled="invalid" class="submitButton">
            Mettre à jour
          </button>
        </ValidationObserver>
        <div class="boutons">
          <Bouton
            @click="goToPage()"
            text="Retourner à la page principale"
            class="submitButton"
          />
          <Bouton
            text="Supprimer le compte"
            @click="$refs.modaleSuppression.openModal()"
            class="submitButton"
          />
          <Modal ref="modaleSuppression">
            <template v-slot:header>
              <h1>Suppression du compte</h1>
            </template>
            <template v-slot:body>
              <p>Etes-vous sûr(e) de vouloir supprimer ce compte?</p>
              <p>Cette opération est irréversible.</p>
              <p>
                Cliquez sur Confirmer pour confirmer la suppression et sur
                Annuler pour annuler la suppression
              </p>
            </template>
            <template v-slot:footer>
              <div>
                <Bouton @click="deleteUser()" text="Confirmer" />
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
import FormTextInput from "../components/forms/FormTextInput.vue";
import TextAreaInput from "../components/forms/FormTextarea.vue";
import FormRadio from "../components/forms/FormRadio.vue";
import DateInput from "../components/forms/FormDate.vue";
import Bouton from "../components/Bouton.vue";
import Modal from "../components/modal.vue";
import router from "../router";
import { ValidationObserver } from "vee-validate";

export default {
  name: "profile",
  components: {
    Header,
    ValidationObserver,
    FormTextInput,
    TextAreaInput,
    DateInput,
    FormRadio,
    Bouton,
    Modal,
  },
  data() {
    const pseudo = sessionStorage.getItem("pseudo") || 0;
    const avatar = sessionStorage.getItem("avatar") || 0;
    return {
      pseudo,
      avatar,
      user: sessionStorage.getItem("user"),
      role: "0",
      selectedValue: "1",
      files: [],
      Avatars: [
        {
          name: "avatar1",
          img: "http://localhost:3000/upload/Avatars/avatar1.jpg",
        },
        {
          name: "avatar2",
          img: "http://localhost:3000/upload/Avatars/avatar2.png",
        },
        {
          name: "avatar3",
          img: "http://localhost:3000/upload/Avatars/avatar3.png",
        },
        {
          name: "avatar4",
          img: "http://localhost:3000/upload/Avatars/avatar4.png",
        },
        {
          name: "avatar5",
          img: "http://localhost:3000/upload/Avatars/avatar5.jpg",
        },
        {
          name: "avatar6",
          img: "http://localhost:3000/upload/Avatars/avatar6.png",
        },
        {
          name: "avatar7",
          img: "http://localhost:3000/upload/Avatars/avatar7.png",
        },
        {
          name: "avatar8",
          img: "http://localhost:3000/upload/Avatars/avatar8.png",
        },
        {
          name: "avatar9",
          img: "http://localhost:3000/upload/Avatars/avatar9.png",
        },
        {
          name: "avatar10",
          img: "http://localhost:3000/upload/Avatars/avatar10.png",
        },
        {
          name: "avatar11",
          img: "http://localhost:3000/upload/Avatars/avatar11.png",
        },
        {
          name: "Avatar neutre",
          img: "http://localhost:3000/upload/Avatars/default-avatar.jpg",
        },
        {
          name: "Avatar Homme 1",
          img: "http://localhost:3000/upload/Avatars/default-avatar-man.png",
        },
        {
          name: "Avatar Homme 2",
          img: "http://localhost:3000/upload/Avatars/default-avatar-man-2.png",
        },
        {
          name: "Avatar Femme 1",
          img: "http://localhost:3000/upload/Avatars/default-avatar-woman.png",
        },
        {
          name: "Avatar Femme 2",
          img: "http://localhost:3000/upload/Avatars/default-avatar-woman-2.png",
        },
        {
          name: "Avatar Femme 3",
          img: "http://localhost:3000/upload/Avatars/default-avatar-woman-3.png",
        },
      ],
      selectedAvatar: "",
    };
  },
  //Quand le DOM est monté, on lance getUser
  mounted() {
    this.getUser();
    this.userRole();
  },
  methods: {
    //Récupération de la valeur du boutn pour le sexe
    changeValue(newValue) {
      this.selectedValue = newValue;
      this.user.sexe = this.selectedValue;
    },
    //redirection vers la page d'articles
    goToPage() {
      router.push("/Posts");
    },
    //Profil du user
    userRole() {
      let userRole = "";
      const role = sessionStorage.getItem("role");
      role == 0
        ? (userRole = "membre")
        : role == 1
        ? (userRole = "modérateur")
        : (userRole = "administrateur");
      return userRole;
    },
    saveAvatar(selected) {
      let selectedAvatar = selected;
      this.user.avatar = selectedAvatar;
    },
    avatarChanged(e) {
      this.file = e.files[0];
      return this.file;
    },
    addFile(e) {
      let files = e.dataTransfer.files;
      [...files].forEach((file) => {
        this.files.push(file);
      });
      if (this.files.length != 0) {
        this.file = this.files[0];
      } else this.file = "";
      return this.file;
    },
    removeFile(file) {
      this.files = this.files.filter((f) => {
        return f != file;
      });
    },
    //Charger les données d'un utilisateur à partir du backend
    getUser() {
      //on récupère l'userId et le token qui ont été enregistrés dans le sessionStorage au moment du login
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      //requête get api/users/profile/:id
      axios
        .get("http://localhost:3000/api/users/profile/" + userId, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        // si OK, on récupère le user, on enregistre dans le sessionStorage
        .then((response) => {
          this.user = response.data.user;
          //on supprime le user qui était enregistré dans le sessionStorage
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
          let user = response.data.user;
          sessionStorage.setItem("avatar", user.avatar);
          const userEmail = response.data.email.emailDecrypted;
          this.user.email = userEmail;
          return this.user.email;
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
    fileChanged(event) {
      this.file = event.target.files[0];
      return this.file;
    },
    //Mise à jour profil utilisateur
    updateUser() {
      let userId = parseInt(sessionStorage.getItem("userId"));
      const avatar = sessionStorage.getItem("avatar");
      let birthdate = "";
      let updatedate = new Date().toISOString().slice(0, 19).replace("T", " ");
      if (this.user.birthdate != null) {
        birthdate = new Date(this.user.birthdate)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      }
      this.user.avatar = this.file
        ? this.file.name
        : avatar.split("/upload/Avatars/")[1];
      const dataForm = new FormData();
      if (this.user.lastname != "")
        dataForm.append("lastname", this.user.lastname);
      if (this.user.firstname != "")
        dataForm.append("firstname", this.user.firstname);
      if (this.user.pseudo != "") dataForm.append("pseudo", this.user.pseudo);
      if (this.user.email != "") dataForm.append("email", this.user.email);
      if (this.user.sexe != "") dataForm.append("sexe", this.user.sexe);
      if (this.user.birthdate != null) dataForm.append("birthdate", birthdate);
      if (this.user.avatar != "") dataForm.append("avatar", this.user.avatar);
      if (this.user.bio != "") dataForm.append("bio", this.user.bio);
      dataForm.append("updatedate", updatedate);
      const token = sessionStorage.getItem("token");
      //requête put api/users/profile/:id
      axios
        .patch("http://localhost:3000/api/users/profile/" + userId, dataForm, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // si Ok, message
        .then((response) => {
          console.log(response);
          alert("Votre profil a bien été mis à jour!");
          this.getUser();
          location.reload();
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
    //Suppression profil utilisateur
    deleteUser() {
      const userId = parseInt(sessionStorage.getItem("userId"));
      const token = sessionStorage.getItem("token");
      console.log(userId);
      //requête delete api/users/profile/:id
      axios
        .delete("http://localhost:3000/api/users/profile/" + userId, {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        //si OK, on efface le sessionStorage et on redirige vers le signup
        .then((response) => {
          sessionStorage.clear();
          console.log(response);
          router.push("/Signup");
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
