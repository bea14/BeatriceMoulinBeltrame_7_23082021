<!--Page du forum, affiche les articles. Possibilité de tri-->
<template>
  <div class="posts">
    <div class="container">
      <div class="posts-container">
        <div class="body-left">
          <h1>Forum Groupomania</h1>
          <p class="UpText">        
            Le lieu où vous pouvez échanger des textes, photos, vidéos, liens avec vos collègues. Ce forum est surveillé 
            par des modérateurs mais nous vous demandons de respecter quelques règles simples.<br />
            Merci à vous et profitez bien !
          </p>
          <!--Tri des articles-->
          <!--
          <FilteredPost @selected='setSelected($event)'  @change='functionFilterByDate()'/>-->
          <FilteredPost v-on:sorting-date="setSelected($event)" />
          <!--Affichage des articles-->
          
          <PostsPreview v-for="post in allPosts" :key="post.id" :postData="post" @refresh="getPosts()"/>
          <!--<PostsPreview v-for="post in filterByDate" :key="post.id" :postData="post" @refresh="getPosts()"/>-->
        </div>
        <!--Aside qui permet d'afficher quelques règles et les membres du forum-->
        <div class="body-right">
          <Aside />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
import FilteredPost from "../components/posts/postsFilter.vue";
import Aside from "../components/posts/postsAside.vue";
import PostsPreview from "../components/posts/postsPreview.vue";

export default {
  name: "Posts",
  data() {    
    let path = window.location.pathname;
    return {
      path,      
      posts: [],
      filterByDate: [],      
      allPosts: [],
      sortingDate: "",
      allPost: [],
    }
  },
  /*created: function() {
      this.filterByDate = this.allPosts.slice(0);
  },*/
  components: {
    FilteredPost,
    Aside,
    PostsPreview,
  },
  methods: {
    getPosts() {
      //on récupère le token pour l'authentification des routes
      const token = sessionStorage.getItem("token");
      //appel à l'API GET api/topics/
      axios
        .get("http://localhost:3000/api/topics", {
          headers: { "Authorization": "Bearer " + token },
        })
        .then((response) => {
          this.allPosts = response.data.post;
          console.log('YYYYYYYYYYYYYYYYYYYYYYYYY',response.data.post)
          console.log('YYYYYYYYYYYYYYYYYYYYYYYYY',this.allPosts)
          this.functionFilterByDate('Desc')
        });
    },
    setSelected(e) {
      let sortingDate = e;
      console.log('sortingDate', sortingDate)
      this.functionFilterByDate(sortingDate)
    },
    getDateToday(){
      //Récupération de la date du jour
      let today = new Date(); 
      let dd = today.getDate();
      let mm = today.getMonth();
      let yyyy = today.getFullYear();
      //Les mois commencent à 0 donc on rajoute 1 pour avoir le bon mois
      let mm2 = Number(mm)+1;
      mm2.toString();
      // Si les jours et le smois sont inférieurs à 10, on rajoute un 0 devant
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm2 < 10) {
        mm2 = '0' + mm2;
      }
       //Mise au bon format de la date
      today = dd + '/' + (mm2) + '/' + yyyy;     
      return today
    },
    getDateLastWeek(){
      let today = new Date(); 
      var dateOffset = (24*60*60*1000) * 7; // 7 jours
      let lastWeekenMs = today.setTime(today.getTime() - dateOffset);
      //Conversion des ms en date
      let lastWeekenDate = new Date(lastWeekenMs); 
      //Conversion du format Date en format DB
      let lastWeekenDB = lastWeekenDate.toISOString().slice(0, 19).replace('T', ' ');
      //On récupère les 10 premiers caractères
      let lastWeek = lastWeekenDB.substr(0, 10)
      return lastWeek
    },
    getDateLastMonth(){
      let today = new Date();      
      var dateOffset = (24*60*60*1000) * 30; // 30 jours
      let lastMonthenMs = today.setTime(today.getTime() - dateOffset);
      //Conversion des ms en date
      let lastMonthenDate = new Date(lastMonthenMs); 
      //Conversion du format Date en format DB
      let lastMonthenDB = lastMonthenDate.toISOString().slice(0, 19).replace('T', ' ');
      //On récupère les 10 premiers caractères
      let lastMonth = lastMonthenDB.substr(0, 10)
      return lastMonth
    },
    functionFilterByDate(tri){
      //let filterByDate = [];
      let allPost=[];
      let filterByDate = this.allPosts.slice(0);
      console.log('filterByDate',filterByDate)
      console.log('sortingDate',tri)
      let lastWeek = this.getDateLastWeek();
      let lastMonth = this.getDateLastMonth();
      console.log(lastWeek)
      console.log(lastMonth)
      if (tri == 'Desc') {
        allPost = filterByDate;
      console.log('filterByDateDesc',allPost)
      }
      if (tri == "Asc") {
        allPost = filterByDate.reverse();
      console.log('filterByDateAsc',allPost)
      }
      if (tri == "LastWeek") {
        allPost = filterByDate.filter(item => item.creationdate.substr(0,10) > lastWeek)
      console.log('filterByDateLW',allPost)
      }
      if (tri == "LastMonth") {
        allPost = filterByDate.filter(item => item.creationdate.substr(0,10) > lastMonth)
      console.log('filterByDateLM',allPost)
      }  
      console.log('allPosts', allPost)
      console.log('filterByDate',filterByDate)
      return allPost
    },
  },
  /*computed:{    
    functionFilterByDate(){
      let filterByDate = [];
      //this.filterByDate = this.allPosts.slice(0);
      console.log('filterByDate',filterByDate)
      console.log('sortingDate',this.sortingDate)
      let lastWeek = this.getDateLastWeek();
      let lastMonth = this.getDateLastMonth();
      console.log(lastWeek)
      console.log(lastMonth)
      if (this.sortingDate == "Desc") {
        filterByDate = this.allPosts.slice(0);
      console.log('filterByDateDesc',filterByDate)
      }
      if (this.sortingDate == "Asc") {
        filterByDate = this.allPosts.slice(0).reverse();
      console.log('filterByDateAsc',filterByDate)
      }
      if (this.sortingDate == "LastWeek") {
        filterByDate = this.allPosts.slice(0).filter(item => item.post_date_fr > lastWeek)
      console.log('filterByDateLW',filterByDate)
      }
      if (this.sortingDate == "LastMonth") {
        filterByDate = this.allPosts.slice(0).filter(item => item.post_date_fr > lastMonth)
      console.log('filterByDateLM',filterByDate)
      }  
      console.log('allPosts', this.allPosts)
      console.log('filterByDate',filterByDate)
      
      console.log('filterByDate[2].media_url',filterByDate.media_url)
        return this.filterByDate
    },
  },*/
  beforeMount(){
    this.getDateToday();
    this.getDateLastWeek();
    this.getDateLastMonth();
  },
  mounted() {
    this.getPosts();
  },
};
</script>

<style lang="scss">
@import "../assets/styles/utils/_variables.scss";
.posts {
  background-color: lighten($tertiary-color, 50%);
  display: flex;
  flex-direction: column;
}

.container{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.posts-container{
  display: flex;
  flex-direction: row;
  .body-left {
    //margin-right: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    @media screen and (min-width: 924px) {
      width: 640px;
      margin-bottom: 2rem;
    }
  }
  .body-right{
    display: none;
    @media screen and (min-width: 924px) {
      display: flex;
      margin-left: 2.5rem;
      margin-top: 1.5rem;
      margin-bottom: 2rem;
      border-radius: $border-radius-m;
      width: 312px;
    }
  }
}

</style>
