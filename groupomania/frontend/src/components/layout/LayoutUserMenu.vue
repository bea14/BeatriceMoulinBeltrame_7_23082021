<template>
  <div class="userAside">
    <h2>Bienvenue {{ this.userName }}</h2>
    <div class="buttons-full">
      <router-link role="button" to="/CreatePost"
        >Ecrire un article</router-link
      >
    </div>
    <div class="user-submenu">
      <span class="subtitle">Mon compte</span>
      <p>
        <router-link :to="{ name: 'Profile', params: { userId: this.userId } }"
          >Mon profil</router-link
        >
      </p>
      <p v-if="userIsAdmin">
        <router-link :to="{ name: 'Admin' }">Administration</router-link>
      </p>
      <p>
        <router-link :to="{ name: 'User', params: { userId: this.userId } }"
          >Mes articles</router-link
        >
      </p>
      <!--<p> Messages</p>-->
      <p @click="Logout()">Déconnexion</p>
    </div>
  </div>
</template>

<script>
import router from "../../router";

export default {
  name: "UserMenu",
  data() {
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("pseudo");
    let userIsAdmin = this.functionUserIsAdmin();
    return {
      user: sessionStorage.getItem("user"),
      userIsAdmin,
      userName,
      userId,
    };
  },
  methods: {
    Logout() {
      sessionStorage.clear();
      router.push("/Login");
    },
    functionUserIsAdmin() {
      const role = sessionStorage.getItem("role") || 0;
      let userIsAdmin = false;
      if (role == 1 || role == 2) {
        userIsAdmin = true;
        console.log("userIsAdmin", userIsAdmin);
        return userIsAdmin;
      }
    },
  },
};
</script>
