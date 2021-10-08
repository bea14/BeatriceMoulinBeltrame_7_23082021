<template>
  <header class="header">
    <div class="logo" @click="goToHome()">
      <img src="../../assets/img/icon.png" alt="Logo Groupomania" />
      <span>Groupomania</span>
    </div>
    <div>
      <Searchbar />
    </div>
    <div class="user">
      <div class="user-details" @click="toggleVisibility('menu-details-click')">
        <img
          :src="`${avatar}`"
          alt="avatar utilisateur"
          class="user-details-avatar"
        />
        <i class="fas fa-sort-down"></i>
        <section class="menu-details" id="menu-details-click">
          <div class="menu-details-name">
            <h2>{{ this.userName }}</h2>
          </div>
          <div class="menu-details-submenu">
            <div class="buttons-full">
              <router-link role="button" to="/CreatePost"
                >Ecrire un article</router-link
              >
            </div>
            <p>
              <router-link
                :to="{ name: 'Profile', params: { userId: this.userId } }"
                >Mon profil</router-link
              >
            </p>
            <p v-if="userIsAdmin">
              <router-link :to="{ name: 'Admin' }">Administration</router-link>
            </p>
            <p>
              <router-link
                :to="{ name: 'User', params: { userId: this.userId } }"
                >Mes articles</router-link
              >
            </p>
            <!--<p> Mes commentaires</p>
              <p> Messages</p>-->
            <p @click="Logout()">Déconnexion</p>
          </div>
        </section>
      </div>
    </div>
  </header>
</template>

<script>
import router from "../../router";
import Searchbar from "./LayoutSearchbar.vue";

export default {
  components: {
    Searchbar,
  },
  data() {
    const avatar = sessionStorage.getItem("avatar");
    const userName = sessionStorage.getItem("pseudo");
    const userId = sessionStorage.getItem("userId");
    let userIsAdmin = this.functionUserIsAdmin();
    return {
      changePath: 0,
      avatar,
      userName,
      userIsAdmin,
      userId,
    };
  },
  methods: {
    goToHome() {
      this.$emit("goToHome", true);
    },
    Logout() {
      sessionStorage.clear();
      router.push("/Login");
    },
    toggleVisibility(el) {
      var div = document.getElementById(el);
      div.style.display = div.style.display == "block" ? "none" : "block";
    },
    functionUserIsAdmin() {
      const role = sessionStorage.getItem("role") || 0;
      let userIsAdmin = false;
      if (role == 1 || role == 2) {
        userIsAdmin = true;
        return userIsAdmin;
      }
    },
  },
};
</script>
