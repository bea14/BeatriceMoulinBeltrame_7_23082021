<template>
  <div class="profile">
    <h1>Profil {{ userRole }} de {{ pseudo }}</h1>
    <h2>Compte créé le {{ user.user_creationdate_fr }}</h2>
    <div class="form">
      <ValidationObserver v-slot="{ invalid }" tag="form" class="formulaire" @submit.prevent="updateUser">
        <FormTextInput label="Nom :" name="lastname" type="text" v-model="user.lastname" placeholder="Votre nom "/>
        <FormTextInput label="Prénom :" name="firstname" type="text" v-model="user.firstname" placeholder="Votre prénom "/>
        <FormTextInput label="Pseudo :" name="pseudo" type="text" v-model="user.pseudo" placeholder="Votre pseudo"/>
        <FormTextInput label="Email : (not visible for the moment)" name="email" v-model="user.email" placeholder="Votre email"/>
        <FormTextInput rules="min:6" label="Mot de passe :(not visible for the moment)" name="password" v-model="user.password" placeholder="Votre mot de passe"/>
        <!--<FormCheckBox name="Masculin" type="radio" v-model="user.sexe" value="M "/>Masculin
        <FormCheckBox name="Feminin" type="radio" v-model="user.sexe" value="F "/>Féminin
        <FormCheckBox name="Autre" type="radio" v-model="user.sexe" value="A "/>Autre--->
        <span>Votre avatar : <img :src="`${user.avatar}`" alt="Avatar utilisateur"></span> 
        
        <input type="file" id="fileElem" multiple accept="image/*" style="display:none" onchange="handleFiles(this.files)">
        <a href="#" id="fileSelect">Sélectionnez des fichiers</a>
        <div id="fileList">
          <p>Aucun fichier sélectionné !</p>
        </div>
        
        <p>
          <span >Cliquer pour choisir un avatar :</span>
        </p>
        <div id="image-upload">
          <div v-for="avatar in Avatars" :key="avatar.name" :value="avatar.img" class="avatarsPreview" @click="saveAvatar(avatar.img)" @change="fileChanged($event)">
            <img :src="`${avatar.img}`" alt="image d'un avatar">
          </div>
        </div>     
        <!--<DateInput label="Date de naissance" name="birthdate" type="date" v-model="user.birthdate" placeholder="Votre date de naissance "/>-->     
        <TextAreaInput label="Votre histoire :" name="bio" v-model="user.bio" placeholder="Votre histoire "/>
        <button :disabled="invalid" class="submitButton" >Mettre à jour après modifications</button>
      </ValidationObserver>
      <div class="boutons">
      <Bouton @click="goToPage()" text="Valider et aller à la page principale" class="submitButton" />
      <Bouton text="Supprimer le compte" @click="$refs.modaleSuppression.openModal()" class="submitButton" />
      <Modal ref="modaleSuppression">
        <template v-slot:header>
          <h1>Suppression du compte</h1>
        </template>
        <template v-slot:body>
          <p>Etes-vous sûr(e) de vouloir supprimer ce compte?</p>
          <p>Cette opération est irréversible.</p>
          <p>Cliquez sur Confirmer pour confirmer la suppression et sur Annuler pour annuler la suppression</p>
        </template>
        <template v-slot:footer>
          <div>            
            <Bouton @click="deleteUser()" text="Confirmer" />      
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
//import FormCheckBox from '../components/forms/FormCheckbox.vue';
//import DateInput from "../components/forms/FormDate.vue";
import Bouton from "../components/Bouton.vue";
import Modal from "../components/modal.vue";
import router from "../router";
import { ValidationObserver } from "vee-validate";

export default {
  name: "profile",
  components: {
    ValidationObserver,
    FormTextInput,
    TextAreaInput,
    //DateInput,
    //FormCheckBox,
    Bouton,
    Modal
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
      user: sessionStorage.getItem("user"),
      role: "0",
      Avatars: [
        {name:'avatar1', img: 'http://localhost:3000/upload/Avatars/avatar1.jpg'},
        {name:'avatar2', img: 'http://localhost:3000/upload/Avatars/avatar2.png'},
        {name:'avatar3', img: 'http://localhost:3000/upload/Avatars/avatar3.png'},
        {name:'avatar4', img: 'http://localhost:3000/upload/Avatars/avatar4.png'},
        {name:'avatar5', img: 'http://localhost:3000/upload/Avatars/avatar5.jpg'},
        {name:'avatar6', img: 'http://localhost:3000/upload/Avatars/avatar6.png'},
        {name:'avatar7', img: 'http://localhost:3000/upload/Avatars/avatar7.png'},
        {name:'avatar8', img: 'http://localhost:3000/upload/Avatars/avatar8.png'},
        {name:'avatar9', img: 'http://localhost:3000/upload/Avatars/avatar9.png'},
        {name:'avatar10', img: 'http://localhost:3000/upload/Avatars/avatar10.png'},
        {name:'avatar11', img: 'http://localhost:3000/upload/Avatars/avatar11.png'},
        {name:'Avatar neutre', img: 'http://localhost:3000/upload/Avatars/default-avatar.jpg'},
        {name:'Avatar Homme 1', img: 'http://localhost:3000/upload/Avatars/default-avatar-man.png'},
        {name:'Avatar Homme 2', img: 'http://localhost:3000/upload/Avatars/default-avatar-man-2.png'},
        {name:'Avatar Femme 1', img: 'http://localhost:3000/upload/Avatars/default-avatar-woman.png'},
        {name:'Avatar Femme 2', img: 'http://localhost:3000/upload/Avatars/default-avatar-woman-2.png'},
        {name:'Avatar Femme 3', img: 'http://localhost:3000/upload/Avatars/default-avatar-woman-3.png'},
      ],
      selectedAvatar:''
    }
  },
  //Quand le DOM est monté, on lance getUser
  mounted() {
    this.getUser();
  },  
  methods: {
    //redirection vers la page d'articles
    goToPage() {
      router.push("/Posts");
    },
    chargerAvatars(){
      window.URL = window.URL || window.webkitURL;
      var fileSelect = document.getElementById("fileSelect"),
          fileElem = document.getElementById("fileElem");
      fileSelect.addEventListener("click", function (e) {
        if (fileElem) {
          fileElem.click();
        }
        e.preventDefault(); // empêche la navigation vers "#"
      }, false);
    },
    handleFiles(files) {
      this.chargerAvatars()
      var fileList = document.getElementById("fileList")
      if (!files.length) {
        fileList.innerHTML = "<p>Aucun fichier sélectionné !</p>";
      } else {
        fileList.innerHTML = "";
        var list = document.createElement("ul");
        fileList.appendChild(list);
        for (var i = 0; i < files.length; i++) {
          var li = document.createElement("li");
          list.appendChild(li);
          var img = document.createElement("img");
          img.src = window.URL.createObjectURL(files[i]);
          img.height = 60;
          img.onload = function() {
            window.URL.revokeObjectURL(this.src);
          }
          li.appendChild(img);
          var info = document.createElement("span");
          info.innerHTML = files[i].name + ": " + files[i].size + " bytes";
          li.appendChild(info);
        }
      }
    },
    saveAvatar(selected){
      let selectedAvatar = selected;
      this.user.avatar = selectedAvatar;
      console.log('SSSSSSSSSSSSSSSAAAAAAVVVVVV', selectedAvatar)
      return this.user.avatar
    },
    //Charger les données d'un utilisateur à partir du backend
    getUser() {
      //on récupère l'userId et le token qui ont été enregistrés dans le sessionStorage au moment du login
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      console.log('userID', userId);
      console.log('token', token);
      //requête get api/users/profile/:id
      axios
      .get("http://localhost:3000/api/users/profile/" + userId, {
        headers: { 
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      // si OK, on récupère le user, on enregistre dans le sessionStorage
      .then((response) => {
        this.user = response.data.user;          
        console.log('user', response.data);
        console.log(response.data. emailDecrypted)
        //on supprime le user qui était enregistré dans le sessionStorage
        //sessionStorage.removeItem("user");
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
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
      return this.file;
    },
    //Mise à jour profil utilisateur
    updateUser() {
      let userId = parseInt(sessionStorage.getItem("userId"));
      let updatedate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      //let date = this.editedUser.userSelected.birthdate;
      //let birthdate = date.toISOString().slice(0, 19).replace('T', ' ')
      /*const dataForm = {
        lastname: this.user.lastname, 
        firstname: this.user.firstname,
        pseudo: this.user.pseudo,
        //email: this.user.email,
        //password: this.user.password,
        //sexe: this.user.sexe,
        avatar: this.user.avatar,
        //birthdate: this.user.birthdate,
        bio: this.user.bio,
        creationdate: JSON.parse(sessionStorage.getItem("user")).creationdate,
        updatedate: updatedate,
        role: sessionStorage.getItem("role"),
      }*/
      const dataForm = new FormData();
      if (this.user.lastname !="") dataForm.append("lastname", this.user.lastname);
      if (this.user.firstname !="") dataForm.append("firstname", this.user.firstname);
      if (this.user.pseudo !="") dataForm.append("pseudo", this.user.pseudo);
      if (this.file.name !="") dataForm.append("avatar", this.file.name);
      if (this.user.bio !="") dataForm.append("bio", this.user.bio);
      dataForm.append("updatedate", updatedate);
      dataForm.append("media", this.file);
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',this.user.lastname);
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',this.user.firstname);
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',this.user.pseudo);
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',this.file.name);
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',this.user.bio);
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',this.file.name);
        console.log('eeeeeeeeeeeeeeeeeeeeeeee',dataForm);

      //const token = sessionStorage.getItem("token");      
      //requête put api/users/profile/:id
      axios
      .patch('http://localhost:3000/api/users/profile/'+userId,dataForm, {
        /*headers: { 
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },*/
      })
      // si Ok, message
      .then((response) => {
        console.log(response);
        alert('Votre profil a bien été mis à jour!');
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
    //Suppression profil utilisateur
    deleteUser() {
      const userId = parseInt(sessionStorage.getItem("userId"));
      const token = sessionStorage.getItem("token");
      console.log(userId);
      //requête delete api/users/profile/:id
      axios
      .delete('http://localhost:3000/api/users/profile/'+userId,{
        headers: { 
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      //si OK, on efface le sessionStorage et on redirige vers le signup
      .then((response) => {
        sessionStorage.clear();
        console.log(response);
        router.push("/Signup");
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
.profile{
  margin: 60px auto 5rem auto;
  border-radius: $border-radius-m;
  box-shadow: $net-shadow;
  background-color: white;
  max-width: 48rem;
  width: 100%;
}

.form {
  padding: 1rem 2rem;
  img {
    width: 100px;
  }
  #image-upload {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .avatarsPreview {
    width: 80px;
    img {
      width: 80px;
    }
  }
}

.boutons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 0.5rem 0;
    @media screen and (min-width: 768px) {
    flex-direction: row;      
    }
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
</style>
