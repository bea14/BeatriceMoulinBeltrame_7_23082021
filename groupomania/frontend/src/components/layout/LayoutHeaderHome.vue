<template>
  <header class="header">
    <div class="logo" @click="goToHome()">
      <img src="../../assets/img/icon.png" alt="Logo Groupomania" />
      <span>Groupomania</span>
    </div>
    <div class="buttons">
      <router-link to="/Signup" class="buttons-empty" role="button"
        >S'inscrire</router-link
      >
      <router-link to="/Login" class="buttons-full" role="button"
        >Se connecter</router-link
      >
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$emit("goToHome", true);
    },
  },
};
</script>
