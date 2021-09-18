<!--Compoosant de la page d'accueil qui affiche les boutons d'inscription et de connexion-->
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
      <div class="welcome_background"></div>
      <div class="welcome_top_bottom">
        <!--<img
          src="../assets/img/icon-left-font-monochrome-white.png"
          class="imagebottom"
          alt="logo groupomania"
          height="412"
        />-->
        <img
          src="../assets/img/icon-left-font-monochrome-black.png"
          class="imagebottom"
          alt="logo groupomania"
          height="412"
        />
      </div>
    </div>
    <div>
      <h1>Bienvenue sur le réseau social de l'entreprise Groupomania !</h1>
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

<style lang="scss">
@import "../assets/styles/utils/_variables.scss";
.welcome {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  h1 {
    text-align: center;
  }
  &_top {
    //background-color: $primary-color;
    height: 50vh;
    position: relative;
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding-bottom: 4rem;
    @media screen and (min-width: 992px) {
      align-items: flex-end;
      justify-content: flex-start;
      padding-left: 6rem;
    }
    @media screen and (min-width: 1200px) {
      padding-left: 2rem;
    }
    &_full {
      overflow: hidden;
      box-sizing: border-box;
      height: 60vh;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: 0;
      @media screen and (min-width: 768px) {
        height: 57vh;
      }
      .imagetop {
        box-sizing: border-box;
        border: none;
        display: block;
        min-width: 100%;
        max-width: 100%;
        min-height: 100%;
        max-height: 100%;
        object-fit: cover;
        opacity: 0.2;
        width: 100vw;
        height: 100%;
      }
    }
    &_bottom {
      box-sizing: border-box;
      max-width: 100%;
      padding-left: 6rem;
      padding-right: 6rem;
      position: absolute;
      bottom: 0;
      @media screen and (max-width: 767px) {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }
      .imagebottom {
        max-width: 100%;
        display: block;
        margin: 0;
        padding: 0;
        border: 0;
      }
    }
  }
  &_background {
    background-color: $primary-color;
    opacity: 0.2;
    height: 50vh;
    position: absolute;
  }
  &_bottom {
    color: $primary-color;
    //margin: 1rem auto;
    .buttons {
      display: flex;
      flex-direction: column;
      text-align: center;
      padding-right: 6rem;
      padding-left: 6rem;
      padding-top: 2rem;
      padding-bottom: 2rem;
      justify-content: center;
      align-items: center;
      @media screen and (min-width: 992px) {
        flex-direction: row;
        padding-top: 6rem;
        padding-bottom: 6rem;
        justify-content: flex-end;
      }
      &-empty {
        color: $primary-color;
        border-radius: $border-radius-m;
        border: 1px solid $primary-color;
        padding-left: 4rem;
        padding-right: 4rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        margin-bottom: 2rem;
        font-weight: bold;
        text-align: center;
        background-color: white;
        width: 160px;
        @media screen and (min-width: 992px) {
          margin-right: 0.5rem;
          margin-bottom: 0;
        }
      }
      &-full {
        background-color: $primary-color;
        color: white;
        border-radius: $border-radius-m;
        border: 1px solid $primary-color;
        width: 160px;
        padding-right: 4rem;
        padding-left: 4rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        font-weight: bold;
        text-align: center;
      }
      a {
        text-decoration: none;
      }
    }
  }
}
</style>
