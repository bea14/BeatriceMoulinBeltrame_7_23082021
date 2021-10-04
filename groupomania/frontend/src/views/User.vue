<template>
    <div class="maincontainer">
        <Header @gotohome="path = '/Posts'"/>
        <div class="userboard">
            <div>
                <router-link to="/Posts">
                    <i class="fas fa-arrow-left" aria-hidden="true"></i>
                    <span>Retour au forum</span>
                </router-link>
            </div>
            <div class="user-title">
                <h1>Votre activité sur le forum</h1>
            </div>        
            <div class="table-heading">
                <i class="fas fa-newspaper fa-2x" aria-hidden="true"></i>
                <h2>Tous vos articles</h2>
            </div>
            <p class="alert-reporting">
                Vous avez écrit : <span class="weightbold">{{ userPostsCount().length }}</span> article(s)<br />                
                Vous avez <span class="weightbold">{{ userReportedPostsCount().length }}</span> article(s) signalé(s)
            </p>
            <div class="table-body" tabindex="0">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Titre</th>
                        <th scope="col">Contenu</th>
                        <th scope="col">Signalement</th>
                        <th scope="col">Supprimer</th>
                    </tr>
                    </thead>
                    <tbody class="table-posts">
                    <tr v-for="post in userPostsCount()" :key="post.id" :class="`${postIsReported(post.id) ? 'red' : ''}`">
                        <th scope="row">{{ post.id }}</th>
                        <td>{{ post.title}}</td>
                        <td>{{ post.content }}</td>
                        <td>{{ post.isreported }}</td>
                        <td>
                            <div @click="$refs.modaleSuppressionPostUser.openModal(); postId=`${post.id}`">
                                <i class="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="boutons">
                <Bouton @click="goToPage()" text="Retourner à la page principale" class="submitButton" />
            </div>
            <Modal ref="modaleSuppressionPostUser">
                <template v-slot:header>
                    <h1>Suppression de l'article</h1>
                </template>
                <template v-slot:body>
                    <p>Etes-vous sûr(e) de vouloir supprimer cet articel?</p>
                    <p>Cette opération est irréversible.</p>
                    <p>Cliquez sur Confirmer pour confirmer la suppression et sur Annuler pour annuler la suppression</p>
                </template>
                <template v-slot:footer>
                    <div>            
                    <Bouton @click="deletePost(postId)" text="Confirmer" />      
                    <Bouton @click="$refs.modaleSuppressionPostUser.closeModal()" text="Annuler" />
                    </div>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script>
const axios = require("axios").default;
import Header from "../components/layout/LayoutHeader.vue";
import Modal from "../components/modal.vue";
import Bouton from "../components/Bouton.vue";
import router from "../router";

export default {
    name: "User",
    components: {
        Header,
        Modal,
        Bouton
    },
    data() {
        const pseudo = sessionStorage.getItem("pseudo");
        return {
            Posts: [],
            allUserPosts: [],
            count:[],           
            post: {},
            pseudo,
        }
    },
   //Quand le DOM est monté, on lance getUser
    mounted() {
        this.getPosts();
    },

    methods: {
        goToPage() {
            router.push("/Posts");
        },
        //on récupère tous les posts
        getPosts() {
            //on récupère le token pour l'authentification des routes
            const token = sessionStorage.getItem("token");
            //appel à l'API GET api/topics/
            axios
            .get("http://localhost:3000/api/topics", {
            headers: { 'Authorization': "Bearer " + token },
            })
            .then((response) => {
            this.Posts = response.data.post;
            });
        },
        //posts ecrits par un user = filtre sur tous les posts avec pseudo du user 
        userPostsCount: function(){
            let count=[];
            const pseudo = sessionStorage.getItem("pseudo");
            count = this.Posts.slice(0).filter((post) => post.pseudo == pseudo);
            return count
        },
        //nombre de posts signales    
        userReportedPostsCount() {            
            const pseudo = sessionStorage.getItem("pseudo");
            const countReported = this.Posts.slice(0).filter((post) => post.isreported == "O" && post.pseudo == pseudo);
            return countReported;
        },
        //Verifie si un post est signale
        postIsReported(id){
            let postIsReported = false;
            const postReported = this.Posts.filter((post) => post.isreported == "O" && post.id == id);
            if (postReported.length != 0) {postIsReported = true}
            return postIsReported;
        },
        //Suppression post
        deletePost(id) {      
            const postId = id;
            console.log('postIdpostIdpostIdpostIdpostIdpostId',postId)
            const token = sessionStorage.getItem("token");
            let media_url = this.post.media_url? this.post.media_url : null;
            //requête delete api/topics/:id
            axios
            .delete('http://localhost:3000/api/topics/'+postId,{
                headers: { "Authorization": "Bearer " + token },
                data: { media_url },
            })
            //si OK, on efface le sessionStorage et on redirige vers le signup
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch (function (error) {
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
                console.log('Error', error.message);
                }
                console.log(error.config);
            });
        },
    },
}
</script>
