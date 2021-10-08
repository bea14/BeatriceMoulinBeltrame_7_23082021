<!--Page du forum, affiche les articles. Possibilité de tri par date-->
<template>
  <div class="maincontainer">
    <Header @gotohome="path = '/Posts'" />
    <div class="posts">
      <div class="container">
        <div class="posts-container">
          <div class="body-left">
            <h1>Forum Groupomania</h1>
            <p class="UpText">
              Le lieu où vous pouvez échanger des textes, photos, vidéos, liens
              avec vos collègues. Ce forum est surveillé par des modérateurs
              mais nous vous demandons de respecter quelques règles simples.<br />
              Merci à vous et profitez bien !
            </p>
            <!--Tri des articles-->
            <FilteredPost v-on:sortingdate="setSelected($event)" />
            <!--Affichage des articles-->
            <PostsPreview
              v-for="post in sortedPosts"
              :key="post.id"
              :postData="post"
            />
          </div>
          <!--Aside qui permet d'afficher quelques règles et les membres du forum-->
          <div class="body-right">
            <Aside />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import Header from "../components/layout/LayoutHeader.vue";
import FilteredPost from "../components/posts/postsFilter.vue";
import Aside from "../components/posts/postsAside.vue";
import PostsPreview from "../components/posts/postsPreview.vue";

export default {
  name: "Posts",
  components: {
    Header,
    FilteredPost,
    Aside,
    PostsPreview,
  },
  data() {
    let path = window.location.pathname;
    return {
      path,
      posts: [],
      filterByDate: [],
      allPosts: [],
      sortingDate: "",
      datetri: "",
    };
  },
  methods: {
    getPosts() {
      //on récupère le token pour l'authentification des routes
      const token = sessionStorage.getItem("token");
      //appel à l'API GET api/topics/
      axios
        .get("http://localhost:3000/api/topics", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          this.allPosts = response.data.post;
        })
        .catch(function (error) {
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
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
    //On récupère l'option de tri selectionné
    setSelected(e) {
      let datetri = e;
      return (this.sortingDate = datetri);
    },
    //Date du jour au format jj/mm/yyy
    getDateToday() {
      //Récupération de la date du jour
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth();
      let yyyy = today.getFullYear();
      //Les mois commencent à 0 donc on rajoute 1 pour avoir le bon mois
      let mm2 = Number(mm) + 1;
      mm2.toString();
      // Si les jours et les mois sont inférieurs à 10, on rajoute un 0 devant
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm2 < 10) {
        mm2 = "0" + mm2;
      }
      //Mise au bon format de la date
      today = dd + "/" + mm2 + "/" + yyyy;
      return today;
    },
    //Date de la semaine précédente au format jj/mm/yyy
    getDateLastWeek() {
      let today = new Date();
      // 7 jours de différence
      var dateOffset = 24 * 60 * 60 * 1000 * 7;
      let lastWeekenMs = today.setTime(today.getTime() - dateOffset);
      //Conversion des ms en date
      let lastWeekenDate = new Date(lastWeekenMs);
      //Conversion du format Date en format DB
      let lastWeekenDB = lastWeekenDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      //On récupère les 10 premiers caractères
      let lastWeek = lastWeekenDB.substr(0, 10);
      return lastWeek;
    },
    //Date du mois précédent au format jj/mm/yyy
    getDateLastMonth() {
      let today = new Date();
      // 30 jours de différence
      var dateOffset = 24 * 60 * 60 * 1000 * 30;
      let lastMonthenMs = today.setTime(today.getTime() - dateOffset);
      //Conversion des ms en date
      let lastMonthenDate = new Date(lastMonthenMs);
      //Conversion du format Date en format DB
      let lastMonthenDB = lastMonthenDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      //On récupère les 10 premiers caractères
      let lastMonth = lastMonthenDB.substr(0, 10);
      return lastMonth;
    },
  },
  computed: {
    //tri des posts
    sortedPosts: function () {
      let allPost = [];
      let tri = this.sortingDate;
      if (this.datetri != "") tri = this.datetri;
      //On convertit l'objet en tableau
      let filterByDate = this.allPosts.slice(0);
      //On récupère les dates pour le tri
      let lastWeek = this.getDateLastWeek();
      let lastMonth = this.getDateLastMonth();
      //tri
      if (tri == "Desc") {
        allPost = filterByDate;
      }
      if (tri == "Asc") {
        allPost = filterByDate.reverse();
      }
      if (tri == "LastWeek") {
        allPost = filterByDate.filter(
          (item) => item.creationdate.substr(0, 10) > lastWeek
        );
      }
      if (tri == "LastMonth") {
        allPost = filterByDate.filter(
          (item) => item.creationdate.substr(0, 10) > lastMonth
        );
      }
      //valeur retournée
      return allPost;
    },
  },
  beforeMount() {
    //Calcule les dates
    this.getDateToday();
    this.getDateLastWeek();
    this.getDateLastMonth();
    //Par défaut on affiche les articles récents en premier
    this.sortingDate = "Desc";
  },
  mounted() {
    //récupère les posts
    this.getPosts();
  },
  updated() {
    //si tri alors affiche les posts suivant le tri
    this.sortedPosts;
  },
};
</script>
