<template>
  <div class="aside">
    <!--Menu utilisateur-->
    <div class="aside-user">
      <UserMenu />
    </div>
    <!--Règles du forum-->
    <div class="aside-top">
      <span class="aside-header">Règles du forum</span>
      <Rules />
    </div>
    <!--Annuaire des membres du forum-->
    <div class="aside-bottom">
      <span class="aside-header">Les membres du forum</span>
      <div class="aside-list" v-for="user in allUsers" :key="user.id" :postData="user" @refresh="getUsers()" >
        <ul>
          <li><img :src="`${user.avatar}`" alt="Avatar utilisateur"> - {{ user.pseudo }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Rules from './postRules.vue';
import UserMenu from '../layout/LayoutUserMenu.vue';

const axios = require("axios").default;

export default {
  components : {
    Rules,
    UserMenu
  },  
  data() { 
    return {
      allUsers: [],
    };
  },
  //Quand le DOM est monté, on lance getUser
  mounted() {
    this.getUsers();
  },  
  methods: {
    getUsers() {
      const token = sessionStorage.getItem("token");
      axios
      .get("http://localhost:3000/api/users/profile/", {
        headers: { 'Authorization': "Bearer " + token },
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
  },
};
</script>