<template>
  <header class="header">
    <div class="logo" @click="goToHome()">
      <img src="../../assets/img/icon.png" alt="Logo Groupomania" />
      <span>Groupomania</span>
    </div>
    <!--<div class="searchbar">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Rechercher" />
    </div>-->
    <div class="menu">
      <div v-if="showButtons()" class="buttons">
        <router-link role="button" to="/CreatePost" class="buttons-empty">Ecrire un article</router-link>
      </div>
      <!--<div v-else class="buttons">
        <router-link role="button" to="/Signup" class="buttons-empty">S'inscrire</router-link>
        <router-link role="button" to="/Login" class="buttons-full">Se connecter</router-link>
      </div>-->
      <div class="user" v-if="showButtons()">
        <div class="user-details" @click="toggleVisibility('menu-details-click')">
          <img src="../../assets/img/default-avatar.jpg" alt="avatar utilisateur" width="40" />
          <i class="fas fa-sort-down"></i>
          <section class="menu-details" id="menu-details-click">
            <div class="menu-details-name">
                <h2>{{ this.userName }}</h2>
            </div>
            <div class="menu-details-submenu">
                <p><router-link :to="{ name: 'Profile', params: { userId: this.userId } }">Mon profil</router-link></p>              
                <p  v-if="userIsAdmin"> <router-link :to="{ name: 'Admin' }">Administration</router-link></p>
                <p> <router-link :to="{ name: 'User', params: { userId: this.userId } }">Mes articles</router-link></p>
                <p> Mes commentaires</p>
                <p> Messages</p>
                <p @click="Logout()">Déconnexion</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import router from "../../router";

export default {
  components: {
  },
  data(){
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("pseudo");
    let userIsAdmin = this.functionUserIsAdmin();
    return {
      userIsAdmin,
      userName,
      userId
    }
  },
  methods: {
    goToHome() {
      this.$emit("goToHome", true);
    },
    showButtons() {
      console.log(window.location.pathname.split('/'));
      let buttons = true;
      let path = window.location.pathname;
      if (path == "/" || path == "/Signup"  || path == "/Login") {
        buttons = false;
      }
      console.log(buttons);
      return buttons;
    },
    Logout(){
      sessionStorage.clear();
      router.push("/Login");
    },
    toggleVisibility(el) {
      var div = document.getElementById(el);
      div.style.display = div.style.display == "block" ? "none" : "block";
    },
    functionUserIsAdmin(){
      const role = sessionStorage.getItem('role') || 0;
      let userIsAdmin = false;
      if (role == 1 || role ==2) {
        userIsAdmin = true
        console.log("userIsAdmin", userIsAdmin)
        return userIsAdmin
      }
    }       
  },
  mounted(){
    this.functionUserIsAdmin();
  },
  beforeMount(){    
    this.showButtons();
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/utils/_variables.scss";
.header {
 /* height: 4rem;*/
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.5rem;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  @media screen and (min-width: 768px){
    flex-direction: row;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: #1c1c1c;
    cursor: pointer;
    order:-1;
    .span {
      font-size: 20px;
      width: auto;
    }
    img {
      height: 40px;
      object-fit: contain;
      border-radius: 15px;
    }
  }
  .menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      @media screen and (min-width: 768px) {
          flex-direction: row;
        } 
      &-empty,
      &-full {
        display: flex;
        height: 60%;
        width: 130px;
        align-items: center;
        justify-content: space-around;
        text-decoration: none;
        line-height: 1.5rem;
        text-align: center;
      }
      &-empty {
        background-color: white;
        color: $primary-color;
        font-weight: bold;
        border-radius: 20px;
        border: 1px solid $primary-color;
        margin-bottom: 0.5rem;
        @media screen and (min-width: 768px) {
          margin-bottom: 0;
          margin-right: 0.5rem;
        } 
      }
      &-full {
        background-color: $primary-color;
        color: white;
        font-weight: bold;
        border-radius: 20px;
        border: 1px solid $primary-color;
      }
    }
    .user {
      margin-left: 10px;
      display: flex;
      width: 50px;
      padding: 10px;
      justify-content: space-between;
      margin-right: 20px;
      :hover {
        padding: 9px;
        border: 1px solid #edeff1;
        border-radius: 5px;
        cursor: pointer;
      }
      &-details {
        display: flex;
        align-items: center;
        position: relative;
        right: 250px;
        .menu-details {
          font-size: 12px;
          height: 6vh;
          display: none;
          min-width: 20vw;
          max-width: 100vw;
          border: 1px solid black;
          h2 {
            margin: 0;
          }
          &-name, &-submenu{
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            background-color: white;
          }
        }
      }
    }
  }
}
    
/*.searchbar {
  background-color: $bg-body;
  padding: 0 15px;
  border-radius: 5px;
  margin: 0 16px;
  display: flex;
  align-items: center;
  border: 1px solid $bg-body;
  flex-grow: 1;
  min-width: 680px;
  max-width: 70vw;
  width: 100%;
  height: auto;
  line-height: 1.78rem;
  input {
    min-width: 60px;
          height: 5vh;
    margin-left: 10px;
    background-color: $bg-body;
    padding: -10px;
    font-size: 13px;
    width: 280px;
    border: 0;
    line-height: 1.78rem;
    :focus {
      outline: none;
    }
  }
}*/
</style>
