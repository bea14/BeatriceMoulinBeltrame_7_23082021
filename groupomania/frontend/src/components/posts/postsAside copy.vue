<template>
  <div class="aside">
    <div class="aside-top">
      <h1>Règles du forum</h1>
      <Rules />
    </div>
    <div class="aside-bottom">
      <span  class="aside-header">Les membres du forum</span>
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
const axios = require("axios").default;
export default {  
  data() { 
    return {
      userss: null,
      allUsers: [],
    };
  },
  components : {
    Rules
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
        });
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/utils/_variables.scss";
.aside {
  display: flex;
  flex-direction: column;
  &-top, &-bottom {
  background-color: white;
  border-radius: $border-radius-m;
    width: 100%;
    margin-left: 0.2rem;
  }
  &-top {
    h2{
      margin: 0;
      padding: 0.5rem 0;
      background-image: linear-gradient(135deg,$secondary-color, $primary-color);
      color: white;
    }
  }
  &-bottom {
    margin-top: 2rem;
    text-align: center;
    span {      
      background-image: linear-gradient(135deg,$secondary-color, $primary-color);
      color: white;
      display: block;
      padding: 0.5rem 0;
      width: 100%
    }
  }
  &-header {
    background-color: $secondary-color;
    color: white;
    padding: 0.2rem;
  }
  &-list{
    text-align: left;
    padding-left: 10px;
    ul {
      list-style-type: none;
    }
    li img {
      width: 50px;
    }
  }
}
</style>
