<!--Composant de la page d'accueil qui affiche les boutons d'inscription et de connexion-->
<template>
  <div class="welcome">
    <div class="welcome_top">
      <div class="welcome_top_full">
        <img
          src="../assets/img/teamwork-3213924.jpg"
          class="imagetop"
          alt="collegues de bureau se tapant dans les poings"
        />
      </div>
      <div class="welcome_top_title">
        <h1>Bienvenue sur le réseau social de l'entreprise Groupomania !</h1>
      </div>
      <div class="welcome_top_bottom">
        <img
          src="../assets/img/icon.png"
          class="imagebottom"
          alt="logo groupomania"
          height="100"
        />
        <h2>Groupomania</h2>
        <!--<img
          src="../assets/img/icon-left-font-monochrome-black.png"
          class="imagebottom"
          alt="logo groupomania"
          height="412"
        />-->
      </div>
    </div>
    <div class="welcome_bottom">
      <div class="buttons">
        <router-link to="/Signup" class="buttons-empty" role="button"
          >S'inscrire</router-link
        >
        <router-link to="/Login" class="buttons-full" role="button"
          >Se connecter</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  props: {
    msg: String,
  },
};
</script>
