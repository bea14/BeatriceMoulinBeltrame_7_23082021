<template>
  <div class="maincontainer">
    <Header @gotohome="path = '/Posts'"/>
    <div class="admin">
      <div>
        <router-link to="/Posts">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
          <span>Retour au forum</span>
        </router-link>
      </div>
      <div class="admin-title">
        <h1>Administration du forum</h1>
      </div>
      <div class="table-heading">
        <i class="fas fa-users fa-2x" aria-hidden="true"></i>
        <h2>Membres du forum</h2>
      </div>
      <div class="table-body" tabindex="0">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">id</th>              
              <th scope="col">role</th>
              <th scope="col">Pseudo</th>
              <th scope="col">Avatar</th>
              <th scope="col" v-if="userIsAdmin" >Supprimer</th>
              <th scope="col">Contacter</th>
            </tr>
          </thead>
          <tbody class="table-users">
            <tr v-for="user in allUsers" :key="user.id">
              <th scope="row">{{ user.id }}</th>
              <th scope="row">{{ user.role }}
                <div v-if="userIsAdmin">
                   <input                   
                    type="text"
                    id="newRole"
                    name="updateRole"
                    placeholder="role"
                    v-model="user.role"
                    onfocus="if(value !== '') {value=''}"
                    @keyup.enter="updateRole(`${user.id}`,`${user.role}`,`${user.avatar}`)"
                  />
                </div>
              </th>
              <td>{{ user.pseudo }}</td>
              <td><img :src="`${user.avatar}`" alt="avatar utilisateur"></td>
              <td v-if="userIsAdmin" >
                <!--<div @click="$refs.modaleSuppressionUser.openModal()" :userId="`${user.id}`">-->
                <div @click="deleteUser(`${user.id}`)">
                  <i class="fas fa-user-times fa-lg" aria-hidden="true"></i>
                </div>
              </td>
              <td>
                <a @click="mailToUser(user.id)">
                    <i class="fas fa-envelope fa-lg" aria-hidden="true"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-heading">
        <i class="fas fa-newspaper fa-2x" aria-hidden="true"></i>
        <h2>Tous les articles</h2>
      </div>
      <p class="alert-reporting">
        <span>Attention !</span><br /> 
        Il y a <span class="weightbold">{{ reportedPostsCount().length }}</span> article(s) signalé(s)
      </p>
      <div class="table-body" tabindex="0">
        <table  class="table table-striped">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Titre</th>
              <th scope="col">Contenu</th>
              <th scope="col">Auteur</th>
              <th scope="col">Signalement</th>
              <th scope="col">Supprimer</th>
            </tr>
          </thead>
          <tbody class="table-posts">
            <tr v-for="post in allPosts" :key="post.id" :class="`${postIsReported(post.id) ? 'red' : ''}`">
              <th scope="row">{{ post.id }}</th>
              <td>{{ post.title}}</td>
              <td>{{ post.content }}</td>
              <td>{{ post.pseudo }}</td>
              <td>{{ post.isreported }}</td>
              <td>
                <!--<div @click="$refs.modaleSuppressionPost.openModal()" :postId="`${post.id}`">-->
                  <div @click="deletePost(`${post.id}`)">                  
                  <i class="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="boutons">
        <Bouton @click="goToPage()" text="Retourner à la page principale" class="submitButton" />
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Header from "../components/layout/LayoutHeader.vue";
import Bouton from "../components/Bouton.vue";
import router from "../router";

export default {
  name: "Admin",
  components: {
    Header,
    Bouton
  },
  data() {
      let userIsAdmin = this.functionUserIsAdmin();
    return {
      allUsers: [],
      allPosts: [],
      userIsAdmin,
    };
  },
   //Quand le DOM est monté, on lance getUsers et getPosts
  mounted() {
    this.getUsers();
    this.getPosts();
    this.functionUserIsAdmin();
  },
  methods: {
    goToPage() {
      router.push("/Posts");
    },
    functionUserIsAdmin(){
      const role = sessionStorage.getItem('role') || 0;
      let userIsAdmin = false;
      if (role ==2) {
        userIsAdmin = true
        return userIsAdmin
      }
    },
    getUsers() {
      //on récupère le token pour l'authentification des routes
      const token = sessionStorage.getItem("token");
      //appel à l'API GET api/users/profile/ pour récupérer tous les utilisateurs
      axios
      .get("http://localhost:3000/api/users/profile/", {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .then((response) => {
        this.allUsers = response.data.results;
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
    updateRole(id,role,avatar){
      //on récupère le token pour l'authentification des routes
      const token = sessionStorage.getItem("token");
      //on récupère l'id de l'utilisateur à supprimer
      const userId = id;
      const dataForm = new FormData();
      let updatedate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let newRole = parseInt(role);      
      let userAvatar = avatar.split("/upload/Avatars/")[1];
      dataForm.append("avatar", userAvatar);
      dataForm.append("updatedate", updatedate);
      dataForm.append("role", newRole);
      //appel à l'API GET api/users/profile/:id pour updater l'utilisateur
      axios
      .patch('http://localhost:3000/api/users/profile/'+userId,dataForm, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        alert('Le rôle a bien été mis à jour!');
        this.getUsers();
        location.reload();
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
    getPosts() {
      //on récupère le token pour l'authentification des routes
      const token = sessionStorage.getItem("token");
      //appel à l'API GET api/topics/ pour récupérer tous les posts
      axios
      .get("http://localhost:3000/api/topics", {
        headers: { 'Authorization': "Bearer " + token },
      })
      .then((response) => {
        this.allPosts = response.data.post;
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
    //nombre de posts signales    
    reportedPostsCount() {
      const count = this.allPosts.filter((post) => post.isreported == "O");
      return count;
    },
    //Verifie si un post est signale
    postIsReported(id){
      let postIsReported = false;
      const postReported = this.allPosts.filter((post) => post.isreported == "O" && post.id == id);
      if (postReported.length != 0) {postIsReported = true}
      return postIsReported;
    },
    //Suppression utilisateur
    deleteUser(id) {
      //on récupère l'id de l'utilisateur à supprimer
      const user = id;
      //on récupère le token pour l'authentification des routes
      const token = sessionStorage.getItem("token");
      //requête delete api/users/profile/:id
      axios
      .delete('http://localhost:3000/api/users/profile/'+user,{
        headers: { 
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      //si OK, on recharge la page
      .then((response) => {
        console.log(response);
        alert('l\'utilisateur a bien été supprimé')
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
    //Suppression post
    deletePost(id) {      
      const postId = id;
      const token = sessionStorage.getItem("token");
      //requête delete api/topics/:id
      axios
      .delete('http://localhost:3000/api/topics/'+postId,{
          headers: { "Authorization": "Bearer " + token },
      })
      //si OK, on recharge la page
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
    //Fonction qui sert à envoyer un message à l'utilisateur
    mailToUser(id) {
      alert("Vous pouvez envoyer un message privé à l'utilisateur "+id+". Désolé mais cette fonction n'est pas encore utilisable !")
    },
  },
}
</script>