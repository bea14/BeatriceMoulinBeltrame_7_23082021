<template>
    <div class="">
        <div class="admin-title">
            <h1>Votre activité sur le forum</h1>
            <p class="alert-reporting">
                Vous avez écrit : {{ userPostsCount().length }} article(s)<br />
               <!-- Vous avez écrit : {{ userCommentsCount().length }} comment(s)-->
            </p>
        </div>
        
        <div class="table-heading">
            <i class="fas fa-newspaper fa-2x"></i>
            <h2>Tous vos articles</h2>
        </div>
        <div class="table-body" tabindex="0">
            <table class="table">
                <thead class="thead-light">
                <tr>
                    <th scope="col">id</th>
                    <th scope="col">Titre</th>
                    <th scope="col">Contenu</th>
                    <th scope="col">Signalement</th>
                    <th scope="col">Supprimer</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="post in count" :key="post.id">
                    <th scope="row">{{ post[0].id }}</th>
                    <td>{{ post[0].title}}</td>
                    <td>{{ post[0].content }}</td>
                    <td>{{ post[0].isreported }}</td>
                    <td>
                    <a class="nav-link trash" @click="deletePost(post.id)">
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
    name: "User",
    data() {
        return {
        allUsers: [],
        allPosts: [],
        allComments: [],
        count:[]
        };
    },
   //Quand le DOM est monté, on lance getUser
    mounted() {
        //this.getUsers();
        this.getPosts();
        this.userPostsCount()
        //this.getComments();
        this.userPosts();
    },
    methods: {
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
        //nombre de posts ecrits par un user  
        userPostsCount() {
            const pseudo = sessionStorage.getItem("pseudo");
            const count = this.allPosts.slice().filter((post) => post.pseudo == pseudo);
            console.log('CZJDIUBFZIQI', count)
            return count;
        },
        userPosts(){
            let Post =[];
            for (var i = 0; i< this.count.length; i++) {
                Post[i].id = this.count[i].id;
                Post[i].title = this.count[i].title;
                Post[i].content = this.count[i].content;
                Post[i].media_url = this.count[i].media_url;
                Post[i].isreported = this.count[i].isreported;
                console.log('efbsjdbviudf', Post[i])
            }
        }
    }
}
</script>
