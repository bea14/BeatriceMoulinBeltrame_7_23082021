<!--Page d'accueil qaund on arrive sur le site. Affiche une image et propose login ou signup. Charge le composant Welcome-->
<template>
  <div id="home">
    <Welcome />
  </div>
</template>

<script>
import Welcome from "../components/Welcome";
import router from "../router";

export default {
  name: "Home",
  components: {
    Welcome,
  },
  //si l'utilisateur est déjà connecté, on redirige vers la page des articles
  beforeMount() {
    if (sessionStorage.getItem("userId") && sessionStorage.getItem("token")) {
      console.log("l'utilisateur est connecté");
      router.push("/Posts");
    }
  },
};
</script>
