<template>
  <div class="admin">
    <div class="admin-title">
      <h1>Administration du forum</h1>
    </div>
    <p class="alert-reporting">
      <span>Attention !</span><br /> 
      Il y a {{ reportedPostsCount().length }} article(s) signalé(s) et x commentaire(s) signalé(s)
    </p>
    <div class="table-heading">
      <i class="fas fa-users fa-2x"></i>
      <h2>Membres du forum</h2>
    </div>
    <div class="table-body" tabindex="0">
      <table class="table table-sm">
        <thead class="thead-light">
          <tr>
            <th scope="col">id</th>
            <th scope="col">Pseudo</th>
            <th scope="col">Avatar</th>
            <th scope="col">Supprimer</th>
            <th scope="col">Contacter</th>
          </tr>
        </thead>
        <tbody class="table-users">
          <tr v-for="user in allUsers" :key="user.id">
            <th scope="row">{{ user.id }}</th>
            <td>{{ user.pseudo }}</td>
            <td><img :src="`upload/${user.avatar}`" alt="avatar utilisateur"></td>
            <td>
              <a class="nav-link trash" @click="deleteUser(user.id)">
                <i class="fas fa-user-times fa-lg"></i>
              </a>
            </td>
            <td>
              <a class="nav-link mail" @click="mailToUser(user.id)">
                <i class="fas fa-envelope fa-lg"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-heading">
      <i class="fas fa-newspaper fa-2x"></i>
      <h2>Tous les articles</h2>
    </div>
    <div class="table-body" tabindex="0">
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th scope="col">id</th>
            <th scope="col">Titre</th>
            <th scope="col">Contenu</th>
            <th scope="col">Auteur</th>
            <th scope="col">Signalement</th>
            <th scope="col">Supprimer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in allPosts" :key="post.id">
            <th scope="row">{{ post.id }}</th>
            <td>{{ post.title}}</td>
            <td>{{ post.content }}</td>
            <td>{{ post.pseudo }}</td>
            <td>{{ post.isreported }}</td>
            <td>
              <a class="nav-link trash" @click="deletePost(post.id)">
                <i class="fas fa-trash-alt fa-lg"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-heading">
      <i class="fas fa-users fa-2x"></i>
      <h2>Commentaires signalés</h2>
    </div>
    <div v-for="post in allPosts" :key="post.id">
      <div class="table-body" tabindex="0">
      <table class="table table-sm">
        <thead class="thead-light">
          <tr>
            <th scope="col">id</th>
            <th scope="col">Post id</th>
            <th scope="col">Auteur</th>
            <th scope="col">Contenu</th>
            <th scope="col">Signalement</th>
            <th scope="col">Date du signalement</th>
            <th scope="col">Supprimer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in allComments" :key="comment.id">
            <th scope="row">{{ comment.id }}</th>
            <td>{{ comment.topic}}</td>
            <td>{{ comment.author }}</td>
            <td>{{ comment.content }}</td>
            <td>{{ comment.isreported }}</td>
            <td>{{comment.comment_reportingdate_fr }}</td>
            <td>
              <a class="nav-link trash" @click="deleteComment(coment.id)">
                <i class="fas fa-trash-alt fa-lg"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>

   
    
    <div class="table-heading" @onLoad='getComments()'>
      <i class="fas fa-comment-dots fa-2x"></i>
      <h2>Tous les commentaires</h2>
    </div>
    <div class="table-body" tabindex="0">
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th scope="col">id</th>
            <th scope="col">Contenu</th>
            <th scope="col">Auteur</th>
            <th scope="col">Supprimer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in allComments" :key="comment.id">
            <th scope="row">{{ comment.id }}</th>
            <td>{{ comment.content }}</td>
            <td>{{ comment.author }}</td>
            <td>
              <a class="nav-link trash" @click="deletePost(comment.id)">
                <i class="fas fa-trash-alt fa-lg"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "Admin",
  data() {
    return {
      allUsers: [],
      allPosts: [],
      allComments: [],
    };
  },
   //Quand le DOM est monté, on lance getUser
  mounted() {
    this.getUsers();
    this.getPosts();
    this.getComments();
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
    getPosts() {
      //on récupère le token pour l'authentification des routes
      const token = sessionStorage.getItem("token");
      //appel à l'API GET api/topics/
      axios
        .get("http://localhost:3000/api/topics", {
          headers: { 'Authorization': "Bearer " + token },
        })
        .then((response) => {
          this.allPosts = response.data.post;
          console.log('TTTTTTTTTT',response.data.post)
        });
    },
      //nombre de posts signales    
    reportedPostsCount() {
      const count = this.allPosts.filter((post) => post.isreported == "O");
      return count;
    },
    getComments(){
      const token = sessionStorage.getItem("token");
      const postId= this.post.id;
      axios
      .get(`http://localhost:3000/api/topics/`+postId+`/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {        
        console.log('VVVVVVVVVVVVVVVVV',response.data.comments)
          console.log('GGGGGGGGGGGGFFFFFFFFF',JSON.stringify(response.data))
        return (this.allComments = response.data.comments)
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
    },    
    mailToUser(id) {
      alert("Vous pouvez envoyer un message privé à l'utilisateur "+id+". Désolé mais cette fonction n'est pas encore utilisable !")
    },
  },
  /*methods: {
    deleteUser(userId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      Swal.fire({
        title: "Are you sure you want to delete user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:5000/api/auth/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            })
            .then(() => {
              console.log("user deleted");
            })
            .catch(() => {
              console.log("Cannot delete User!");
            });
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("canceled");
        }
      });
    },
    deletePost(postId) {
      let userData = JSON.parse(localStorage.getItem("user"));
      let token = userData.token;
      Swal.fire({
        title: "Are you sure you want to delete this post?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:5000/api/posts/${postId}`, {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            })
            .then(() => {
              console.log("Post deleted");
            })
            .catch(() => {
              console.log("Cannot delete post !");
            });
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("canceled");
        }
      });
    },
  },
  beforeCreate() {
    let userData = JSON.parse(localStorage.getItem("user"));
    let token = userData.token;
    //get all users
    axios
      .get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        return (this.users = response.data);
      })
      .catch((err) => console.log(err));
    //get all posts
    axios
      .get("http://localhost:5000/api/posts/", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        return (this.posts = response.data);
      })
      .catch((err) => console.log(err));
    //get all comment
    axios
      .get(`http://localhost:5000/api/comments/`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        return (this.comments = response.data);
      })
      .catch((err) => {
        console.log(err.response.data.errors[0].msg);
      });
  },
}*/
}
</script>
<style  scoped lang="scss">
@import "../assets/styles/utils/_variables.scss";
.table-heading {
  display: flex;
  justify-content: center;
  padding: 15px;
  margin: 20px;
  color: $tertiary-color;
}
.table-heading h3 {
  margin-left: 10px;
}
.admin-title {
  display: flex;
  justify-content: center;
  padding: 15px;
  margin-top: 30px;
  color: $secondary-color;
}
.admin-title h2 {
  margin-top: 15px;
  margin-left: 10px;
}
.admin-title img {
  width: 70px;
  height: 70px;
}
.alert-reporting {
  background-color: $primary-color;
  color: white;
  text-align: center;
  padding: 0.5rem 0;
  span {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 0.2rem;
  }
}
table .fas {
  cursor: pointer;
  color: #b71c1c;
  width: 100%
}
.table-body {
  height: 300px;
  overflow-y: scroll;
}
.admin {
  max-width: 800px;
  margin: auto;
  padding-bottom: 100px;
}

.table-users tr td img {
  width: 40px;
}
</style>